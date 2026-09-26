import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface CuratedStoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export default function CuratedStoryFormModal({ isOpen, onClose, initialData, onSubmit }: CuratedStoryFormModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('cổ tích');
  const [moralLesson, setMoralLesson] = useState('');
  const [duration, setDuration] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategory(initialData.category || 'cổ tích');
      setMoralLesson(initialData.moralLesson || '');
      setDuration(initialData.duration || '');
      setContent(initialData.content || '');
    } else {
      setTitle(''); setCategory('cổ tích'); setMoralLesson(''); setDuration(''); setContent('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, category, moralLesson, duration, content });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 600 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>{initialData ? 'Sửa truyện' : 'Thêm truyện mới'}</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Tiêu đề</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Thể loại</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                <option value="cổ tích">Cổ tích</option>
                <option value="ngụ ngôn">Ngụ ngôn</option>
                <option value="khoa học">Khoa học</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Thời lượng (phút)</label>
              <input required type="number" value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Bài học đạo đức</label>
            <input required type="text" value={moralLesson} onChange={e => setMoralLesson(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Nội dung</label>
            <textarea required rows={6} value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)', fontFamily: 'inherit' }} />
          </div>

          <div className="admin-modal-actions" style={{ marginTop: 8 }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>Huỷ</button>
            <button type="submit" className="admin-btn admin-btn-primary">{initialData ? 'Lưu thay đổi' : 'Thêm truyện'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
