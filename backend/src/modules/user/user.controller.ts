import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { sendResponse } from '../../shared/responses/apiResponse';

export class UserController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getProfile(req.user!.id);
      return sendResponse(res, 200, user);
    } catch (error) { next(error); }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateProfile(req.user!.id, req.body);
      return sendResponse(res, 200, user);
    } catch (error) { next(error); }
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.listUsers({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        role: req.query.role as string,
        status: req.query.status as string,
        search: req.query.search as string,
      });
      return sendResponse(res, 200, result);
    } catch (error) { next(error); }
  }

  static async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUserStatus(req.params.id, req.body.status);
      return sendResponse(res, 200, user);
    } catch (error) { next(error); }
  }

  static async approveExpert(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.approveExpert(req.params.id, req.body.approved);
      return sendResponse(res, 200, user);
    } catch (error) { next(error); }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      return sendResponse(res, 200, result);
    } catch (error) { next(error); }
  }
}
