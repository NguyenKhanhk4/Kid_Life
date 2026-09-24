import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import '../admin-theme.css';

import AdminSidebar from '../components/AdminSidebar';
import AdminTopBar from '../components/AdminTopBar';

export default function AdminLayout() {
  const { logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'Gia đình & Người dùng';
    if (path.includes('/community')) return 'Cộng đồng';
    if (path.includes('/master-data')) return 'Danh mục Hệ thống';
    if (path.includes('/quiz-bank')) return 'Ngân Hàng Câu Hỏi & Quiz';
    if (path.includes('/video-bank')) return 'Ngân Hàng Bài Học Video';
    if (path.includes('/subscriptions')) return 'Gói Dịch Vụ';
    if (path.includes('/settings')) return 'Cấu hình Hệ thống';
    if (path.includes('/logs')) return 'Nhật ký & Hỗ trợ';
    return 'Tổng quan';
  };

  return (
    <div className="admin-layout">
      <AdminSidebar collapsed={sidebarCollapsed} />
      
      <div className="admin-main-wrapper">
        <AdminTopBar title={getPageTitle()} onLogout={logout} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
