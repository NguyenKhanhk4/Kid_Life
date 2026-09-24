// Children Routes — mount tại /api/children
import { Router } from 'express';
import { getChildren, createChild, updateChild, resetPin, deleteChild, verifyPin } from './children.controller';
import authMiddleware from '../../middleware/authMiddleware';
import requireRole from '../../middleware/rbacMiddleware';
import validateRequest from '../../middleware/validateRequest';
import { createChildSchema, updateChildSchema, resetPinSchema } from './children.validation';

const router = Router();

// Tất cả route children đều cần đăng nhập + role parent/admin
router.use(authMiddleware);
router.use(requireRole('admin', 'parent'));

// GET /api/children
router.get('/', getChildren);

// POST /api/children
router.post('/', validateRequest(createChildSchema), createChild);

// PUT /api/children/:id
router.put('/:id', validateRequest(updateChildSchema), updateChild);

// POST /api/children/:id/reset-pin
router.post('/:id/reset-pin', validateRequest(resetPinSchema), resetPin);

// DELETE /api/children/:id
router.delete('/:id', deleteChild);

// POST /api/children/:id/verify-pin
router.post('/:id/verify-pin', verifyPin);

export default router;
