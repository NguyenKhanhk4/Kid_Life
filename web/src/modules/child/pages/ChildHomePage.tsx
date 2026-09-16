import { useNavigate } from 'react-router-dom';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoStarSharp, IoFlame } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

const QUICK_ACTIONS = [
  { emoji: '💳', label: 'Ví điểm', path: '/child/wallet' },
  { emoji: '🐉', label: 'Thú cưng', path: '/child/pet' },
  { emoji: '📚', label: 'Học bài', path: '/child/lessons' },
  { emoji: '🌙', label: 'Kể chuyện', path: '/child/stories' },
  { emoji: '🧞‍♂️', label: 'Điều ước', path: '/child/wishes' },
];

export default function ChildHomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <p style={{ fontSize: 14, color: 'var(--kl-muted)', marginBottom: 4 }}>Chào Minh Anh! 🎉</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Trang chủ của bé
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 16, fontWeight: 700, color: 'var(--kl-primary)', background: 'var(--kl-primary-soft)', padding: '4px 12px', borderRadius: 20 }}>
              <IoStarSharp size={14} color="var(--kl-yellow)" />
              {D.child.xp.toLocaleString()} XP
            </span>
          </h1>
        </div>
        <span className="kl-badge" style={{ background: '#FFF5EB', color: '#E85D04', fontSize: 13, padding: '6px 14px' }}>
          🔥 {D.child.streak} ngày streak
        </span>
      </div>

      {/* Top Grid: Pet + Quick Actions */}
      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Pet mascot card */}
        <div className="kl-card" style={{ textAlign: 'center', padding: 32, background: 'linear-gradient(135deg, #E9EDFF 0%, #F0E9FF 100%)' }}>
          <div style={{ fontSize: 80, marginBottom: 12 }}>{D.pet.emoji}</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--kl-primary)' }}>{D.pet.name}</div>
          <div style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 6 }}>
            Cấp {D.pet.level} • {D.pet.stageName} • Mood: {D.pet.mood} 😊
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <IoFlame size={18} color="var(--kl-orange)" />
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--kl-orange)' }}>
              Streak: {D.pet.streak}/14 ngày
            </span>
          </div>
          <button
            className="kl-btn kl-btn-primary kl-btn-sm"
            style={{ marginTop: 16 }}
            onClick={() => navigate('/child/pet')}
          >
            🐉 Chăm sóc thú cưng
          </button>
        </div>

        {/* Quick Actions */}
        <div className="kl-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>Menu nhanh ⚡</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="kl-card"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  cursor: 'pointer', width: '100%', border: '1px solid var(--kl-border)',
                }}
              >
                <span style={{ fontSize: 26 }}>{action.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Tasks + Streak */}
      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Today's Tasks */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <span style={{ fontSize: 20 }}>📋</span>
              <h2 className="section-title">Nhiệm vụ hôm nay</h2>
            </div>
            <span className="kl-badge" style={{ background: 'var(--kl-primary-soft)', color: 'var(--kl-primary)' }}>
              {D.todayTasks.filter(t => t.status === 'done').length}/{D.todayTasks.length}
            </span>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {D.todayTasks.map((task) => (
              <div
                key={task.id}
                className="kl-card"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer',
                  borderLeft: `4px solid ${task.status === 'done' ? 'var(--kl-green)' : task.status === 'in_progress' ? 'var(--kl-orange)' : 'var(--kl-border)'}`,
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: task.status === 'done' ? 'var(--kl-green-soft)' : '#F0F2FA', display: 'grid', placeItems: 'center', fontSize: 24, flexShrink: 0 }}>
                  {task.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--kl-muted)' : 'var(--kl-text)' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--kl-muted)', marginTop: 3 }}>
                    {task.time} • {task.xp}
                  </div>
                </div>
                {task.status === 'done' && <span style={{ color: 'var(--kl-green)', fontSize: 20 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Streak Calendar */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <IoFlame size={20} color="var(--kl-orange)" />
              <h2 className="section-title">Chuỗi học tập</h2>
            </div>
          </div>

          <div className="kl-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => {
                const isActive = i < 5;
                return (
                  <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--kl-muted)', fontWeight: 600 }}>{day}</span>
                    <div style={{
                      width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center',
                      background: isActive ? '#FF8A00' : '#F8F9FD',
                      fontSize: 18,
                    }}>
                      {isActive ? '🔥' : <span style={{ color: '#D1D5E4' }}>-</span>}
                    </div>
                    {i === 4 && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#00C48C' }} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
