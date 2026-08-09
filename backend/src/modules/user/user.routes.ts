import { Router } from 'express';
import { UserController } from './user.controller';
import { requireAuth, requireRole } from '../../shared/middleware/auth';
import { validateObjectId, validateEnumBody } from '../../shared/validation/validators';

const router = Router();

// Profile (authenticated user)
router.get('/me', requireAuth, UserController.getMe);
router.put('/me', requireAuth, UserController.updateMe);

// Admin user management
router.get('/', requireAuth, requireRole(['ADMIN']), UserController.listUsers);
router.patch('/:id/status', requireAuth, requireRole(['ADMIN']), validateObjectId('id'), validateEnumBody('status', ['ACTIVE', 'LOCKED']), UserController.updateUserStatus);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), validateObjectId('id'), UserController.deleteUser);

// Admin expert approval
router.patch('/experts/:id/approve', requireAuth, requireRole(['ADMIN']), validateObjectId('id'), UserController.approveExpert);

export const userRoutes = router;
