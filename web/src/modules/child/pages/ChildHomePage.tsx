import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoStarSharp, IoFlame } from 'react-icons/io5';
import { getWalletData, WalletData } from '@/shared/utils/walletStorage';
import { getTasks, TaskItem } from '@/shared/utils/taskStorage';
import { usePetSummary } from '@/features/pet/hooks/usePet';
import { getSpeciesConfig, getStageImageUrl } from '@/features/pet/config/species.config';
import type { PetMood } from '@/features/pet/types';

const MOOD_LABEL: Record<PetMood, string> = {
  excited: 'Siêu vui 🤩',
  happy: 'Vui vẻ 😊',
  neutral: 'Bình thường 🙂',
  sad: 'Đang đói 🥺',
};

const QUICK_ACTIONS = [
  { emoji: '🎬', label: 'Học bài Video', path: '/child/video-lessons' },
  { emoji: '🧠', label: 'Kiểm tra trí nhớ', path: '/child/quiz-library' },
  { emoji: '💳', label: 'Ví điểm', path: '/child/wallet' },
  { emoji: '🐉', label: 'Thú cưng', path: '/child/pet' },
  { emoji: '🌙', label: 'Kể chuyện', path: '/child/stories' },
  { emoji: '🧞‍♂️', label: 'Điều ước', path: '/child/wishes' },
];

export default function ChildHomePage() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState<WalletData>(getWalletData);
  const [tasks, setTasks] = useState<TaskItem[]>(getTasks);
  const { child, pet, loaded: petLoaded } = usePetSummary();
  const petSpecies = pet ? getSpeciesConfig(pet.speciesId) : undefined;

  useEffect(() => {
    const handleWalletUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WalletData>;
      if (customEvent.detail) {
        setWallet(customEvent.detail);
      } else {
        setWallet(getWalletData());
      }
    };

    const handleTasksUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<TaskItem[]>;
      if (customEvent.detail) {
        setTasks(customEvent.detail);
      } else {
        setTasks(getTasks());
      }
    };

    window.addEventListener('kidlife_wallet_update', handleWalletUpdate);
    window.addEventListener('kidlife_tasks_update', handleTasksUpdate);
    window.addEventListener('focus', () => {
      setWallet(getWalletData());
      setTasks(getTasks());
    });
    window.addEventListener('storage', () => {
      setWallet(getWalletData());
      setTasks(getTasks());
    });

    return () => {
      window.removeEventListener('kidlife_wallet_update', handleWalletUpdate);
      window.removeEventListener('kidlife_tasks_update', handleTasksUpdate);
    };
  }, []);

  const completedCount = tasks.filter((t) => t.status === 'done').length;

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <p style={{ fontSize: 14, color: 'var(--kl-muted)', marginBottom: 4 }}>Chào {child?.name ?? 'bé'}! 🎉</p>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Trang chủ của bé
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--kl-primary)',
                background: 'var(--kl-primary-soft)',
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              <IoStarSharp size={14} color="var(--kl-yellow)" />
              {wallet.balance.toLocaleString()} XP
            </span>
          </h1>
        </div>
        <span
          className="kl-badge"
          style={{ background: '#FFF5EB', color: '#E85D04', fontSize: 13, padding: '6px 14px' }}
        >
          🔥 {pet?.streakDays ?? child?.streak ?? 0} ngày streak
        </span>
      </div>

      {/* Top Grid: Pet + Quick Actions */}
      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Pet mascot card */}
        <div
          className="kl-card"
          style={{ textAlign: 'center', padding: 32, background: 'linear-gradient(135deg, #E9EDFF 0%, #F0E9FF 100%)' }}
        >
          {pet && petSpecies ? (
            <>
              <img
                src={getStageImageUrl(petSpecies, pet.stage)}
                alt={petSpecies.name}
                style={{ width: 120, height: 120, objectFit: 'contain', marginBottom: 12 }}
              />
              <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--kl-primary)' }}>{petSpecies.name}</div>
              <div style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 6 }}>
                Giai đoạn {pet.stage}/{pet.maxStage} • {MOOD_LABEL[pet.mood]} • còn {pet.feedsLeftToday} lượt ăn hôm nay
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <IoFlame size={18} color="var(--kl-orange)" />
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--kl-orange)' }}>
                  Streak: {pet.streakDays} ngày
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 80, marginBottom: 12 }}>🐣</div>
              <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--kl-primary)' }}>
                {petLoaded ? 'Bé chưa có thú cưng' : 'Đang tải thú cưng…'}
              </div>
            </>
          )}
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
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>
            Menu nhanh ⚡
          </h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="kl-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  width: '100%',
                  border: '1px solid var(--kl-border)',
                }}
              >
                <span style={{ fontSize: 26 }}>{action.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>
                  {action.label}
                </span>
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
              {completedCount}/{tasks.length}
            </span>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {tasks.map((task) => {
              const isDone = task.status === 'done';
              const isSubmitted = task.status === 'submitted';
              const isInProgress =
                task.status === 'in_progress' ||
                isSubmitted ||
                (task.subtasks.some((s) => s.done) && !isDone);
              const isTodo = !isDone && !isInProgress;

              const cardBg = isDone ? '#E6F9EE' : isInProgress ? '#FEF9C3' : '#FFFFFF';
              const cardBorder = isDone ? '1.5px solid #10B981' : isInProgress ? '1.5px solid #F59E0B' : '1px solid #E2E8F0';
              const titleColor = isDone ? '#065F46' : isInProgress ? '#92400E' : 'var(--kl-primary-dark)';
              const metaColor = isDone ? '#047857' : isInProgress ? '#B45309' : 'var(--kl-muted)';

              return (
                <div
                  key={task.id}
                  onClick={() => navigate('/child/tasks')}
                  className="kl-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 16,
                    cursor: 'pointer',
                    background: cardBg,
                    border: cardBorder,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: isDone ? '#D1FAE5' : isInProgress ? '#FEF3C7' : '#F0F2FA',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {task.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: titleColor,
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: metaColor, marginTop: 3 }}>
                      {task.time} • {task.xp}
                    </div>
                  </div>

                  {isDone && (
                    <span
                      style={{
                        background: '#10B981',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      ✓ Hoàn thành
                    </span>
                  )}

                  {isInProgress && !isDone && (
                    <span
                      style={{
                        background: isSubmitted ? '#F59E0B' : '#FEF08A',
                        color: isSubmitted ? '#ffffff' : '#854D0E',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 12,
                        border: isSubmitted ? 'none' : '1px solid #FCD34D',
                      }}
                    >
                      {isSubmitted ? 'Chờ duyệt ⏳' : 'Đang làm ⚡'}
                    </span>
                  )}

                  {isTodo && (
                    <span
                      style={{
                        background: '#F1F5F9',
                        color: '#64748B',
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 12,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      Chưa làm
                    </span>
                  )}
                </div>
              );
            })}
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
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        display: 'grid',
                        placeItems: 'center',
                        background: isActive ? '#FF8A00' : '#F8F9FD',
                        fontSize: 18,
                      }}
                    >
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
