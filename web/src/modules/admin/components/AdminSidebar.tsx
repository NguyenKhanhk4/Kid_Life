import { Link, useLocation } from 'react-router-dom';
import { 
  IoPieChartOutline, 
  IoPeopleOutline, 
  IoChatbubblesOutline, 
  IoSettingsOutline, 
  IoFolderOpenOutline, 
  IoTimeOutline, 
  IoStarOutline
} from 'react-icons/io5';

interface AdminSidebarProps {
  collapsed: boolean;
}

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/admin/overview', label: 'Tổng quan', icon: <IoPieChartOutline /> },
    { path: '/admin/users', label: 'Gia đình', icon: <IoPeopleOutline /> },
    { path: '/admin/community', label: 'Cộng đồng', icon: <IoChatbubblesOutline /> },
    { path: '/admin/master-data', label: 'Danh mục', icon: <IoFolderOpenOutline /> },
    { path: '/admin/subscriptions', label: 'Gói dịch vụ', icon: <IoStarOutline /> },
    { path: '/admin/settings', label: 'Cấu hình', icon: <IoSettingsOutline /> },
    { path: '/admin/logs', label: 'Nhật ký', icon: <IoTimeOutline /> },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-logo">
        <div className="admin-logo-icon">K</div>
        {!collapsed && <span>KidLife</span>}
      </div>
      
      <nav className="admin-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${currentPath.startsWith(item.path) ? 'active' : ''}`}
          >
            <span className="admin-nav-icon">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
