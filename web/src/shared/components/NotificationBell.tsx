import { useState, useEffect, useRef } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Notification {
  _id: string;
  type: string;
  title: string;
  body: string;
  targetUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data.notifications || []);
        setUnreadCount(json.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Lỗi khi tải thông báo:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Có thể set interval ở đây nếu muốn realtime đơn giản
    // const interval = setInterval(fetchNotifications, 60000); // 1 phút
    // return () => clearInterval(interval);
  }, [token]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark as read and navigate
  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.isRead && token) {
      try {
        await fetch(`${API_BASE}/api/notifications/${notif._id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` }
        });
        // Update local state
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error('Lỗi cập nhật trạng thái đã đọc', err);
      }
    }
    
    setIsOpen(false);
    if (notif.targetUrl) {
      navigate(notif.targetUrl);
    }
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'Vừa xong';
    if (m < 60) return `${m} phút trước`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'var(--kl-bg-soft)', 
          border: 'none', 
          width: 40, 
          height: 40, 
          borderRadius: 20, 
          display: 'grid', 
          placeItems: 'center',
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <IoNotificationsOutline size={20} color="var(--kl-muted)" />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 10,
            height: 10,
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 50,
          right: 0,
          width: 320,
          maxHeight: 400,
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          border: '1px solid var(--kl-border)',
          zIndex: 1000,
          padding: '16px 0'
        }}>
          <h3 style={{ margin: '0 16px 12px', fontSize: 16, fontWeight: 800 }}>Thông báo</h3>
          
          {notifications.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--kl-muted)', fontSize: 13, padding: '20px 0' }}>
              Không có thông báo nào.
            </p>
          ) : (
            <div>
              {notifications.map(notif => (
                <div 
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--kl-border)',
                    background: notif.isRead ? 'transparent' : 'var(--kl-primary-soft)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--kl-text)' }}>
                    {notif.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>
                    {notif.body}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--kl-muted)', marginTop: 4 }}>
                    {formatTime(notif.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
