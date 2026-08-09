import mongoose from 'mongoose';
import { Subscription, Transaction } from './payment.model';
import { getPlan, paymentConfig } from '../../config/payment.config';
import { AppError } from '../../shared/errors/AppError';
import { getPaymentGateway } from './payment.gateway';
import { isMongoServerError } from '../../shared/errors/MongoErrorGuard';
import crypto from 'crypto';

export class PaymentService {
  static getPlans() {
    return paymentConfig.plans;
  }

  static async getSubscriptions(parentId: string) {
    return Subscription.find({ parentId }).sort({ createdAt: -1 });
  }

  static async getTransactions(parentId: string) {
    return Transaction.find({ parentId }).sort({ createdAt: -1 });
  }

  static async subscribe(parentId: string, planId: string, idempotencyKey: string) {
    const plan = getPlan(planId);
    if (!plan) {
      throw new AppError('Invalid plan selected', 400, 'INVALID_PLAN');
    }

    const gateway = getPaymentGateway();
    const session = await mongoose.startSession();
    let transactionCommitted = false;
    session.startTransaction();

    try {
      // Create pending subscription
      const subscription = new Subscription({
        parentId,
        planId,
        status: 'PENDING',
      });
      await subscription.save({ session });

      // Create pending transaction
      const transaction = new Transaction({
        parentId,
        subscriptionId: subscription._id,
        planId,
        amount: plan.amount,
        currency: plan.currency,
        status: 'PENDING',
        idempotencyKey,
      });

      await transaction.save({ session });

      await session.commitTransaction();
      transactionCommitted = true;
      try {
        const checkoutUrl = await gateway.createCheckoutUrl(transaction._id.toString(), plan, parentId);
        return { subscription, transaction, checkoutUrl };
      } catch (gatewayError) {
        await Transaction.updateOne({ _id: transaction._id }, { $set: { status: 'FAILED' } });
        await Subscription.updateOne({ _id: subscription._id }, { $set: { status: 'CANCELED' } });
        throw gatewayError;
      }
    } catch (error: unknown) {
      if (!transactionCommitted) {
        await session.abortTransaction();
      }
      if (isMongoServerError(error) && error.code === 11000) {
        throw new AppError('Transaction already initiated', 409, 'DUPLICATE_TRANSACTION');
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async cancelCurrentSubscription(parentId: string) {
    const subscription = await Subscription.findOne({
      parentId,
      status: { $in: ['ACTIVE', 'PENDING', 'CANCELED'] },
    }).sort({ createdAt: -1 });
    if (!subscription) {
      throw new AppError('Subscription not found', 404, 'NOT_FOUND');
    }

    if (subscription.status === 'CANCELED') {
      return subscription; // Idempotent cancel
    }

    // Cancellation does not delete data, just transitions status.
    // Assuming end of billing period logic for a real system, but for now we mark CANCELED.
    subscription.status = 'CANCELED';
    await subscription.save();
    return subscription;
  }

  static async processWebhookEvent(
    eventId: string,
    transactionId: string,
    amount: number,
    planId: string,
    parentId: string
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findOne({ _id: transactionId }).session(session);
      if (!transaction) {
        throw new AppError('Transaction not found', 404, 'NOT_FOUND');
      }

      if (transaction.status === 'SUCCESS') {
        // Idempotent webhook replay handling
        await session.abortTransaction();
        return { message: 'Already processed' };
      }

      if (transaction.parentId !== parentId || transaction.amount !== amount || transaction.planId !== planId) {
        throw new AppError('Webhook payload mismatch with server record', 409, 'PAYLOAD_MISMATCH');
      }

      const subscription = await Subscription.findOne({ _id: transaction.subscriptionId }).session(session);
      if (!subscription) {
        throw new AppError('Subscription not found', 404, 'NOT_FOUND');
      }

      const plan = getPlan(planId);
      if (!plan) throw new AppError('Invalid plan', 500, 'INVALID_PLAN');

      // Update states
      transaction.status = 'SUCCESS';
      transaction.providerTxId = eventId;
      
      subscription.status = 'ACTIVE';
      const now = new Date();
      subscription.startDate = now;
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + plan.durationMonths);
      subscription.endDate = endDate;

      await transaction.save({ session });
      await subscription.save({ session });

      await session.commitTransaction();
      return { message: 'Processed successfully' };
    } catch (error: unknown) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static verifyWebhookSignature(payload: Buffer, signature: string) {
    const secret = paymentConfig.webhookSecret;
    if (!secret) throw new AppError('Webhook secret not configured', 503, 'SERVICE_UNAVAILABLE');

    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    
    if (expectedSignature.length !== signature.length) {
      throw new AppError('Invalid signature', 401, 'INVALID_SIGNATURE');
    }

    const isValid = crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
    if (!isValid) {
      throw new AppError('Invalid signature', 401, 'INVALID_SIGNATURE');
    }
  }
}
