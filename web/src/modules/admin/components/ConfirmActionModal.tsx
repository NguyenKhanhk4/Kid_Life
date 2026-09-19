import { ReactNode } from 'react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmActionModal({
  isOpen,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmVariant = 'danger',
  onConfirm,
  onCancel
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <h3 className="admin-modal-title">{title}</h3>
        <p className="admin-modal-desc">{description}</p>
        
        <div className="admin-modal-actions">
          <button className="admin-btn admin-btn-outline" onClick={onCancel}>
            {cancelText}
          </button>
          <button 
            className={`admin-btn admin-btn-${confirmVariant}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
