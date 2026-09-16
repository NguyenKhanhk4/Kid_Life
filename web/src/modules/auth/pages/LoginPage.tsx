import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoPersonOutline, IoEyeOutline } from 'react-icons/io5';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/role');
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--kl-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 20, fontWeight: 900 }}>K</div>
            <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--kl-primary)' }}>Kid<span style={{ color: 'var(--kl-text)' }}>Life</span></span>
          </div>
          <h1 className="login-title">Đăng nhập</h1>
          <p className="login-subtitle">Nhập thông tin tài khoản của bạn</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="kl-input-wrap">
            <label className="kl-input-label">Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <IoPersonOutline size={18} color="#2B44E8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="kl-input"
                style={{ paddingLeft: 40 }}
                type="text"
                placeholder="Tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="kl-input-wrap">
            <label className="kl-input-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <IoEyeOutline size={18} color="#2B44E8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                className="kl-input"
                style={{ paddingLeft: 40 }}
                type="password"
                placeholder="Mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="login-options">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#98A3C7', cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: '#2B44E8' }} />
              Ghi nhớ đăng nhập
            </label>
            <span className="login-link">Quên mật khẩu?</span>
          </div>

          <button type="submit" className="kl-btn kl-btn-primary kl-btn-block" style={{ marginTop: 20 }}>
            Đăng nhập
          </button>
        </form>

        <div className="login-divider"><span>hoặc</span></div>

        <div className="login-social-row">
          <button className="login-social">
            <span style={{ color: '#EA4335', fontSize: 17, fontWeight: 900 }}>G</span>
            <span style={{ color: '#536088', fontSize: 11, fontWeight: 700 }}>Google</span>
          </button>
          <button className="login-social">
            <span style={{ color: '#1877F2', fontSize: 19, fontWeight: 900 }}>f</span>
            <span style={{ color: '#536088', fontSize: 11, fontWeight: 700 }}>Facebook</span>
          </button>
        </div>

        <div className="login-register">
          <span>Bạn chưa có tài khoản?</span>
          <span className="login-link">Đăng ký ngay!</span>
        </div>
      </div>
    </div>
  );
}
