import { IoSearchOutline, IoNotificationsOutline } from 'react-icons/io5';

interface AdminTopBarProps {
  title: string;
  onLogout: () => void;
}

export default function AdminTopBar({ title, onLogout }: AdminTopBarProps) {
  return (
    <header className="admin-topbar">
      <h1 className="admin-page-title">{title}</h1>
      
      <div className="admin-topbar-actions">
        <div className="admin-search">
          <IoSearchOutline className="admin-search-icon" />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        
        <button className="admin-icon-btn">
          <IoNotificationsOutline />
        </button>

        <button className="admin-btn admin-btn-outline" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
