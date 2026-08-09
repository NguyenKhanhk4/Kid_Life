import { Request, Response, NextFunction } from 'express';
import { MissionService } from './mission.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';
import { verifyChildScope } from '../../shared/middleware/auth';

export class MissionController {
  static async createMission(req: Request, res: Response, next: NextFunction) {
    try {
      // req.body.childId is already checked by requireChildScope in routes
      const data = req.body;
      const mission = await MissionService.createMission(data);
      return sendResponse(res, 201, mission);
    } catch (error) {
      next(error);
    }
  }

  static async getMissions(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.query.childId as string;
      const missions = await MissionService.getMissions(childId);
      return sendResponse(res, 200, missions);
    } catch (error) {
      next(error);
    }
  }

  static async getMissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const missionId = req.params.id;
      if (!missionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
      const mission = await MissionService.getMissionById(missionId);
      verifyChildScope(req.user!, mission.childId);
      return sendResponse(res, 200, mission);
    } catch (error) {
      next(error);
    }
  }

  static async updateMission(req: Request, res: Response, next: NextFunction) {
    try {
      const missionId = req.params.id;
      if (!missionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
      const mission = await MissionService.getMissionById(missionId);
      verifyChildScope(req.user!, mission.childId);
      
      const updated = await MissionService.updateMission(missionId, req.body);
      return sendResponse(res, 200, updated);
    } catch (error) {
      next(error);
    }
  }

  static async deleteMission(req: Request, res: Response, next: NextFunction) {
    try {
      const missionId = req.params.id;
      if (!missionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
      const mission = await MissionService.getMissionById(missionId);
      verifyChildScope(req.user!, mission.childId);

      await MissionService.deleteMission(missionId);
      return sendResponse(res, 200, { message: 'Mission deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async updateChecklist(req: Request, res: Response, next: NextFunction) {
    try {
      const missionId = req.params.id;
      const itemId = req.params.itemId;
      if (!missionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
      if (!itemId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid item ID', 400, 'BAD_REQUEST');
      const mission = await MissionService.getMissionById(missionId);
      verifyChildScope(req.user!, mission.childId);

      const { isDone } = req.body;
      if (typeof isDone !== 'boolean') {
        throw new AppError('isDone must be a boolean', 400, 'BAD_REQUEST');
      }
      const updated = await MissionService.updateChecklist(missionId, itemId, isDone);
      return sendResponse(res, 200, updated.checklist);
    } catch (error) {
      next(error);
    }
  }
}
