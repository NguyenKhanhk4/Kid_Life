import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  childId: string;
  availableBalance: number;
  savingsBalance: number;
  version: number; // For optimistic concurrency control
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema(
  {
    childId: { type: String, required: true, unique: true },
    availableBalance: { type: Number, required: true, default: 0, min: 0 },
    savingsBalance: { type: Number, required: true, default: 0, min: 0 },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema);

export type TransactionType = 'CREDIT' | 'DEBIT';
export type SourceType = 'TASK' | 'QUIZ' | 'WISH' | 'REWARD' | 'PENALTY' | 'PET' | 'ADMIN';

export interface IWalletTransaction extends Document {
  walletId: mongoose.Types.ObjectId;
  childId: string;
  type: TransactionType;
  amount: number;
  bucket: 'AVAILABLE' | 'SAVINGS';
  sourceType: SourceType;
  sourceId: string; // The ID of the task, quiz, etc.
  idempotencyKey: string;
  balanceAfter: number;
  createdAt: Date;
}

const WalletTransactionSchema: Schema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    childId: { type: String, required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    amount: { type: Number, required: true },
    bucket: { type: String, enum: ['AVAILABLE', 'SAVINGS'], default: 'AVAILABLE' },
    sourceType: { type: String, required: true },
    sourceId: { type: String, required: true },
    idempotencyKey: { type: String, required: true, unique: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Compound unique index to prevent double crediting/debiting for the same source action if no idempotency key is provided
WalletTransactionSchema.index({ sourceType: 1, sourceId: 1, type: 1 }, { unique: true });

export const WalletTransaction = mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);
