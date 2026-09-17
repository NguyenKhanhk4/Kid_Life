// Mongoose Schema & Model cho Redemption
import { Schema, model, Document, Types } from 'mongoose';

export interface IRedemption extends Document {
  reward_id: Types.ObjectId;
  child_id: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  requested_at: Date;
  reviewed_at: Date | null;
}

const RedemptionSchema = new Schema<IRedemption>({
  reward_id: { type: Schema.Types.ObjectId, ref: 'Reward', required: true },
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requested_at: { type: Date, default: Date.now },
  reviewed_at: { type: Date, default: null },
});

export default model<IRedemption>('Redemption', RedemptionSchema);
