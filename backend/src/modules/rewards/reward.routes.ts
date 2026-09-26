// Định nghĩa routes cho Reward module
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import {
  createRewardSchema,
  updateRewardSchema,
  redeemSchema,
  approveRedemptionSchema,
} from './reward.validation';
import {
  getRewards,
  createReward,
  updateReward,
  redeemReward,
  approveRedemption,
  getRedemptions,
} from './reward.controller';

const router = Router();

// LƯU Ý QUAN TRỌNG: Route có path cụ thể phải đặt TRƯỚC route có :id params để tránh conflict
router.get('/redemptions', getRedemptions);
router.post('/redeem', validateRequest(redeemSchema), redeemReward);
router.post('/redemptions/:id/approve', validateRequest(approveRedemptionSchema), approveRedemption);
router.get('/', getRewards);
router.post('/', validateRequest(createRewardSchema), createReward);
router.put('/:id', validateRequest(updateRewardSchema), updateReward);

export default router;
