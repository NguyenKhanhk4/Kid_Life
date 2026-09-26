import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

/** Khớp enum category ở backend (backend/src/modules/pet/accessories) */
export const ACCESSORY_CATEGORY_LABEL: Record<string, string> = {
  hat: 'Mũ',
  crown: 'Vương miện',
  halo: 'Hào quang',
  bow: 'Nơ',
  glasses: 'Kính',
  mask: 'Mặt nạ',
  necklace: 'Vòng cổ',
  wings: 'Cánh',
};

/** Ảnh phụ kiện đặt ở web/public/assets/pets/accessories/<category>/ (xem README.md trong thư mục đó) */
const IMAGE_DIR = '/assets/pets/accessories';
const folderOf = (category: string) => `${IMAGE_DIR}/${category}/`;

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
  const [icon, setIcon] = useState(folderOf('hat'));
  const [previewBroken, setPreviewBroken] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'hat');
      setPriceXP(initialData.priceXP ?? 100);
      setIcon(initialData.icon || folderOf(initialData.category || 'hat'));
    } else {
      setName(''); setCategory('hat'); setPriceXP(100); setIcon(folderOf('hat'));
    }
  }, [initialData, isOpen]);

  useEffect(() => setPreviewBroken(false), [icon]);

  if (!isOpen) return null;

  const changeCategory = (next: string) => {
    // đường dẫn đang là thư mục mặc định của loại cũ → đổi theo loại mới
    if (icon.startsWith(folderOf(category))) setIcon(folderOf(next) + icon.slice(folderOf(category).length));
    setCategory(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, category, priceXP, icon: icon.trim() });
  };

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' };
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 480 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>{initialData ? 'Sửa phụ kiện' : 'Thêm phụ kiện mới'}</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Tên phụ kiện</label>
            <input required type="text" maxLength={60} value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Danh mục</label>
              <select value={category} onChange={e => changeCategory(e.target.value)} style={inputStyle}>
                {Object.entries(ACCESSORY_CATEGORY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Giá (XP)</label>
              <input required type="number" min={0} value={priceXP} onChange={e => setPriceXP(Number(e.target.value))} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Đường dẫn ảnh (PNG nền trong suốt)</label>
            <input
              required
              type="text"
              value={icon}
              onChange={e => setIcon(e.target.value)}
              placeholder={`${folderOf(category)}ten-anh.png`}
              pattern="^(/assets/|https?://)\S+\.(png|webp|jpe?g|gif|svg)$"
              title="Vd. /assets/pets/accessories/hat/cap.png"
              style={inputStyle}
            />
            <div style={{ fontSize: 12, color: 'var(--admin-muted)', marginTop: 4 }}>
              Bỏ file ảnh vào <code>web/public{folderOf(category)}</code> rồi nhập đường dẫn ở trên.
            </div>
            <div style={{
              marginTop: 10, width: 96, height: 96, borderRadius: 12, border: '1px dashed var(--admin-border)',
              display: 'grid', placeItems: 'center', background: 'var(--admin-bg)', fontSize: 11,
              color: 'var(--admin-muted)', textAlign: 'center', padding: 4,
            }}>
              {previewBroken || !/\.(png|webp|jpe?g|gif|svg)$/i.test(icon)
                ? 'Chưa thấy ảnh'
                : <img src={icon} alt="" onError={() => setPreviewBroken(true)} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />}
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
