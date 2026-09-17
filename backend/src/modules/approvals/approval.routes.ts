import { Router } from 'express';
import { validateRequest } from '../../middleware/validateRequest';
import { approveSubmissionSchema } from './approval.validation';
import { getPendingController, approveController, getWalletController } from './approval.controller';

const router = Router();

router.get('/pending', getPendingController);
router.get('/wallet/:childId', getWalletController);
router.post('/:submissionId/approve', validateRequest(approveSubmissionSchema), approveController);

export default router;
