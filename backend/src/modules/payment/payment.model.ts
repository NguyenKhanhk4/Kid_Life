import mongoose, { Schema, Document } from 'mongoose';

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'PENDING';
export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface ISubscription extends Document {
  parentId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    parentId: { type: String, required: true },
    planId: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'CANCELED', 'EXPIRED', 'PENDING'], default: 'PENDING' },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ parentId: 1, status: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export interface ITransaction extends Document {
  parentId: string;
  subscriptionId: mongoose.Types.ObjectId;
  planId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  providerTxId: string | null;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    parentId: { type: String, required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: 'Subscription', required: true },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    providerTxId: { type: String, default: null },
    idempotencyKey: { type: String, required: true },
  },
  { timestamps: true }
);

// Idempotency: exact one transaction per key
TransactionSchema.index({ idempotencyKey: 1 }, { unique: true });
TransactionSchema.index({ providerTxId: 1 }, { unique: true, sparse: true });

// Lookups
TransactionSchema.index({ parentId: 1, createdAt: -1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
