import { useState, useEffect } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCheckmarkCircle, IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import {
  getTasks,
  approveTask,
  rejectTask,
  TaskItem,
} from '@/shared/utils/taskStorage';
import { triggerCelebrationNotice } from '@/shared/utils/walletStorage';

const D = MOCK_KIDLIFE_DATA;

interface ApprovalItem {
  id: string;
  taskId?: string;
  childName: string;
  type: 'task' | 'reward' | 'wish';
  title: string;
  time: string;
  xp: string;
  note: string;
  photoProof: string;
  proofImage?: string;
  rewardXP?: number;
}

export default function ParentApprovalPage() {
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);

  const buildApprovals = (): ApprovalItem[] => {
    const tasks = getTasks();
    const items: ApprovalItem[] = [];

    // Lấy các nhiệm vụ đang ở trạng thái submitted (chờ duyệt)
    const submittedTasks = tasks.filter((t) => t.status === 'submitted');

    submittedTasks.forEach((t) => {
      let timeLabel = 'Vừa xong';
      if (t.submittedAt) {
        const diffMins = Math.round((Date.now() - new Date(t.submittedAt).getTime()) / 60000);
        if (diffMins >= 60) {
          timeLabel = `${Math.round(diffMins / 60)} giờ trước`;
        } else if (diffMins > 1) {
          timeLabel = `${diffMins} phút trước`;
        }
      }

      items.push({
        id: `task-${t.id}`,
        taskId: t.id,
        childName: D.child.name,
        type: 'task',
        title: t.title,
        time: timeLabel,
        xp: `+${t.rewardXP} XP`,
        note: `Bé ${D.child.name} đã hoàn thành đầy đủ các bước và gửi ảnh báo cáo!`,
        photoProof: '📸 Ảnh minh chứng từ bé',
        proofImage: t.proofImage,
        rewardXP: t.rewardXP,
      });
    });

    // Các yêu cầu đổi quà hoặc điều ước mẫu
    items.push(
      {
        id: 'mock-reward-1',
        childName: D.child.name,
        type: 'reward',
        title: 'Đổi 15 phút chơi game',
        time: '1 giờ trước',
        xp: '-100 XP',
        note: 'Con muốn chơi sau khi làm xong bài tập',
        photoProof: '🎮 Yêu cầu đổi quà',
        rewardXP: 100,
      },
      {
        id: 'mock-wish-1',
        childName: D.child.name,
        type: 'wish',
        title: 'Ước được đi công viên nước cuối tuần',
        time: 'Hôm qua',
        xp: 'Điều ước',
        note: 'Nếu con đạt chuỗi Streak 14 ngày, ba mẹ cho con đi nhé!',
        photoProof: '🧞‍♂️ Điều ước của bé',
      }
    );

    return items;
  };

  useEffect(() => {
    setApprovals(buildApprovals());

    const handleSync = () => {
      setApprovals(buildApprovals());
    };

    window.addEventListener('kidlife_tasks_update', handleSync);
    window.addEventListener('kidlife_approvals_count_update', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('kidlife_tasks_update', handleSync);
      window.removeEventListener('kidlife_approvals_count_update', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleAction = (item: ApprovalItem, action: 'approved' | 'rejected') => {
    setApprovals((prev) => prev.filter((i) => i.id !== item.id));

    if (item.type === 'task' && item.taskId) {
      if (action === 'approved') {
        // Phê duyệt nhiệm vụ: cộng XP, kích hoạt thông báo chúc mừng 3s sang bé, cập nhật task thành done
        approveTask(item.taskId);
      } else {
        // Từ chối / Nhắc con làm lại
        rejectTask(item.taskId);
      }
    } else if (action === 'approved' && item.type === 'wish') {
      triggerCelebrationNotice(item.id, item.title, 50);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Duyệt Minh Chứng & Thưởng ✅</h1>
          <p className="page-subtitle">Xem xét các bài tập và yêu cầu của con gửi lên</p>
        </div>
        <span
          className="kl-badge"
          style={{
            background: approvals.length > 0 ? 'var(--kl-orange-soft)' : 'var(--kl-green-soft)',
            color: approvals.length > 0 ? '#B36A00' : 'var(--kl-green)',
            fontSize: 13,
            padding: '6px 14px',
          }}
        >
          {approvals.length > 0 ? `${approvals.length} chờ duyệt` : 'Tất cả đã xong'}
        </span>
      </div>

      {approvals.length === 0 ? (
        <div className="kl-card" style={{ textAlign: 'center', padding: 60, borderRadius: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
            Không còn yêu cầu nào chờ duyệt!
          </h3>
          <p style={{ fontSize: 14, color: 'var(--kl-muted)', marginTop: 6 }}>
            Tất cả nhiệm vụ và phần thưởng của bé đã được xử lý.
          </p>
        </div>
      ) : (
        <div className="web-grid-2">
          {approvals.map((item) => (
            <div key={item.id} className="kl-card" style={{ padding: 22, borderRadius: 22 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span
                      className="kl-badge"
                      style={{
                        background: item.proofImage ? '#D1FAE5' : '#EAF0FF',
                        color: item.proofImage ? '#065F46' : 'var(--kl-primary)',
                        fontSize: 11,
                      }}
                    >
                      {item.photoProof}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>{item.time}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
                    {item.title}
                  </h3>
                </div>
                <span
                  className="kl-badge"
                  style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontWeight: 800 }}
                >
                  {item.xp}
                </span>
              </div>

              {/* Hiển thị ảnh minh chứng thực tế nếu có */}
              {item.proofImage && (
                <div
                  onClick={() => setViewingImage(item.proofImage || null)}
                  style={{
                    marginBottom: 14,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '2px solid var(--kl-green)',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.proofImage}
                    alt="Ảnh minh chứng từ bé"
                    style={{
                      width: '100%',
                      maxHeight: 220,
                      display: 'block',
                      objectFit: 'contain',
                      background: '#F8F9FD',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.65)',
                      borderRadius: 8,
                      padding: '4px 10px',
                      fontSize: 11,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <IoImageOutline size={14} />
                    Nhấn để phóng to
                  </div>
                </div>
              )}

              <div
                style={{
                  background: '#F8F9FD',
                  padding: 14,
                  borderRadius: 14,
                  marginBottom: 16,
                  fontSize: 14,
                  color: 'var(--kl-text)',
                  lineHeight: 1.5,
                }}
              >
                💬 "<i>{item.note}</i>"
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleAction(item, 'approved')}
                  className="kl-btn kl-btn-primary"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <IoCheckmarkCircle size={18} /> Phê duyệt & Cộng điểm
                </button>
                <button
                  onClick={() => handleAction(item, 'rejected')}
                  className="kl-btn"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    fontSize: 13,
                    background: '#FFF0F3',
                    color: 'var(--kl-pink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <IoCloseCircle size={18} /> Nhắc con làm lại
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          onClick={() => setViewingImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 20,
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>📸 Ảnh minh chứng từ bé</span>
            <button
              onClick={() => setViewingImage(null)}
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
          <img
            src={viewingImage}
            alt="Ảnh minh chứng phóng to"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh',
              objectFit: 'contain',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Nhấn ✕ hoặc vùng trống để đóng</span>
        </div>
      )}
    </div>
  );
}
