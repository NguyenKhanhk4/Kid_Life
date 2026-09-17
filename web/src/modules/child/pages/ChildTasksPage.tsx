import { useState, useRef, useEffect } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCheckmarkCircle, IoEllipseOutline, IoCameraOutline, IoRefreshOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

// Lưu trữ ảnh minh chứng để chia sẻ giữa trang Bé và trang Phụ huynh
const STORAGE_KEY = 'kidlife_task_proofs';

interface TaskProof {
  taskId: string;
  taskTitle: string;
  proofImage: string;
  submittedAt: string;
}

function getStoredProofs(): Record<string, TaskProof> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProof(taskId: string, taskTitle: string, proofImage: string) {
  const proofs = getStoredProofs();
  proofs[taskId] = {
    taskId,
    taskTitle,
    proofImage,
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs));
}

function removeProof(taskId: string) {
  const proofs = getStoredProofs();
  delete proofs[taskId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs));
}

// Lưu trạng thái hoàn thành nhiệm vụ
const COMPLETED_TASKS_KEY = 'kidlife_completed_tasks';

function getCompletedTasks(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(COMPLETED_TASKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setTaskCompleted(taskId: string) {
  const completed = getCompletedTasks();
  completed[taskId] = true;
  localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(completed));
}

function resetTaskCompleted(taskId: string) {
  const completed = getCompletedTasks();
  delete completed[taskId];
  localStorage.setItem(COMPLETED_TASKS_KEY, JSON.stringify(completed));
}

export default function ChildTasksPage() {
  // Khôi phục trạng thái hoàn thành từ localStorage khi load trang
  const completedMap = getCompletedTasks();
  const storedProofs = getStoredProofs();
  const initialTasks = D.todayTasks.map(t => {
    if (completedMap[t.id]) {
      return {
        ...t,
        status: 'done' as string,
        subtasks: t.subtasks.map(s => ({ ...s, done: true })),
      };
    }
    return t;
  });

  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(tasks[0]);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [taskWarning, setTaskWarning] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isAllSubtasksDone = selectedTask.subtasks.every(s => s.done);
  const isTaskCompleted = !!completedMap[selectedTask.id];
  const storedProofForTask = storedProofs[selectedTask.id] || null;

  const toggleSubtask = (taskId: string, subId: string) => {
    // Không cho toggle nếu nhiệm vụ đã hoàn thành và gửi ảnh
    if (completedMap[taskId]) return;

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
    if (updatedSelected) {
      setSelectedTask(updatedSelected);
      if (updatedSelected.subtasks.every(s => s.done)) {
        setTaskWarning(null);
      }
    }
  };

  const openCamera = () => {
    if (isTaskCompleted) return;
    if (!isAllSubtasksDone) {
      setTaskWarning('🌟 Bé hãy tích hoàn thành tất cả các bước nhiệm vụ ở trên để có thể mở camera chụp ảnh báo cáo nhé! Cố lên nào bé yêu! 💪');
      setTimeout(() => setTaskWarning(null), 4500);
      return;
    }
    setTaskWarning(null);
    setShowCamera(true);
    setCameraError(null);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch {
        setShowCamera(false);
        setCameraError('Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt.');
        setTimeout(() => setCameraError(null), 4000);
      }
    }, 100);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0);
    }
    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    closeCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const sendProof = () => {
    if (!capturedImage) return;
    setIsSending(true);
    setTimeout(() => {
      // Lưu ảnh vào localStorage để phụ huynh xem được
      saveProof(selectedTask.id, selectedTask.title, capturedImage);
      // Đánh dấu nhiệm vụ đã hoàn thành
      setTaskCompleted(selectedTask.id);

      setIsSending(false);
      setCapturedImage(null);
      setSuccessMessage(true);

      // Cập nhật task status thành done
      const updatedTasks = tasks.map(t => {
        if (t.id === selectedTask.id) {
          return {
            ...t,
            status: 'done' as string,
            subtasks: t.subtasks.map(s => ({ ...s, done: true })),
          };
        }
        return t;
      });
      setTasks(updatedTasks);
      const updatedSelected = updatedTasks.find(t => t.id === selectedTask.id);
      if (updatedSelected) setSelectedTask(updatedSelected);

      setTimeout(() => setSuccessMessage(false), 3000);
    }, 1500);
  };

  const resetTask = (taskId: string) => {
    // Xoá trạng thái hoàn thành
    resetTaskCompleted(taskId);
    // Xoá ảnh minh chứng
    removeProof(taskId);

    // Reset lại task trong state
    const original = D.todayTasks.find(t => t.id === taskId);
    if (!original) return;

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...original,
        };
      }
      return t;
    });
    setTasks(updatedTasks);
    const updatedSelected = updatedTasks.find(t => t.id === taskId);
    if (updatedSelected) setSelectedTask(updatedSelected);
    setCapturedImage(null);
    setSuccessMessage(false);
    setTaskWarning(null);
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="kl-badge" style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontSize: 14, fontWeight: 800 }}>
                {selectedTask.xp}
              </span>
            </div>
          </div>

          {/* Thông báo đã hoàn thành */}
          {isTaskCompleted && (
            <div style={{
              background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
              border: '1px solid var(--kl-green)',
              borderRadius: 16,
              padding: '16px 18px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🎉</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#065F46' }}>Nhiệm vụ đã hoàn thành!</div>
                  <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>Ảnh minh chứng đã gửi cho ba mẹ duyệt</div>
                </div>
              </div>
              <button
                onClick={() => resetTask(selectedTask.id)}
                style={{
                  background: '#fff',
                  border: '1px solid #6EE7B7',
                  borderRadius: 10,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#047857',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                <IoRefreshOutline size={14} />
                Làm lại
              </button>
            </div>
          )}

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
                  cursor: isTaskCompleted ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: isTaskCompleted ? 0.7 : 1,
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

            {taskWarning && (
              <div
                style={{
                  background: '#FEF3C7',
                  border: '1px solid #FCD34D',
                  borderRadius: 12,
                  padding: '12px 14px',
                  marginBottom: 12,
                  fontSize: 14,
                  color: '#92400E',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  lineHeight: 1.4,
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.12)',
                }}
              >
                <span style={{ fontSize: 20 }}>💡</span>
                <span>{taskWarning}</span>
              </div>
            )}

            {cameraError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '10px 14px', marginBottom: 10, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
                {cameraError}
              </div>
            )}

            {successMessage && (
              <div style={{ background: 'var(--kl-green-soft)', border: '1px solid var(--kl-green)', borderRadius: 12, padding: 14, marginBottom: 10, fontSize: 14, color: 'var(--kl-green)', fontWeight: 700 }}>
                ✅ Đã gửi ảnh minh chứng cho ba mẹ duyệt! 🌟
              </div>
            )}

            {/* Hiển thị ảnh đã gửi trước đó cho task đã hoàn thành */}
            {isTaskCompleted && storedProofForTask && !capturedImage && !successMessage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-green)' }}>📸 Ảnh minh chứng đã gửi:</span>
                <img
                  src={storedProofForTask.proofImage}
                  alt="Ảnh minh chứng đã gửi"
                  style={{ width: '100%', borderRadius: 12, border: '2px solid var(--kl-green)', objectFit: 'contain', background: '#F0FFF4' }}
                />
                <div style={{ fontSize: 12, color: 'var(--kl-muted)', textAlign: 'center' }}>
                  Đã gửi lúc: {new Date(storedProofForTask.submittedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            )}

            {/* Nút mở camera — chỉ hiện khi chưa hoàn thành */}
            {!isTaskCompleted && !capturedImage && !successMessage && (
              <button
                onClick={openCamera}
                className="kl-btn"
                style={{
                  width: '100%',
                  padding: 14,
                  background: isAllSubtasksDone ? '#F0F3FF' : '#F8FAFC',
                  color: isAllSubtasksDone ? 'var(--kl-primary)' : 'var(--kl-muted)',
                  border: isAllSubtasksDone ? '2px dashed var(--kl-primary)' : '2px dashed #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <IoCameraOutline size={22} />
                {isAllSubtasksDone ? 'Chụp / Tải ảnh minh chứng 📸' : 'Bé hãy hoàn thành các bước để chụp ảnh 🔒'}
              </button>
            )}

            {capturedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>Ảnh minh chứng:</span>
                <img
                  src={capturedImage}
                  alt="Ảnh minh chứng"
                  style={{ width: '100%', borderRadius: 12, border: '2px solid var(--kl-green)', objectFit: 'contain', background: '#F8F9FD' }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={retakePhoto}
                    className="kl-btn"
                    style={{ flex: 1, padding: 12, background: '#fff', border: '1px solid var(--kl-border)', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
                  >
                    🔄 Chụp lại
                  </button>
                  <button
                    onClick={sendProof}
                    disabled={isSending}
                    className="kl-btn"
                    style={{ flex: 1, padding: 12, background: isSending ? '#9CA3AF' : 'var(--kl-primary)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: isSending ? 'not-allowed' : 'pointer' }}
                  >
                    {isSending ? 'Đang gửi...' : '✅ Gửi cho ba mẹ'}
                  </button>
                </div>
              </div>
            )}
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
              const isCompleted = !!getCompletedTasks()[task.id];
              return (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setCapturedImage(null);
                    setTaskWarning(null);
                    setSuccessMessage(false);
                  }}
                  className="kl-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 16,
                    width: '100%',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid var(--kl-primary)' : isCompleted ? '1px solid var(--kl-green)' : '1px solid var(--kl-border)',
                    background: isSelected ? 'var(--kl-primary-soft)' : isCompleted ? '#F0FFF4' : '#fff',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{task.icon}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kl-primary-dark)' }}>{task.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--kl-muted)', marginTop: 2 }}>{task.xp} • {task.time}</div>
                  </div>
                  {(task.status === 'done' || isCompleted) && <span style={{ color: 'var(--kl-green)', fontSize: 18 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 20, boxSizing: 'border-box' }}>
          <div style={{ width: '100%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>📸 Chụp ảnh minh chứng</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setIsMirrored(prev => !prev)}
                style={{
                  background: isMirrored ? 'var(--kl-primary)' : 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  padding: '6px 14px',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                title="Bật/Tắt chế độ lật gương"
              >
                🔄 {isMirrored ? 'Lật gương: BẬT' : 'Lật gương: TẮT'}
              </button>
              <button
                onClick={closeCamera}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
              >
                ✕
              </button>
            </div>
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              maxWidth: 480,
              maxHeight: '60vh',
              objectFit: 'cover',
              borderRadius: 16,
              background: '#111',
              transform: isMirrored ? 'scaleX(-1)' : 'none',
            }}
          />
          <button
            onClick={capturePhoto}
            style={{ width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '4px solid rgba(255,255,255,0.4)', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 6px rgba(255,255,255,0.15)' }}
          >
            <IoCameraOutline size={32} color="var(--kl-primary)" />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Bấm nút để chụp ảnh</span>
        </div>
      )}
    </div>
  );
}
