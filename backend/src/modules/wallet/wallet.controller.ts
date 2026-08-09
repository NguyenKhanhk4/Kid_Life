import { Request, Response, NextFunction } from 'express';
import { WalletService } from './wallet.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';

export class WalletController {
  static async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.params.childId;
      
      const wallet = await WalletService.getWallet(childId);
      if (!wallet) {
        throw new AppError('Wallet not found', 404, 'NOT_FOUND');
      }
      return sendResponse(res, 200, wallet);
    } catch (error) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.params.childId;
      const limit = parseInt(req.query.limit as string) || 20;
      const cursor = req.query.cursor ? new Date(req.query.cursor as string) : undefined;
      
      const history = await WalletService.getHistory(childId, limit, cursor);
      return sendResponse(res, 200, history);
    } catch (error) {
      next(error);
    }
  }

  static async adminAdjust(req: Request, res: Response, next: NextFunction) {
    try {
      const { childId } = req.params;
      const { amount, action, sourceId, idempotencyKey } = req.body;

      if (!amount || !action || !sourceId || !idempotencyKey) {
        throw new AppError('Missing required fields', 400, 'BAD_REQUEST');
      }

      let result;
      if (action === 'add') {
        result = await WalletService.addPoints(childId, amount, 'ADMIN', sourceId, idempotencyKey);
      } else if (action === 'deduct') {
        result = await WalletService.deductPoints(childId, amount, 'ADMIN', sourceId, idempotencyKey);
      } else {
        throw new AppError('Invalid action', 400, 'BAD_REQUEST');
      }

      return sendResponse(res, 200, result);
    } catch (error) {
      next(error);
    }
  }
}
