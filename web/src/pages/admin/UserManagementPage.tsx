import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import UserTable from '../../components/UserTable';
import { getUsers, updateUserStatus, approveExpert, UserProfile } from '../../api/userApi';
import { useAuth } from '../../contexts/AuthContext';

export default function UserManagementPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getUsers({ page: 1, limit: 50, search, role, status });
      setUsers(res.users);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, role, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatusChange = async (userId: string, newStatus: 'ACTIVE' | 'LOCKED') => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Thay đổi trạng thái thất bại');
    }
  };

  const handleApproveExpert = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await approveExpert(userId, action);
      if (action === 'APPROVE') {
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: 'ACTIVE' } : u));
      } else {
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      alert('Thao tác thất bại');
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: 100, color: 'var(--text-muted)' }}>
        <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
        <h2 className="title-md">Không có quyền truy cập</h2>
        <p>Chức năng quản lý người dùng chỉ dành cho Quản trị viên.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="title-lg">Quản lý Người dùng</h1>
        <p className="text-muted">Tổng số: {total} người dùng trên hệ thống</p>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select value={role} onChange={e => setRole(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 600 }}>
                <option value="">Tất cả vai trò</option>
                <option value="PARENT">Phụ huynh</option>
                <option value="CHILD">Trẻ em</option>
                <option value="EXPERT">Chuyên gia</option>
                <option value="ADMIN">Quản trị</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontWeight: 600 }}>
                <option value="">Tất cả trạng thái</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="LOCKED">Bị khóa</option>
                <option value="PENDING">Chờ duyệt</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
        ) : (
          <UserTable 
            users={users} 
            onStatusChange={handleStatusChange} 
            onApproveExpert={handleApproveExpert}
          />
        )}
      </div>
    </div>
  );
}
