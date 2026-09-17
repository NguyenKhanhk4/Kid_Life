// Mongoose Model cho Leaderboard (collection: leaderboards)
// Dev 2 sẽ gọi `incrementLeaderboardPoints(familyId, challengeId, amount)`
// được export từ community.service.ts để cộng điểm khi duyệt nhiệm vụ
import { Schema, model, Document, Types } from 'mongoose';

export interface ILeaderboard extends Document {
  challengeId: Types.ObjectId;
  familyId: Types.ObjectId;  // parentId của admin gia đình
  points: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    familyId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    points: { type: Number, default: 0, min: 0 },
    streak: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Mỗi gia đình chỉ tham gia 1 challenge 1 lần
LeaderboardSchema.index({ challengeId: 1, familyId: 1 }, { unique: true });

export default model<ILeaderboard>('Leaderboard', LeaderboardSchema);
