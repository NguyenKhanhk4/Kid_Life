import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { requireAuth } from '../../shared/middleware/auth';
import { validateObjectId } from '../../shared/validation/validators';

const router = Router();

router.get('/', requireAuth, NotificationController.list);
router.patch('/:id/read', requireAuth, validateObjectId('id'), NotificationController.markRead);
router.patch('/read-all', requireAuth, NotificationController.markAllRead);

export const notificationRoutes = router;
