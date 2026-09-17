import { useState, useEffect } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCheckmarkCircle, IoCloseCircle, IoImageOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

// Đọc ảnh minh chứng từ localStorage (chia sẻ với ChildTasksPage)
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

interface ApprovalItem {
  id: string;
  childName: string;
  type: string;
  title: string;
  time: string;
  xp: string;
  note: string;
  photoProof: string;
  proofImage?: string;
}

export default function ParentApprovalPage() {
  const storedProofs = getStoredProofs();

  // Tạo danh sách approval từ mock data + ảnh thực từ bé chụp
  const buildApprovals = (): ApprovalItem[] => {
    const proofs = getStoredProofs();
    const items: ApprovalItem[] = [];

    // Thêm các ảnh minh chứng thực từ bé
    Object.values(proofs).forEach((proof) => {
      const timeDiff = Math.round((Date.now() - new Date(proof.submittedAt).getTime()) / 60000);
      let timeLabel = 'Vừa xong';
      if (timeDiff >= 60) {
        timeLabel = `${Math.round(timeDiff / 60)} giờ trước`;
      } else if (timeDiff > 1) {
        timeLabel = `${timeDiff} phút trước`;
      }

      items.push({
        id: `proof-${proof.taskId}`,
        childName: D.child.name,
        type: 'task',
        title: proof.taskTitle,
        time: timeLabel,
        xp: '+XP',
        note: `${D.child.name} đã hoàn thành nhiệm vụ và gửi ảnh minh chứng!`,
        photoProof: '📸 Ảnh minh chứng từ bé',
        proofImage: proof.proofImage,
      });
    });

    // Thêm các mock approval khác (reward, wish) nếu chưa có ảnh thật
    items.push(
      {
        id: 'app2',
        childName: 'Minh Anh',
        type: 'reward',
        title: 'Đổi 15 phút chơi game',
        time: '1 giờ trước',
        xp: '-100 XP',
        note: 'Con muốn chơi sau khi làm xong bài tập',
        photoProof: '🎮 Yêu cầu đổi quà',
      },
      {
        id: 'app3',
        childName: 'Minh Anh',
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

  const [approvals, setApprovals] = useState<ApprovalItem[]>(buildApprovals);
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Refresh khi focus vào tab (để cập nhật ảnh mới từ bé)
  useEffect(() => {
    const handleFocus = () => {
      setApprovals(buildApprovals());
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setApprovals(prev => prev.filter(item => item.id !== id));

    // Nếu là proof thực, xoá khỏi localStorage khi duyệt hoặc từ chối
    if (id.startsWith('proof-')) {
      const taskId = id.replace('proof-', '');
      const proofs = getStoredProofs();
      delete proofs[taskId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(proofs));
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Duyệt Minh Chứng & Thưởng ✅</h1>
          <p className="page-subtitle">Xem xét các yêu cầu của con</p>
        </div>
        <span className="kl-badge" style={{ background: approvals.length > 0 ? 'var(--kl-orange-soft)' : 'var(--kl-green-soft)', color: approvals.length > 0 ? '#B36A00' : 'var(--kl-green)', fontSize: 13, padding: '6px 14px' }}>
          {approvals.length > 0 ? `${approvals.length} chờ duyệt` : 'Tất cả đã xong'}
        </span>
      </div>

      {approvals.length === 0 ? (
        <div className="kl-card" style={{ textAlign: 'center', padding: 60, borderRadius: 24 }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>Không còn yêu cầu nào chờ duyệt!</h3>
          <p style={{ fontSize: 14, color: 'var(--kl-muted)', marginTop: 6 }}>Tất cả nhiệm vụ và phần thưởng của bé đã được xử lý.</p>
        </div>
      ) : (
        <div className="web-grid-2">
          {approvals.map((item) => (
            <div key={item.id} className="kl-card" style={{ padding: 22, borderRadius: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className="kl-badge" style={{ background: item.proofImage ? '#D1FAE5' : '#EAF0FF', color: item.proofImage ? '#065F46' : 'var(--kl-primary)', fontSize: 11 }}>
                      {item.photoProof}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>{item.time}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{item.title}</h3>
                </div>
                <span className="kl-badge" style={{ background: 'var(--kl-green-soft)', color: 'var(--kl-green)', fontWeight: 800 }}>
                  {item.xp}
                </span>
              </div>

              {/* Hiển thị ảnh minh chứng thực nếu có */}
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
                    style={{ width: '100%', display: 'block', objectFit: 'contain', background: '#F8F9FD' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: 8,
                    padding: '4px 10px',
                    fontSize: 11,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <IoImageOutline size={14} />
                    Nhấn để phóng to
                  </div>
                </div>
              )}

              <div style={{ background: '#F8F9FD', padding: 14, borderRadius: 14, marginBottom: 16, fontSize: 14, color: 'var(--kl-text)', lineHeight: 1.5 }}>
                💬 "<i>{item.note}</i>"
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleAction(item.id, 'approved')}
                  className="kl-btn kl-btn-primary"
                  style={{ flex: 1, padding: '10px 14px', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <IoCheckmarkCircle size={18} /> Phê duyệt
                </button>
                <button
                  onClick={() => handleAction(item.id, 'rejected')}
                  className="kl-btn"
                  style={{ flex: 1, padding: '10px 14px', fontSize: 13, background: '#FFF0F3', color: 'var(--kl-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
          <div style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>📸 Ảnh minh chứng từ bé</span>
            <button
              onClick={() => setViewingImage(null)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'grid', placeItems: 'center' }}
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
