import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'PARENT' | 'CHILD' | 'EXPERT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'LOCKED' | 'PENDING';

export interface IRefreshToken {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  phone?: string;
  isEmailVerified: boolean;
  refreshTokens: IRefreshToken[];
  loginAttempts: number;
  lockUntil?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['PARENT', 'CHILD', 'EXPERT', 'ADMIN'], required: true },
    status: { type: String, enum: ['ACTIVE', 'LOCKED', 'PENDING'], default: 'ACTIVE' },
    avatarUrl: { type: String },
    phone: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    refreshTokens: { type: [RefreshTokenSchema], default: [] },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    emailVerificationToken: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true });
UserSchema.index({ emailVerificationToken: 1 }, { sparse: true });

// Never return sensitive fields in JSON
UserSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(_doc: any, ret: any) {
    delete ret.passwordHash;
    delete ret.refreshTokens;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.emailVerificationToken;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser>('User', UserSchema);
