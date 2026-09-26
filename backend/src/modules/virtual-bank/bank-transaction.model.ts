// Mongoose Schema & Model cho BankTransaction (Lịch sử giao dịch ngân hàng ảo)
import { Schema, model, Document, Types } from 'mongoose';

export interface IBankTransaction extends Document {
  account_id: Types.ObjectId;
  child_id: Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'interest';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  created_at: Date;
}

const BankTransactionSchema = new Schema<IBankTransaction>({
  account_id: { type: Schema.Types.ObjectId, ref: 'BankAccount', required: true },
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'interest'], required: true },
  amount: { type: Number, required: true, min: 1 },
  balance_before: { type: Number, required: true, min: 0 },
  balance_after: { type: Number, required: true, min: 0 },
  description: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now },
});

export default model<IBankTransaction>('BankTransaction', BankTransactionSchema);
