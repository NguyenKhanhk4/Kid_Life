// Admin Routes — mount tại /api/admin
import { Router } from 'express';
import { 
  getAdminStats, getUsers, updateUserStatus, 
  getFamilyDetail, updateChildStatus, getPendingInvites,
  getReportedPosts, hidePost, createChallengeAdmin, closeChallengeAdmin,
  getSettings, updateSetting,
  masterDataPlaceholder, getMasterDataPlaceholder,
  getAuditLogs, createSupportTicket, getSupportTickets, resolveSupportTicket
} from './admin.controller';
import authMiddleware from '../../middleware/authMiddleware';
import rbacMiddleware from '../../middleware/rbacMiddleware';

const router = Router();

// Tất cả route admin đều cần đăng nhập và role='admin'
router.use(authMiddleware);
router.use(rbacMiddleware('admin'));

// GET /api/admin/stats
router.get('/stats', getAdminStats);

// GET /api/admin/users
router.get('/users', getUsers);

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', updateUserStatus);

// GET /api/admin/families/:userId
router.get('/families/:userId', getFamilyDetail);

// PUT /api/admin/children/:id/status
router.put('/children/:id/status', updateChildStatus);

// GET /api/admin/family-invites?status=pending
router.get('/family-invites', getPendingInvites);

// ─── NHÓM C: KIỂM DUYỆT CỘNG ĐỒNG ──────────────────────────────────────────────
router.get('/community/reports', getReportedPosts);
router.put('/community/posts/:id/hide', hidePost);
router.post('/community/challenges', createChallengeAdmin);
router.put('/community/challenges/:id/close', closeChallengeAdmin);

// ─── NHÓM E: CẤU HÌNH HỆ THỐNG ───────────────────────────────────────────────
router.get('/settings', getSettings);
router.put('/settings/:key', updateSetting);

// ─── NHÓM D: QUẢN LÝ DANH MỤC HỆ THỐNG (Master Data) ────────────────────────
// Các model này thuộc Dev 2/3. Sử dụng placeholder
router.get('/master-data/curated-stories', getMasterDataPlaceholder);
router.post('/master-data/curated-stories', masterDataPlaceholder);
router.put('/master-data/curated-stories/:id', masterDataPlaceholder);
router.delete('/master-data/curated-stories/:id', masterDataPlaceholder);

router.get('/master-data/pet-accessories', getMasterDataPlaceholder);
router.post('/master-data/pet-accessories', masterDataPlaceholder);
router.put('/master-data/pet-accessories/:id', masterDataPlaceholder);
router.delete('/master-data/pet-accessories/:id', masterDataPlaceholder);

router.get('/master-data/lessons', getMasterDataPlaceholder);
router.post('/master-data/lessons', masterDataPlaceholder);
router.put('/master-data/lessons/:id', masterDataPlaceholder);
router.delete('/master-data/lessons/:id', masterDataPlaceholder);

// ─── NHÓM F: VẬN HÀNH & GIÁM SÁT ──────────────────────────────────────────────
router.get('/audit-logs', getAuditLogs);
router.get('/support/tickets', getSupportTickets);
router.put('/support/tickets/:id/resolve', resolveSupportTicket);
// Note: POST /api/support/tickets (gửi ticket từ user) sẽ được đặt ở support.routes.ts hoặc gộp vào đây nhưng phải bỏ check rbac('admin')
// Sẽ đặt riêng 1 route public bên dưới

export default router;
