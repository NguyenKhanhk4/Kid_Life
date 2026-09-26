// Mongoose Schema & Model cho BankAccount (Tài khoản ngân hàng ảo của bé)
import { Schema, model, Document, Types } from 'mongoose';

export interface IBankAccount extends Document {
  child_id: Types.ObjectId;
  balance: number;
  total_interest_earned: number;
  last_interest_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

const BankAccountSchema = new Schema<IBankAccount>({
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
  total_interest_earned: { type: Number, default: 0, min: 0 },
  last_interest_at: { type: Date, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model<IBankAccount>('BankAccount', BankAccountSchema);
