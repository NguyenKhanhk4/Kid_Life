import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const handleSelectRole = (role: 'parent' | 'child') => {
    navigate(role === 'parent' ? '/parent/home' : '/child/home');
  };

  return (
    <div className="role-screen">
      {/* Greeting */}
      {user && (
        <p style={{ textAlign: 'center', color: '#98A3C7', fontSize: 13, marginBottom: 4 }}>
          Xin chào, <strong style={{ color: 'var(--kl-primary)' }}>{user.fullName || user.email}</strong>!
        </p>
      )}

      <h1 className="role-heading">Bạn là ai?</h1>
      <p className="role-subtitle">Bạn là phụ huynh hay trẻ em?</p>

      <div className="role-cards">
        <button
          id="role-parent-btn"
          className="role-card"
          style={{ background: '#8197FF' }}
          onClick={() => handleSelectRole('parent')}
        >
          <span className="role-emoji">👨‍👩‍👧</span>
          <span className="role-card-title" style={{ color: '#fff' }}>Phụ huynh</span>
          <span className="role-card-sub" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Quản lý, theo dõi tiến độ học tập của con
          </span>
        </button>

        <button
          id="role-child-btn"
          className="role-card"
          style={{ background: '#D9F58C' }}
          onClick={() => handleSelectRole('child')}
        >
          <span className="role-emoji">🧒</span>
          <span className="role-card-title">Trẻ em</span>
          <span className="role-card-sub">
            Vào học, chăm pet và nhận thưởng mỗi ngày
          </span>
        </button>
      </div>

      <p className="role-footer">Bạn có thể chuyển tài khoản bất kỳ lúc nào.</p>

      {/* Logout */}
      <button
        id="role-logout-btn"
        onClick={logout}
        style={{
          marginTop: 16,
          background: 'none',
          border: 'none',
          color: '#98A3C7',
          fontSize: 12,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}
