import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  IoHomeOutline,
  IoListOutline,
  IoCheckmarkCircleOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoCardOutline,
  IoLogOutOutline,
  IoVideocamOutline,
  IoSchoolOutline,
} from 'react-icons/io5';
import { useAuth } from '@/modules/auth/AuthContext';
import ChildPicker from '@/shared/components/ChildPicker';
import NotificationBell from '@/shared/components/NotificationBell';
import { getPendingApprovalsCount } from '@/shared/utils/taskStorage';

const NAV_ITEMS = [
  { path: '/parent/home', label: 'Trang chủ', icon: IoHomeOutline, emoji: '🏠' },
  { path: '/parent/tasks', label: 'Nhiệm vụ', icon: IoListOutline, emoji: '📋' },
  { path: '/parent/approval', label: 'Duyệt thưởng', icon: IoCheckmarkCircleOutline, emoji: '✅' },
  { path: '/parent/video-manage', label: 'Quản lý Video', icon: IoVideocamOutline, emoji: '🎬' },
  { path: '/parent/quiz-manage', label: 'Quản lý Quiz', icon: IoSchoolOutline, emoji: '🧠' },
  { path: '/parent/ai-analytics', label: 'Báo cáo AI', icon: IoHomeOutline, emoji: '📊' },
  { path: '/parent/stories', label: 'Voice Studio', icon: IoHomeOutline, emoji: '🎤' },
  { path: '/parent/memory-lane', label: 'Memory Lane', icon: IoHomeOutline, emoji: '📷' },
  { path: '/parent/bank', label: 'Ngân hàng ảo', icon: IoCardOutline, emoji: '🏦' },
  { path: '/parent/community', label: 'Cộng đồng', icon: IoPeopleOutline, emoji: '🏆' },
  { path: '/parent/account', label: 'Tài khoản', icon: IoPersonOutline, emoji: '⚙️' },
];

export default function ParentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [pendingCount, setPendingCount] = useState<number>(getPendingApprovalsCount);

  useEffect(() => {
    const handleUpdate = () => {
      setPendingCount(getPendingApprovalsCount());
    };

    window.addEventListener('kidlife_approvals_count_update', handleUpdate);
    window.addEventListener('kidlife_tasks_update', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('kidlife_approvals_count_update', handleUpdate);
      window.removeEventListener('kidlife_tasks_update', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="web-shell">
      {/* Sidebar */}
      <aside className="web-sidebar parent-sidebar">
        {/* Brand */}
        <div className="web-sidebar-brand">
          <div className="web-sidebar-brand-icon">K</div>
          <div className="web-sidebar-brand-text">
            Kid<span>Life</span>
          </div>
        </div>

        {/* User Info */}
        <div className="web-sidebar-user">
          <div className="web-sidebar-avatar">
            👨‍👩‍👧
          </div>
          <div>
            <div className="web-sidebar-user-name">{user?.fullName || 'Phụ huynh'}</div>
            <div className="web-sidebar-user-role">Phụ huynh • {user?.email || ''}</div>
          </div>
        </div>

        {/* ChildPicker — chọn nhanh bé đang quản lý */}
        <div style={{ padding: '0 12px 12px' }}>
          <ChildPicker />
        </div>

        {/* Navigation */}
        <nav className="web-sidebar-nav">
          <div className="web-sidebar-section-label">Điều hướng</div>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== '/parent/home' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                className={`web-nav-item ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-item-icon">{item.emoji}</span>
                {item.label}
                {item.path === '/parent/approval' && pendingCount > 0 ? (
                  <span className="nav-item-badge">{pendingCount}</span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="web-sidebar-bottom">
          <button
            className="web-sidebar-mode-btn"
            onClick={() => navigate('/role')}
          >
            ⇄ Chuyển sang chế độ Trẻ em
          </button>

          <button
            className="web-nav-item"
            style={{ color: 'var(--kl-red)', marginTop: 4 }}
            onClick={() => { logout(); navigate('/login'); }}
          >
            <span className="nav-item-icon"><IoLogOutOutline size={18} /></span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="web-main" style={{ position: 'relative' }}>
        {/* Top Header Controls (Global) */}
        <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 100, display: 'flex', gap: 12 }}>
          <NotificationBell />
        </div>
        
        <Outlet />
      </main>
    </div>
  );
}
