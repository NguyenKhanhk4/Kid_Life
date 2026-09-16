import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCheckmarkCircle, IoEllipseOutline, IoCameraOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

export default function ChildTasksPage() {
  const [tasks, setTasks] = useState(D.todayTasks);
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [submittedProof, setSubmittedProof] = useState(false);

  const toggleSubtask = (taskId: string, subId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const updatedSubs = t.subtasks.map(s => s.id === subId ? { ...s, done: !s.done } : s);
        const allDone = updatedSubs.every(s => s.done);
        return {
          ...t,
          subtasks: updatedSubs,
          status: allDone ? 'done' : 'in_progress',
        };
      }
      return t;
    });
    setTasks(updatedTasks);
    const updatedSelected = updatedTasks.find(t => t.id === taskId);
    if (updatedSelected) setSelectedTask(updatedSelected);
  };

  const handleSendProof = () => {
    setSubmittedProof(true);
    setTimeout(() => {
      setSubmittedProof(false);
      alert('Đã gửi bằng chứng hoàn thành nhiệm vụ cho ba mẹ duyệt! 🌟');
    }, 1500);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Nhiệm Vụ Của Con 🎯</h1>
          <p className="page-subtitle">Tự giác hoàn thành để nhận điểm XP!</p>
        </div>
        <span className="kl-badge" style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontSize: 13, padding: '6px 14px' }}>
          {tasks.filter(t => t.status === 'done').length}/{tasks.length} hoàn thành
        </span>
      </div>

      <div className="web-grid-2-1">
        {/* Left: Task Details */}
        <div className="kl-card" style={{ padding: 24, borderRadius: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 18, background: '#F0F3FF', display: 'grid', placeItems: 'center', fontSize: 32 }}>
                {selectedTask.icon}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{selectedTask.title}</h2>
                <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Thời gian: {selectedTask.time}</span>
              </div>
            </div>
            <span className="kl-badge" style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontSize: 14, fontWeight: 800 }}>
              {selectedTask.xp}
            </span>
          </div>

          {/* Multi-step Checklist */}
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>
            Các bước thực hiện (Bấm để tích hoàn thành):
          </h3>
          <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
            {selectedTask.subtasks.map((sub, idx) => (
              <div
                key={sub.id}
                onClick={() => toggleSubtask(selectedTask.id, sub.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: sub.done ? 'var(--kl-green-soft)' : '#FAFAFC',
                  border: sub.done ? '1px solid var(--kl-green)' : '1px solid var(--kl-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {sub.done ? (
                  <IoCheckmarkCircle size={26} color="var(--kl-green)" />
                ) : (
                  <IoEllipseOutline size={26} color="var(--kl-muted)" />
                )}
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: sub.done ? 'var(--kl-green)' : 'var(--kl-primary-dark)',
                    textDecoration: sub.done ? 'line-through' : 'none',
                  }}
                >
                  Bước {idx + 1}: {sub.title}
                </span>
              </div>
            ))}
          </div>

          {/* Photo Proof Upload */}
          <div style={{ borderTop: '1px solid var(--kl-border)', paddingTop: 20 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--kl-primary-dark)', marginBottom: 12, display: 'block' }}>
              Chụp ảnh báo cáo cho ba mẹ:
            </span>
            <button
              onClick={handleSendProof}
              className="kl-btn"
              style={{
                width: '100%',
                padding: 14,
                background: '#F0F3FF',
                color: 'var(--kl-primary)',
                border: '2px dashed var(--kl-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              <IoCameraOutline size={22} />
              {submittedProof ? 'Đang tải ảnh...' : 'Chụp / Tải ảnh minh chứng'}
            </button>
          </div>
        </div>

        {/* Right: Task Selector */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>
            Danh sách nhiệm vụ
          </h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {tasks.map(task => {
              const isSelected = selectedTask.id === task.id;
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="kl-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    width: '100%',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--kl-primary)' : '1px solid var(--kl-border)',
                    background: isSelected ? 'var(--kl-primary-soft)' : '#fff',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{task.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kl-primary-dark)' }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--kl-muted)', marginTop: 2 }}>{task.xp} • {task.time}</div>
                  </div>
                  {task.status === 'done' && <span style={{ color: 'var(--kl-green)', fontSize: 18 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
