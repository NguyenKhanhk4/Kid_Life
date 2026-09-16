import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoAddCircleOutline, IoCheckmarkCircle, IoTimeOutline, IoEllipseOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

type Filter = 'all' | 'done' | 'in_progress' | 'todo';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: typeof IoCheckmarkCircle }> = {
  done: { label: 'Hoàn thành', color: 'var(--kl-green)', bg: 'var(--kl-green-soft)', icon: IoCheckmarkCircle },
  in_progress: { label: 'Đang làm', color: 'var(--kl-orange)', bg: 'var(--kl-orange-soft)', icon: IoTimeOutline },
  todo: { label: 'Chưa làm', color: 'var(--kl-muted)', bg: '#F0F2FA', icon: IoEllipseOutline },
};

export default function ParentTasksPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const tasks = D.todayTasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Quản lý nhiệm vụ 📋</h1>
          <p className="page-subtitle">Tạo và theo dõi nhiệm vụ hằng ngày cho bé</p>
        </div>
        <button className="kl-btn kl-btn-primary kl-btn-sm">
          <IoAddCircleOutline size={16} />
          Tạo mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tab-bar" style={{ marginBottom: 24 }}>
        {[
          { key: 'all' as Filter, label: 'Tất cả' },
          { key: 'done' as Filter, label: 'Hoàn thành' },
          { key: 'in_progress' as Filter, label: 'Đang làm' },
          { key: 'todo' as Filter, label: 'Chưa làm' },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`filter-tab-btn ${filter === tab.key ? 'active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Cards — 2 column grid */}
      <div className="web-grid-2">
        {tasks.map((task) => {
          const s = STATUS_MAP[task.status];
          const StatusIcon = s.icon;
          const completedSubs = task.subtasks.filter(st => st.done).length;
          const totalSubs = task.subtasks.length;
          return (
            <div key={task.id} className="kl-card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: s.bg, display: 'grid', placeItems: 'center', fontSize: 28, flexShrink: 0 }}>
                  {task.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{task.title}</h3>
                    <span className="kl-badge" style={{ background: s.bg, color: s.color }}>
                      <StatusIcon size={12} /> {s.label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--kl-muted)', marginBottom: 12 }}>
                    ⏰ {task.time} &nbsp;•&nbsp; 🏷️ {task.category} &nbsp;•&nbsp; ⭐ {task.xp}
                  </p>
                  {/* Subtasks */}
                  <div style={{ background: '#FAFBFF', borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--kl-muted)', marginBottom: 8 }}>
                      Checklist ({completedSubs}/{totalSubs})
                    </div>
                    <div style={{ height: 4, background: 'var(--kl-border)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: s.color, borderRadius: 2, width: `${(completedSubs / totalSubs) * 100}%`, transition: 'width 0.4s ease' }} />
                    </div>
                    {task.subtasks.map((sub) => (
                      <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
                        {sub.done
                          ? <IoCheckmarkCircle size={18} color="var(--kl-green)" />
                          : <IoEllipseOutline size={18} color="var(--kl-border)" />
                        }
                        <span style={{ textDecoration: sub.done ? 'line-through' : 'none', color: sub.done ? 'var(--kl-muted)' : 'var(--kl-text)' }}>
                          {sub.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="web-full-span" style={{ textAlign: 'center', padding: 60, color: 'var(--kl-muted)' }}>
            <span style={{ fontSize: 48 }}>📋</span>
            <p style={{ marginTop: 12 }}>Không có nhiệm vụ nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
