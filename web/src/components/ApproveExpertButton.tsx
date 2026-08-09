import { Check, X } from 'lucide-react';

interface ApproveExpertButtonProps {
  onAction: (action: 'APPROVE' | 'REJECT') => void;
}

export default function ApproveExpertButton({ onAction }: ApproveExpertButtonProps) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button 
        className="btn btn-success" 
        style={{ padding: '6px' }}
        title="Duyệt"
        onClick={() => {
          if (window.confirm('Chấp thuận tài khoản chuyên gia này?')) onAction('APPROVE');
        }}
      >
        <Check size={16} />
      </button>
      <button 
        className="btn btn-danger" 
        style={{ padding: '6px' }}
        title="Từ chối"
        onClick={() => {
          if (window.confirm('Từ chối tài khoản chuyên gia này? Hành động này sẽ xóa tài khoản.')) onAction('REJECT');
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
