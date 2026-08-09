import { Router } from 'express';
import { MissionController } from './mission.controller';
import { requireAuth, requireRole, requireChildScope } from '../../shared/middleware/auth';
import { SubmissionController } from '../submission/submission.controller';

const router = Router();

router.use(requireAuth);

router.post('/', requireRole(['PARENT']), requireChildScope('childId'), MissionController.createMission);

// GET requires query parameter childId or implicitly sets it based on req.user for CHILD
router.get('/', (req, res, next) => {
  if (req.user?.role === 'CHILD') {
    req.query.childId = req.user.id;
  }
  next();
}, requireChildScope('childId'), MissionController.getMissions);

router.get('/:id', MissionController.getMissionById);
router.put('/:id', requireRole(['PARENT']), MissionController.updateMission);
router.delete('/:id', requireRole(['PARENT']), MissionController.deleteMission);

router.patch('/:id/checklist/:itemId', requireRole(['CHILD', 'PARENT']), MissionController.updateChecklist);

// Submission nested routes
router.post('/:id/submissions', requireRole(['CHILD']), SubmissionController.createSubmission);

export { router as missionRoutes };
