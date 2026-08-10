import { Notification, NotificationType, NotificationChannel, NotificationPriority } from './notification.model';
import { AppError } from '../../shared/errors/AppError';
import { sendPushNotification } from '../../shared/utils/fcm';

export class NotificationService {
  /**
   * Create a notification — exported for Dev 2 & Dev 3 to call
   */
  static async createNotification(data: {
    receiverId: string;
    type: NotificationType;
    title: string;
    content: string;
    channel?: NotificationChannel;
    priority?: NotificationPriority;
    actionUrl?: string;
  }) {
    const notification = await Notification.create({
      receiverId: data.receiverId,
      type: data.type,
      title: data.title,
      content: data.content,
      channel: data.channel || 'IN_APP',
      priority: data.priority || 'NORMAL',
      actionUrl: data.actionUrl,
    });

    if (notification.channel === 'PUSH' || notification.channel === 'BOTH') {
      // Note: In a real app, you'd fetch the user's fcm tokens from the DB here
      // For now, we simulate the FCM call with a dummy token for demonstration
      await sendPushNotification('user_fcm_token_placeholder', notification.title, notification.content, { url: notification.actionUrl || '' });
    }

    return notification;
  }

  /**
   * List notifications for a user with pagination
   */
  static async listByUser(receiverId: string, query: { limit?: number; cursor?: string; unreadOnly?: boolean }) {
    const limit = Math.min(100, Math.max(1, query.limit || 20));

    const filter: Record<string, unknown> = { receiverId };
    if (query.unreadOnly) filter.isRead = false;
    if (query.cursor) filter.createdAt = { $lt: new Date(query.cursor) };

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit);

    const unreadCount = await Notification.countDocuments({ receiverId, isRead: false });

    return { notifications, unreadCount };
  }

  /**
   * Mark a single notification as read
   */
  static async markRead(notificationId: string, receiverId: string) {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new AppError('Notification not found', 404, 'NOT_FOUND');
    if (notification.receiverId !== receiverId) throw new AppError('Forbidden', 403, 'FORBIDDEN');

    notification.isRead = true;
    await notification.save();
    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllRead(receiverId: string) {
    const result = await Notification.updateMany(
      { receiverId, isRead: false },
      { $set: { isRead: true } }
    );
    return { modifiedCount: result.modifiedCount };
  }
}
