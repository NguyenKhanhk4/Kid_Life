import mongoose, { FilterQuery } from 'mongoose';
import { Wallet, WalletTransaction, SourceType, IWalletTransaction } from './wallet.model';
import { AppError } from '../../shared/errors/AppError';
import { isMongoServerError } from '../../shared/errors/MongoErrorGuard';

export class WalletService {
  /**
   * Internal method to ensure a wallet exists for transactions.
   */
  static async ensureWallet(childId: string, session?: mongoose.ClientSession) {
    let wallet = await Wallet.findOne({ childId }).session(session || null);
    if (!wallet) {
      try {
        const wallets = await Wallet.create([{ childId, availableBalance: 0, savingsBalance: 0 }], { session });
        wallet = wallets[0];
      } catch (error: unknown) {
        // Handle race condition if created simultaneously
        if (isMongoServerError(error) && error.code === 11000) {
          wallet = await Wallet.findOne({ childId }).session(session || null);
        } else {
          throw error;
        }
      }
    }
    return wallet;
  }

  /**
   * Gets the wallet for a child, returning null if it doesn't exist
   */
  static async getWallet(childId: string) {
    return Wallet.findOne({ childId });
  }

  /**
   * Gets transaction history
   */
  static async getHistory(childId: string, limit = 20, cursor?: Date) {
    const query: FilterQuery<IWalletTransaction> = { childId };
    if (cursor) {
      query.createdAt = { $lt: cursor };
    }
    
    return WalletTransaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  private static async checkIdempotency(
    idempotencyKey: string,
    childId: string,
    amount: number,
    type: 'CREDIT' | 'DEBIT',
    sourceType: string,
    sourceId: string
  ) {
    const existingTx = await WalletTransaction.findOne({ idempotencyKey });
    if (existingTx) {
      // Validate that the payload perfectly matches the existing transaction to prevent abuse
      if (
        existingTx.childId !== childId ||
        existingTx.amount !== amount ||
        existingTx.type !== type ||
        existingTx.sourceType !== sourceType ||
        existingTx.sourceId !== sourceId
      ) {
        throw new AppError('Idempotency payload mismatch', 409, 'IDEMPOTENCY_MISMATCH');
      }
      return existingTx;
    }
    return null;
  }

  /**
   * Adds points to wallet (Credit)
   */
  static async addPoints(
    childId: string, 
    amount: number, 
    sourceType: SourceType, 
    sourceId: string, 
    idempotencyKey: string,
    sessionToUse?: mongoose.ClientSession
  ) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new AppError('Amount must be a positive integer', 400, 'INVALID_AMOUNT');
    }

    if (!sessionToUse) {
      const existingTx = await this.checkIdempotency(idempotencyKey, childId, amount, 'CREDIT', sourceType, sourceId);
      if (existingTx) {
        return { wallet: await this.getWallet(childId), transaction: existingTx };
      }
    }

    const session = sessionToUse || await mongoose.startSession();
    if (!sessionToUse) session.startTransaction();
    
    try {
      await this.ensureWallet(childId, session);

      const wallet = await Wallet.findOne({ childId }).session(session);
      if (!wallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');

      wallet.availableBalance += amount;
      wallet.version += 1;
      await wallet.save({ session });

      const transaction = new WalletTransaction({
        walletId: wallet._id,
        childId,
        type: 'CREDIT',
        amount,
        bucket: 'AVAILABLE',
        sourceType,
        sourceId,
        idempotencyKey,
        balanceAfter: wallet.availableBalance,
      });
      await transaction.save({ session });

      if (!sessionToUse) await session.commitTransaction();
      return { wallet, transaction };
    } catch (error: unknown) {
      if (!sessionToUse) await session.abortTransaction();
      if (isMongoServerError(error) && error.code === 11000) {
        throw new AppError('Transaction already processed', 409, 'DUPLICATE_TRANSACTION');
      }
      throw error;
    } finally {
      if (!sessionToUse) session.endSession();
    }
  }

  /**
   * Deducts points from wallet (Debit)
   */
  static async deductPoints(
    childId: string, 
    amount: number, 
    sourceType: SourceType, 
    sourceId: string, 
    idempotencyKey: string,
    sessionToUse?: mongoose.ClientSession
  ) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new AppError('Amount must be a positive integer', 400, 'INVALID_AMOUNT');
    }

    // Don't use checkIdempotency if we are part of an external transaction (to avoid cross-session blocks),
    // rely on the unique index. If independent, check explicitly.
    if (!sessionToUse) {
      const existingTx = await this.checkIdempotency(idempotencyKey, childId, amount, 'DEBIT', sourceType, sourceId);
      if (existingTx) {
        return { wallet: await this.getWallet(childId), transaction: existingTx };
      }
    }

    await this.ensureWallet(childId);

    const session = sessionToUse || await mongoose.startSession();
    if (!sessionToUse) session.startTransaction();

    try {
      const wallet = await Wallet.findOneAndUpdate(
        { childId, availableBalance: { $gte: amount } },
        { $inc: { availableBalance: -amount, version: 1 } },
        { new: true, session }
      );

      if (!wallet) {
        const existingWallet = await Wallet.findOne({ childId }).session(session);
        if (!existingWallet) throw new AppError('Wallet not found', 404, 'WALLET_NOT_FOUND');
        throw new AppError('Insufficient balance', 400, 'INSUFFICIENT_BALANCE');
      }

      const transaction = new WalletTransaction({
        walletId: wallet._id,
        childId,
        type: 'DEBIT',
        amount,
        bucket: 'AVAILABLE',
        sourceType,
        sourceId,
        idempotencyKey,
        balanceAfter: wallet.availableBalance,
      });
      await transaction.save({ session });

      if (!sessionToUse) await session.commitTransaction();
      return { wallet, transaction };
    } catch (error: unknown) {
      if (!sessionToUse) await session.abortTransaction();
      if (isMongoServerError(error) && error.code === 11000) {
        throw new AppError('Transaction already processed', 409, 'DUPLICATE_TRANSACTION');
      }
      throw error;
    } finally {
      if (!sessionToUse) session.endSession();
    }
  }
}
