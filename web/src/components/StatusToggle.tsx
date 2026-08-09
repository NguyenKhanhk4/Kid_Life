import { Lock, Unlock } from 'lucide-react';

interface StatusToggleProps {
  isActive: boolean;
  isPending: boolean;
  onChange: (active: boolean) => void;
}

export default function StatusToggle({ isActive, isPending, onChange }: StatusToggleProps) {
  if (isPending) return null; // Cannot toggle lock/unlock if pending approval

  return (
    <button 
      className={`btn ${isActive ? 'btn-danger' : 'btn-success'}`}
      style={{ padding: '6px 12px', fontSize: 12 }}
      onClick={() => {
        if (window.confirm(`Bạn có chắc muốn ${isActive ? 'khóa' : 'mở khóa'} tài khoản này?`)) {
          onChange(!isActive);
        }
      }}
    >
      {isActive ? <><Lock size={14} /> Khóa</> : <><Unlock size={14} /> Mở khóa</>}
    </button>
  );
}
