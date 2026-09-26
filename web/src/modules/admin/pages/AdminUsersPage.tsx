import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import ConfirmActionModal from '../components/ConfirmActionModal';
import AdminDetailDrawer from '../components/AdminDetailDrawer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
  plan?: string;
  childrenCount?: number;
}

interface FamilyDetail {
  owner: UserData;
  members: any[];
  children: any[];
}

const translateRole = (role: string) => {
  switch (role) {
    case 'admin': return 'QUẢN TRỊ';
    case 'parent': return 'PHỤ HUYNH';
    case 'grandparent': return 'ÔNG BÀ';
    case 'child': return 'BÉ';
    default: return (role || '').toUpperCase();
  }
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'invites'>('users');
  
  // Users state
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Invites state
  const [invites, setInvites] = useState<any[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  // Filters
  const [filterRole, setFilterRole] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  // Modals & Drawers
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    user: UserData | null;
  }>({ isOpen: false, user: null });
  
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [familyDetail, setFamilyDetail] = useState<FamilyDetail | null>(null);
  const [loadingFamily, setLoadingFamily] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(1, false);
    } else {
      fetchInvites();
    }
  }, [activeTab, filterRole, filterPlan, filterStatus]);

  const fetchUsers = async (p = 1, append = false) => {
    if (!token) return;
    setLoadingUsers(true);
    try {
      const url = new URL(`${API_BASE}/api/admin/users`);
      url.searchParams.append('page', p.toString());
      if (filterRole) url.searchParams.append('role', filterRole);
      if (filterStatus) url.searchParams.append('status', filterStatus);
      if (filterPlan) url.searchParams.append('plan', filterPlan);
      if (search) url.searchParams.append('search', search);

      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        setUsers(append ? prev => [...prev, ...data.data.users] : data.data.users);
        setHasMore(data.data.pagination.hasMore);
        setPage(p);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchInvites = async () => {
    if (!token) return;
    setLoadingInvites(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/family-invites`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setInvites(data.data);
    } catch (err) { console.error(err); } finally { setLoadingInvites(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, false);
  };

  const toggleUserStatus = async () => {
    const user = confirmModal.user;
    if (!user) return;

    const newStatus = user.status === 'locked' ? 'active' : 'locked';
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${user._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
      } else alert(data.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
    
    setConfirmModal({ isOpen: false, user: null });
  };

  const openFamilyDetail = async (user: UserData) => {
    setSelectedUser(user);
    setLoadingFamily(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/families/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setFamilyDetail(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFamily(false);
    }
  };

  const userColumns: Column<UserData>[] = [
    { 
      key: 'fullName', 
      header: 'Họ tên',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--admin-primary)' }}>
            {u.fullName.charAt(0)}
          </div>
          <span style={{ fontWeight: 600 }}>{u.fullName}</span>
        </div>
      )
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Vai trò',
      render: (u) => (
        <span className={`admin-badge ${u.role === 'admin' ? 'badge-primary' : 'badge-info'}`}>
          {translateRole(u.role)}
        </span>
      )
    },
    { 
      key: 'plan', 
      header: 'Gói',
      render: (u) => (
        <span className={`admin-badge ${u.plan === 'premium' ? 'badge-primary' : 'badge-info'}`}>
          {u.plan === 'premium' ? 'PREMIUM' : 'FREE'}
        </span>
      )
    },
    { key: 'childrenCount', header: 'Số bé', render: (u) => u.childrenCount || 0 },
    { 
      key: 'status', 
      header: 'Trạng thái',
      render: (u) => (
        <span className={`admin-badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
          {u.status === 'active' ? 'HOẠT ĐỘNG' : 'ĐÃ KHOÁ'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      header: 'Ngày tạo',
      render: (u) => new Date(u.createdAt).toLocaleDateString('vi-VN')
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (u) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => openFamilyDetail(u)}>Chi tiết</button>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => navigate(`/admin/subscriptions?user=${u._id}`)}>Đổi gói</button>
          <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setConfirmModal({ isOpen: true, user: u })}>
            {u.status === 'active' ? 'Khoá' : 'Mở khoá'}
          </button>
        </div>
      )
    }
  ];

  const inviteColumns: Column<any>[] = [
    { key: 'inviteeName', header: 'Người được mời' },
    { key: 'phone', header: 'Số điện thoại' },
    { key: 'inviterName', header: 'Gia đình mời', render: (i) => i.family?.owner?.fullName || 'N/A' },
    { key: 'role', header: 'Vai trò', render: (i) => <span className="admin-badge badge-info">{translateRole(i.role)}</span> },
    { key: 'createdAt', header: 'Ngày gửi', render: (i) => new Date(i.createdAt).toLocaleDateString('vi-VN') },
    { key: 'status', header: 'Trạng thái', render: () => <span className="admin-badge badge-warning">PENDING</span> }
  ];

  return (
    <>
      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Tất cả người dùng</button>
            <button className={`admin-tab ${activeTab === 'invites' ? 'active' : ''}`} onClick={() => setActiveTab('invites')}>Lời mời chờ xử lý</button>
          </div>
        </div>

        {activeTab === 'users' && (
          <>
            <div style={{ padding: '16px 24px', display: 'flex', gap: 16, background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  placeholder="Tìm theo tên/email..." 
                  style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)', width: 200 }}
                  value={search} onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" className="admin-btn admin-btn-primary">Tìm</button>
              </form>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                <option value="">Tất cả vai trò</option>
                <option value="parent">Phụ huynh</option>
                <option value="grandparent">Ông bà</option>
              </select>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                <option value="">Tất cả gói</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Đã khoá</option>
              </select>
            </div>
            <DataTable columns={userColumns} data={users} loading={loadingUsers} hasMore={hasMore} onNextPage={() => fetchUsers(page + 1, true)} />
          </>
        )}

        {activeTab === 'invites' && (
          <DataTable columns={inviteColumns} data={invites} loading={loadingInvites} emptyMessage="Không có lời mời nào đang chờ." />
        )}
      </div>

      <ConfirmActionModal 
        isOpen={confirmModal.isOpen}
        title={confirmModal.user?.status === 'locked' ? 'Mở khoá tài khoản?' : 'Khoá tài khoản này?'}
        description={confirmModal.user?.status === 'locked' 
          ? `Người dùng ${confirmModal.user.fullName} sẽ có thể đăng nhập lại hệ thống.` 
          : `Tài khoản và toàn bộ các bé thuộc gia đình này sẽ không thể đăng nhập cho tới khi được mở khoá lại.`}
        confirmText={confirmModal.user?.status === 'locked' ? 'Mở khoá' : 'Khoá tài khoản'}
        confirmVariant={confirmModal.user?.status === 'locked' ? 'primary' : 'danger'}
        onConfirm={toggleUserStatus}
        onCancel={() => setConfirmModal({ isOpen: false, user: null })}
      />

      <AdminDetailDrawer 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        title="Chi tiết gia đình"
      >
        {loadingFamily ? (
          <div className="admin-skeleton" style={{ height: 200 }} />
        ) : familyDetail ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', color: 'var(--admin-primary)' }}>
                {familyDetail.owner.fullName.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18 }}>{familyDetail.owner.fullName}</h3>
                <div style={{ color: 'var(--admin-muted)', fontSize: 14 }}>{familyDetail.owner.email}</div>
                <div style={{ marginTop: 4 }}>
                   <span className="admin-badge badge-primary">PREMIUM</span>
                </div>
              </div>
              <button className="admin-btn admin-btn-danger" onClick={() => { setSelectedUser(null); setConfirmModal({ isOpen: true, user: familyDetail.owner }); }}>
                Khoá tài khoản
              </button>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 12 }}>Thành viên gia đình</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {familyDetail.members.length === 0 ? <span style={{ color: 'var(--admin-muted)', fontSize: 14 }}>Không có thành viên phụ</span> : familyDetail.members.map(m => (
                  <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid var(--admin-border)', borderRadius: 8 }}>
                    <span style={{ fontWeight: 600 }}>{m.user?.fullName || m.phone}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className="admin-badge badge-info">{translateRole(m.role)}</span>
                      <span className={`admin-badge ${m.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{m.status === 'active' ? 'HOẠT ĐỘNG' : 'CHỜ XÁC NHẬN'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', color: 'var(--admin-muted)', marginBottom: 12 }}>Các bé</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
                {familyDetail.children.map(c => (
                  <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, border: '1px solid var(--admin-border)', borderRadius: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: 'var(--admin-bg)' }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{c.name} ({c.age} tuổi)</div>
                      <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>Level {c.level} • {c.missionsCompleted || '—'} nhiệm vụ</div>
                    </div>
                    <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px', color: 'var(--admin-danger)', borderColor: 'var(--admin-danger)' }}>
                      Khoá bé
                    </button>
                  </div>
                ))}
                {familyDetail.children.length === 0 && <span style={{ color: 'var(--admin-muted)', fontSize: 14 }}>Chưa thêm bé nào</span>}
              </div>
            </div>
          </div>
        ) : (
          <div>Không tìm thấy dữ liệu</div>
        )}
      </AdminDetailDrawer>
    </>
  );
}
