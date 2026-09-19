import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface SystemLessonFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export default function SystemLessonFormModal({ isOpen, onClose, initialData, onSubmit }: SystemLessonFormModalProps) {
  const [title, setTitle] = useState('');
  const [skill, setSkill] = useState('');
  const [ageGroup, setAgeGroup] = useState('4-6');
  const [duration, setDuration] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSkill(initialData.skill || '');
      setAgeGroup(initialData.ageGroup || '4-6');
      setDuration(initialData.duration || '');
      setThumbnail(initialData.thumbnail || '');
    } else {
      setTitle(''); setSkill(''); setAgeGroup('4-6'); setDuration(''); setThumbnail('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, skill, ageGroup, duration, thumbnail });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>{initialData ? 'Sửa bài học' : 'Thêm bài học hệ thống'}</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Tiêu đề bài học</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Kỹ năng</label>
              <input required type="text" placeholder="VD: Quản lý cảm xúc" value={skill} onChange={e => setSkill(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Độ tuổi</label>
              <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                <option value="3-4">3-4 tuổi</option>
                <option value="4-6">4-6 tuổi</option>
                <option value="6-8">6-8 tuổi</option>
                <option value="8-12">8-12 tuổi</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Thời lượng (phút)</label>
            <input required type="number" value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Link Thumbnail (URL)</label>
            <input required type="url" value={thumbnail} onChange={e => setThumbnail(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div className="admin-modal-actions" style={{ marginTop: 8 }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>Huỷ</button>
            <button type="submit" className="admin-btn admin-btn-primary">{initialData ? 'Lưu thay đổi' : 'Thêm bài học'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
