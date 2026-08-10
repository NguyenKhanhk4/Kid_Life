import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { sendResponse } from '../../shared/responses/apiResponse';

export class NotificationController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.listByUser(req.user!.id, {
        limit: parseInt(req.query.limit as string) || 20,
        cursor: req.query.cursor as string,
        unreadOnly: req.query.unreadOnly === 'true',
      });
      return sendResponse(res, 200, result);
    } catch (error) { next(error); }
  }

  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await NotificationService.markRead(req.params.id, req.user!.id);
      return sendResponse(res, 200, notification);
    } catch (error) { next(error); }
  }

  static async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.markAllRead(req.user!.id);
      return sendResponse(res, 200, result);
    } catch (error) { next(error); }
  }
}
