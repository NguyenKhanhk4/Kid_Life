import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronForward, IoPencil, IoLogOutOutline, IoPersonAddOutline, IoCloseOutline, IoPeopleOutline, IoPersonOutline } from 'react-icons/io5';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { useAuth } from '@/modules/auth/AuthContext';
import { usePermission } from '@/modules/auth/usePermission';
import { getWalletData, WalletData } from '@/shared/utils/walletStorage';

const D = MOCK_KIDLIFE_DATA;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AVATAR_OPTIONS = ['🧒', '👦', '👧', '🧒🏻', '👦🏻', '👧🏻', '🧒🏽', '🦸', '🧙', '🐱'];

const menuItems = [
  { icon: '💳', label: 'Gói KidLife Premium', detail: 'Đang hoạt động', isPremium: true },
  { icon: '📈', label: 'Báo cáo kỹ năng AI', detail: 'Xem Radar chart & AI đánh giá' },
  { icon: '📷', label: 'Nhật ký hành trình', detail: 'Kho ảnh, AI Video Recap & Sách ảnh' },
  { icon: '🏦', label: 'Ngân hàng ảo & Vé phạt', detail: 'Cài đặt tiết kiệm & quản lý kỷ luật' },
  { icon: '🎤', label: 'Thu âm giọng đọc (Voice Clone)', detail: 'Nhân bản giọng đọc truyện cho bé' },
  { icon: '🎁', label: 'Phần thưởng & ví', detail: 'Quản lý phần thưởng của bé' },
  { icon: '🔔', label: 'Thông báo', detail: '' },
  { icon: '❓', label: 'Trợ giúp & hỗ trợ', detail: '' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface FamilyMember {
  _id: string;
  phone: string;
  role: 'admin' | 'parent' | 'grandparent';
  status: 'active' | 'pending';
  userId?: { fullName: string; email: string };
}

interface Child {
  _id: string;
  name: string;
  age?: number;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Quản trị',
  parent: 'Phụ huynh',
  grandparent: 'Ông/Bà',
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Đang hoạt động', color: '#16a34a', bg: '#dcfce7' },
  pending: { label: 'Chờ xác nhận', color: '#d97706', bg: '#fef9c3' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParentAccountPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const { canInviteFamily, canChangeRole } = usePermission();

  // Family state
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState('');

  // Invite modal
  const [showModal, setShowModal] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState<'parent' | 'grandparent'>('parent');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  // Children state
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [showChildModal, setShowChildModal] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [childAvatar, setChildAvatar] = useState('🧒');
  const [childPin, setChildPin] = useState('');
  const [childLoading, setChildLoading] = useState(false);
  const [childError, setChildError] = useState('');
  const [childSuccess, setChildSuccess] = useState('');

  const defaultMembers: FamilyMember[] = D.familyMembers.map((m) => ({
    _id: m.id,
    phone: m.phone,
    role: m.role as 'admin' | 'parent' | 'grandparent',
    status: m.status as 'active' | 'pending',
    userId: { fullName: m.name, email: '' },
  }));

  const defaultChild: Child = {
    _id: D.child.id,
    name: D.child.name,
    age: D.child.age,
    avatar: D.child.avatar,
    level: D.child.level,
    xp: getWalletData().balance,
    streak: D.child.streak,
  };

  // Lắng nghe thay đổi số dư ví realtime
  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const custom = e as CustomEvent<WalletData>;
      const newBal = custom.detail ? custom.detail.balance : getWalletData().balance;
      setChildren((prev) =>
        prev.map((c) => (c._id === D.child.id || c.name === D.child.name ? { ...c, xp: newBal } : c))
      );
    };

    window.addEventListener('kidlife_wallet_update', handleWalletUpdate);
    window.addEventListener('storage', () => {
      const newBal = getWalletData().balance;
      setChildren((prev) =>
        prev.map((c) => (c._id === D.child.id || c.name === D.child.name ? { ...c, xp: newBal } : c))
      );
    });

    return () => {
      window.removeEventListener('kidlife_wallet_update', handleWalletUpdate);
    };
  }, []);

  // ── Fetch members ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setMembers(defaultMembers);
      return;
    }
    setLoadingMembers(true);
    fetch(`${API_BASE}/api/family/members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setMembers(json.data);
        } else {
          setMembers(defaultMembers);
        }
      })
      .catch(() => setMembers(defaultMembers))
      .finally(() => setLoadingMembers(false));
  }, [token]);

  // ── Fetch children ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setChildren([defaultChild]);
      return;
    }
    setLoadingChildren(true);
    fetch(`${API_BASE}/api/children`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setChildren(json.data);
        } else {
          setChildren([defaultChild]);
        }
      })
      .catch(() => setChildren([defaultChild]))
      .finally(() => setLoadingChildren(false));
  }, [token]);

  // ── Handle add child ───────────────────────────────────────────────────────────
  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setChildError(''); setChildSuccess('');
    setChildLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/children`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: childName, age: childAge ? Number(childAge) : undefined, avatar: childAvatar, pinCode: childPin }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Tạo hồ sơ bé thất bại');
      setChildren((prev) => [...prev, json.data]);
      setChildSuccess(`Đã tạo hồ sơ cho bé ${childName}!`);
      setChildName(''); setChildAge(''); setChildPin(''); setChildAvatar('🧒');
      setTimeout(() => { setShowChildModal(false); setChildSuccess(''); }, 1800);
    } catch (err: any) {
      setChildError(err.message);
    } finally {
      setChildLoading(false);
    }
  };

  // ── Handle invite ──────────────────────────────────────────────────────────
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteSuccess('');
    setInviteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/family/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: invitePhone, role: inviteRole }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Gửi lời mời thất bại');
      setInviteSuccess(`Đã gửi lời mời đến SĐT ${invitePhone}!`);
      setMembers((prev) => [...prev, json.data]);
      setInvitePhone('');
      setTimeout(() => { setShowModal(false); setInviteSuccess(''); }, 1800);
    } catch (err: any) {
      setInviteError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  // ── Handle change password ────────────────────────────────────────────────
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPwError('');
    setPwSuccess('');
    setPwLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Đổi mật khẩu thất bại');
      setPwSuccess('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  // ── Handle logout ──────────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Tài khoản phụ huynh ⚙️</h1>
          <p className="page-subtitle">Quản lý thông tin cá nhân và cài đặt</p>
        </div>
      </div>

      <div className="web-grid-2-1">
        {/* Left column */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Profile card */}
          <div className="kl-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--kl-primary-soft)', display: 'grid', placeItems: 'center', fontSize: 42 }}>
              {D.parent.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{user?.fullName || D.parent.name}</div>
              <div style={{ color: 'var(--kl-muted)', fontSize: 12, marginTop: 4 }}>
                {user?.email || D.parent.email} • Quyền {user?.role || D.parent.role}
              </div>
              <button className="kl-badge" style={{ background: 'var(--kl-primary-soft)', color: 'var(--kl-primary)', marginTop: 10 }}>
                <IoPencil size={11} /> Chỉnh sửa thông tin
              </button>
            </div>
          </div>

          {/* ── Section: Đồng quản lý gia đình ────────────────────────────── */}
          <div className="kl-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IoPeopleOutline size={20} color="var(--kl-primary)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Đồng quản lý gia đình</h2>
              </div>
              {canInviteFamily && (
                <button
                  id="family-invite-btn"
                  className="kl-btn kl-btn-primary"
                  style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5 }}
                  onClick={() => { setShowModal(true); setInviteError(''); setInviteSuccess(''); }}
                >
                  <IoPersonAddOutline size={14} /> Mời thành viên
                </button>
              )}
            </div>

            {/* Error */}
            {membersError && (
              <p style={{ color: 'var(--kl-red)', fontSize: 12, marginBottom: 12 }}>⚠️ {membersError}</p>
            )}

            {/* Loading */}
            {loadingMembers ? (
              <p style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Đang tải...</p>
            ) : members.length === 0 ? (
              <p style={{ color: 'var(--kl-muted)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
                Chưa có thành viên nào. {canInviteFamily ? 'Hãy mời thêm!' : ''}
              </p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {members.map((m) => {
                  const st = STATUS_LABEL[m.status];
                  return (
                    <div
                      key={m._id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 12,
                        background: 'var(--kl-bg-soft)', border: '1px solid var(--kl-border)',
                      }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--kl-primary-soft)', display: 'grid', placeItems: 'center', fontSize: 18 }}>
                        {m.role === 'grandparent' ? '👴' : '👨‍👩‍👧'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>
                          {m.userId?.fullName || m.phone}
                        </div>
                        <div style={{ color: 'var(--kl-muted)', fontSize: 11, marginTop: 2 }}>
                          {m.phone} • {ROLE_LABEL[m.role]}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 10px',
                        borderRadius: 20, background: st.bg, color: st.color,
                      }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Section: Tài khoản trẻ em ────────────────────── */}
          <div className="kl-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <IoPersonOutline size={20} color="var(--kl-primary)" />
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>Tài khoản trẻ em ({children.length} bé)</h2>
              </div>
              <button
                id="add-child-btn"
                className="kl-btn kl-btn-primary"
                style={{ fontSize: 12, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={() => { setShowChildModal(true); setChildError(''); setChildSuccess(''); }}
              >
                <IoPersonAddOutline size={14} /> Thêm bé
              </button>
            </div>

            {loadingChildren ? (
              <p style={{ color: 'var(--kl-muted)', fontSize: 13 }}>Đang tải...</p>
            ) : children.length === 0 ? (
              <p style={{ color: 'var(--kl-muted)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>Chưa có hồ sơ bé nào. Hãy thêm bé đầu tiên!</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {children.map((child) => (
                  <div key={child._id} className="kl-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, cursor: 'pointer', border: '1px solid var(--kl-border)' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--kl-orange-soft)', display: 'grid', placeItems: 'center', fontSize: 26 }}>
                      {child.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>Bé {child.name}</div>
                      <div style={{ color: 'var(--kl-muted)', fontSize: 11, marginTop: 3 }}>
                        {child.age ? `${child.age} tuổi  •  ` : ''}Cấp {child.level}  •  {child.xp.toLocaleString()} XP
                      </div>
                    </div>
                    <IoChevronForward size={18} color="var(--kl-primary)" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Menu */}
        <div className="kl-card" style={{ padding: '4px 16px' }}>
          {menuItems.map((item) => (
            <button
              key={item.label}
              style={{
                display: 'flex', alignItems: 'center', width: '100%', padding: '16px 0',
                borderBottom: '1px solid var(--kl-border)', gap: 12,
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{item.label}</div>
                {item.detail && <div style={{ color: 'var(--kl-muted)', fontSize: 11, marginTop: 3 }}>{item.detail}</div>}
              </div>
              {item.isPremium && (
                <span className="kl-badge" style={{ background: 'var(--kl-lime)', color: 'var(--kl-lime-dark)' }}>Premium</span>
              )}
              <IoChevronForward size={18} color="var(--kl-muted)" />
            </button>
          ))}

          {/* ── Đổi mật khẩu ─────────────────────────────────────────────────── */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--kl-border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🔒 Đổi mật khẩu</h3>
            {pwError && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px', marginBottom: 12, color: '#DC2626', fontSize: 12 }}>⚠️ {pwError}</div>}
            {pwSuccess && <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', marginBottom: 12, color: '#16a34a', fontSize: 12 }}>✅ {pwSuccess}</div>}
            <form onSubmit={handleChangePassword}>
              <div className="kl-input-wrap" style={{ marginBottom: 10 }}>
                <input className="kl-input" type="password" placeholder="Mật khẩu cũ" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required style={{ fontSize: 13, padding: '8px 12px' }} />
              </div>
              <div className="kl-input-wrap" style={{ marginBottom: 10 }}>
                <input className="kl-input" type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} style={{ fontSize: 13, padding: '8px 12px' }} />
              </div>
              <button type="submit" className="kl-btn kl-btn-primary kl-btn-block" style={{ padding: '8px', fontSize: 13, opacity: pwLoading ? 0.7 : 1 }} disabled={pwLoading}>
                {pwLoading ? 'Đang đổi...' : 'Xác nhận đổi'}
              </button>
            </form>
          </div>

          <button
            id="account-logout-btn"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', padding: '18px 0', color: 'var(--kl-red)', fontWeight: 800, fontSize: 13 }}
          >
            <IoLogOutOutline size={19} /> Đăng xuất
          </button>
        </div>
      </div>

      {/* ── Modal Mời thành viên ─────────────────────────────────────────────── */}
      {showModal && (
        <div
          id="family-modal-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="kl-card" style={{ width: '100%', maxWidth: 420, padding: 28, position: 'relative' }}>
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <IoCloseOutline size={22} color="var(--kl-muted)" />
            </button>

            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>👨‍👩‍👧 Mời thành viên gia đình</h2>
            <p style={{ color: 'var(--kl-muted)', fontSize: 12, marginBottom: 20 }}>
              Nhập số điện thoại và chọn vai trò cho thành viên mới.
            </p>

            {inviteError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#DC2626', fontSize: 13 }}>
                ⚠️ {inviteError}
              </div>
            )}
            {inviteSuccess && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#16a34a', fontSize: 13 }}>
                ✅ {inviteSuccess}
              </div>
            )}

            <form onSubmit={handleInvite}>
              <div className="kl-input-wrap">
                <label className="kl-input-label">Số điện thoại</label>
                <input
                  id="invite-phone-input"
                  className="kl-input"
                  type="tel"
                  placeholder="09xxxxxxxx"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  required
                />
              </div>

              <div className="kl-input-wrap">
                <label className="kl-input-label">Vai trò</label>
                <select
                  id="invite-role-select"
                  className="kl-input"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'parent' | 'grandparent')}
                >
                  <option value="parent">Phụ huynh (Bố/Mẹ) — Full quyền</option>
                  <option value="grandparent">Ông/Bà — Chỉ xem & tặng quà</option>
                </select>
              </div>

              <button
                id="invite-submit-btn"
                type="submit"
                className="kl-btn kl-btn-primary kl-btn-block"
                style={{ marginTop: 8, opacity: inviteLoading ? 0.7 : 1 }}
                disabled={inviteLoading}
              >
                {inviteLoading ? 'Đang gửi lời mời...' : 'Gửi lời mời'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Thêm bé ──────────────────────────────────────────────────── */}
      {showChildModal && (
        <div
          id="child-modal-overlay"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowChildModal(false); }}
        >
          <div className="kl-card" style={{ width: '100%', maxWidth: 440, padding: 28, position: 'relative' }}>
            <button onClick={() => setShowChildModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
              <IoCloseOutline size={22} color="var(--kl-muted)" />
            </button>
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>🧒 Thêm hồ sơ bé</h2>
            <p style={{ color: 'var(--kl-muted)', fontSize: 12, marginBottom: 20 }}>Điền thông tin để tạo tài khoản cho bé.</p>

            {childError && <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#DC2626', fontSize: 13 }}>⚠️ {childError}</div>}
            {childSuccess && <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#16a34a', fontSize: 13 }}>✅ {childSuccess}</div>}

            <form onSubmit={handleAddChild}>
              {/* Avatar picker */}
              <div className="kl-input-wrap">
                <label className="kl-input-label">Chọn avatar</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {AVATAR_OPTIONS.map((av) => (
                    <button key={av} type="button" onClick={() => setChildAvatar(av)}
                      style={{ fontSize: 24, width: 44, height: 44, borderRadius: 12, border: childAvatar === av ? '2px solid var(--kl-primary)' : '2px solid transparent', background: childAvatar === av ? 'var(--kl-primary-soft)' : '#f5f5f5', cursor: 'pointer' }}>
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="kl-input-wrap">
                <label className="kl-input-label">Tên bé</label>
                <input id="child-name-input" className="kl-input" type="text" placeholder="Nguyễn Văn An..." value={childName} onChange={(e) => setChildName(e.target.value)} required />
              </div>

              <div className="kl-input-wrap">
                <label className="kl-input-label">Tuổi <span style={{ color: 'var(--kl-muted)', fontWeight: 400 }}>(tuỳ chọn)</span></label>
                <input id="child-age-input" className="kl-input" type="number" placeholder="8" min={1} max={18} value={childAge} onChange={(e) => setChildAge(e.target.value)} />
              </div>

              <div className="kl-input-wrap">
                <label className="kl-input-label">Mã PIN (4 chữ số)</label>
                <input id="child-pin-input" className="kl-input" type="password" inputMode="numeric" maxLength={4} placeholder="****" value={childPin} onChange={(e) => setChildPin(e.target.value.replace(/\D/g, '').slice(0, 4))} required />
              </div>

              <button id="child-submit-btn" type="submit" className="kl-btn kl-btn-primary kl-btn-block" style={{ marginTop: 8, opacity: childLoading ? 0.7 : 1 }} disabled={childLoading}>
                {childLoading ? 'Đang tạo...' : 'Tạo hồ sơ bé'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
