import { useState, useRef, useEffect } from 'react';
import {
  IoCheckmarkCircle,
  IoEllipseOutline,
  IoCameraOutline,
  IoRefreshOutline,
  IoHourglassOutline,
  IoSparkles,
} from 'react-icons/io5';
import {
  getTasks,
  toggleSubtaskItem,
  submitTaskProof,
  resetTaskToTodo,
  TaskItem,
} from '@/shared/utils/taskStorage';

export default function ChildTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(getTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(() => {
    const all = getTasks();
    return all.length > 0 ? all[0].id : '';
  });

  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [taskWarning, setTaskWarning] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ realtime danh sách nhiệm vụ từ taskStorage
  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<TaskItem[]>;
      const newTasks = custom.detail || getTasks();
      setTasks(newTasks);
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

  // Lấy task đang chọn
  const selectedTask: TaskItem | undefined =
    tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  // Nếu chưa có selectedTaskId và có tasks
  useEffect(() => {
    if (!selectedTaskId && tasks.length > 0) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [selectedTaskId, tasks]);

  if (!selectedTask) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <span style={{ fontSize: 48 }}>🎯</span>
        <h2 style={{ marginTop: 12 }}>Chưa có nhiệm vụ nào!</h2>
        <p style={{ color: 'var(--kl-muted)' }}>Ba mẹ chưa giao việc cho con hôm nay. Hãy nghỉ ngơi hoặc nhắc ba mẹ nhé!</p>
      </div>
    );
  }

  const isAllSubtasksDone =
    selectedTask.subtasks.length > 0 && selectedTask.subtasks.every((s) => s.done);
  const isDone = selectedTask.status === 'done';
  const isSubmitted = selectedTask.status === 'submitted';
  const isInProgress =
    selectedTask.status === 'in_progress' ||
    isSubmitted ||
    (selectedTask.subtasks.some((s) => s.done) && !isDone);
  const isTodo = !isDone && !isInProgress;
  const isLockedForAction = isDone || isSubmitted;

  // Toggle subtask
  const handleToggleSubtask = (subId: string) => {
    if (isLockedForAction) return;

    const updated = toggleSubtaskItem(selectedTask.id, subId);
    setTasks(updated);

    const curr = updated.find((t) => t.id === selectedTask.id);
    if (curr && curr.subtasks.every((s) => s.done)) {
      setTaskWarning(null);
    }
  };

  // Mở camera
  const openCamera = () => {
    if (isLockedForAction) return;
    if (!isAllSubtasksDone) {
      setTaskWarning(
        '🌟 Bé hãy tích hoàn thành tất cả các bước nhiệm vụ ở trên để có thể mở camera chụp ảnh báo cáo nhé! Cố lên nào bé yêu! 💪'
      );
      setTimeout(() => setTaskWarning(null), 4500);
      return;
    }
    setTaskWarning(null);
    setShowCamera(true);
    setCameraError(null);
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch {
        setShowCamera(false);
        setCameraError('Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera hoặc bấm tải ảnh bên dưới.');
        setTimeout(() => setCameraError(null), 4000);
      }
    }, 100);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCapturedImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  // Nộp ảnh minh chứng cho ba mẹ
  const sendProof = () => {
    if (!capturedImage) return;
    setIsSending(true);

    setTimeout(() => {
      submitTaskProof(selectedTask.id, capturedImage);
      setIsSending(false);
      setCapturedImage(null);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3500);
    }, 1000);
  };

  // Làm lại nhiệm vụ
  const handleResetTask = () => {
    if (window.confirm('Bé có muốn làm lại nhiệm vụ này từ đầu không?')) {
      resetTaskToTodo(selectedTask.id);
      setCapturedImage(null);
      setSuccessMessage(false);
      setTaskWarning(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Nhiệm Vụ Của Con 🎯</h1>
          <p className="page-subtitle">Tự giác hoàn thành để nhận điểm XP và phần thưởng tuyệt vời!</p>
        </div>
        <span
          className="kl-badge"
          style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontSize: 13, padding: '6px 14px' }}
        >
          {tasks.filter((t) => t.status === 'done').length}/{tasks.length} hoàn thành
        </span>
      </div>

      <div className="web-grid-2-1">
        {/* Left: Task Details */}
        <div
          className="kl-card"
          style={{
            padding: 24,
            borderRadius: 24,
            background: '#FFFFFF',
            border: isDone
              ? '2px solid #10B981'
              : isInProgress
              ? '2px solid #F59E0B'
              : '1px solid var(--kl-border)',
            boxShadow: isDone
              ? '0 4px 20px rgba(16, 185, 129, 0.08)'
              : isInProgress
              ? '0 4px 20px rgba(245, 158, 11, 0.08)'
              : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: isDone ? '#D1FAE5' : isInProgress ? '#FEF3C7' : '#F0F3FF',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 32,
                }}
              >
                {selectedTask.icon}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{selectedTask.title}</h2>
                <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>
                  Khung giờ: {selectedTask.time} &nbsp;•&nbsp; {selectedTask.category}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isDone && (
                <span
                  style={{
                    background: '#D1FAE5',
                    color: '#065F46',
                    fontSize: 13,
                    fontWeight: 800,
                    padding: '6px 12px',
                    borderRadius: 20,
                  }}
                >
                  ✓ Hoàn thành
                </span>
              )}
              {isInProgress && (
                <span
                  style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontSize: 13,
                    fontWeight: 800,
                    padding: '6px 12px',
                    borderRadius: 20,
                  }}
                >
                  {isSubmitted ? '⏳ Chờ ba mẹ duyệt' : '⚡ Đang làm'}
                </span>
              )}
              {isTodo && (
                <span
                  style={{
                    background: '#F1F5F9',
                    color: '#64748B',
                    fontSize: 13,
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: 20,
                  }}
                >
                  ⚪ Chưa làm
                </span>
              )}
              <span
                className="kl-badge"
                style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontSize: 14, fontWeight: 800 }}
              >
                {selectedTask.xp}
              </span>
            </div>
          </div>

          {/* Banner trạng thái: ĐÃ HOÀN THÀNH */}
          {isDone && (
            <div
              style={{
                background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)',
                border: '1px solid var(--kl-green)',
                borderRadius: 16,
                padding: '16px 18px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>🎉</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#065F46' }}>
                    Xuất sắc! Nhiệm vụ đã hoàn thành!
                  </div>
                  <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                    Ba mẹ đã duyệt và cộng +{selectedTask.rewardXP} XP vào ví của con 🌟
                  </div>
                </div>
              </div>
              <button
                onClick={handleResetTask}
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

          {/* Banner trạng thái: CHỜ DUYỆT */}
          {isSubmitted && (
            <div
              style={{
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: 16,
                padding: '16px 18px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IoHourglassOutline size={28} color="#B45309" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: '#92400E' }}>
                    Đã nộp ảnh minh chứng! Đang chờ ba mẹ duyệt ⏳
                  </div>
                  <div style={{ fontSize: 12, color: '#B45309', marginTop: 2 }}>
                    Ba mẹ sẽ sớm xem ảnh và gửi điểm thưởng XP về ví cho con nhé!
                  </div>
                </div>
              </div>
              <button
                onClick={handleResetTask}
                style={{
                  background: '#fff',
                  border: '1px solid #FCD34D',
                  borderRadius: 10,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#92400E',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  whiteSpace: 'nowrap',
                }}
              >
                <IoRefreshOutline size={14} />
                Chụp lại
              </button>
            </div>
          )}

          {/* Multi-step Checklist */}
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 14 }}>
            Các bước thực hiện (Bấm vào từng bước để đánh dấu hoàn thành):
          </h3>
          <div style={{ display: 'grid', gap: 10, marginBottom: 24 }}>
            {selectedTask.subtasks.map((sub, idx) => (
              <div
                key={sub.id || idx}
                onClick={() => handleToggleSubtask(sub.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: sub.done ? '#E6F9EE' : '#FFFFFF',
                  border: sub.done ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                  cursor: isLockedForAction ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: sub.done ? 'none' : '0 1px 3px rgba(0,0,0,0.02)',
                  opacity: isLockedForAction ? 0.85 : 1,
                }}
              >
                {sub.done ? (
                  <IoCheckmarkCircle size={26} color="#10B981" />
                ) : (
                  <IoEllipseOutline size={26} color="#94A3B8" />
                )}
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: sub.done ? '#065F46' : 'var(--kl-primary-dark)',
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
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--kl-primary-dark)',
                marginBottom: 12,
                display: 'block',
              }}
            >
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
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 10,
                  fontSize: 13,
                  color: '#DC2626',
                  fontWeight: 600,
                }}
              >
                {cameraError}
              </div>
            )}

            {successMessage && (
              <div
                style={{
                  background: 'var(--kl-green-soft)',
                  border: '1px solid var(--kl-green)',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 10,
                  fontSize: 14,
                  color: 'var(--kl-green)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <IoSparkles size={20} />
                Đã gửi ảnh minh chứng thành công! Đang chờ ba mẹ duyệt nhé 🌟
              </div>
            )}

            {/* Hiển thị ảnh đã nộp nếu có */}
            {(isSubmitted || isDone) && selectedTask.proofImage && !capturedImage && !successMessage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-green)' }}>
                  📸 Ảnh minh chứng đã gửi:
                </span>
                <img
                  src={selectedTask.proofImage}
                  alt="Ảnh minh chứng đã gửi"
                  style={{
                    width: '100%',
                    maxHeight: 280,
                    borderRadius: 14,
                    border: '2px solid var(--kl-green)',
                    objectFit: 'contain',
                    background: '#F0FFF4',
                  }}
                />
                {selectedTask.submittedAt && (
                  <div style={{ fontSize: 12, color: 'var(--kl-muted)', textAlign: 'center' }}>
                    Đã gửi lúc: {new Date(selectedTask.submittedAt).toLocaleString('vi-VN')}
                  </div>
                )}
              </div>
            )}

            {/* Nút chụp ảnh khi chưa nộp hoặc chưa xong */}
            {!isLockedForAction && !capturedImage && !successMessage && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={openCamera}
                  className="kl-btn"
                  style={{
                    flex: 1,
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
                  {isAllSubtasksDone ? 'Chụp ảnh minh chứng 📸' : 'Hoàn thành các bước để chụp ảnh 🔒'}
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="kl-btn"
                  style={{
                    padding: '0 16px',
                    background: '#F8F9FA',
                    border: '1px solid var(--kl-border)',
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--kl-muted)',
                    cursor: 'pointer',
                  }}
                  title="Tải ảnh từ máy tính"
                >
                  📁 Tải ảnh
                </button>
              </div>
            )}

            {/* Preview ảnh vừa chụp */}
            {capturedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)' }}>
                  Ảnh vừa chụp:
                </span>
                <img
                  src={capturedImage}
                  alt="Ảnh minh chứng"
                  style={{
                    width: '100%',
                    maxHeight: 280,
                    borderRadius: 14,
                    border: '2px solid var(--kl-green)',
                    objectFit: 'contain',
                    background: '#F8F9FD',
                  }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={retakePhoto}
                    className="kl-btn"
                    style={{
                      flex: 1,
                      padding: 12,
                      background: '#fff',
                      border: '1px solid var(--kl-border)',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                    }}
                  >
                    🔄 Chụp lại
                  </button>
                  <button
                    onClick={sendProof}
                    disabled={isSending}
                    className="kl-btn"
                    style={{
                      flex: 1,
                      padding: 12,
                      background: isSending ? '#9CA3AF' : 'var(--kl-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: isSending ? 'not-allowed' : 'pointer',
                    }}
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
            Danh sách nhiệm vụ hôm nay
          </h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {tasks.map((task) => {
              const isSelected = selectedTask.id === task.id;
              const taskIsDone = task.status === 'done';
              const taskIsSubmitted = task.status === 'submitted';
              const taskIsInProgress =
                task.status === 'in_progress' ||
                taskIsSubmitted ||
                (task.subtasks.some((s) => s.done) && !taskIsDone);
              const taskIsTodo = !taskIsDone && !taskIsInProgress;

              // Màu sắc theo quy tắc:
              // - Hoàn thành: Màu xanh lá cây (#E6F9EE)
              // - Đang làm: Màu vàng (#FEF9C3)
              // - Chưa làm: Màu trắng (#FFFFFF)
              const cardBg = taskIsDone
                ? '#E6F9EE'
                : taskIsInProgress
                ? '#FEF9C3'
                : '#FFFFFF';

              const cardBorder = taskIsDone
                ? '#10B981'
                : taskIsInProgress
                ? '#F59E0B'
                : '#E2E8F0';

              const cardTitleColor = taskIsDone
                ? '#065F46'
                : taskIsInProgress
                ? '#92400E'
                : 'var(--kl-primary-dark)';

              const cardMetaColor = taskIsDone
                ? '#047857'
                : taskIsInProgress
                ? '#B45309'
                : 'var(--kl-muted)';

              return (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
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
                    textAlign: 'left',
                    background: cardBg,
                    border: isSelected
                      ? `2.5px solid ${taskIsDone ? '#059669' : taskIsInProgress ? '#D97706' : 'var(--kl-primary)'}`
                      : `1.5px solid ${cardBorder}`,
                    boxShadow: isSelected
                      ? taskIsDone
                        ? '0 0 0 3px rgba(16, 185, 129, 0.35), 0 4px 12px rgba(16, 185, 129, 0.15)'
                        : taskIsInProgress
                        ? '0 0 0 3px rgba(245, 158, 11, 0.4), 0 4px 12px rgba(245, 158, 11, 0.15)'
                        : '0 0 0 3px rgba(67, 97, 238, 0.3), 0 4px 12px rgba(0, 0, 0, 0.06)'
                      : '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{task.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: cardTitleColor,
                        textDecoration: taskIsDone ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: cardMetaColor, marginTop: 2 }}>
                      {task.xp} • {task.time}
                    </div>
                  </div>

                  {/* Badges bên phải thẻ */}
                  {taskIsDone && (
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

                  {taskIsInProgress && !taskIsDone && (
                    <span
                      style={{
                        background: taskIsSubmitted ? '#F59E0B' : '#FEF08A',
                        color: taskIsSubmitted ? '#ffffff' : '#854D0E',
                        fontSize: 11,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 12,
                        border: taskIsSubmitted ? 'none' : '1px solid #FCD34D',
                      }}
                    >
                      {taskIsSubmitted ? 'Chờ duyệt ⏳' : 'Đang làm ⚡'}
                    </span>
                  )}

                  {taskIsTodo && (
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Camera Modal Overlay */}
      {showCamera && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            padding: 20,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>📸 Chụp ảnh minh chứng</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setIsMirrored((prev) => !prev)}
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
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  color: '#fff',
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                }}
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
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#fff',
              border: '4px solid rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 0 0 6px rgba(255,255,255,0.15)',
            }}
          >
            <IoCameraOutline size={32} color="var(--kl-primary)" />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Bấm nút tròn để chụp ảnh</span>
        </div>
      )}
    </div>
  );
}
