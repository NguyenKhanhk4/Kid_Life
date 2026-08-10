import { useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notificationApi';
import type { Notification } from '../api/notificationApi';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        setLoading(true);
        const res = await getNotifications({ limit: 100 });
        setNotifications(res.notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadNotifs();
  }, []);

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (!isRead) {
      try {
        await markNotificationRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      } catch (err) { }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="title-lg">Tất cả thông báo</h1>
          <p className="text-muted">Bạn có {unreadCount} thông báo chưa đọc</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={handleMarkAllRead}>
            <CheckCheck size={18} /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(n => (
              <div 
                key={n._id} 
                style={{ 
                  padding: '20px 24px', 
                  borderBottom: '1px solid var(--border)', 
                  display: 'flex', 
                  gap: 20,
                  background: n.isRead ? 'transparent' : 'var(--primary-soft)',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onClick={() => handleMarkRead(n._id, n.isRead)}
              >
                <div style={{ 
                  width: 48, height: 48, borderRadius: '50%', 
                  background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)', color: n.type === 'SYSTEM' ? 'var(--red)' : 'var(--primary)'
                }}>
                  <Bell size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: 'var(--text)' }}>{n.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.content}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, fontWeight: 500 }}>
                    {new Date(n.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                {!n.isRead && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)', marginTop: 8 }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
