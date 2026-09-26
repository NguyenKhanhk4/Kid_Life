import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../auth-kids.css';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const childRef = useRef<HTMLButtonElement>(null);

  // ── Logic giữ nguyên ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSelectRole = (role: 'parent' | 'child') => {
    if (role === 'child') {
      childRef.current?.classList.add('rs-card-celebrate');
      setTimeout(() => navigate('/child-login'), 380);
    } else {
      navigate('/parent/home');
    }
  };

  return (
    <div className="rs-screen">
      {/* ── Mây & Đom đóm trang trí ────────────────────────────────────── */}
      <div className="rs-fireflies">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="rs-firefly" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }} />
        ))}
      </div>

      {/* ── Nội dung ───────────────────────────────────────────────────── */}
      {user && (
        <p className="rs-greeting">
          Xin chào, <strong>{user.fullName || user.email}</strong>! 🌈
        </p>
      )}

      <h1 className="rs-title">Hôm nay bạn là ai? 🤔</h1>
      <p className="rs-subtitle">Chọn cổng vào thế giới của bạn nhé!</p>

      {/* ── 2 Card lựa chọn ────────────────────────────────────────────── */}
      <div className="rs-cards">
        {/* Card Phụ huynh */}
        <button
          id="role-parent-btn"
          className="rs-card rs-card-parent"
          onClick={() => handleSelectRole('parent')}
          aria-label="Vào với tư cách Phụ huynh"
        >
          <span className="rs-card-emoji" aria-hidden="true">👨‍👩‍👧</span>
          <span className="rs-card-title">Phụ huynh</span>
          <span className="rs-card-sub">Quản lý & theo dõi tiến độ học tập của con</span>
        </button>

        {/* Card Bé — bounce + sparkles */}
        <button
          id="role-child-btn"
          ref={childRef}
          className="rs-card rs-card-child"
          onClick={() => handleSelectRole('child')}
          aria-label="Vào với tư cách Bé"
        >
          {/* Ngôi sao lấp lánh trang trí */}
          <div className="rs-stars" aria-hidden="true">
            <span className="rs-star">✨</span>
            <span className="rs-star">⭐</span>
            <span className="rs-star">✨</span>
            <span className="rs-star">🌟</span>
          </div>
          <span className="rs-card-emoji" aria-hidden="true">🐣</span>
          <span className="rs-card-title">Em bé ngoan!</span>
          <span className="rs-card-sub">Vào học, chăm pet và nhận thưởng mỗi ngày 🎁</span>
        </button>
      </div>

      <p className="rs-footer-text" style={{ position: 'relative', zIndex: 2 }}>
        Bạn có thể chuyển tài khoản bất kỳ lúc nào. ✨
      </p>

      <button
        id="role-logout-btn"
        className="rs-logout"
        onClick={logout}
        style={{ position: 'relative', zIndex: 2 }}
        aria-label="Đăng xuất"
      >
        Đăng xuất
      </button>

    </div>
  );
}
