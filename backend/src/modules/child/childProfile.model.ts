import mongoose, { Schema, Document } from 'mongoose';

export interface IChildProfile extends Document {
  parentId: string;
  name: string;
  dateOfBirth: Date;
  avatarUrl?: string;
  loginUsername: string;
  loginPasswordHash: string;
  preferredSkills: string[];
  level: number;
  totalPoints: number;
  restrictions?: {
    maxScreenTime?: number;
    allowedHours?: { start: string; end: string };
  };
  createdAt: Date;
  updatedAt: Date;
}

const ChildProfileSchema = new Schema<IChildProfile>(
  {
    parentId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    avatarUrl: { type: String },
    loginUsername: { type: String, required: true, unique: true, lowercase: true, trim: true },
    loginPasswordHash: { type: String, required: true },
    preferredSkills: [{ type: String }],
    level: { type: Number, default: 1, min: 1 },
    totalPoints: { type: Number, default: 0, min: 0 },
    restrictions: {
      maxScreenTime: { type: Number },
      allowedHours: {
        start: { type: String },
        end: { type: String },
      },
    },
  },
  { timestamps: true }
);

ChildProfileSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(_doc: any, ret: any) {
    delete ret.loginPasswordHash;
    delete ret.__v;
    return ret;
  },
});

export const ChildProfile = mongoose.model<IChildProfile>('ChildProfile', ChildProfileSchema);
