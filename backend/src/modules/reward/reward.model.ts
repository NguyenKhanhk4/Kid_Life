import mongoose, { Schema, Document } from 'mongoose';

export type RewardType = 'VIRTUAL' | 'PHYSICAL';
export type RewardStatus = 'ACTIVE' | 'ARCHIVED';

export interface IReward extends Document {
  familyId: string;
  createdBy: string;
  title: string;
  description: string;
  type: RewardType;
  cost: number;
  status: RewardStatus;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema: Schema = new Schema(
  {
    familyId: { type: String, required: true },
    createdBy: { type: String, required: true }, // parentId
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['VIRTUAL', 'PHYSICAL'], default: 'PHYSICAL' },
    cost: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

export const Reward = mongoose.model<IReward>('Reward', RewardSchema);

export type RedemptionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IRewardRedemption extends Document {
  familyId: string;
  childId: string;
  rewardId: mongoose.Types.ObjectId;
  rewardTitleSnapshot: string;
  costSnapshot: number;
  status: RedemptionStatus;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  walletTransactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const RewardRedemptionSchema: Schema = new Schema(
  {
    familyId: { type: String, required: true },
    childId: { type: String, required: true },
    rewardId: { type: Schema.Types.ObjectId, ref: 'Reward', required: true },
    rewardTitleSnapshot: { type: String, required: true },
    costSnapshot: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    reviewedBy: { type: String, default: null }, // parentId
    reviewedAt: { type: Date, default: null },
    walletTransactionId: { type: String, default: null },
  },
  { timestamps: true }
);

export const RewardRedemption = mongoose.model<IRewardRedemption>('RewardRedemption', RewardRedemptionSchema);
