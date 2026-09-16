import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoLogOutOutline, IoShareSocial } from 'react-icons/io5';
import ViralMilestoneModal from '@/modules/child/components/ViralMilestoneModal';

const D = MOCK_KIDLIFE_DATA;

export default function ChildAccountPage() {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Hồ Sơ Của Bé 🧒🏻</h1>
          <p className="page-subtitle">Hành trình và thành tích của con</p>
        </div>
      </div>

      <div className="web-grid-2-1">
        {/* Left: Profile + Stats */}
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Profile Card */}
          <div
            className="kl-card"
            style={{
              textAlign: 'center',
              padding: 28,
              borderRadius: 24,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FF 100%)',
            }}
          >
            <div style={{ width: 90, height: 90, borderRadius: 45, background: '#E7EBFF', display: 'grid', placeItems: 'center', fontSize: 48, margin: '0 auto 14px' }}>
              {D.child.avatar}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{D.child.name}</h2>
            <p style={{ fontSize: 14, color: 'var(--kl-muted)', marginTop: 4 }}>
              {D.child.age} tuổi • Cấp độ {D.child.level} Nhà Thám Hiểm
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 24 }}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '1px solid var(--kl-border)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--kl-primary)' }}>{D.child.xp}</div>
                <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Tổng XP</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '1px solid var(--kl-border)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--kl-orange)' }}>{D.child.streak}</div>
                <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Ngày Streak</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '1px solid var(--kl-border)' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--kl-green)' }}>{D.child.completedTasksCount}</div>
                <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Nhiệm vụ</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gap: 10 }}>
            <button
              onClick={() => navigate('/role')}
              className="kl-card"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 18, cursor: 'pointer', border: '1px solid var(--kl-border)', width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22 }}>🔄</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>Chuyển đổi chế độ vai trò</div>
                  <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Chuyển sang Phụ huynh hoặc Admin</div>
                </div>
              </div>
              <span style={{ fontSize: 20, color: 'var(--kl-muted)' }}>›</span>
            </button>

            <button
              onClick={() => navigate('/login')}
              className="kl-card"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 18, cursor: 'pointer', border: '1px solid #FFE8EC', background: '#FFF8F8', width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IoLogOutOutline size={22} color="var(--kl-pink)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-pink)' }}>Đăng xuất</div>
                  <div style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Thoát phiên đăng nhập</div>
                </div>
              </div>
              <span style={{ fontSize: 20, color: 'var(--kl-pink)' }}>›</span>
            </button>
          </div>
        </div>

        {/* Right: Badges */}
        <div className="kl-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
              Bộ sưu tập huy hiệu 🏅
            </h3>
            <span style={{ fontSize: 13, color: 'var(--kl-primary)', fontWeight: 700 }}>
              {D.badges.filter(b => !b.locked).length}/{D.badges.length} đã mở
            </span>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {D.badges.map((b) => (
              <div
                key={b.id}
                onClick={() => !b.locked && setSelectedBadge(b)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 14px',
                  borderRadius: 16,
                  background: b.locked ? '#F8F9FA' : '#F0F3FF',
                  border: b.locked ? '1px dashed var(--kl-border)' : '1px solid var(--kl-primary-soft)',
                  opacity: b.locked ? 0.6 : 1,
                  cursor: b.locked ? 'default' : 'pointer',
                }}
              >
                <span style={{ fontSize: 36 }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: b.locked ? 'var(--kl-muted)' : 'var(--kl-primary)', marginTop: 2 }}>
                    {b.locked ? '🔒 Chưa mở' : '✅ Đã đạt (Bấm để tạo thiệp vinh danh)'}
                  </div>
                </div>
                {!b.locked && (
                  <button className="kl-btn kl-btn-sm" style={{ background: 'var(--kl-purple)', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IoShareSocial size={14} /> Thiệp QR
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Render Viral Milestone Modal */}
      {selectedBadge && (
        <ViralMilestoneModal
          badge={selectedBadge}
          childName={D.child.name}
          onClose={() => setSelectedBadge(null)}
        />
      )}
    </div>
  );
}
