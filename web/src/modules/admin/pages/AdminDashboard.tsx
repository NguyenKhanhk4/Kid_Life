import { useState, useEffect } from 'react';
import { 
  IoPeopleOutline, IoSettingsOutline, IoCheckmarkCircleOutline, 
  IoFlashOutline, IoLockClosedOutline, IoLockOpenOutline, 
  IoGiftOutline, IoStarOutline, IoSchoolOutline, IoHeartOutline,
  IoChatbubbleOutline, IoCloseOutline
} from 'react-icons/io5';
import { useAuth } from '../../auth/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Stats {
  totalFamilies: number;
  totalChildren: number;
  totalMissionsCompleted: number;
  totalActiveUsersToday: number;
  totalRedemptions: number;
  totalXPCirculating: number;
  totalLessonsCompleted: number;
  petsByStage: { stage1: number, stage2: number, stage3: number, stage4: number };
  pendingWishesCount: number;
  totalForumPosts: number;
  totalForumComments: number;
  newUsersLast7Days: { date: string; count: number }[];
}

interface UserData {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

interface FamilyDetail {
  owner: UserData;
  members: any[];
  children: any[];
}

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  
  // States - Group A (Stats)
  const [stats, setStats] = useState<Stats | null>(null);
  
  // States - Users
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // States - Group B (Family)
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [familyDetail, setFamilyDetail] = useState<FamilyDetail | null>(null);
  const [loadingFamily, setLoadingFamily] = useState(false);

  // States - Invites
  const [invites, setInvites] = useState<any[]>([]);

  // States - Group C (Community)
  const [reportedPosts, setReportedPosts] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [newChallenge, setNewChallenge] = useState({ title: '', description: '', durationDays: 7, startDate: '', endDate: '' });

  // States - Group E (Settings)
  const [settings, setSettings] = useState<any[]>([]);

  // States - Group D (Master Data)
  const [masterDataInfo] = useState('Chức năng đang chờ module Dev 2 & Dev 3 hoàn thiện.');

  // States - Group F (Logs & Tickets)
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    // Fetch stats
    fetch(`${API_BASE}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setStats(data.data))
      .catch(console.error);
      
      // Fetch pending invites
    fetch(`${API_BASE}/api/admin/family-invites`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setInvites(data.data))
      .catch(console.error);

    // Fetch reports
    fetch(`${API_BASE}/api/admin/community/reports`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setReportedPosts(data.data))
      .catch(console.error);
      
    // Fetch settings
    fetch(`${API_BASE}/api/admin/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setSettings(data.data))
      .catch(console.error);

    // Fetch challenges
    fetch(`${API_BASE}/api/community/challenges`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setChallenges(data.data))
      .catch(console.error);

    // Fetch Audit Logs
    fetch(`${API_BASE}/api/admin/audit-logs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setAuditLogs(data.data.logs))
      .catch(console.error);

    // Fetch Support Tickets
    fetch(`${API_BASE}/api/admin/support/tickets`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => data.success && setSupportTickets(data.data))
      .catch(console.error);
  }, [token]);

  const fetchUsers = async (p = 1, append = false) => {
    if (!token) return;
    try {
      const url = new URL(`${API_BASE}/api/admin/users`);
      url.searchParams.append('page', p.toString());
      if (filterRole) url.searchParams.append('role', filterRole);
      if (filterStatus) url.searchParams.append('status', filterStatus);

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

  useEffect(() => {
    setLoadingUsers(true);
    fetchUsers(1, false);
  }, [token, filterRole, filterStatus]);

  // Handle lock/unlock User
  const handleToggleStatus = async (user: UserData) => {
    const newStatus = user.status === 'locked' ? 'active' : 'locked';
    if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'locked' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản ${user.fullName}?`)) return;

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
  };

  // Handle Family Details
  const handleViewFamily = async (userId: string) => {
    setSelectedFamilyId(userId);
    setLoadingFamily(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/families/${userId}`, {
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

  // Handle lock/unlock Child
  const handleToggleChildStatus = async (childId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'locked' ? 'active' : 'locked';
    if (!window.confirm(`Bạn có chắc muốn ${newStatus === 'locked' ? 'KHÓA' : 'MỞ KHÓA'} hồ sơ bé này?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/children/${childId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setFamilyDetail(prev => prev ? {
          ...prev,
          children: prev.children.map(c => c._id === childId ? { ...c, status: newStatus } : c)
        } : null);
      } else alert(data.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
  };

  const renderSimpleChart = () => {
    if (!stats || !stats.newUsersLast7Days || stats.newUsersLast7Days.length === 0) return null;
    const maxCount = Math.max(...stats.newUsersLast7Days.map(d => d.count), 1);
    
    return (
      <div className="kl-card" style={{ padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Người dùng mới (7 ngày qua)</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 150 }}>
          {stats.newUsersLast7Days.map((item, idx) => {
            const heightPct = (item.count / maxCount) * 100;
            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', height: 100, display: 'flex', alignItems: 'flex-end', background: 'var(--kl-bg-soft)', borderRadius: 4 }}>
                  <div style={{ width: '100%', height: `${heightPct}%`, background: 'var(--kl-primary)', borderRadius: 4, transition: 'height 0.3s' }}></div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--kl-muted)' }}>
                  {new Date(item.date).getDate()}/{new Date(item.date).getMonth() + 1}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{item.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="web-shell" style={{ display: 'block', padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <div className="web-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🛠️ Admin Dashboard</h1>
          <p className="page-subtitle">Quản trị toàn hệ thống KidLife</p>
        </div>
        <button className="kl-btn" onClick={logout}>Đăng xuất</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '2px solid var(--kl-border)', paddingBottom: 12 }}>
        <button className={`kl-btn ${activeTab === 'overview' ? 'kl-btn-primary' : ''}`} onClick={() => setActiveTab('overview')}>
          Tổng quan & Users
        </button>
        <button className={`kl-btn ${activeTab === 'invites' ? 'kl-btn-primary' : ''}`} onClick={() => setActiveTab('invites')}>
          Lời mời đang chờ ({invites.length})
        </button>
        <button className={`kl-btn ${activeTab === 'community' ? 'kl-btn-primary' : ''}`} onClick={() => setActiveTab('community')}>
          Kiểm duyệt Cộng đồng
        </button>
        <button className={`kl-btn ${activeTab === 'settings' ? 'kl-btn-primary' : ''}`} onClick={() => setActiveTab('settings')}>
          Cấu hình Hệ thống
        </button>
        <button className={`kl-btn ${activeTab === 'masterdata' ? 'kl-btn-primary' : ''}`} onClick={() => setActiveTab('masterdata')}>
          Danh mục Hệ thống
        </button>
        <button className={`kl-btn ${activeTab === 'logs' ? 'kl-btn-primary' : ''}`} onClick={() => setActiveTab('logs')}>
          Nhật ký & Hỗ trợ
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid Group A */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {/* Old Stats */}
            <div className="kl-card" style={{ padding: 20 }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Tổng Gia đình</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalFamilies ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20 }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Tổng Trẻ em</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalChildren ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20 }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Active Users (Hôm nay)</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalActiveUsersToday ?? '-'}</div>
            </div>
            {/* New Stats Group A */}
            <div className="kl-card" style={{ padding: 20, borderLeft: '4px solid var(--kl-blue)' }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Nhiệm vụ hoàn thành</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalMissionsCompleted ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20, borderLeft: '4px solid var(--kl-green)' }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Bài học đã xong</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalLessonsCompleted ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20, borderLeft: '4px solid var(--kl-orange)' }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Tổng quà đổi</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalRedemptions ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20, borderLeft: '4px solid var(--kl-yellow)' }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>XP Đang lưu hành</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalXPCirculating ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20, borderLeft: '4px solid var(--kl-pink)' }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Lời chúc chờ duyệt</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.pendingWishesCount ?? '-'}</div>
            </div>
            <div className="kl-card" style={{ padding: 20, borderLeft: '4px solid var(--kl-purple)' }}>
              <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Bài đăng Forum</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{stats?.totalForumPosts ?? '-'} / {stats?.totalForumComments ?? '-'} cmt</div>
            </div>
          </div>

          {renderSimpleChart()}

          {/* Users Table */}
          <div className="kl-card" style={{ padding: 24, marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Quản lý người dùng</h2>
              <div style={{ display: 'flex', gap: 12 }}>
                <select className="kl-input" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                  <option value="">Tất cả Role</option>
                  <option value="admin">Admin</option>
                  <option value="parent">Parent</option>
                </select>
                <select className="kl-input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="">Tất cả Status</option>
                  <option value="active">Active</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            </div>

            {loadingUsers && users.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--kl-muted)' }}>Đang tải...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--kl-border)' }}>
                      <th style={{ padding: '12px 16px' }}>Họ tên</th>
                      <th style={{ padding: '12px 16px' }}>Email</th>
                      <th style={{ padding: '12px 16px' }}>Role</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} style={{ borderBottom: '1px solid var(--kl-bg-soft)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>{user.fullName}</td>
                        <td style={{ padding: '12px 16px' }}>{user.email}</td>
                        <td style={{ padding: '12px 16px' }}>{user.role}</td>
                        <td style={{ padding: '12px 16px', color: user.status === 'locked' ? '#ef4444' : '#22c55e', fontWeight: 700 }}>
                          {(user.status ?? 'active').toUpperCase()}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                          {user.role === 'parent' && (
                            <button className="kl-btn" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => handleViewFamily(user._id)}>
                              Chi tiết gia đình
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button 
                              className={`kl-btn ${user.status === 'locked' ? '' : 'kl-btn-primary'}`}
                              style={{ 
                                padding: '4px 8px', fontSize: 12,
                                background: user.status === 'locked' ? '#e2e8f0' : '#ef4444',
                                color: user.status === 'locked' ? '#475569' : '#fff'
                              }}
                              onClick={() => handleToggleStatus(user)}
                            >
                              {user.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab Invites */}
      {activeTab === 'invites' && (
        <div className="kl-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Lời mời tham gia gia đình đang chờ</h2>
          {invites.length === 0 ? (
            <div style={{ color: 'var(--kl-muted)' }}>Không có lời mời nào.</div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {invites.map(inv => (
                <div key={inv._id} style={{ padding: 16, background: 'var(--kl-bg-soft)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{inv.phone}</div>
                    <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Vai trò: {inv.role} • Mời bởi: {inv.familyId?.fullName} ({inv.familyId?.email})</div>
                  </div>
                  <div className="kl-badge">Pending</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Community */}
      {activeTab === 'community' && (
        <div>
          <div className="kl-card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Bài viết bị báo cáo</h2>
            {reportedPosts.length === 0 ? (
              <div style={{ color: 'var(--kl-muted)' }}>Chưa có bài viết nào bị báo cáo.</div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {reportedPosts.map(post => (
                  <div key={post._id} style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{post.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--kl-muted)', marginBottom: 8 }}>Bởi: {post.authorId?.fullName}</div>
                      <div style={{ fontSize: 14 }}>{post.content.slice(0, 100)}...</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#ef4444', fontWeight: 700, marginBottom: 8 }}>{post.reportsCount} Reports</div>
                      <button 
                        className={`kl-btn ${post.isHidden ? '' : 'kl-btn-primary'}`}
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        onClick={async () => {
                          const res = await fetch(`${API_BASE}/api/admin/community/posts/${post._id}/hide`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ isHidden: !post.isHidden })
                          });
                          if (res.ok) {
                            setReportedPosts(prev => prev.map(p => p._id === post._id ? { ...p, isHidden: !p.isHidden } : p));
                          }
                        }}
                      >
                        {post.isHidden ? 'Đã Ẩn (Bỏ ẩn)' : 'Ẩn Bài'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="kl-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Quản lý Thử thách (Challenges)</h2>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <input type="text" className="kl-input" placeholder="Tên thử thách" value={newChallenge.title} onChange={e => setNewChallenge({...newChallenge, title: e.target.value})} />
              <input type="date" className="kl-input" value={newChallenge.startDate} onChange={e => setNewChallenge({...newChallenge, startDate: e.target.value})} />
              <input type="date" className="kl-input" value={newChallenge.endDate} onChange={e => setNewChallenge({...newChallenge, endDate: e.target.value})} />
              <button className="kl-btn kl-btn-primary" onClick={async () => {
                const res = await fetch(`${API_BASE}/api/admin/community/challenges`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(newChallenge)
                });
                if (res.ok) {
                  alert('Tạo thành công');
                  window.location.reload();
                }
              }}>Tạo Thử Thách</button>
            </div>
            
            <div style={{ display: 'grid', gap: 12 }}>
              {challenges.map(c => (
                <div key={c._id} style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</div>
                  </div>
                  {new Date(c.endDate) > new Date() ? (
                    <button className="kl-btn" style={{ padding: '6px 12px', fontSize: 12, color: '#ef4444' }} onClick={async () => {
                      if (!window.confirm('Đóng thử thách này?')) return;
                      await fetch(`${API_BASE}/api/admin/community/challenges/${c._id}/close`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
                      window.location.reload();
                    }}>Đóng sớm</button>
                  ) : <span className="kl-badge">Đã kết thúc</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Settings */}
      {activeTab === 'settings' && (
        <div className="kl-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Cấu hình Hệ thống</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {settings.map((setting: any) => (
              <div key={setting._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'var(--kl-bg-soft)', borderRadius: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{setting.key}</div>
                  <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>{setting.description || 'Không có mô tả'}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input 
                    type="text" 
                    className="kl-input" 
                    defaultValue={setting.value}
                    id={`setting-${setting.key}`}
                    style={{ width: 150 }}
                  />
                  <button className="kl-btn kl-btn-primary" onClick={async () => {
                    const el = document.getElementById(`setting-${setting.key}`) as HTMLInputElement;
                    const res = await fetch(`${API_BASE}/api/admin/settings/${setting.key}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ value: isNaN(Number(el.value)) ? el.value : Number(el.value) })
                    });
                    if (res.ok) alert('Đã lưu');
                  }}>Lưu</button>
                </div>
              </div>
            ))}
            {settings.length === 0 && <div style={{ color: 'var(--kl-muted)' }}>Chưa có cấu hình nào. (Cần chạy Seed script)</div>}
          </div>
        </div>
      )}

      {/* Tab Master Data */}
      {activeTab === 'masterdata' && (
        <div className="kl-card" style={{ padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Danh mục Hệ thống (Master Data)</h2>
          <div style={{ padding: 16, background: '#fffbeb', color: '#92400e', borderRadius: 8, marginBottom: 20 }}>
            <span style={{ fontWeight: 700 }}>TODO:</span> {masterDataInfo}
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12 }}>
              <h3 style={{ fontWeight: 700 }}>Truyện cổ tích (Curated Stories)</h3>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Thuộc module Dev 3 (Pet & Stories)</p>
            </div>
            <div style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12 }}>
              <h3 style={{ fontWeight: 700 }}>Phụ kiện thú cưng (Pet Accessories)</h3>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Thuộc module Dev 3 (Pet & Stories)</p>
            </div>
            <div style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12 }}>
              <h3 style={{ fontWeight: 700 }}>Bài học hệ thống (System Lessons)</h3>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Thuộc module Dev 2 (Missions & Lessons)</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Logs & Tickets */}
      {activeTab === 'logs' && (
        <div>
          <div className="kl-card" style={{ padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Yêu cầu hỗ trợ (Support Tickets)</h2>
            {supportTickets.length === 0 ? (
              <div style={{ color: 'var(--kl-muted)' }}>Chưa có yêu cầu nào.</div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {supportTickets.map(ticket => (
                  <div key={ticket._id} style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: ticket.status === 'resolved' ? 'var(--kl-bg-soft)' : '#fff' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{ticket.subject}</div>
                      <div style={{ fontSize: 13, color: 'var(--kl-muted)', marginBottom: 8 }}>Từ: {ticket.userId?.fullName} ({ticket.userId?.email})</div>
                      <div style={{ fontSize: 14 }}>{ticket.message}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: ticket.status === 'resolved' ? '#22c55e' : '#eab308', fontWeight: 700, marginBottom: 8 }}>{ticket.status.toUpperCase()}</div>
                      {ticket.status === 'open' && (
                        <button className="kl-btn kl-btn-primary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={async () => {
                          const res = await fetch(`${API_BASE}/api/admin/support/tickets/${ticket._id}/resolve`, {
                            method: 'PUT',
                            headers: { Authorization: `Bearer ${token}` }
                          });
                          if (res.ok) setSupportTickets(prev => prev.map(t => t._id === ticket._id ? { ...t, status: 'resolved' } : t));
                        }}>Đánh dấu Xử lý xong</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="kl-card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Nhật ký Vận hành (Audit Logs)</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--kl-border)' }}>
                    <th style={{ padding: '12px 8px' }}>Thời gian</th>
                    <th style={{ padding: '12px 8px' }}>Admin</th>
                    <th style={{ padding: '12px 8px' }}>Hành động</th>
                    <th style={{ padding: '12px 8px' }}>Mục tiêu</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map(log => (
                    <tr key={log._id} style={{ borderBottom: '1px solid var(--kl-bg-soft)' }}>
                      <td style={{ padding: '12px 8px' }}>{new Date(log.createdAt).toLocaleString()}</td>
                      <td style={{ padding: '12px 8px', fontWeight: 600 }}>{log.actorId?.fullName}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--kl-primary)', fontWeight: 700 }}>{log.action}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--kl-muted)' }}>{log.targetType} {log.targetId ? `(${log.targetId})` : ''}</td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: 20, textAlign: 'center', color: 'var(--kl-muted)' }}>Chưa có nhật ký nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chi tiết gia đình */}
      {selectedFamilyId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedFamilyId(null); }}>
          <div className="kl-card" style={{ width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: 24, position: 'relative' }}>
            <button onClick={() => setSelectedFamilyId(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
              <IoCloseOutline size={24} color="var(--kl-muted)" />
            </button>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Chi tiết gia đình</h2>
            
            {loadingFamily ? (
              <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>
            ) : familyDetail ? (
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Chủ gia đình</h3>
                <div style={{ padding: 16, background: 'var(--kl-bg-soft)', borderRadius: 12, marginBottom: 20 }}>
                  <div style={{ fontWeight: 700 }}>{familyDetail.owner.fullName}</div>
                  <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>{familyDetail.owner.email}</div>
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Đồng quản lý (Members)</h3>
                <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                  {familyDetail.members.length === 0 && <div style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Không có.</div>}
                  {familyDetail.members.map(m => (
                    <div key={m._id} style={{ padding: 12, border: '1px solid var(--kl-border)', borderRadius: 12 }}>
                      <div style={{ fontWeight: 700 }}>{m.userId?.fullName || m.phone}</div>
                      <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Vai trò: {m.role} • Status: {m.status}</div>
                    </div>
                  ))}
                </div>

                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Hồ sơ Trẻ em ({familyDetail.children.length})</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                  {familyDetail.children.map(c => (
                    <div key={c._id} style={{ padding: 16, border: '1px solid var(--kl-border)', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ fontSize: 24 }}>{c.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{c.name} {c.status === 'locked' && <span style={{ color: '#ef4444', fontSize: 12 }}>(Bị khóa)</span>}</div>
                          <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>
                            Level {c.level} • {c.xp} XP • {c.totalMissionsCompleted} Nhiệm vụ
                          </div>
                        </div>
                      </div>
                      <button 
                        className={`kl-btn ${c.status === 'locked' ? '' : 'kl-btn-primary'}`}
                        style={{ 
                          padding: '6px 12px', fontSize: 12,
                          background: c.status === 'locked' ? '#e2e8f0' : '#ef4444',
                          color: c.status === 'locked' ? '#475569' : '#fff'
                        }}
                        onClick={() => handleToggleChildStatus(c._id, c.status || 'active')}
                      >
                        {c.status === 'locked' ? 'Mở khóa bé' : 'Khóa bé'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
