import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

/** Khớp enum category ở backend (backend/src/modules/pet/accessories) */
export const ACCESSORY_CATEGORY_LABEL: Record<string, string> = {
  hat: 'Mũ',
  glasses: 'Kính',
  crown: 'Vương miện',
  cape: 'Khăn / nơ',
};

const ICON_CHOICES = ['🎩', '🧢', '🎓', '👒', '🕶️', '👓', '👑', '🌸', '🧣', '🎀'];

interface PetAccessoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export default function PetAccessoryFormModal({ isOpen, onClose, initialData, onSubmit }: PetAccessoryFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('hat');
  const [priceXP, setPriceXP] = useState(100);
  const [icon, setIcon] = useState('🎩'); // emoji hoặc URL ảnh

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'hat');
      setPriceXP(initialData.priceXP ?? 100);
      setIcon(initialData.icon || '🎩');
    } else {
      setName(''); setCategory('hat'); setPriceXP(100); setIcon('🎩');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, category, priceXP, icon });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 450 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>{initialData ? 'Sửa phụ kiện' : 'Thêm phụ kiện mới'}</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Tên phụ kiện</label>
            <input required type="text" maxLength={60} value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Danh mục</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
                {Object.entries(ACCESSORY_CATEGORY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Giá (XP)</label>
              <input required type="number" min={0} value={priceXP} onChange={e => setPriceXP(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Icon</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ICON_CHOICES.map(i => (
                <div
                  key={i}
                  onClick={() => setIcon(i)}
                  style={{
                    fontSize: 24, padding: 8, cursor: 'pointer', borderRadius: 8,
                    border: icon === i ? '2px solid var(--admin-primary)' : '1px solid var(--admin-border)',
                    background: icon === i ? 'var(--admin-bg)' : 'transparent'
                  }}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>

          <div className="admin-modal-actions" style={{ marginTop: 8 }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>Huỷ</button>
            <button type="submit" className="admin-btn admin-btn-primary">{initialData ? 'Lưu thay đổi' : 'Thêm phụ kiện'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
