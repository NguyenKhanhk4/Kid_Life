// Mongoose Model cho Challenge (collection: challenges)
import { Schema, model, Document } from 'mongoose';

export interface IChallenge extends Document {
  title: string;
  description: string;
  durationDays: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    durationDays: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

export default model<IChallenge>('Challenge', ChallengeSchema);
