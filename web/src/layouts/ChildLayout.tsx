import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { useAuth } from '@/modules/auth/AuthContext';
import { getWalletData, WalletData } from '@/shared/utils/walletStorage';
import TaskCelebrationToast from '@/shared/components/TaskCelebrationToast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const NAV_ITEMS = [
  { path: '/child/home', label: 'Trang chủ', emoji: '🏠' },
  { path: '/child/tasks', label: 'Nhiệm vụ', emoji: '🎯' },
  { path: '/child/video-lessons', label: 'Học bài', emoji: '🎬' },
  { path: '/child/quiz-library', label: 'Kiểm tra trí nhớ', emoji: '🧠' },
  { path: '/child/wallet', label: 'Ví điểm', emoji: '💰' },
  { path: '/child/pet', label: 'Thú cưng', emoji: '🐉' },
  { path: '/child/account', label: 'Của tôi', emoji: '🧒' },
];

export default function ChildLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [wallet, setWallet] = useState<WalletData>(getWalletData);
  const [childProfile, setChildProfile] = useState<any | null>(null);
  const [petInfo, setPetInfo] = useState<any | null>(null);

  // Fetch child profile from API
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/children`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success && json.data?.length > 0) setChildProfile(json.data[0]); })
      .catch(() => {});
  }, [token]);

  // Fetch pet info from API
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/pet`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => { if (json.success && json.data) setPetInfo(json.data); })
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WalletData>;
      if (customEvent.detail) {
        setWallet(customEvent.detail);
      } else {
        setWallet(getWalletData());
      }
    };

    window.addEventListener('kidlife_wallet_update', handleWalletUpdate);
    window.addEventListener('focus', () => setWallet(getWalletData()));

    return () => {
      window.removeEventListener('kidlife_wallet_update', handleWalletUpdate);
      window.removeEventListener('focus', () => setWallet(getWalletData()));
    };
  }, []);

  return (
    <div className="web-shell">
      {/* Toast chúc mừng tự động khi phụ huynh duyệt bài */}
      <TaskCelebrationToast />

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
          <div className="child-sidebar-pet-emoji">{petInfo?.emoji ?? '🐣'}</div>
          <div className="child-sidebar-pet-name">{petInfo?.name ?? 'Thú cưng'}</div>
          <div className="child-sidebar-pet-level">
            Cấp {petInfo?.level ?? 1} • 🔥 {petInfo?.streakDays ?? petInfo?.streak_days ?? 0} ngày streak
          </div>
        </div>

        {/* Child User Info */}
        <div className="web-sidebar-user">
          <div className="web-sidebar-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '50%', width: 44, height: 44 }}>
            {childProfile?.avatar?.startsWith('/') ? (
              <img src={childProfile.avatar} alt="avatar" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
            ) : (
              childProfile?.avatar ?? '🧒'
            )}
          </div>
          <div>
            <div className="web-sidebar-user-name">Bé {childProfile?.name ?? '...'}</div>
            <div className="web-sidebar-user-role">
              ⭐ {wallet.balance.toLocaleString()} XP • Cấp {childProfile?.level ?? 1}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="web-sidebar-nav">
          <div className="web-sidebar-section-label">Menu</div>
          {NAV_ITEMS.map((item) => {
            const isQuizSection = item.path === '/child/quiz-library' &&
              (location.pathname.startsWith('/child/quiz') || location.pathname.startsWith('/child/quiz-result'));
            const active = location.pathname === item.path ||
              isQuizSection ||
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
