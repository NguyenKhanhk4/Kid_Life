// Express routes cho VirtualBank module
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { depositSchema, withdrawSchema } from './virtual-bank.validation';
import {
  getBankAccountController,
  depositController,
  withdrawController,
  triggerInterestController,
} from './virtual-bank.controller';

const router = Router();

// Routes cụ thể đặt trước routes chứa params (:childId)
router.post('/deposit', validateRequest(depositSchema), depositController);
router.post('/withdraw', validateRequest(withdrawSchema), withdrawController);
router.post('/trigger-interest', triggerInterestController);
router.get('/:childId', getBankAccountController);

export default router;
