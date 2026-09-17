// Mongoose Schema & Model cho Mission
import { Schema, model, Document, Types } from 'mongoose';

export interface IMission extends Document {
  child_id: Types.ObjectId;
  title: string;
  category: string;
  reward_xp: number;
  schedule_time?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const MissionSchema = new Schema<IMission>({
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  title: { type: String, required: true, maxlength: 100, trim: true },
  category: { type: String, required: true, enum: ['hoc_tap', 'nha_cua', 'the_chat', 'ky_nang', 'khac'] },
  reward_xp: { type: Number, required: true, min: 1, max: 500 },
  schedule_time: { type: String, required: false, default: '' },
  status: { type: String, required: true, enum: ['todo', 'in_progress', 'submitted', 'done'], default: 'todo' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default model<IMission>('Mission', MissionSchema);
