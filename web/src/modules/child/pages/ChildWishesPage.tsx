import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoMic, IoSend, IoSparkles, IoStarSharp } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

export default function ChildWishesPage() {
  const [wishText, setWishText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoiceRecorded, setHasVoiceRecorded] = useState(false);
  const [wishSent, setWishSent] = useState(false);

  const handleHoldRecord = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setHasVoiceRecorded(true);
      setWishText('Con ước cuối tuần này được đi công viên nước cùng cả nhà!');
    }, 2000);
  };

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;
    setWishSent(true);
    setTimeout(() => {
      setWishSent(false);
      alert('Đã gửi điều ước thầm kín tới ba mẹ thành công! 🧞‍♂️✨ Ba mẹ sẽ xem xét duyệt ước nguyện của con.');
      setWishText('');
      setHasVoiceRecorded(false);
    }, 1500);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Cây Điều Ước Thần Kỳ 🧞‍♂️✨</h1>
          <p className="page-subtitle">Thủ thỉ ước mơ với ba mẹ bằng lời nói hoặc chữ viết</p>
        </div>
        <span className="kl-badge" style={{ background: '#FFF4E5', color: '#E85D04', fontSize: 13, padding: '6px 14px' }}>
          <IoStarSharp color="var(--kl-yellow)" size={16} /> Phí gửi: 50 Sao
        </span>
      </div>

      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Left: Magical Wish Tree Creator */}
        <div
          className="kl-card"
          style={{
            padding: 32,
            borderRadius: 28,
            background: 'radial-gradient(circle at 50% 30%, #EBF4FF 0%, #D8E9FF 100%)',
            border: '2px solid rgba(43, 68, 232, 0.15)',
          }}
        >
          {/* Wish Tree Mascot */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 84, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))' }}>🌳✨</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--kl-primary-dark)' }}>
              Cây Ước Nguyện Thần Kỳ
            </h2>
            <p style={{ fontSize: 13, color: 'var(--kl-muted)', maxWidth: 380, margin: '6px auto 0' }}>
              Hãy thì thầm ước mơ thực tế của con (Ví dụ: đi công viên nước, ăn pizza, mua cuốn sách mới)...
            </p>
          </div>

          {wishSent ? (
            <div style={{ background: 'var(--kl-green-soft)', padding: 24, borderRadius: 20, textAlign: 'center', color: 'var(--kl-green)', fontWeight: 800, fontSize: 16 }}>
              ✨ Điều ước đã được nêm phép thuật và gửi thẳng tới ứng dụng của ba mẹ! 🧞‍♂️
            </div>
          ) : (
            <form onSubmit={handleSendWish} style={{ display: 'grid', gap: 18 }}>
              {/* Voice Record Button */}
              <div style={{ textAlign: 'center', background: '#fff', padding: 20, borderRadius: 20, border: '1px solid #CBE0FF' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 12 }}>
                  Cách 1: Ghi âm giọng nói thủ thỉ:
                </span>
                <button
                  type="button"
                  onClick={handleHoldRecord}
                  className="kl-btn"
                  style={{
                    background: isRecording ? '#FF4785' : hasVoiceRecorded ? 'var(--kl-green)' : 'var(--kl-primary)',
                    color: '#fff',
                    padding: '12px 24px',
                    borderRadius: 24,
                    fontSize: 15,
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <IoMic size={20} />
                  {isRecording ? '🎙️ Đang ghi âm...' : hasVoiceRecorded ? '✅ Đã ghi âm lời ước (0:12)' : '🎙️ Giữ Để Ghi Âm Lời Ước'}
                </button>
              </div>

              {/* Text Wish Input */}
              <div style={{ background: '#fff', padding: 20, borderRadius: 20, border: '1px solid #CBE0FF' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-primary-dark)', display: 'block', marginBottom: 8 }}>
                  Cách 2: Gõ chữ ước mơ:
                </span>
                <textarea
                  rows={3}
                  placeholder="Nhập điều ước của con tại đây..."
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  className="kl-input"
                  style={{ fontSize: 14, resize: 'none' }}
                />
              </div>

              {/* Submit Wish Button */}
              <button
                type="submit"
                className="kl-btn kl-btn-primary kl-btn-block"
                style={{ fontSize: 16, padding: 16, borderRadius: 20, boxShadow: '0 6px 20px rgba(43,68,232,0.3)' }}
                disabled={!wishText.trim()}
              >
                <IoSend size={18} /> Gửi Điều Ước Cho Ba Mẹ (Tốn 50 Sao) 🧞‍♂️
              </button>
            </form>
          )}
        </div>

        {/* Right: Sent Wishes Stream */}
        <div className="kl-card" style={{ padding: 24, borderRadius: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 16 }}>
            Nhật Ký Điều Ước Đã Gửi 📜
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {D.wishes.map((w) => (
              <div
                key={w.id}
                style={{
                  padding: 16,
                  borderRadius: 16,
                  background: w.status === 'approved' ? 'var(--kl-green-soft)' : '#F8F9FD',
                  border: w.status === 'approved' ? '1px solid var(--kl-green)' : '1px solid var(--kl-border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{w.childName}</span>
                  <span
                    className="kl-badge"
                    style={{
                      background: w.status === 'approved' ? 'var(--kl-green)' : '#FFA900',
                      color: '#fff',
                      fontSize: 11,
                    }}
                  >
                    {w.status === 'approved' ? '✅ Ba mẹ đã duyệt' : '⏳ Đang chờ ba mẹ duyệt'}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--kl-text)', margin: 0, fontWeight: 600 }}>"{w.wishText}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--kl-muted)', marginTop: 8 }}>
                  <span>{w.hasAudio ? `🎙️ File ghi âm (${w.audioDuration})` : '📝 Văn bản'}</span>
                  <span>{w.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
