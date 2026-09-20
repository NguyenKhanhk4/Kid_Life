import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoStarSharp,
  IoFlameSharp,
  IoMedalSharp,
  IoMapOutline,
  IoArrowForward,
  IoGift,
  IoCard,
  IoCheckmarkCircle,
  IoTimeOutline,
} from 'react-icons/io5';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { getTasks, TaskItem } from '@/shared/utils/taskStorage';
import { getWalletData, WalletData } from '@/shared/utils/walletStorage';

const D = MOCK_KIDLIFE_DATA;

export default function ParentHomePage() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(D.children[0]);
  const [showChildPicker, setShowChildPicker] = useState(false);

  const [tasks, setTasks] = useState<TaskItem[]>(getTasks);
  const [wallet, setWallet] = useState<WalletData>(getWalletData);

  useEffect(() => {
    const handleTasksSync = (e: Event) => {
      const custom = e as CustomEvent<TaskItem[]>;
      setTasks(custom.detail || getTasks());
    };

    const handleWalletSync = (e: Event) => {
      const custom = e as CustomEvent<WalletData>;
      setWallet(custom.detail || getWalletData());
    };

    window.addEventListener('kidlife_tasks_update', handleTasksSync);
    window.addEventListener('kidlife_wallet_update', handleWalletSync);
    window.addEventListener('focus', () => {
      setTasks(getTasks());
      setWallet(getWalletData());
    });
    window.addEventListener('storage', () => {
      setTasks(getTasks());
      setWallet(getWalletData());
    });

    return () => {
      window.removeEventListener('kidlife_tasks_update', handleTasksSync);
      window.removeEventListener('kidlife_wallet_update', handleWalletSync);
    };
  }, []);

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const totalCount = tasks.length || 1;
  const completionPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginBottom: 4 }}>Xin chào phụ huynh! 👋</p>
          <h1>
            Dashboard — Bé {selectedChild.name}
            <button
              onClick={() => setShowChildPicker(!showChildPicker)}
              style={{
                fontSize: 14,
                color: 'var(--kl-primary)',
                fontWeight: 700,
                marginLeft: 12,
                verticalAlign: 'middle',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ▼ Đổi bé
            </button>
          </h1>
        </div>
        <div className="web-page-header-actions">
          <span className="kl-badge" style={{ background: '#EAF0FF', color: 'var(--kl-primary)' }}>
            🔥 12 ngày liên tiếp
          </span>
        </div>
      </div>

      {/* Child Picker */}
      {showChildPicker && (
        <div className="kl-card" style={{ marginBottom: 20, maxWidth: 400, animation: 'slideUp 0.2s ease' }}>
          <p style={{ fontSize: 14, color: 'var(--kl-primary-dark)', marginBottom: 12, fontWeight: 700 }}>
            Chọn tài khoản con khác
          </p>
          {D.children.map((child) => (
            <button
              key={child.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                width: '100%',
                borderBottom: '1px solid #F0F2F8',
                background: 'none',
                borderTop: 'none',
                borderLeft: 'none',
                borderRight: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedChild(child);
                setShowChildPicker(false);
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  background: '#E8EDFC',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 18,
                }}
              >
                {child.avatar}
              </div>
              <span style={{ fontWeight: 700, color: 'var(--kl-primary-dark)' }}>{child.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Top Grid: Overview + Quick Actions */}
      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Blue Overview Card */}
        <div className="parent-overview-card">
          <div className="xp-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <IoStarSharp size={16} color="#FFD233" />
              <span style={{ fontWeight: 'bold', fontSize: 14 }}> {wallet.balance.toLocaleString()} XP</span>
            </div>
            <span style={{ fontSize: 12, opacity: 0.8 }}>
              Cấp {D.child.level} → Cấp {D.child.level + 1}: {D.child.xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(100, (wallet.balance / D.child.xpToNextLevel) * 100)}%`,
              }}
            />
          </div>
          <div className="stats-row">
            <div className="stat-box">
              <IoFlameSharp size={24} color="#FF6B6B" />
              <div className="stat-num">12</div>
              <div className="stat-lbl">Ngày liên tiếp</div>
            </div>
            <div className="stat-box">
              <IoStarSharp size={24} color="#FFD233" />
              <div className="stat-num">{completedCount * 15 + 18}</div>
              <div className="stat-lbl">Sao tuần này</div>
            </div>
            <div className="stat-box">
              <IoMedalSharp size={24} color="#FFA900" />
              <div className="stat-num">3</div>
              <div className="stat-lbl">Huy hiệu mới</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="kl-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 2 }}>
            Thao tác nhanh
          </h3>
          <button
            className="quick-action-btn"
            style={{
              background: 'rgba(142,84,233,0.08)',
              color: '#8E54E9',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 12,
              padding: 10,
            }}
            onClick={() => navigate('/parent/ai-analytics')}
          >
            <span style={{ fontSize: 18 }}>📊</span>
            <span>Báo cáo kỹ năng AI</span>
          </button>
          <button
            className="quick-action-btn"
            style={{
              background: 'rgba(255,71,133,0.08)',
              color: '#FF4785',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 12,
              padding: 10,
            }}
            onClick={() => navigate('/parent/stories')}
          >
            <span style={{ fontSize: 18 }}>🎤</span>
            <span>AI Voice Studio</span>
          </button>
          <button
            className="quick-action-btn"
            style={{
              background: 'rgba(43,68,232,0.08)',
              color: '#2B44E8',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 12,
              padding: 10,
            }}
            onClick={() => navigate('/parent/memory-lane')}
          >
            <span style={{ fontSize: 18 }}>📷</span>
            <span>Nhật ký Memory Lane</span>
          </button>
          <button
            className="quick-action-btn"
            style={{
              background: 'rgba(255,169,0,0.08)',
              color: '#FFA900',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 12,
              padding: 10,
            }}
            onClick={() => navigate('/parent/approval')}
          >
            <IoGift size={18} />
            <span>Duyệt thưởng & Điều ước</span>
          </button>
          <button
            className="quick-action-btn"
            style={{
              background: 'rgba(0,196,140,0.08)',
              color: '#00C48C',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              gap: 12,
              padding: 10,
            }}
            onClick={() => navigate('/parent/bank')}
          >
            <IoCard size={18} />
            <span>Ngân hàng ảo & Heo đất</span>
          </button>
        </div>
      </div>

      {/* Middle Grid: Tasks + Progress */}
      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Today's Tasks */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <IoMapOutline size={24} color="var(--kl-primary)" />
              <h2 className="section-title">Nhiệm vụ hôm nay</h2>
            </div>
            <span className="kl-badge" style={{ background: '#EAF0FF', color: 'var(--kl-primary)', fontWeight: 700 }}>
              {completedCount}/{tasks.length} hoàn thành
            </span>
          </div>

          <div className="message-card">
            <div className="msg-header">
              <span style={{ fontSize: 20 }}>👨‍👩‍👧</span>
              <span className="msg-title">Nhắn cho ba mẹ</span>
            </div>
            <p className="msg-body">
              {completedCount > 0
                ? `Hôm nay bé Minh Anh đã hoàn thành ${completedCount} nhiệm vụ, tiến độ đạt ${completionPercent}%. Hãy khen ngợi và động viên bé nhé! 🌸`
                : `Hôm nay bé có ${tasks.length} nhiệm vụ đang chờ thực hiện. Ba mẹ hãy nhắc nhở bé rèn luyện tính tự lập nhé! 💪`}
            </p>
          </div>

          <div className="task-list">
            {tasks.map((task) => {
              const isDone = task.status === 'done';
              const isSubmitted = task.status === 'submitted';
              return (
                <div
                  key={task.id}
                  onClick={() => navigate('/parent/tasks')}
                  className="task-item"
                  style={{
                    background: isDone ? 'var(--kl-lime)' : isSubmitted ? '#FEF3C7' : '#E8EDFC',
                    cursor: 'pointer',
                  }}
                >
                  <div className="task-icon-box">{task.icon}</div>
                  <div className="task-info">
                    <div
                      className="task-title"
                      style={{
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--kl-muted)' : 'inherit',
                      }}
                    >
                      {task.title}
                    </div>
                    <div className="task-rewards">
                      <span className="task-reward-pill">
                        {isDone ? (
                          <IoCheckmarkCircle size={14} color="var(--kl-green)" />
                        ) : isSubmitted ? (
                          <IoTimeOutline size={14} color="#B45309" />
                        ) : (
                          <IoStarSharp size={12} color="var(--kl-orange)" />
                        )}
                        <span style={{ color: isSubmitted ? '#B45309' : 'var(--kl-primary)' }}>
                          {isSubmitted ? 'Chờ duyệt' : isDone ? 'Đã xong' : task.category}
                        </span>
                      </span>
                      <span className="task-reward-pill" style={{ color: 'var(--kl-purple)' }}>
                        +{task.rewardXP} XP
                      </span>
                    </div>
                  </div>
                  <button className="task-arrow" title="Xem chi tiết">
                    <IoArrowForward size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress Report */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <span style={{ fontSize: 20 }}>📊</span>
              <h2 className="section-title">Báo cáo tiến độ</h2>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-content">
              <div className="circular-progress">
                <div>
                  <strong>{completionPercent}%</strong>
                  <small>hôm nay</small>
                </div>
              </div>
              <div className="bar-charts">
                {[
                  { label: 'Giao tiếp', value: 72, color: 'var(--kl-purple)' },
                  { label: 'Tự lập', value: Math.min(100, Math.max(30, completionPercent)), color: 'var(--kl-green)' },
                  { label: 'Cảm xúc', value: 88, color: 'var(--kl-red)' },
                  { label: 'Sáng tạo', value: 40, color: 'var(--kl-orange)' },
                ].map((bar) => (
                  <div className="bar-chart-row" key={bar.label}>
                    <div className="bar-header">
                      <span className="bar-label">{bar.label}</span>
                      <span className="bar-val" style={{ color: bar.color }}>
                        {bar.value}%
                      </span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${bar.value}%`, background: bar.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="trophy-banner">
              <span style={{ fontSize: 24 }}>🏆</span>
              <div>
                <div className="trophy-banner-title">Tiến độ hôm nay</div>
                <div className="trophy-banner-sub">
                  Bé đã hoàn thành {completedCount}/{tasks.length} nhiệm vụ — Đạt {completionPercent}% mục tiêu
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="section-header">
        <div className="section-title-row">
          <span style={{ fontSize: 20 }}>🏅</span>
          <h2 className="section-title">Huy hiệu của bé</h2>
        </div>
      </div>
      <div className="badges-grid" style={{ marginBottom: 24 }}>
        {D.badges.map((badge) => (
          <div className="badge-item" key={badge.id}>
            <div className="badge-icon-box" style={{ background: badge.bgColor }}>
              <span style={{ fontSize: 28, opacity: badge.locked ? 0.4 : 1 }}>{badge.icon}</span>
              {badge.locked && <span className="badge-lock">🔒</span>}
            </div>
            <span className="badge-name">{badge.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
