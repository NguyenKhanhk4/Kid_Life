import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import DataTable, { Column } from '../components/DataTable';
import StatCard from '../components/StatCard';
import ChangePlanModal from '../components/ChangePlanModal';
import FeatureFlagEditModal from '../components/FeatureFlagEditModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AdminSubscriptionsPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');

  const [activeTab, setActiveTab] = useState<'subs' | 'flags'>('subs');
  const [stats, setStats] = useState<any>(null);

  // Subscriptions
  const [subs, setSubs] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [filterPlan, setFilterPlan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expiringOnly, setExpiringOnly] = useState(false);

  // Flags
  const [flags, setFlags] = useState<any[]>([]);
  const [loadingFlags, setLoadingFlags] = useState(false);

  // Modals
  const [planModalUser, setPlanModalUser] = useState<any | null>(null);
  const [flagModalKey, setFlagModalKey] = useState<string | null>(null);
  const [flagModalData, setFlagModalData] = useState<any | null>(null);

  useEffect(() => {
    fetchStats();
    if (activeTab === 'subs') fetchSubs();
    else fetchFlags();
  }, [activeTab, filterPlan, filterStatus, expiringOnly]);

  useEffect(() => {
    // If navigated from users page with a specific user to change plan
    if (initialUserId && subs.length > 0) {
      const u = subs.find(s => s.user?._id === initialUserId || s._id === initialUserId);
      if (u) setPlanModalUser(u);
    }
  }, [initialUserId, subs]);

  const fetchStats = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/subscriptions/stats`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchSubs = async () => {
    if (!token) return;
    setLoadingSubs(true);
    try {
      const url = new URL(`${API_BASE}/api/admin/subscriptions`);
      if (filterPlan) url.searchParams.append('plan', filterPlan);
      if (filterStatus) url.searchParams.append('status', filterStatus);
      if (expiringOnly) url.searchParams.append('expiringDays', '7');
      
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setSubs(data.data);
    } catch (err) { console.error(err); } finally { setLoadingSubs(false); }
  };

  const fetchFlags = async () => {
    if (!token) return;
    setLoadingFlags(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/feature-flags`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) {
        // Convert object mapping to array for table
        const flagArray = Object.keys(data.data).map(key => ({
          key,
          ...data.data[key]
        }));
        setFlags(flagArray);
      }
    } catch (err) { console.error(err); } finally { setLoadingFlags(false); }
  };

  const handleChangePlan = async (data: any) => {
    if (!planModalUser) return;
    const userId = planModalUser.user?._id || planModalUser._id;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/plan`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        fetchSubs(); // Refresh
        setPlanModalUser(null);
      } else alert(resData.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
  };

  const handleToggleFlag = async (key: string, enabled: boolean) => {
    try {
      // Optimistic update
      setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled } : f));
      const res = await fetch(`${API_BASE}/api/admin/feature-flags/${key}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on error
        setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !enabled } : f));
        alert(data.error?.message);
      }
    } catch (err) { 
      setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !enabled } : f));
      alert('Lỗi hệ thống'); 
    }
  };

  const handleUpdateFlagConfig = async (key: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/feature-flags/${key}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (resData.success) {
        setFlags(prev => prev.map(f => f.key === key ? { ...f, ...data } : f));
        setFlagModalKey(null);
      } else alert(resData.error?.message);
    } catch (err) { alert('Lỗi hệ thống'); }
  };

  const formatKey = (key: string) => {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const subColumns: Column<any>[] = [
    { key: 'user', header: 'Người dùng', render: (s) => <span style={{ fontWeight: 600 }}>{s.user?.fullName || 'N/A'}</span> },
    { 
      key: 'plan', 
      header: 'Gói', 
      render: (s) => (
        <span className={`admin-badge ${s.plan === 'premium' ? 'badge-primary' : 'badge-info'}`}>
          {s.plan === 'premium' ? 'PREMIUM' : 'FREE'}
        </span>
      )
    },
    { 
      key: 'source', 
      header: 'Nguồn', 
      render: (s) => (
        <span className="admin-badge badge-default" style={{ fontSize: 10 }}>
          {s.source === 'admin' ? 'Admin gán' : 'Thanh toán'}
        </span>
      )
    },
    { key: 'startDate', header: 'Ngày bắt đầu', render: (s) => new Date(s.startDate).toLocaleDateString('vi-VN') },
    { 
      key: 'endDate', 
      header: 'Ngày hết hạn', 
      render: (s) => {
        if (!s.endDate) return 'Không giới hạn';
        const isExpiring = new Date(s.endDate).getTime() - Date.now() <= 7 * 24 * 60 * 60 * 1000;
        return <span style={{ color: isExpiring ? 'var(--admin-warning)' : 'inherit', fontWeight: isExpiring ? 700 : 400 }}>{new Date(s.endDate).toLocaleDateString('vi-VN')}</span>;
      }
    },
    { 
      key: 'status', 
      header: 'Trạng thái', 
      render: (s) => (
        <span className={`admin-badge ${s.status === 'active' ? 'badge-success' : s.status === 'expired' ? 'badge-danger' : 'badge-warning'}`}>
          {s.status.toUpperCase()}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: (s) => (
        <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => setPlanModalUser(s)}>
          Đổi gói
        </button>
      )
    }
  ];

  const flagColumns: Column<any>[] = [
    { key: 'key', header: 'Tên tính năng', render: (f) => <span style={{ fontWeight: 700 }}>{formatKey(f.key)}</span> },
    { key: 'description', header: 'Mô tả', render: (f) => <span style={{ color: 'var(--admin-muted)' }}>{f.description}</span> },
    { key: 'requiredPlan', header: 'Yêu cầu gói', render: (f) => <span className={`admin-badge ${f.requiredPlan === 'premium' ? 'badge-primary' : 'badge-info'}`}>{f.requiredPlan.toUpperCase()}</span> },
    { key: 'freeLimitValue', header: 'Giới hạn Free', render: (f) => f.freeLimitValue !== null ? f.freeLimitValue : <span style={{ color: 'var(--admin-muted)' }}>Không áp dụng</span> },
    { 
      key: 'enabled', 
      header: 'Trạng thái', 
      render: (f) => (
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ position: 'relative', width: 40, height: 24, borderRadius: 12, background: f.enabled ? 'var(--admin-success)' : 'var(--admin-border)', transition: 'background 0.3s' }}>
            <div style={{ position: 'absolute', top: 2, left: f.enabled ? 18 : 2, width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
          <input type="checkbox" checked={f.enabled} onChange={(e) => handleToggleFlag(f.key, e.target.checked)} style={{ display: 'none' }} />
        </label>
      )
    },
    {
      key: 'actions',
      header: '',
      render: (f) => (
        <button className="admin-btn admin-btn-outline" style={{ fontSize: 12, padding: '4px 8px' }} onClick={() => { setFlagModalKey(f.key); setFlagModalData(f); }}>
          Sửa
        </button>
      )
    }
  ];

  return (
    <>
      <div className="admin-stats-grid">
        <StatCard label="Free users" value={stats?.freeUsers || '-'} />
        <StatCard label="Premium users" value={stats?.premiumUsers || '-'} />
        <StatCard label="Tỉ lệ chuyển đổi" value={stats?.conversionRate ? `${stats.conversionRate}%` : '-'} />
        <StatCard label="Sắp hết hạn (7 ngày)" value={stats?.expiringSoon || '-'} />
      </div>

      <div className="admin-table-container" style={{ marginTop: 24 }}>
        <div className="admin-table-toolbar">
          <div className="admin-tabs">
            <button className={`admin-tab ${activeTab === 'subs' ? 'active' : ''}`} onClick={() => setActiveTab('subs')}>Danh sách Subscription</button>
            <button className={`admin-tab ${activeTab === 'flags' ? 'active' : ''}`} onClick={() => setActiveTab('flags')}>Feature Flags</button>
          </div>
        </div>

        {activeTab === 'subs' && (
          <>
            <div style={{ padding: '16px 24px', display: 'flex', gap: 16, background: 'var(--admin-bg)', borderBottom: '1px solid var(--admin-border)', alignItems: 'center' }}>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                <option value="">Tất cả gói</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--admin-border)' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="canceled">Canceled</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                <input type="checkbox" checked={expiringOnly} onChange={e => setExpiringOnly(e.target.checked)} />
                Chỉ hiện sắp hết hạn (≤7 ngày)
              </label>
            </div>
            <DataTable columns={subColumns} data={subs} loading={loadingSubs} />
          </>
        )}

        {activeTab === 'flags' && (
          <DataTable columns={flagColumns} data={flags} loading={loadingFlags} />
        )}
      </div>

      <ChangePlanModal 
        isOpen={!!planModalUser} 
        onClose={() => setPlanModalUser(null)} 
        user={planModalUser} 
        onSubmit={handleChangePlan} 
      />

      <FeatureFlagEditModal 
        isOpen={!!flagModalKey} 
        onClose={() => setFlagModalKey(null)} 
        featureKey={flagModalKey || ''} 
        initialData={flagModalData} 
        onSubmit={handleUpdateFlagConfig} 
      />
    </>
  );
}
