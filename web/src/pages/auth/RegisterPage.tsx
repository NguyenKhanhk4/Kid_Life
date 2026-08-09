import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerExpert } from '../../api/authApi';
import { Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return setError('Mật khẩu xác nhận không khớp');
    }
    
    try {
      setLoading(true);
      setError('');
      await registerExpert({ fullName: form.fullName, email: form.email, password: form.password });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-layout">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--green-soft)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Briefcase size={32} />
          </div>
          <h1>Đăng ký thành công!</h1>
          <p className="text-muted" style={{ margin: '16px 0 24px' }}>
            Tài khoản chuyên gia của bạn đã được ghi nhận. Vui lòng chờ Quản trị viên duyệt hồ sơ trước khi có thể đăng nhập.
          </p>
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>Quay lại đăng nhập</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div className="auth-header" style={{ marginBottom: 24 }}>
          <Briefcase size={40} color="var(--primary)" style={{ marginBottom: 12 }} />
          <h1>Đăng ký Chuyên gia</h1>
          <p className="text-muted">Tham gia mạng lưới chuyên gia KidLife</p>
        </div>

        {error && (
          <div style={{ padding: 12, background: 'var(--red-soft)', color: 'var(--red)', borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="label">Họ và tên</label>
            <input required type="text" className="input-field" placeholder="VD: Nguyễn Văn A" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input-field" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="label">Mật khẩu</label>
            <input required type="password" className="input-field" placeholder="Ít nhất 8 ký tự" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <div>
            <label className="label">Xác nhận mật khẩu</label>
            <input required type="password" className="input-field" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: 44, marginTop: 10, fontSize: 15 }} disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Gửi yêu cầu xét duyệt'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
          <span className="text-muted">Đã có tài khoản? </span>
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
