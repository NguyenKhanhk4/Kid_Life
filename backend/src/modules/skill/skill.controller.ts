import { Request, Response, NextFunction } from 'express';
import { SkillService } from './skill.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';

export class SkillController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, ageRange } = req.body;
      if (!name || !description || !ageRange) {
        throw new AppError('name, description, ageRange are required', 400, 'MISSING_FIELDS');
      }
      const skill = await SkillService.create(req.body, req.user!.id);
      return sendResponse(res, 201, skill);
    } catch (error) { next(error); }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await SkillService.list({ search: req.query.search as string });
      return sendResponse(res, 200, { skills });
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await SkillService.update(req.params.id, req.user!.id, req.user!.role, req.body);
      return sendResponse(res, 200, skill);
    } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SkillService.delete(req.params.id);
      return sendResponse(res, 200, result);
    } catch (error) { next(error); }
  }
}
