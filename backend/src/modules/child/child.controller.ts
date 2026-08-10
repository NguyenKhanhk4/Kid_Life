import { Request, Response, NextFunction } from 'express';
import { ChildService } from './child.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';

export class ChildController {
  static async createChild(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, dateOfBirth, loginUsername, loginPassword } = req.body;
      if (!name || !dateOfBirth || !loginUsername || !loginPassword) {
        throw new AppError('name, dateOfBirth, loginUsername, loginPassword are required', 400, 'MISSING_FIELDS');
      }
      const result = await ChildService.createChild(req.user!.id, req.body);
      return sendResponse(res, 201, result);
    } catch (error) { next(error); }
  }

  static async getChildren(req: Request, res: Response, next: NextFunction) {
    try {
      const children = await ChildService.getChildren(req.user!.id);
      return sendResponse(res, 200, { children });
    } catch (error) { next(error); }
  }

  static async getChild(req: Request, res: Response, next: NextFunction) {
    try {
      const child = await ChildService.getChild(req.user!.id, req.params.id);
      return sendResponse(res, 200, child);
    } catch (error) { next(error); }
  }

  static async updateChild(req: Request, res: Response, next: NextFunction) {
    try {
      const child = await ChildService.updateChild(req.user!.id, req.params.id, req.body);
      return sendResponse(res, 200, child);
    } catch (error) { next(error); }
  }

  static async deleteChild(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ChildService.deleteChild(req.user!.id, req.params.id);
      return sendResponse(res, 200, result);
    } catch (error) { next(error); }
  }
}
