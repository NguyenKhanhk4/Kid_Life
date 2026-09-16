import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

const INITIAL_APPROVALS = [
  {
    id: 'app1',
    childName: 'Minh Anh',
    type: 'task',
    title: 'Dọn dẹp phòng khách sạch sẽ',
    time: '15 phút trước',
    xp: '+80 XP',
    note: 'Con đã dọn hết đồ chơi và lau bàn rồi ba mẹ nhé!',
    photoProof: '🛋️📸 Đã đính kèm ảnh',
  },
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
  },
];

export default function ParentApprovalPage() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setApprovals(prev => prev.filter(item => item.id !== id));
    alert(action === 'approved' ? 'Đã duyệt thành công! Điểm XP đã được cộng cho bé 🎉' : 'Đã từ chối và gửi phản hồi cho bé.');
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
                    <span className="kl-badge" style={{ background: '#EAF0FF', color: 'var(--kl-primary)', fontSize: 11 }}>
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
    </div>
  );
}
