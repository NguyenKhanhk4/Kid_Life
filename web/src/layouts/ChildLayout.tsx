import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from 'react-icons/io5';
import { getWalletData, WalletData } from '@/shared/utils/walletStorage';
import TaskCelebrationToast from '@/shared/components/TaskCelebrationToast';
import { usePetSummary } from '@/features/pet/hooks/usePet';
import { getSpeciesConfig, getStageImageUrl } from '@/features/pet/config/species.config';

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
  const [wallet, setWallet] = useState<WalletData>(getWalletData);
  // Bé đang dùng (đăng nhập PIN) + pet thật của bé đó, tự cập nhật khi cho ăn ở trang Thú cưng
  const { child: childProfile, pet: petInfo } = usePetSummary();
  const petSpecies = petInfo ? getSpeciesConfig(petInfo.speciesId) : undefined;

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
          <div className="child-sidebar-pet-emoji">
            {petInfo && petSpecies ? (
              <img
                src={getStageImageUrl(petSpecies, petInfo.stage)}
                alt={petSpecies.name}
                style={{ width: 56, height: 56, objectFit: 'contain' }}
              />
            ) : (
              '🐣'
            )}
          </div>
          <div className="child-sidebar-pet-name">{petSpecies?.name ?? 'Chưa có thú cưng'}</div>
          <div className="child-sidebar-pet-level">
            {petInfo
              ? `Giai đoạn ${petInfo.stage}/${petInfo.maxStage} • 🔥 ${petInfo.streakDays} ngày streak`
              : 'Vào mục Thú cưng để chọn nhé!'}
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
