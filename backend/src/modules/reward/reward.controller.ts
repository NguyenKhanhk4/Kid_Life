import { Request, Response, NextFunction } from 'express';
import { RewardService, CreateRewardDTO, UpdateRewardDTO } from './reward.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { AppError } from '../../shared/errors/AppError';

export class RewardController {
  // Reward Management (Parent)
  static async createReward(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.familyId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      
      const { title, description, type, cost } = req.body;
      const data: CreateRewardDTO = { title, description, type, cost };
      
      const reward = await RewardService.createReward(data, req.user.familyId, req.user.id);
      return sendResponse(res, 201, reward);
    } catch (error) { next(error); }
  }

  static async getRewards(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.user?.familyId;
      if (!familyId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      
      const status = req.query.status as string;
      const rewards = await RewardService.getRewards(familyId, status);
      return sendResponse(res, 200, rewards);
    } catch (error) { next(error); }
  }

  static async updateReward(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.user?.familyId;
      if (!familyId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      
      const { title, description, type, cost, status } = req.body;
      const data: UpdateRewardDTO = { title, description, type, cost, status };

      const reward = await RewardService.updateReward(req.params.id, data, familyId);
      return sendResponse(res, 200, reward);
    } catch (error) { next(error); }
  }

  static async archiveReward(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.user?.familyId;
      if (!familyId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      
      const reward = await RewardService.archiveReward(req.params.id, familyId);
      return sendResponse(res, 200, reward);
    } catch (error) { next(error); }
  }

  // Redemption requests
  static async redeemReward(req: Request, res: Response, next: NextFunction) {
    try {
      const childId = req.user?.id; // Assuming token is for child
      const familyId = req.user?.familyId;
      const rewardId = req.params.id;

      if (req.user?.role !== 'CHILD' || !childId || !familyId) {
        throw new AppError('Only children can request redemption', 403, 'FORBIDDEN');
      }

      const redemption = await RewardService.requestRedemption(childId, rewardId, familyId);
      return sendResponse(res, 201, redemption);
    } catch (error) { next(error); }
  }

  static async getRedemptions(req: Request, res: Response, next: NextFunction) {
    try {
      const familyId = req.user?.familyId;
      if (!familyId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      
      const status = req.query.status as string;
      const redemptions = await RewardService.getRedemptions(familyId, status);
      return sendResponse(res, 200, redemptions);
    } catch (error) { next(error); }
  }

  static async reviewRedemption(req: Request, res: Response, next: NextFunction) {
    try {
      const parentId = req.user?.id;
      const familyId = req.user?.familyId;
      if (!parentId || !familyId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

      const { approved } = req.body;
      
      let redemption;
      if (approved === true) {
        redemption = await RewardService.approveRedemption(req.params.id, parentId, familyId);
      } else if (approved === false) {
        redemption = await RewardService.rejectRedemption(req.params.id, parentId, familyId);
      } else {
        throw new AppError('Boolean "approved" field is required', 400, 'BAD_REQUEST');
      }

      return sendResponse(res, 200, redemption);
    } catch (error) { next(error); }
  }
}
