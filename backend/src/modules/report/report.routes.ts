import { Router } from 'express';
import { ReportController } from './report.controller';
import { requireAuth, requireRole, requireChildScope } from '../../shared/middleware/auth';

const router = Router();

router.get('/child/:id', requireAuth, requireChildScope('id'), ReportController.getChildReport);
router.get('/admin/overview', requireAuth, requireRole(['ADMIN']), ReportController.getAdminOverview);
router.get('/expert/content', requireAuth, requireRole(['EXPERT']), ReportController.getExpertContent);

export const reportRoutes = router;
