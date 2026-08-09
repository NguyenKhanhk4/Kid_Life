import { Router } from 'express';
import { SubmissionController } from './submission.controller';
import { requireAuth, requireRole, requireChildScope } from '../../shared/middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole(['PARENT']), SubmissionController.getSubmissions);
router.get('/:id', requireRole(['PARENT']), SubmissionController.getSubmissionById);
router.patch('/:id/review', requireRole(['PARENT']), SubmissionController.reviewSubmission);

export { router as submissionRoutes };
