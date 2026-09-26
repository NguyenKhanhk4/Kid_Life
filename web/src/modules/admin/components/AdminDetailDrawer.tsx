import { IoCloseOutline } from 'react-icons/io5';

interface AdminDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function AdminDetailDrawer({ isOpen, onClose, title, children }: AdminDetailDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(30, 34, 51, 0.5)', 
          zIndex: 90, transition: 'opacity 0.3s'
        }}
        onClick={onClose}
      />
      <div 
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, 
          backgroundColor: 'var(--admin-surface)', zIndex: 100, 
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--admin-border)'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button className="admin-icon-btn" onClick={onClose} style={{ fontSize: 24 }}>
            <IoCloseOutline />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {children}
        </div>
      </div>
    </>
  );
}
