// Notification Service — Dùng chung toàn hệ thống
import { Types } from 'mongoose';
import Notification from './notification.model';

export interface CreateNotificationParams {
  userId: string;
  type: string;
  title: string;
  body: string;
  targetUrl?: string;
}

/**
 * @function createNotification
 * @description Hàm tạo thông báo. Dùng chung cho toàn hệ thống.
 * DEV 2 (missions, rewards) & DEV 3 (pet, wishes) IMPORT HÀM NÀY VÀ GỌI ĐỂ PHÁT THÔNG BÁO.
 * Không cần chờ logic của Dev 1.
 * 
 * @param {CreateNotificationParams} params - Thông tin thông báo
 * @param {string} params.userId - ObjectId của User nhận thông báo (VD: parentId)
 * @param {string} params.type - Loại thông báo (VD: 'mission_submitted', 'wish_created', 'redemption_requested')
 * @param {string} params.title - Tiêu đề ngắn gọn
 * @param {string} params.body - Nội dung chi tiết
 * @param {string} [params.targetUrl] - Link điều hướng khi click (VD: '/parent/approval')
 * @returns {Promise<any>}
 */
export async function createNotification(params: CreateNotificationParams) {
  const notif = await Notification.create({
    userId: new Types.ObjectId(params.userId),
    type: params.type,
    title: params.title,
    body: params.body,
    targetUrl: params.targetUrl,
  });
  return notif;
}

// ─── GET notifications của 1 user ────────────────────────────────────────────
export async function getNotificationsService(userId: string) {
  const uid = new Types.ObjectId(userId);
  
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ userId: uid })
      .sort({ createdAt: -1 })
      .limit(50) // Giới hạn lấy 50 thông báo gần nhất
      .lean(),
    Notification.countDocuments({ userId: uid, isRead: false }),
  ]);

  return { notifications, unreadCount };
}

// ─── ĐÁNH DẤU ĐÃ ĐỌC ──────────────────────────────────────────────────────────
export async function markAsReadService(userId: string, notificationId: string) {
  const notif = await Notification.findOneAndUpdate(
    { _id: new Types.ObjectId(notificationId), userId: new Types.ObjectId(userId) },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!notif) {
    const err = new Error('Không tìm thấy thông báo');
    (err as any).code = 'NOTIFICATION_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  return notif;
}
