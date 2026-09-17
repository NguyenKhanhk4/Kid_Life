import { Router } from 'express';
import { createSupportTicket } from './admin.controller';
import authMiddleware from '../../middleware/authMiddleware';

const router = Router();

// Gửi ticket từ phụ huynh (Public cho user đăng nhập)
router.post('/tickets', authMiddleware, createSupportTicket);

export default router;
