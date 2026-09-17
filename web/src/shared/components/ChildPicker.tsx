// ChildPicker — component chọn nhanh tài khoản bé, dùng trên ParentLayout header
// Export: default ChildPicker
import { useState, useEffect, useRef } from 'react';
import { IoChevronDownOutline, IoPersonAddOutline } from 'react-icons/io5';
import { useAuth } from '@/modules/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ChildOption {
  _id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
}

interface ChildPickerProps {
  /** Callback khi chọn bé, truyền childId */
  onSelect?: (child: ChildOption) => void;
}

export default function ChildPicker({ onSelect }: ChildPickerProps) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [selected, setSelected] = useState<ChildOption | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch children list
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/children`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.length > 0) {
          setChildren(json.data);
          setSelected(json.data[0]); // mặc định chọn bé đầu tiên
        }
      })
      .catch(() => {});
  }, [token]);

  // Close dropdown khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (child: ChildOption) => {
    setSelected(child);
    setOpen(false);
    onSelect?.(child);
  };

  if (children.length === 0) {
    return (
      <button
        id="child-picker-add-btn"
        onClick={() => navigate('/parent/account')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 20,
          background: 'var(--kl-primary-soft)', border: 'none',
          color: 'var(--kl-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
        }}
      >
        <IoPersonAddOutline size={14} /> Thêm bé
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        id="child-picker-trigger"
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 20,
          background: 'var(--kl-primary-soft)', border: 'none',
          cursor: 'pointer', transition: 'background 0.2s',
        }}
      >
        <span style={{ fontSize: 20 }}>{selected?.avatar ?? '🧒'}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary)' }}>
          {selected?.name ?? 'Chọn bé'}
        </span>
        <IoChevronDownOutline
          size={14}
          color="var(--kl-primary)"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id="child-picker-dropdown"
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid var(--kl-border)', minWidth: 220, zIndex: 500, overflow: 'hidden',
          }}
        >
          <div style={{ padding: '8px 12px 4px', fontSize: 10, fontWeight: 800, color: 'var(--kl-muted)', letterSpacing: 1 }}>
            CHỌN TÀI KHOẢN BÉ
          </div>
          {children.map((child) => (
            <button
              key={child._id}
              id={`child-picker-option-${child._id}`}
              onClick={() => handleSelect(child)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 14px', background: selected?._id === child._id ? 'var(--kl-primary-soft)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: 24 }}>{child.avatar}</span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-text)' }}>{child.name}</div>
                <div style={{ fontSize: 11, color: 'var(--kl-muted)' }}>
                  Cấp {child.level} • {child.xp.toLocaleString()} XP
                </div>
              </div>
              {selected?._id === child._id && (
                <span style={{ fontSize: 16, color: 'var(--kl-primary)' }}>✓</span>
              )}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--kl-border)', padding: '6px 8px' }}>
            <button
              onClick={() => { setOpen(false); navigate('/parent/account'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                padding: '8px 10px', borderRadius: 10, background: 'none',
                border: 'none', color: 'var(--kl-primary)', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              <IoPersonAddOutline size={14} /> Thêm bé mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
