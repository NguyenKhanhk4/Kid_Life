// Mongoose Schema & Model cho User — Dev 1 sở hữu
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  phone?: string;
  role: 'admin' | 'parent' | 'child';
  status: 'active' | 'locked';
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'parent', 'child'],
      default: 'parent',
    },
    refreshToken: {
      type: String,
      select: false,
    },
    status: {
      type: String,
      enum: ['active', 'locked'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', UserSchema);
