import { useState, useEffect, useRef } from 'react';
import { IoPersonAddOutline, IoChevronDownOutline } from 'react-icons/io5';
import { useAuth } from '@/modules/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWalletData, WalletData } from '@/shared/utils/walletStorage';
import '@/modules/auth/auth-kids.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ChildOption {
  _id: string; name: string; avatar: string; level: number; xp: number;
}

interface ChildPickerProps {
  onSelect?: (child: ChildOption) => void;
}

export default function ChildPicker({ onSelect }: ChildPickerProps) {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [selected, setSelected] = useState<ChildOption | null>(null);
  const [open, setOpen]         = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fetch children from API, show empty state if none
  useEffect(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/children`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.length > 0) {
          setChildren(json.data);
          setSelected(json.data[0]);
        }
      })
      .catch(() => {});
  }, [token]);

  // Lắng nghe thay đổi ví điểm realtime để cập nhật XP
  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const custom = e as CustomEvent<WalletData>;
      const newBalance = custom.detail ? custom.detail.balance : getWalletData().balance;
      setChildren(prev => prev.map(c => ({ ...c, xp: newBalance })));
      setSelected(prev => (prev ? { ...prev, xp: newBalance } : null));
    };

    window.addEventListener('kidlife_wallet_update', handleWalletUpdate);
    window.addEventListener('storage', () => {
      const currentXP = getWalletData().balance;
      setChildren(prev => prev.map(c => ({ ...c, xp: currentXP })));
      setSelected(prev => (prev ? { ...prev, xp: currentXP } : null));
    });

    return () => {
      window.removeEventListener('kidlife_wallet_update', handleWalletUpdate);
    };
  }, []);

  // Close on outside click (GIỮ NGUYÊN LOGIC)
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
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
        className="kpicker-trigger"
        onClick={() => navigate('/parent/account')}
        aria-label="Thêm tài khoản bé"
      >
        <IoPersonAddOutline size={16} color="#6031EB" />
        <span className="kpicker-name">Thêm bé</span>
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        id="child-picker-trigger"
        className="kpicker-trigger"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Đang xem bé: ${selected?.name ?? 'Chọn bé'}`}
      >
        <span className="kpicker-avatar" aria-hidden="true" style={{ width: 36, height: 36, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '50%' }}>
          {selected?.avatar?.startsWith('/') ? <img src={selected.avatar} alt="avatar" style={{ width: '85%', height: '85%', objectFit: 'contain' }} /> : (selected?.avatar ?? '🧒')}
        </span>
        <span className="kpicker-name">{selected?.name ?? 'Chọn bé'}</span>
        <IoChevronDownOutline
          size={14}
          className={`kpicker-chevron${open ? ' open' : ''}`}
        />
      </button>

      {open && (
        <div
          id="child-picker-dropdown"
          className="kpicker-dropdown"
          role="listbox"
          aria-label="Danh sách tài khoản bé"
        >
          <div className="kpicker-header">Chọn tài khoản bé</div>

          {children.map(child => (
            <button
              key={child._id}
              id={`child-picker-option-${child._id}`}
              className={`kpicker-option${selected?._id === child._id ? ' active' : ''}`}
              onClick={() => handleSelect(child)}
              role="option"
              aria-selected={selected?._id === child._id}
            >
              <span className="kpicker-opt-avatar" aria-hidden="true" style={{ width: 44, height: 44, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '50%' }}>
                {child.avatar?.startsWith('/') ? <img src={child.avatar} alt="avatar" style={{ width: '85%', height: '85%', objectFit: 'contain' }} /> : child.avatar}
              </span>
              <span>
                <span className="kpicker-opt-name">{child.name}</span>
                <span className="kpicker-opt-meta">Cấp {child.level} · {child.xp.toLocaleString('vi-VN')} XP</span>
              </span>
              {selected?._id === child._id && (
                <span className="kpicker-opt-check" aria-hidden="true">✓</span>
              )}
            </button>
          ))}

          <button
            className="kpicker-add"
            onClick={() => { setOpen(false); navigate('/parent/account'); }}
            aria-label="Thêm tài khoản bé mới"
          >
            <IoPersonAddOutline size={15} aria-hidden="true" /> Thêm bé mới
          </button>
        </div>
      )}
    </div>
  );
}
