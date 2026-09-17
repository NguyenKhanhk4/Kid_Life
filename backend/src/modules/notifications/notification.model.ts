// Mongoose Model cho Notification — Dev 1 sở hữu
import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: string; // 'mission_submitted', 'wish_created', 'redemption_requested', v.v.
  title: string;
  body: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    targetUrl: {
      type: String,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index để lấy danh sách thông báo theo userId nhanh nhất, kết hợp sort createdAt
NotificationSchema.index({ userId: 1, createdAt: -1 });

export default model<INotification>('Notification', NotificationSchema);
