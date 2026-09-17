// Family Routes — mount tại /api/family
import { Router } from 'express';
import { getMembers, inviteMember, updateMemberRole } from './family.controller';
import authMiddleware from '../../middleware/authMiddleware';
import requireRole from '../../middleware/rbacMiddleware';
import validateRequest from '../../middleware/validateRequest';
import { inviteMemberSchema, updateRoleSchema } from './family.validation';

const router = Router();

// Tất cả route family đều cần đăng nhập
router.use(authMiddleware);

// GET /api/family/members — admin & parent đều xem được danh sách gia đình mình
router.get(
  '/members',
  requireRole('admin', 'parent'),
  getMembers
);

// POST /api/family/invite — chỉ admin mới được mời thành viên
router.post(
  '/invite',
  requireRole('admin'),
  validateRequest(inviteMemberSchema),
  inviteMember
);

// PUT /api/family/members/:id/role — chỉ admin mới được đổi role
router.put(
  '/members/:id/role',
  requireRole('admin'),
  validateRequest(updateRoleSchema),
  updateMemberRole
);

export default router;
