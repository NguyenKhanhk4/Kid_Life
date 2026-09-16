import { useNavigate } from 'react-router-dom';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoChevronForward, IoPencil, IoLogOutOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

const menuItems = [
  { icon: '💳', label: 'Gói KidLife Premium', detail: 'Đang hoạt động', isPremium: true },
  { icon: '📈', label: 'Báo cáo kỹ năng AI', detail: 'Xem Radar chart & AI đánh giá' },
  { icon: '👨‍👩‍👧‍👦', label: 'Đồng quản lý gia đình', detail: 'Mời thành viên, phân quyền RBAC' },
  { icon: '📷', label: 'Nhật ký hành trình', detail: 'Kho ảnh, AI Video Recap & Sách ảnh' },
  { icon: '🏦', label: 'Ngân hàng ảo & Vé phạt', detail: 'Cài đặt tiết kiệm & quản lý kỷ luật' },
  { icon: '🎤', label: 'Thu âm giọng đọc (Voice Clone)', detail: 'Nhân bản giọng đọc truyện cho bé' },
  { icon: '🎁', label: 'Phần thưởng & ví', detail: 'Quản lý phần thưởng của bé' },
  { icon: '🔔', label: 'Thông báo', detail: '' },
  { icon: '❓', label: 'Trợ giúp & hỗ trợ', detail: '' },
];

export default function ParentAccountPage() {
  const navigate = useNavigate();

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
        {/* Left: Profile + Children */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Profile */}
          <div className="kl-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: 24, background: 'var(--kl-primary-soft)', display: 'grid', placeItems: 'center', fontSize: 42 }}>
              {D.parent.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{D.parent.name}</div>
              <div style={{ color: 'var(--kl-muted)', fontSize: 12, marginTop: 4 }}>
                {D.parent.email} • Quyền {D.parent.role}
              </div>
              <button className="kl-badge" style={{ background: 'var(--kl-primary-soft)', color: 'var(--kl-primary)', marginTop: 10 }}>
                <IoPencil size={11} /> Chỉnh sửa thông tin
              </button>
            </div>
          </div>

          {/* Managed Children */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Tài khoản trẻ em (3 bé)</h2>
              <span style={{ color: 'var(--kl-primary)', fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>+ Thêm bé</span>
            </div>

            <div className="kl-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer' }}>
              <div style={{ width: 52, height: 52, borderRadius: 18, background: 'var(--kl-orange-soft)', display: 'grid', placeItems: 'center', fontSize: 30 }}>
                {D.child.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15 }}>Bé {D.child.name}</div>
                <div style={{ color: 'var(--kl-muted)', fontSize: 12, marginTop: 4 }}>
                  {D.child.age} tuổi  •  Cấp {D.child.level}  •  {D.child.xp.toLocaleString()} XP
                </div>
              </div>
              <IoChevronForward size={20} color="var(--kl-primary)" />
            </div>
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
                <span className="kl-badge" style={{ background: 'var(--kl-lime)', color: 'var(--kl-lime-dark)' }}>
                  Premium
                </span>
              )}
              <IoChevronForward size={18} color="var(--kl-muted)" />
            </button>
          ))}

          {/* Logout */}
          <button
            onClick={() => navigate('/login')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', padding: '18px 0', color: 'var(--kl-red)', fontWeight: 800, fontSize: 13 }}
          >
            <IoLogOutOutline size={19} />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
