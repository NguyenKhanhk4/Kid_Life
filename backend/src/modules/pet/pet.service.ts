import mongoose from 'mongoose';
import { Pet } from './pet.model';
import { WalletService } from '../wallet/wallet.service';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import { isMongoServerError } from '../../shared/errors/MongoErrorGuard';

export class PetService {
  static async getPet(childId: string) {
    let pet = await Pet.findOne({ childId });
    if (!pet) {
      try {
        pet = await Pet.create({ childId });
      } catch (error: unknown) {
        if (isMongoServerError(error) && error.code === 11000) {
          pet = await Pet.findOne({ childId });
        } else throw error;
      }
    }
    return pet;
  }

  static async feedPet(childId: string) {
    await this.getPet(childId); // Ensure pet exists

    const now = new Date();
    // Assuming server local time boundary, a real app would use family timezone
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const feedCost = env.petFeedCost;
    
    // Idempotency check: daily feed for child
    const dateStr = todayStart.toISOString().split('T')[0];
    const idempotencyKey = `feed_${childId}_${dateStr}`;
    const sourceId = idempotencyKey;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Deduct points with atomic session
      await WalletService.deductPoints(childId, feedCost, 'PET', sourceId, idempotencyKey, session);

      // 2. Conditional Update: only update if not fed today yet
      // This prevents race conditions if idempotency key isn't checked properly or bypassed
      const petUpdate = await Pet.findOneAndUpdate(
        { 
          childId, 
          $or: [
            { lastFedAt: null },
            { lastFedAt: { $lt: todayStart } }
          ]
        },
        {
          $set: { lastFedAt: now, mood: 'HAPPY' },
          $inc: { xp: 10 }
        },
        { new: true, session }
      );

      if (!petUpdate) {
        throw new AppError('Pet has already been fed today', 400, 'PET_ALREADY_FED');
      }

      // Simple level up logic
      if (petUpdate.xp >= petUpdate.level * 100) {
        petUpdate.level += 1;
        petUpdate.xp = 0;
        await petUpdate.save({ session });
      }

      await session.commitTransaction();
      return { pet: petUpdate, feedCost };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
