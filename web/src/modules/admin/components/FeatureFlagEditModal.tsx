import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface FeatureFlagEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureKey: string;
  initialData?: any;
  onSubmit: (key: string, data: { requiredPlan: string; freeLimitValue: number | null; description: string }) => void;
}

export default function FeatureFlagEditModal({ isOpen, onClose, featureKey, initialData, onSubmit }: FeatureFlagEditModalProps) {
  const [requiredPlan, setRequiredPlan] = useState('free');
  const [hasFreeLimit, setHasFreeLimit] = useState(false);
  const [freeLimitValue, setFreeLimitValue] = useState(5);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setRequiredPlan(initialData.requiredPlan || 'free');
      setHasFreeLimit(initialData.freeLimitValue !== null && initialData.freeLimitValue !== undefined);
      setFreeLimitValue(initialData.freeLimitValue || 5);
      setDescription(initialData.description || '');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(featureKey, { 
      requiredPlan, 
      freeLimitValue: hasFreeLimit ? freeLimitValue : null, 
      description 
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal" style={{ width: 450 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 className="admin-modal-title" style={{ margin: 0 }}>Cấu hình tính năng</h3>
          <button className="admin-icon-btn" onClick={onClose}><IoCloseOutline /></button>
        </div>
        
        <div style={{ marginBottom: 16, padding: 12, background: 'var(--admin-bg)', borderRadius: 8, fontFamily: 'monospace', fontWeight: 600 }}>
          {featureKey}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Yêu cầu gói tối thiểu</label>
            <select value={requiredPlan} onChange={e => setRequiredPlan(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={hasFreeLimit} onChange={e => setHasFreeLimit(e.target.checked)} />
              Áp dụng giới hạn cho gói Free
            </label>
            {hasFreeLimit && (
              <input type="number" min={0} value={freeLimitValue} onChange={e => setFreeLimitValue(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} />
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--admin-muted)', marginBottom: 4 }}>Mô tả</label>
            <textarea required rows={2} value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)', fontFamily: 'inherit' }} />
          </div>

          <div className="admin-modal-actions" style={{ marginTop: 8 }}>
            <button type="button" className="admin-btn admin-btn-outline" onClick={onClose}>Huỷ</button>
            <button type="submit" className="admin-btn admin-btn-primary">Lưu cấu hình</button>
          </div>
        </form>
      </div>
    </div>
  );
}
