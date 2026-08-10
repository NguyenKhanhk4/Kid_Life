import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotificationPage from './pages/NotificationPage';

// Protected Route Component
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute allowedRoles={['ADMIN', 'EXPERT']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/users" replace />,
          },
          {
            path: '/users',
            element: <UserManagementPage />,
          },
          {
            path: '/notifications',
            element: <NotificationPage />,
          },
        ]
      }
    ]
  },
  {
    path: '/unauthorized',
    element: <div className="error-screen"><h1>403 - Access Denied</h1><p>You don't have permission to view this page.</p></div>
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
