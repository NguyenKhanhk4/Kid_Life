import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notificationApi';
import type { Notification } from '../api/notificationApi';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await getNotifications({ limit: 10 });
        setNotifications(res.notifications);
        setUnreadCount(res.unreadCount);
      } catch (err) {
        console.error('Failed to load notifs');
      }
    };
    loadNotifs();
    // In real app, we'd use WebSocket or polling
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markNotificationRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) { }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { }
  };

  return (
    <div className="notif-dropdown" ref={dropdownRef}>
      <button className="notif-btn" onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-popover">
          <div className="notif-header">
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Thông báo</h3>
            {unreadCount > 0 && (
              <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 12 }} onClick={handleMarkAllRead}>
                <CheckCheck size={14} /> Đọc tất cả
              </button>
            )}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có thông báo nào</div>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`} onClick={() => handleMarkRead(n._id, n.isRead)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.content}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!n.isRead && <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--primary)', marginTop: 6 }} />}
                </div>
              ))
            )}
          </div>
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <button className="btn" style={{ background: 'transparent', color: 'var(--primary)' }} onClick={() => { setOpen(false); navigate('/notifications'); }}>
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
