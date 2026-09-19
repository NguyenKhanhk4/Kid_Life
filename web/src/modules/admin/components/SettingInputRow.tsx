import { useState, useEffect } from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';

interface SettingInputRowProps {
  label: string;
  value: string | number;
  type?: 'text' | 'number';
  updatedBy?: string;
  updatedAt?: string;
  onSave: (val: any) => Promise<void>;
}

export default function SettingInputRow({ label, value, type = 'number', updatedBy, updatedAt, onSave }: SettingInputRowProps) {
  const [currentVal, setCurrentVal] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCurrentVal(value);
    setHasChanges(false);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = type === 'number' ? Number(e.target.value) : e.target.value;
    setCurrentVal(newVal);
    setHasChanges(newVal !== value);
  };

  const handleSave = async () => {
    if (type === 'number' && Number(currentVal) < 0) {
      alert('Giá trị không được nhỏ hơn 0');
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(currentVal);
      setHasChanges(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ padding: '24px', borderBottom: '1px solid var(--admin-border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ width: 250, fontWeight: 600, marginTop: 8 }}>{label}</div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <input 
              type={type} 
              value={currentVal} 
              onChange={handleChange}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }}
            />
            <button 
              className="admin-btn admin-btn-primary" 
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              style={{ width: 80, opacity: (!hasChanges || isSaving) ? 0.5 : 1 }}
            >
              {isSaving ? 'Đang lưu' : 'Lưu'}
            </button>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--admin-muted)' }}>
              {updatedBy ? `Cập nhật lần cuối bởi ${updatedBy} — ${new Date(updatedAt || '').toLocaleString('vi-VN')}` : 'Chưa có thông tin cập nhật'}
            </div>
            
            {showSuccess && (
              <div style={{ color: 'var(--admin-success)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <IoCheckmarkCircleOutline /> Đã cập nhật
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
