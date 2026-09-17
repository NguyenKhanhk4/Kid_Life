// usePermission — hook dùng chung toàn hệ thống
// Dev 2 (missions/wallet/rewards) và Dev 3 (pet/stories/wishes) đều import hook này
// để ẩn/hiện UI dựa trên role của user hiện tại.
//
// MA TRẬN QUYỀN RBAC (tham chiếu frontend):
// ┌──────────────────────────┬─────────┬────────┬─────────────┐
// │ Quyền                    │ admin   │ parent │ grandparent │
// ├──────────────────────────┼─────────┼────────┼─────────────┤
// │ canCreateMission         │   ✅    │   ✅   │     ❌      │
// │ canDeleteMission         │   ✅    │   ✅   │     ❌      │
// │ canApproveMission        │   ✅    │   ✅   │     ❌      │
// │ canGiveReward            │   ✅    │   ✅   │     ✅      │
// │ canManageWallet          │   ✅    │   ✅   │     ❌      │
// │ canInviteFamily          │   ✅    │   ❌   │     ❌      │
// │ canChangeRole            │   ✅    │   ❌   │     ❌      │
// └──────────────────────────┴─────────┴────────┴─────────────┘
//
// Cách dùng:
//   const { canCreateMission, canApproveMission } = usePermission();
//   {canCreateMission && <button>Tạo nhiệm vụ</button>}

import { useAuth } from './AuthContext';

export interface PermissionMap {
  // Missions
  canCreateMission: boolean;
  canDeleteMission: boolean;
  canApproveMission: boolean;
  // Rewards / Wallet
  canGiveReward: boolean;
  canManageWallet: boolean;
  // Family
  canInviteFamily: boolean;
  canChangeRole: boolean;
  // General
  isAdmin: boolean;
  isParent: boolean;
  isGrandparent: boolean;
  isChild: boolean;
  /** Kiểm tra role tuỳ ý */
  hasRole: (...roles: string[]) => boolean;
}

export function usePermission(): PermissionMap {
  const { user } = useAuth();
  const role = user?.role ?? '';

  const hasRole = (...roles: string[]) => roles.includes(role);

  return {
    // Missions
    canCreateMission: hasRole('admin', 'parent'),
    canDeleteMission: hasRole('admin', 'parent'),
    canApproveMission: hasRole('admin', 'parent'),
    // Rewards / Wallet
    canGiveReward: hasRole('admin', 'parent', 'grandparent'),
    canManageWallet: hasRole('admin', 'parent'),
    // Family
    canInviteFamily: hasRole('admin'),
    canChangeRole: hasRole('admin'),
    // General flags
    isAdmin: role === 'admin',
    isParent: role === 'parent',
    isGrandparent: role === 'grandparent',
    isChild: role === 'child',
    hasRole,
  };
}
