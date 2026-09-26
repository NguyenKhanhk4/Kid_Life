// rbacMiddleware — kiểm tra role của req.user, dùng chung toàn hệ thống
// Dev 2 (missions/submissions/wallet/rewards) và Dev 3 (pet/reports/stories/wishes/milestones)
// đều có thể import và dùng middleware này để bảo vệ route của họ.
//
// MA TRẬN QUYỀN RBAC (tham chiếu cho toàn team):
// ┌─────────────────┬─────────┬────────┬─────────────┐
// │ Hành động       │ admin   │ parent │ grandparent │
// ├─────────────────┼─────────┼────────┼─────────────┤
// │ Tạo mission     │   ✅    │   ✅   │     ❌      │
// │ Xoá mission     │   ✅    │   ✅   │     ❌      │
// │ Duyệt mission   │   ✅    │   ✅   │     ❌      │
// │ Xem mission     │   ✅    │   ✅   │     ✅      │
// │ Tạo reward      │   ✅    │   ✅   │     ❌      │
// │ Tặng quà/reward │   ✅    │   ✅   │     ✅      │
// │ Quản lý wallet  │   ✅    │   ✅   │     ❌      │
// │ Xem wallet      │   ✅    │   ✅   │     ✅      │
// │ Xem pet/stories │   ✅    │   ✅   │     ✅      │
// │ Mời thành viên  │   ✅    │   ❌   │     ❌      │
// │ Đổi role member │   ✅    │   ❌   │     ❌      │
// └─────────────────┴─────────┴────────┴─────────────┘
//
// Cách dùng:
//   import requireRole from '../../middleware/rbacMiddleware';
//   router.post('/missions', authMiddleware, requireRole('admin', 'parent'), createMission);
//   router.get('/missions', authMiddleware, requireRole('admin', 'parent', 'grandparent'), getMissions);

import { Request, Response, NextFunction } from 'express';

function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Bạn chưa đăng nhập',
        },
      });
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Bạn không có quyền thực hiện hành động này. Yêu cầu vai trò: ${allowedRoles.join(' hoặc ')}.`,
        },
      });
      return;
    }

    next();
  };
}

export default requireRole;
