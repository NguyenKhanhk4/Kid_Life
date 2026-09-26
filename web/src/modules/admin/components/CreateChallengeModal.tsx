import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; durationDays: number; startDate: string; endDate: string }) => void;
}

export default function CreateChallengeModal({ isOpen, onClose, onSubmit }: CreateChallengeModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState(7);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(endDate) <= new Date(startDate)) {
      setError('Ngày kết thúc phải sau ngày bắt đầu');
      return;
    }
    setError('');
    onSubmit({ title, description, durationDays, startDate, endDate });
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>Tạo thử thách mới</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div style={{ color: 'var(--admin-danger)', fontSize: 13, background: 'rgba(213,71,63,0.1)', padding: 8, borderRadius: 4 }}>{error}</div>}
          
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Tiêu đề thử thách</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Mô tả</label>
            <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)', fontFamily: 'inherit' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Ngày bắt đầu</label>
              <input required type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Ngày kết thúc</label>
              <input required type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
            </div>
          </div>

          <div className="admin-modal-actions" style={{ marginTop: 8 }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>Huỷ</button>
            <button type="submit" className="admin-btn admin-btn-primary">Tạo thử thách</button>
          </div>
        </form>
      </div>
    </div>
  );
}
