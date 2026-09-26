import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoMailOutline, IoLockClosedOutline,
  IoEyeOutline, IoEyeOffOutline,
  IoPersonOutline, IoCallOutline,
} from 'react-icons/io5';
import { useAuth } from '../AuthContext';
import '../auth-premium.css';
import PinEntryModal from '../components/PinEntryModal';
import { setActiveChildId } from '@/shared/utils/activeChild';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../../config/firebase';

type Mode = 'login' | 'register';

interface ChildOption {
  _id: string;
  name: string;
  avatar?: string;
  emoji?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useAuth();

  const [mode, setMode]           = useState<Mode>('login');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [fullName, setFullName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const [selectedChild, setSelectedChild] = useState<ChildOption | null>(null);

  const [childrenList, setChildrenList] = useState<ChildOption[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kl_device_children');
      if (saved) {
        setChildrenList(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse children from localStorage', e);
    }
  }, []);

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
      setTimeout(() => {
        if (userData.role === 'admin') navigate('/admin');
        else navigate('/role');
      }, 500);
    } catch (err: any) {
      let errorMsg = err.message || 'Đã có lỗi xảy ra';
      if (errorMsg.includes('auth/configuration-not-found')) errorMsg = 'Dự án chưa bật tính năng đăng nhập Email/Mật khẩu trên Firebase.';
      else if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/wrong-password')) errorMsg = 'Email hoặc mật khẩu không chính xác.';
      console.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const userData = await loginWithGoogle(idToken);
      
      setTimeout(() => {
        if (userData.role === 'admin') navigate('/admin');
        else navigate('/role');
      }, 500);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        // Ignore if user manually closes popup
        setError('');
      } else {
        let errorMsg = err.message || 'Đăng nhập Google thất bại';
        if (errorMsg.includes('auth/configuration-not-found')) errorMsg = 'Dự án chưa bật tính năng đăng nhập Google trên Firebase.';
        console.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChildSuccess = () => {
    if (selectedChild) setActiveChildId(selectedChild._id);
    setTimeout(() => {
      navigate('/child/home');
    }, 2000);
  };

  return (
    <div className="premium-screen">
      {/* Nền 3D toàn màn hình */}
      <div className="premium-bg"></div>

      {/* Cột Trái - Dành cho bé */}
      <div className="premium-left">
        <div className="mascot-container">
          <div className="mascot-glow">
            <img src="/assets/dragon.jpg" alt="Dragon Mascot" className="mascot-img" />
          </div>
          <div className="glass-bubble">
            {mode === 'login' ? 'Chào mừng trở lại! 👋' : 'Cùng tham gia nhé! ✨'}
          </div>
        </div>

        <div className="children-section">
          <h2 className="children-title">👋 Bé nào đang online hôm nay?</h2>
          <div className="children-list">
            {childrenList.map((child, index) => {
              const isActive = selectedChild?._id === child._id;
              return (
                <div 
                  key={child._id} 
                  className={`glass-card child-card ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedChild(child)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="child-emoji" style={{ width: 72, height: 72, borderRadius: 24, overflow: 'hidden', display: 'grid', placeItems: 'center', background: '#fff', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)' }}>
                    {child.avatar?.startsWith('/') ? (
                      <img src={child.avatar} alt="avatar" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                    ) : (
                      child.avatar || child.emoji || '🧒'
                    )}
                  </div>
                  <span className="child-name">{child.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cột Phải - Form Phụ Huynh */}
      <div className="premium-right">
        <div className="glass-panel">
          <div className="brand-logo">
            <div className="brand-icon">K</div>
            <span className="brand-text">KidLife</span>
          </div>

          <h1 className="form-title">
            {mode === 'login' ? 'Đăng Nhập Phụ Huynh' : 'Tạo Tài Khoản Mới'}
          </h1>
          <p className="form-subtitle">
            {mode === 'login'
              ? 'Quản lý lộ trình học tập và thói quen của bé'
              : 'Bắt đầu hành trình giáo dục tuyệt vời cùng KidLife'}
          </p>



          <form onSubmit={handleSubmit} noValidate className="premium-form">
            {mode === 'register' && (
              <div className="input-group">
                <label>Họ và tên</label>
                <div className="input-wrapper">
                  <IoPersonOutline className="input-icon" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <IoMailOutline className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="input-group">
                <label>Số điện thoại <span>(tùy chọn)</span></label>
                <div className="input-wrapper">
                  <IoCallOutline className="input-icon" />
                  <input
                    type="tel"
                    placeholder="09xx xxx xxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <IoLockClosedOutline className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" /> Ghi nhớ
                </label>
                <a href="#" className="forgot-pass">Quên mật khẩu?</a>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? 'Đang xử lý...'
                : mode === 'login'
                ? 'Đăng Nhập'
                : 'Đăng Ký'}
            </button>
          </form>

          {mode === 'login' && (
            <>
              <div className="divider">
                <span>Hoặc tiếp tục với</span>
              </div>
              <div className="social-login">
                <button type="button" className="btn-social google" onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%' }}>
                  <span className="social-icon google-icon">G</span> Google
                </button>
              </div>
            </>
          )}

          <div className="auth-switch">
            {mode === 'login' ? (
              <p>
                Chưa có tài khoản?{' '}
                <span onClick={() => { setMode('register'); setError(''); }}>
                  Đăng ký ngay
                </span>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{' '}
                <span onClick={() => { setMode('login'); setError(''); }}>
                  Đăng nhập
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedChild && (
        <PinEntryModal 
          childId={selectedChild._id}
          childName={selectedChild.name}
          avatarSpecies={selectedChild.emoji}
          onClose={() => setSelectedChild(null)}
          onSuccess={handleChildSuccess}
        />
      )}
    </div>
  );
}
