// Mongoose Schema & Model cho Reward
import { Schema, model, Document, Types } from 'mongoose';

export interface IReward extends Document {
  parent_id: Types.ObjectId;
  title: string;
  cost_xp: number;
  category: string;
  icon?: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

const RewardSchema = new Schema<IReward>({
  parent_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  cost_xp: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, enum: ['vat_ly', 'trai_nghiem', 'gia_dinh', 'khac'] },
  icon: { type: String, default: '' },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model<IReward>('Reward', RewardSchema);
