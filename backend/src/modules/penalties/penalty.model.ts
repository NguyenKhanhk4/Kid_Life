// Mongoose Schema & Model cho Penalty (Vé phạt kỷ luật)
import { Schema, model, Document, Types } from 'mongoose';

export interface IPenalty extends Document {
  child_id: Types.ObjectId;
  parent_id: Types.ObjectId;
  reason: string;
  penalty_xp: number;
  actual_deducted: number;
  wallet_balance_before: number;
  wallet_balance_after: number;
  created_at: Date;
}

const PenaltySchema = new Schema<IPenalty>({
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  parent_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true, trim: true, maxlength: 200 },
  penalty_xp: { type: Number, required: true, min: 1, max: 500 },
  actual_deducted: { type: Number, required: true, min: 0 },
  wallet_balance_before: { type: Number, required: true, min: 0 },
  wallet_balance_after: { type: Number, required: true, min: 0 },
  created_at: { type: Date, default: Date.now },
});

export default model<IPenalty>('Penalty', PenaltySchema);
