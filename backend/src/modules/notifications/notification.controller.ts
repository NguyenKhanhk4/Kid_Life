// Notification Controller
import { Request, Response } from 'express';
import { getNotificationsService, markAsReadService } from './notification.service';
import { successResponse } from '../../utils/responseHelper';

export async function getNotifications(req: Request, res: Response): Promise<void> {
  try {
    const result = await getNotificationsService(req.user!.id);
    res.status(200).json(successResponse(result, 'Lấy danh sách thông báo thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_NOTIFICATIONS_ERROR', message: err.message },
    });
  }
}

export async function markAsRead(req: Request, res: Response): Promise<void> {
  try {
    const notif = await markAsReadService(req.user!.id, req.params.id);
    res.status(200).json(successResponse(notif, 'Đã đánh dấu thông báo là đã đọc'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'MARK_READ_ERROR', message: err.message },
    });
  }
}
