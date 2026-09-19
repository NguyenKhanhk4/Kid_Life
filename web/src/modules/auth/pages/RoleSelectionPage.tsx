import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import '../auth-kids.css';

export default function RoleSelectionPage() {
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const childRef  = useRef<HTMLButtonElement>(null);

  // ── Logic giữ nguyên ─────────────────────────────────────────────────
  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
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
      {/* ── Mây trang trí ──────────────────────────────────────────────── */}
      <div className="rs-cloud-1" aria-hidden="true" />
      <div className="rs-cloud-2" aria-hidden="true" />
      <div className="rs-cloud-3" aria-hidden="true" />

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
          <span className="rs-card-title">Tôi là bé!</span>
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

      {/* ── Cỏ footer + Động vật ────────────────────────────────────────── */}
      <div className="rs-grass" aria-hidden="true">
        <div className="rs-critters">
          <div className="rs-critter" data-anim="hop">
            <span className="rs-critter-emoji">🐰</span>
            <span className="rs-critter-label">Thỏ Trắng</span>
          </div>
          <div className="rs-critter" data-anim="nod">
            <span className="rs-critter-emoji">🦆</span>
            <span className="rs-critter-label">Vịt Bầu</span>
          </div>
          <div className="rs-critter" data-anim="sway">
            <span className="rs-critter-emoji">🐻</span>
            <span className="rs-critter-label">Gấu Nâu</span>
          </div>
          <div className="rs-critter" data-anim="wave">
            <span className="rs-critter-emoji">🐱</span>
            <span className="rs-critter-label">Mèo Nhỏ</span>
          </div>
          <div className="rs-critter" data-anim="fly">
            <span className="rs-critter-emoji">🦉</span>
            <span className="rs-critter-label">Cú Mèo</span>
          </div>
          <div className="rs-critter" data-anim="poke">
            <span className="rs-critter-emoji">🦔</span>
            <span className="rs-critter-label">Nhím Nhỏ</span>
          </div>
          <div className="rs-critter" data-anim="leap">
            <span className="rs-critter-emoji">🐸</span>
            <span className="rs-critter-label">Ếch Xanh</span>
          </div>
          <div className="rs-critter" data-anim="spin">
            <span className="rs-critter-emoji">🐼</span>
            <span className="rs-critter-label">Gấu Trúc</span>
          </div>
        </div>
      </div>
    </div>
  );
}
