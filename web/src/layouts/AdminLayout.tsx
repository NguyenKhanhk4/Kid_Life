import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Bell, LogOut, Shield } from 'lucide-react';
import NotificationDropdown from '../components/NotificationDropdown';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Shield size={28} />
          <span>KidLife Admin</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} />
            <span>Quản lý Người dùng</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            <span>Thông báo</span>
          </NavLink>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={handleLogout}>
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h2 className="title-md">Tổng quan</h2>
          </div>
          <div className="header-right">
            <NotificationDropdown />
            <div className="user-profile-btn">
              <div className="avatar">
                {user?.fullName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{user?.fullName}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
