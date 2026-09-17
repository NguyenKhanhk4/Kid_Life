// Mongoose Schema & Model cho Submission
import { Schema, model, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  mission_id: Types.ObjectId;
  child_id: Types.ObjectId;
  proof_image_url: string;
  proof_image_public_id: string;
  status: 'submitted' | 'approved' | 'rejected';
  submitted_at: Date;
  reviewed_at: Date | null;
}

const SubmissionSchema = new Schema<ISubmission>({
  mission_id: { type: Schema.Types.ObjectId, ref: 'Mission', required: true },
  child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
  proof_image_url: { type: String, required: true, trim: true },
  proof_image_public_id: { type: String, required: true, trim: true },
  status: { type: String, required: true, enum: ['submitted', 'approved', 'rejected'], default: 'submitted' },
  submitted_at: { type: Date, default: Date.now },
  reviewed_at: { type: Date, default: null },
});

export default model<ISubmission>('Submission', SubmissionSchema);
