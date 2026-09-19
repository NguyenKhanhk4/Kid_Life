import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import ConfirmActionModal from '../components/ConfirmActionModal';
import AdminDetailDrawer from '../components/AdminDetailDrawer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminLogsPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'audit' | 'support'>('audit');
  
  // Audit Logs
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logFilterAction, setLogFilterAction] = useState('');
  
  // Support Tickets
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketFilterStatus, setTicketFilterStatus] = useState('');

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [confirmResolve, setConfirmResolve] = useState<{ isOpen: boolean; ticket: any | null }>({ isOpen: false, ticket: null });

  useEffect(() => {
    if (activeTab === 'audit') fetchLogs();
    else fetchTickets();
  }, [activeTab, logFilterAction, ticketFilterStatus]);

  const fetchLogs = async () => {
    if (!token) return;
    setLoadingLogs(true);
    try {
      const url = new URL(`${API_BASE}/api/admin/logs/audit`);
      if (logFilterAction) url.searchParams.append('action', logFilterAction);
      
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setLogs(data.data);
    } catch (err) { console.error(err); } finally { setLoadingLogs(false); }
  };

  const fetchTickets = async () => {
    if (!token) return;
    setLoadingTickets(true);
    try {
      const url = new URL(`${API_BASE}/api/admin/logs/support`);
      if (ticketFilterStatus) url.searchParams.append('status', ticketFilterStatus);
      
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setTickets(data.data);
    } catch (err) { console.error(err); } finally { setLoadingTickets(false); }
  };

  const handleResolveTicket = async () => {
    const ticket = confirmResolve.ticket;
    if (!ticket) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/logs/support/${ticket._id}/resolve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, status: 'resolved' } : t));
        setSelectedTicket(null);
      } else alert(data.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
    
    setConfirmResolve({ isOpen: false, ticket: null });
  };

  const formatAction = (action: string) => {
    switch (action) {
      case 'lock_user': return { label: 'Khoá TK', type: 'danger' };
      case 'unlock_user': return { label: 'Mở khoá TK', type: 'success' };
      case 'change_plan': return { label: 'Đổi gói', type: 'primary' };
      case 'hide_post': return { label: 'Ẩn bài viết', type: 'warning' };
      case 'update_setting': return { label: 'Cập nhật Cấu hình', type: 'info' };
      default: return { label: action, type: 'default' };
    }
  };

  const logColumns: Column<any>[] = [
    { key: 'createdAt', header: 'Thời gian', render: (l) => new Date(l.createdAt).toLocaleString('vi-VN') },
    { key: 'admin', header: 'Admin', render: (l) => <span style={{ fontWeight: 600 }}>{l.admin?.fullName || 'System'}</span> },
    { 
      key: 'action', 
      header: 'Hành động', 
      render: (l) => {
        const fmt = formatAction(l.action);
        return <span className={`admin-badge badge-${fmt.type}`}>{fmt.label}</span>;
      }
    },
    { key: 'target', header: 'Đối tượng tác động', render: (l) => <span style={{ fontFamily: 'monospace' }}>{l.targetModel} {l.targetId}</span> },
    { key: 'details', header: 'Ghi chú', render: (l) => <span style={{ color: 'var(--admin-muted)' }}>{l.details || '-'}</span> }
  ];

  const ticketColumns: Column<any>[] = [
    { key: 'sender', header: 'Người gửi', render: (t) => <span style={{ fontWeight: 600 }}>{t.sender?.fullName || t.senderEmail}</span> },
    { key: 'title', header: 'Tiêu đề', render: (t) => t.title },
    { 
      key: 'status', 
      header: 'Trạng thái', 
      render: (t) => (
        <span className={`admin-badge ${t.status === 'open' ? 'badge-warning' : 'badge-success'}`}>
          {t.status === 'open' ? 'ĐANG MỞ' : 'ĐÃ XỬ LÝ'}
        </span>
      )
    },
    { key: 'createdAt', header: 'Ngày gửi', render: (t) => new Date(t.createdAt).toLocaleDateString('vi-VN') },
    {
      key: 'actions',
      header: 'Hành động',
      render: (t) => (
        <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setSelectedTicket(t)}>Xem chi tiết</button>
      )
    }
  ];

  return (
    <>
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>Nhật ký hành động</button>
            <button className={`admin-tab ${activeTab === 'support' ? 'active' : ''}`} onClick={() => setActiveTab('support')}>Phản hồi & Hỗ trợ</button>
          </div>
        </div>

        {activeTab === 'audit' && (
          <>
            <div style={{ padding: '16px 24px', background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={logFilterAction} onChange={e => setLogFilterAction(e.target.value)}>
                <option value="">Tất cả loại hành động</option>
                <option value="lock_user">Khoá tài khoản</option>
                <option value="unlock_user">Mở khoá tài khoản</option>
                <option value="change_plan">Đổi gói dịch vụ</option>
                <option value="hide_post">Ẩn bài viết</option>
                <option value="update_setting">Cập nhật cấu hình</option>
              </select>
            </div>
            <DataTable columns={logColumns} data={logs} loading={loadingLogs} emptyMessage="Chưa có nhật ký hành động nào." />
          </>
        )}

        {activeTab === 'support' && (
          <>
            <div style={{ padding: '16px 24px', background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={ticketFilterStatus} onChange={e => setTicketFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="resolved">Đã xử lý</option>
              </select>
            </div>
            <DataTable columns={ticketColumns} data={tickets} loading={loadingTickets} emptyMessage="Không có phản hồi nào." />
          </>
        )}
      </div>

      <AdminDetailDrawer isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title="Chi tiết Phản hồi">
        {selectedTicket && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 16, background: 'var(--admin-bg)', borderRadius: 8 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 16 }}>{selectedTicket.title}</h4>
              <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>Từ: <span style={{ fontWeight: 600, color: 'var(--admin-ink)' }}>{selectedTicket.sender?.fullName || selectedTicket.senderEmail}</span></div>
              <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>Thời gian: {new Date(selectedTicket.createdAt).toLocaleString('vi-VN')}</div>
            </div>
            
            <div style={{ fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {selectedTicket.content}
            </div>

            {selectedTicket.status === 'open' && (
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--admin-border)', textAlign: 'right' }}>
                <button className="admin-btn admin-btn-success" onClick={() => setConfirmResolve({ isOpen: true, ticket: selectedTicket })}>
                  Đánh dấu đã xử lý
                </button>
              </div>
            )}
          </div>
        )}
      </AdminDetailDrawer>

      <ConfirmActionModal 
        isOpen={confirmResolve.isOpen}
        title="Đánh dấu đã xử lý?"
        description="Bạn xác nhận đã hỗ trợ/xử lý xong phản hồi này? Trạng thái sẽ được chuyển sang 'Đã xử lý'."
        confirmText="Xác nhận"
        confirmVariant="primary"
        onConfirm={handleResolveTicket}
        onCancel={() => setConfirmResolve({ isOpen: false, ticket: null })}
      />
    </>
  );
}
