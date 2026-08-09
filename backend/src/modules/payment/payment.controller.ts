import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';

export class PaymentController {
  static getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = PaymentService.getPlans();
      return sendResponse(res, 200, plans);
    } catch (error) { next(error); }
  }

  static async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = req.user?.id;
      if (!parentId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

      const { planId, idempotencyKey } = req.body;
      if (!planId || !idempotencyKey) {
        throw new AppError('Missing planId or idempotencyKey', 400, 'BAD_REQUEST');
      }

      const result = await PaymentService.subscribe(parentId, planId, idempotencyKey);
      return sendResponse(res, 201, result);
    } catch (error) { next(error); }
  }

  static async getMySubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = req.user?.id;
      if (!parentId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

      const subscriptions = await PaymentService.getSubscriptions(parentId);
      return sendResponse(res, 200, subscriptions);
    } catch (error) { next(error); }
  }

  static async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = req.user?.id;
      if (!parentId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

      const subscription = await PaymentService.cancelCurrentSubscription(parentId);
      return sendResponse(res, 200, subscription);
    } catch (error) { next(error); }
  }

  static async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = req.user?.id;
      if (!parentId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

      const transactions = await PaymentService.getTransactions(parentId);
      return sendResponse(res, 200, transactions);
    } catch (error) { next(error); }
  }
}
