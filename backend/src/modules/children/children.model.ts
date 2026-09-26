// Mongoose Schema & Model cho Child — Dev 1 sở hữu
// QUAN TRỌNG: Export interface IChild để Dev 2 & Dev 3 import tham chiếu type
// Dev 2 (missions/submissions) sẽ cập nhật field `xp`, `level`
// Dev 3 (pet) sẽ cập nhật field `streak`
// Dev 1 KHÔNG viết logic cộng/trừ xp ở đây — chỉ định nghĩa schema
import { Schema, model, Document, Types } from 'mongoose';

export interface IChild extends Document {
  parentId: Types.ObjectId;
  name: string;
  age?: number;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  status: 'active' | 'locked';
  pinCodeHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChildSchema = new Schema<IChild>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    age: {
      type: Number,
      min: 1,
      max: 18,
    },
    avatar: {
      type: String,
      default: '🧒',
    },
    // Các field dưới đây do Dev 2 (xp/level) và Dev 3 (streak) cập nhật
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'locked'],
      default: 'active',
    },
    pinCodeHash: {
      type: String,
      select: false, // KHÔNG bao giờ trả về PIN hash trong response
    },
  },
  { timestamps: true }
);

export default model<IChild>('Child', ChildSchema);
