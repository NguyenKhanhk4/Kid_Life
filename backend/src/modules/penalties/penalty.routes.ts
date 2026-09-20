// Express routes cho Penalty module
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { createPenaltySchema } from './penalty.validation';
import { createPenaltyController, getPenaltiesController } from './penalty.controller';

const router = Router();

router.get('/', getPenaltiesController);
router.post('/', validateRequest(createPenaltySchema), createPenaltyController);

export default router;
