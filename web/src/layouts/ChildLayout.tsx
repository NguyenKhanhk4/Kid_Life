import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const D = MOCK_KIDLIFE_DATA;

const NAV_ITEMS = [
  { path: '/child/home', label: 'Trang chủ', emoji: '🏠' },
  { path: '/child/tasks', label: 'Nhiệm vụ', emoji: '🎯' },
  { path: '/child/lessons', label: 'Học bài', emoji: '📚' },
  { path: '/child/wallet', label: 'Ví điểm', emoji: '💰' },
  { path: '/child/pet', label: 'Thú cưng', emoji: '🐉' },
  { path: '/child/account', label: 'Của tôi', emoji: '🧒' },
];

export default function ChildLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="web-shell">
      {/* Sidebar - Kid-friendly theme */}
      <aside className="web-sidebar child-sidebar">
        {/* Brand */}
        <div className="web-sidebar-brand">
          <div className="web-sidebar-brand-icon">K</div>
          <div className="web-sidebar-brand-text">
            Kid<span>Life</span>
          </div>
        </div>

        {/* Pet Mini Showcase */}
        <div className="child-sidebar-pet">
          <div className="child-sidebar-pet-emoji">{D.pet.emoji}</div>
          <div className="child-sidebar-pet-name">{D.pet.name}</div>
          <div className="child-sidebar-pet-level">
            Cấp {D.pet.level} • 🔥 {D.pet.streak} ngày streak
          </div>
        </div>

        {/* Child User Info */}
        <div className="web-sidebar-user">
          <div className="web-sidebar-avatar">
            {D.child.avatar}
          </div>
          <div>
            <div className="web-sidebar-user-name">Bé {D.child.name}</div>
            <div className="web-sidebar-user-role">
              ⭐ {D.child.xp.toLocaleString()} XP • Cấp {D.child.level}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="web-sidebar-nav">
          <div className="web-sidebar-section-label">Menu</div>
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== '/child/home' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                className={`web-nav-item ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-item-icon">{item.emoji}</span>
                {item.label}
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
            🔄 Chuyển sang Phụ huynh
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
