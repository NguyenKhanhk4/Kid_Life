import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoAddCircleOutline,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoEllipseOutline,
  IoAlertCircleOutline,
  IoCloseOutline,
  IoTrashOutline,
  IoArrowForward,
} from 'react-icons/io5';
import {
  getTasks,
  createNewTask,
  deleteTask,
  approveTask,
  TaskItem,
} from '@/shared/utils/taskStorage';

type Filter = 'all' | 'done' | 'submitted' | 'in_progress' | 'todo';

const STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof IoCheckmarkCircle }
> = {
  done: { label: 'Hoàn thành', color: 'var(--kl-green)', bg: 'var(--kl-green-soft)', icon: IoCheckmarkCircle },
  submitted: { label: 'Chờ duyệt ⏳', color: '#B45309', bg: '#FEF3C7', icon: IoTimeOutline },
  in_progress: { label: 'Đang làm', color: 'var(--kl-orange)', bg: 'var(--kl-orange-soft)', icon: IoTimeOutline },
  todo: { label: 'Chưa làm', color: 'var(--kl-muted)', bg: '#F0F2FA', icon: IoEllipseOutline },
};

const DEFAULT_EMOJIS = ['🧸', '📚', '🧹', '🪑', '🦷', '🧺', '🏃', '🎨', '🎯', '⭐', '🛌', '🍽️'];
const DEFAULT_CATEGORIES = ['Kỹ năng', 'Thói quen', 'Học tập', 'Giúp đỡ gia đình', 'Thể chất', 'Khác'];

export default function ParentTasksPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');
  const [tasks, setTasks] = useState<TaskItem[]>(getTasks);

  // Modal tạo mới
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Kỹ năng');
  const [rewardXP, setRewardXP] = useState(50);
  const [time, setTime] = useState('08:00 - Sáng');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [subtasks, setSubtasks] = useState<string[]>([
    'Bước 1: Chuẩn bị',
    'Bước 2: Thực hiện nhiệm vụ',
  ]);
  const [formError, setFormError] = useState('');

  // Lắng nghe sự kiện đồng bộ realtime từ phía bé hoặc từ các tab khác
  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<TaskItem[]>;
      if (custom.detail) {
        setTasks(custom.detail);
      } else {
        setTasks(getTasks());
      }
    };

    window.addEventListener('kidlife_tasks_update', handleSync);
    window.addEventListener('focus', () => setTasks(getTasks()));
    window.addEventListener('storage', () => setTasks(getTasks()));

    return () => {
      window.removeEventListener('kidlife_tasks_update', handleSync);
      window.removeEventListener('focus', () => setTasks(getTasks()));
      window.removeEventListener('storage', () => setTasks(getTasks()));
    };
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, `Bước ${subtasks.length + 1}`]);
  };

  const handleRemoveSubtask = (index: number) => {
    if (subtasks.length <= 1) return;
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubtaskChange = (index: number, val: string) => {
    const next = [...subtasks];
    next[index] = val;
    setSubtasks(next);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Vui lòng nhập tên nhiệm vụ');
      return;
    }

    const validSubs = subtasks.map((s) => s.trim()).filter((s) => s.length > 0);

    createNewTask({
      title: title.trim(),
      category,
      rewardXP: Number(rewardXP) || 50,
      time: time.trim() || 'Hôm nay',
      icon: selectedEmoji,
      subtasks: validSubs.length > 0 ? validSubs : ['Hoàn thành nhiệm vụ được giao'],
    });

    // Reset form
    setTitle('');
    setRewardXP(50);
    setTime('08:00 - Sáng');
    setSelectedEmoji('🎯');
    setSubtasks(['Bước 1: Chuẩn bị', 'Bước 2: Thực hiện']);
    setFormError('');
    setShowCreateModal(false);
  };

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xoá nhiệm vụ này không?')) {
      deleteTask(taskId);
    }
  };

  const handleDirectApprove = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    approveTask(taskId);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Quản lý nhiệm vụ 📋</h1>
          <p className="page-subtitle">Tạo và theo dõi tiến độ hoàn thành nhiệm vụ thực tế của con</p>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(true);
            setFormError('');
          }}
          className="kl-btn kl-btn-primary kl-btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <IoAddCircleOutline size={18} />
          Tạo mới
        </button>
      </div>

      {/* Filter tabs */}
      <div className="filter-tab-bar" style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { key: 'all' as Filter, label: `Tất cả (${tasks.length})` },
          { key: 'submitted' as Filter, label: `Chờ duyệt (${tasks.filter((t) => t.status === 'submitted').length})` },
          { key: 'in_progress' as Filter, label: `Đang làm (${tasks.filter((t) => t.status === 'in_progress').length})` },
          { key: 'todo' as Filter, label: `Chưa làm (${tasks.filter((t) => t.status === 'todo').length})` },
          { key: 'done' as Filter, label: `Hoàn thành (${tasks.filter((t) => t.status === 'done').length})` },
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
        {filteredTasks.map((task) => {
          const s = STATUS_MAP[task.status] || STATUS_MAP.todo;
          const StatusIcon = s.icon;
          const completedSubs = task.subtasks.filter((st) => st.done).length;
          const totalSubs = task.subtasks.length || 1;
          const isSubmitted = task.status === 'submitted';

          return (
            <div
              key={task.id}
              className="kl-card"
              style={{
                padding: 20,
                border: isSubmitted ? '2px solid #F59E0B' : '1px solid var(--kl-border)',
                background: isSubmitted ? '#FFFDF5' : '#fff',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: s.bg,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 28,
                    flexShrink: 0,
                  }}
                >
                  {task.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: 'var(--kl-primary-dark)' }}>
                      {task.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="kl-badge" style={{ background: s.bg, color: s.color, fontWeight: 700 }}>
                        <StatusIcon size={12} /> {s.label}
                      </span>
                      <button
                        onClick={(e) => handleDeleteTask(task.id, e)}
                        title="Xoá nhiệm vụ"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--kl-muted)',
                          cursor: 'pointer',
                          padding: 4,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: 12, color: 'var(--kl-muted)', marginBottom: 12 }}>
                    ⏰ {task.time} &nbsp;•&nbsp; 🏷️ {task.category} &nbsp;•&nbsp; ⭐ {task.xp}
                  </p>

                  {/* Banner chờ duyệt nếu bé đã gửi ảnh */}
                  {isSubmitted && (
                    <div
                      style={{
                        background: '#FEF3C7',
                        border: '1px solid #FCD34D',
                        borderRadius: 12,
                        padding: '10px 14px',
                        marginBottom: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#92400E', fontWeight: 700 }}>
                        <IoAlertCircleOutline size={18} />
                        <span>Bé đã nộp minh chứng!</span>
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => navigate('/parent/approval')}
                          className="kl-btn"
                          style={{
                            padding: '4px 10px',
                            fontSize: 12,
                            background: '#F59E0B',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          Xem ảnh & duyệt <IoArrowForward size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDirectApprove(task.id, e)}
                          className="kl-btn"
                          style={{
                            padding: '4px 10px',
                            fontSize: 12,
                            background: 'var(--kl-green)',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Duyệt nhanh ✓
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Checklist Subtasks */}
                  <div style={{ background: '#FAFBFF', borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--kl-muted)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tiến độ thực hiện của bé ({completedSubs}/{totalSubs})</span>
                      <span>{Math.round((completedSubs / totalSubs) * 100)}%</span>
                    </div>
                    <div style={{ height: 6, background: '#E2E8F0', borderRadius: 3, marginBottom: 10, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: isSubmitted ? '#F59E0B' : task.status === 'done' ? 'var(--kl-green)' : 'var(--kl-primary)',
                          borderRadius: 3,
                          width: `${(completedSubs / totalSubs) * 100}%`,
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    {task.subtasks.map((sub, idx) => (
                      <div key={sub.id || idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 13 }}>
                        {sub.done ? (
                          <IoCheckmarkCircle size={18} color="var(--kl-green)" />
                        ) : (
                          <IoEllipseOutline size={18} color="var(--kl-border)" />
                        )}
                        <span
                          style={{
                            textDecoration: sub.done ? 'line-through' : 'none',
                            color: sub.done ? 'var(--kl-muted)' : 'var(--kl-text)',
                            fontWeight: sub.done ? 500 : 600,
                          }}
                        >
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

        {filteredTasks.length === 0 && (
          <div className="web-full-span" style={{ textAlign: 'center', padding: 60, color: 'var(--kl-muted)' }}>
            <span style={{ fontSize: 48 }}>📋</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>Không có nhiệm vụ nào trong mục này</p>
          </div>
        )}
      </div>

      {/* Modal Tạo nhiệm vụ mới */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreateModal(false);
          }}
        >
          <div
            className="kl-card"
            style={{
              width: '100%',
              maxWidth: 540,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 28,
              borderRadius: 24,
              position: 'relative',
              animation: 'slideUp 0.2s ease',
            }}
          >
            <button
              onClick={() => setShowCreateModal(false)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--kl-muted)',
              }}
            >
              <IoCloseOutline size={24} />
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 6 }}>
              ✨ Tạo nhiệm vụ mới cho bé
            </h2>
            <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginBottom: 20 }}>
              Giao việc và chia nhỏ các bước để bé rèn luyện tính tự lập mỗi ngày
            </p>

            {formError && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 16,
                  color: '#DC2626',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gap: 16 }}>
              {/* Tên nhiệm vụ */}
              <div className="kl-input-wrap">
                <label className="kl-input-label">Tên nhiệm vụ *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tự dọn dẹp bàn học, Gấp quần áo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="kl-input"
                  required
                />
              </div>

              {/* Icon / Emoji đại diện */}
              <div className="kl-input-wrap">
                <label className="kl-input-label">Biểu tượng</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {DEFAULT_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      style={{
                        fontSize: 22,
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        border: selectedEmoji === emoji ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                        background: selectedEmoji === emoji ? 'var(--kl-primary-soft)' : '#fff',
                        cursor: 'pointer',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Danh mục & Điểm thưởng */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="kl-input-wrap">
                  <label className="kl-input-label">Danh mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="kl-input"
                  >
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="kl-input-wrap">
                  <label className="kl-input-label">Điểm thưởng XP</label>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    value={rewardXP}
                    onChange={(e) => setRewardXP(Number(e.target.value))}
                    className="kl-input"
                    required
                  />
                </div>
              </div>

              {/* Khung giờ */}
              <div className="kl-input-wrap">
                <label className="kl-input-label">Khung giờ thực hiện</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 08:00 - Sáng, 19:30 - Tối"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="kl-input"
                />
              </div>

              {/* Checklist các bước con */}
              <div className="kl-input-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="kl-input-label" style={{ marginBottom: 0 }}>
                    Các bước thực hiện (Checklist)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--kl-primary)',
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + Thêm bước
                  </button>
                </div>

                <div style={{ display: 'grid', gap: 8 }}>
                  {subtasks.map((sub, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--kl-muted)', minWidth: 20 }}>{idx + 1}.</span>
                      <input
                        type="text"
                        value={sub}
                        onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                        placeholder={`Bước ${idx + 1}...`}
                        className="kl-input"
                        style={{ flex: 1, height: 38 }}
                      />
                      {subtasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(idx)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--kl-pink)',
                            cursor: 'pointer',
                            padding: 4,
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nút gửi */}
              <button
                type="submit"
                className="kl-btn kl-btn-primary kl-btn-block"
                style={{ marginTop: 8, padding: 12, fontSize: 15, fontWeight: 700 }}
              >
                Lưu & Giao nhiệm vụ cho bé
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
