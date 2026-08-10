import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 'SUBMISSION' | 'MISSION' | 'REWARD' | 'PAYMENT' | 'SYSTEM' | 'CONTENT';
export type NotificationChannel = 'IN_APP' | 'PUSH' | 'BOTH';
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface INotification extends Document {
  receiverId: string;
  type: NotificationType;
  title: string;
  content: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    receiverId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['SUBMISSION', 'MISSION', 'REWARD', 'PAYMENT', 'SYSTEM', 'CONTENT'],
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    channel: { type: String, enum: ['IN_APP', 'PUSH', 'BOTH'], default: 'IN_APP' },
    priority: { type: String, enum: ['LOW', 'NORMAL', 'HIGH'], default: 'NORMAL' },
    isRead: { type: Boolean, default: false, index: true },
    actionUrl: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
