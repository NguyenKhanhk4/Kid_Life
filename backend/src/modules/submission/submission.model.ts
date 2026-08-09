import mongoose, { Document, Schema } from 'mongoose';

export type SubmissionStatus = 'pending_review' | 'approved' | 'rejected';

export interface ISubmission extends Document {
  missionId: string;
  childId: string;
  evidenceUrls: string[];
  status: SubmissionStatus;
  reviewedBy?: string;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    missionId: { type: String, required: true, index: true },
    childId: { type: String, required: true, index: true },
    evidenceUrls: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected'],
      default: 'pending_review',
    },
    reviewedBy: { type: String },
    rejectReason: { type: String },
  },
  { timestamps: true }
);

SubmissionSchema.index(
  { missionId: 1, childId: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending_review', 'approved'] } } }
);

export const Submission = mongoose.model<ISubmission>('Submission', SubmissionSchema);
