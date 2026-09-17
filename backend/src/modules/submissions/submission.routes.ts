// Định nghĩa routes cho Submission module
import { Router } from 'express';
import upload from '../../config/multer';
import validateRequest from '../../middleware/validateRequest';
import { updateSubtaskSchema } from './submission.validation';
import {
  updateSubtaskController,
  createSubmissionController,
} from './submission.controller';

const router = Router();

router.put('/missions/:missionId/subtasks/:subId', validateRequest(updateSubtaskSchema), updateSubtaskController);
router.post('/', upload.single('proof_image'), createSubmissionController);

export default router;
