import { useNavigate } from 'react-router-dom';

export default function RoleSelectionPage() {
  const navigate = useNavigate();

  const handleSelectRole = (role: 'parent' | 'child') => {
    navigate(role === 'parent' ? '/parent/home' : '/child/home');
  };

  return (
    <div className="role-screen">
      <h1 className="role-heading">Bạn là ai?</h1>
      <p className="role-subtitle">Bạn là phụ huynh hay trẻ em?</p>

      <div className="role-cards">
        <button
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
    </div>
  );
}
