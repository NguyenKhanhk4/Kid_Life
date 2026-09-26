import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  onSubmit: (data: { plan: string; durationDays: number | null; reason: string }) => void;
}

export default function ChangePlanModal({ isOpen, onClose, user, onSubmit }: ChangePlanModalProps) {
  const [plan, setPlan] = useState('free');
  const [duration, setDuration] = useState('30');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (user) {
      setPlan(user.plan || 'free');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationDays = duration === 'forever' ? null : Number(duration);
    onSubmit({ plan, durationDays, reason });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 400 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>Đổi gói dịch vụ</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>
        
        {user && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--admin-bg)', borderRadius: 8 }}>
            <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>Đang đổi gói cho:</div>
            <div style={{ fontWeight: 700 }}>{user.fullName || user.user?.fullName}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Gói</label>
            <select value={plan} onChange={e => setPlan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Thời hạn</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
              <option value="7">7 ngày</option>
              <option value="30">30 ngày</option>
              <option value="365">1 năm</option>
              <option value="forever">Vĩnh viễn</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Ghi chú / Lý do (tuỳ chọn)</label>
            <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="VD: Tặng thưởng sự kiện..." style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div className="admin-modal-actions" style={{ marginTop: 8 }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>Huỷ</button>
            <button type="submit" className="admin-btn admin-btn-primary">Đổi gói</button>
          </div>
        </form>
      </div>
    </div>
  );
}
