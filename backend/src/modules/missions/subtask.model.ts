// Mongoose Schema & Model cho Subtask
import { Schema, model, Document, Types } from 'mongoose';

export interface ISubtask extends Document {
  mission_id: Types.ObjectId;
  title: string;
  is_done: boolean;
  step_order: number;
}

const SubtaskSchema = new Schema<ISubtask>({
  mission_id: { type: Schema.Types.ObjectId, ref: 'Mission', required: true },
  title: { type: String, required: true, trim: true },
  is_done: { type: Boolean, default: false },
  step_order: { type: Number, required: true },
});

export default model<ISubtask>('Subtask', SubtaskSchema);
