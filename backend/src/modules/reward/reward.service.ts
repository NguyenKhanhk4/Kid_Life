import mongoose from 'mongoose';
import { Reward, RewardRedemption, IReward, IRewardRedemption } from './reward.model';
import { WalletService } from '../wallet/wallet.service';
import { AppError } from '../../shared/errors/AppError';

export interface CreateRewardDTO {
  title: string;
  description?: string;
  type?: 'VIRTUAL' | 'PHYSICAL';
  cost: number;
}

export interface UpdateRewardDTO {
  title?: string;
  description?: string;
  type?: 'VIRTUAL' | 'PHYSICAL';
  cost?: number;
  status?: 'ACTIVE' | 'ARCHIVED';
}

export class RewardService {
  static async createReward(data: CreateRewardDTO, familyId: string, parentId: string) {
    const reward = new Reward({ ...data, familyId, createdBy: parentId });
    await reward.save();
    return reward;
  }

  static async getRewards(familyId: string, status = 'ACTIVE') {
    return Reward.find({ familyId, status });
  }

  static async updateReward(id: string, data: UpdateRewardDTO, familyId: string) {
    const reward = await Reward.findOneAndUpdate({ _id: id, familyId }, data, { new: true });
    if (!reward) throw new AppError('Reward not found', 404, 'NOT_FOUND');
    return reward;
  }

  static async archiveReward(id: string, familyId: string) {
    return this.updateReward(id, { status: 'ARCHIVED' }, familyId);
  }

  static async requestRedemption(childId: string, rewardId: string, familyId: string) {
    const reward = await Reward.findOne({ _id: rewardId, familyId, status: 'ACTIVE' });
    if (!reward) {
      throw new AppError('Reward not available', 404, 'REWARD_UNAVAILABLE');
    }

    // Check for duplicate pending requests
    const existingPending = await RewardRedemption.findOne({ childId, rewardId, status: 'PENDING' });
    if (existingPending) {
      throw new AppError('A pending redemption already exists for this reward', 409, 'DUPLICATE_PENDING');
    }

    const redemption = new RewardRedemption({
      familyId,
      childId,
      rewardId: reward._id,
      rewardTitleSnapshot: reward.title,
      costSnapshot: reward.cost,
      status: 'PENDING',
    });

    await redemption.save();
    return redemption;
  }

  static async getRedemptions(familyId: string, status?: string) {
    const query: mongoose.FilterQuery<IRewardRedemption> = { familyId };
    if (status) query.status = status;
    return RewardRedemption.find(query).sort({ createdAt: -1 });
  }

  static async approveRedemption(redemptionId: string, parentId: string, familyId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const redemption = await RewardRedemption.findOneAndUpdate(
        { _id: redemptionId, familyId, status: 'PENDING' },
        { $set: { status: 'APPROVED', reviewedBy: parentId, reviewedAt: new Date() } },
        { new: true, session }
      );

      if (!redemption) {
        throw new AppError('Redemption not found or already processed', 400, 'ALREADY_PROCESSED');
      }

      const idempotencyKey = `reward_approve_${redemption._id.toString()}`;
      const txResult = await WalletService.deductPoints(
        redemption.childId, 
        redemption.costSnapshot, 
        'REWARD', 
        redemption._id.toString(), 
        idempotencyKey,
        session
      );

      redemption.walletTransactionId = txResult.transaction._id.toString();
      await redemption.save({ session });

      await session.commitTransaction();
      return redemption;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async rejectRedemption(redemptionId: string, parentId: string, familyId: string) {
    const redemption = await RewardRedemption.findOneAndUpdate(
      { _id: redemptionId, familyId, status: 'PENDING' },
      { $set: { status: 'REJECTED', reviewedBy: parentId, reviewedAt: new Date() } },
      { new: true }
    );

    if (!redemption) {
      throw new AppError('Redemption not found or already processed', 400, 'ALREADY_PROCESSED');
    }

    return redemption;
  }
}
