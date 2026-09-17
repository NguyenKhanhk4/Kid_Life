import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoPersonOutline, IoCallOutline } from 'react-icons/io5';
import { useAuth } from '../AuthContext';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userData;
      if (mode === 'login') {
        userData = await login(email, password);
      } else {
        userData = await register({ email, password, fullName, phone: phone || undefined });
      }
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/role');
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--kl-primary)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 20, fontWeight: 900 }}>K</div>
            <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--kl-primary)' }}>
              Kid<span style={{ color: 'var(--kl-text)' }}>Life</span>
            </span>
          </div>
          <h1 className="login-title">
            {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </h1>
          <p className="login-subtitle">
            {mode === 'login' ? 'Nhập thông tin tài khoản của bạn' : 'Điền đầy đủ thông tin để bắt đầu'}
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div style={{
            background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: 13, fontWeight: 500
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* fullName — chỉ hiện khi register */}
          {mode === 'register' && (
            <div className="kl-input-wrap">
              <label className="kl-input-label">Họ và tên</label>
              <div style={{ position: 'relative' }}>
                <IoPersonOutline size={18} color="#2B44E8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="auth-fullname"
                  className="kl-input"
                  style={{ paddingLeft: 40 }}
                  type="text"
                  placeholder="Nguyễn Văn A..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="kl-input-wrap">
            <label className="kl-input-label">Email</label>
            <div style={{ position: 'relative' }}>
              <IoMailOutline size={18} color="#2B44E8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="auth-email"
                className="kl-input"
                style={{ paddingLeft: 40 }}
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone — chỉ hiện khi register */}
          {mode === 'register' && (
            <div className="kl-input-wrap">
              <label className="kl-input-label">Số điện thoại <span style={{ color: '#98A3C7', fontWeight: 400 }}>(tuỳ chọn)</span></label>
              <div style={{ position: 'relative' }}>
                <IoCallOutline size={18} color="#2B44E8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  id="auth-phone"
                  className="kl-input"
                  style={{ paddingLeft: 40 }}
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div className="kl-input-wrap">
            <label className="kl-input-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <IoLockClosedOutline size={18} color="#2B44E8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="auth-password"
                className="kl-input"
                style={{ paddingLeft: 40, paddingRight: 42 }}
                type={showPass ? 'text' : 'password'}
                placeholder="Tối thiểu 6 ký tự..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {showPass
                  ? <IoEyeOffOutline size={18} color="#98A3C7" />
                  : <IoEyeOutline size={18} color="#98A3C7" />}
              </button>
            </div>
          </div>

          {mode === 'login' && (
            <div className="login-options">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#98A3C7', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: '#2B44E8' }} />
                Ghi nhớ đăng nhập
              </label>
              <span className="login-link">Quên mật khẩu?</span>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            className="kl-btn kl-btn-primary kl-btn-block"
            style={{ marginTop: 20, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading
              ? (mode === 'login' ? 'Đang đăng nhập...' : 'Đang tạo tài khoản...')
              : (mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản')}
          </button>
        </form>

        {mode === 'login' && (
          <>
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
          </>
        )}

        <div className="login-register">
          {mode === 'login' ? (
            <>
              <span>Bạn chưa có tài khoản?</span>
              <span className="login-link" style={{ cursor: 'pointer' }} onClick={() => { setMode('register'); setError(''); }}>
                Đăng ký ngay!
              </span>
            </>
          ) : (
            <>
              <span>Đã có tài khoản?</span>
              <span className="login-link" style={{ cursor: 'pointer' }} onClick={() => { setMode('login'); setError(''); }}>
                Đăng nhập
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
