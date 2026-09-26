// Notification Routes — mount tại /api/notifications
import { Router } from 'express';
import { getNotifications, markAsRead } from './notification.controller';
import authMiddleware from '../../middleware/authMiddleware';

const router = Router();

// Tất cả route notification đều cần đăng nhập
router.use(authMiddleware);

// GET /api/notifications
router.get('/', getNotifications);

// PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

export default router;
