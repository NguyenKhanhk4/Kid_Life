import { Router } from 'express';
import { RewardController } from './reward.controller';
import { requireAuth, requireRole } from '../../shared/middleware/auth';
import { validateObjectId } from '../../shared/validation/validators';

const router = Router();

// Parent Reward Management
router.post('/rewards', requireAuth, requireRole(['PARENT']), RewardController.createReward);
router.get('/rewards', requireAuth, RewardController.getRewards);
router.put('/rewards/:id', requireAuth, requireRole(['PARENT']), validateObjectId('id'), RewardController.updateReward);
router.delete('/rewards/:id', requireAuth, requireRole(['PARENT']), validateObjectId('id'), RewardController.archiveReward);

// Child Request Redemption
router.post('/rewards/:id/redeem', requireAuth, requireRole(['CHILD']), validateObjectId('id'), RewardController.redeemReward);

// Parent Redemption Management
router.get('/rewards/redemptions', requireAuth, requireRole(['PARENT']), RewardController.getRedemptions);
router.patch('/rewards/redemptions/:id/approve', requireAuth, requireRole(['PARENT']), validateObjectId('id'), RewardController.reviewRedemption);

export const rewardRoutes = router;
