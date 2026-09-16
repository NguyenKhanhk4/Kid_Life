import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoHomeOutline, IoListOutline, IoCheckmarkCircleOutline, IoPeopleOutline, IoPersonOutline, IoCardOutline, IoLogOutOutline } from 'react-icons/io5';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const D = MOCK_KIDLIFE_DATA;

const NAV_ITEMS = [
  { path: '/parent/home', label: 'Trang chủ', icon: IoHomeOutline, emoji: '🏠' },
  { path: '/parent/tasks', label: 'Nhiệm vụ', icon: IoListOutline, emoji: '📋' },
  { path: '/parent/approval', label: 'Duyệt thưởng', icon: IoCheckmarkCircleOutline, emoji: '✅', badge: 3 },
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
            {D.parent.avatar}
          </div>
          <div>
            <div className="web-sidebar-user-name">{D.parent.name}</div>
            <div className="web-sidebar-user-role">Phụ huynh • {D.parent.role}</div>
          </div>
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
                {item.badge && (
                  <span className="nav-item-badge">{item.badge}</span>
                )}
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
            className="web-sidebar-mode-btn"
            onClick={() => navigate('/admin')}
          >
            🛠️ Admin Dashboard
          </button>
          <button
            className="web-nav-item"
            style={{ color: 'var(--kl-red)', marginTop: 4 }}
            onClick={() => navigate('/login')}
          >
            <span className="nav-item-icon"><IoLogOutOutline size={18} /></span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="web-main">
        <Outlet />
      </main>
    </div>
  );
}
