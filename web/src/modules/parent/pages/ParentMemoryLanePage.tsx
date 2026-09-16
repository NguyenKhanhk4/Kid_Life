import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoCamera, IoFilm, IoBook, IoHeart, IoCloudDone, IoSparkles, IoClose } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

export default function ParentMemoryLanePage() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPhotobookModal, setShowPhotobookModal] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    m1: 5, m2: 8, m3: 12, m4: 6, m5: 4
  });

  const handleHeart = (id: string) => {
    setLikesCount(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IoSparkles color="var(--kl-pink)" size={20} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-pink)' }}>Memory Lane Premium 💖</span>
          </div>
          <h1>Nhật Ký Hành Trình & AI Video Recap 📷</h1>
          <p className="page-subtitle">Lưu giữ trọn vẹn từng khoảnh khắc tự lập vô giá của con</p>
        </div>
        <span className="kl-badge" style={{ background: '#FFF0F5', color: 'var(--kl-pink)', fontSize: 13, padding: '8px 16px' }}>
          <IoCloudDone size={16} /> Cloud Storage: Vô Hạn (Full HD)
        </span>
      </div>

      {/* Top Action Banners */}
      <div className="web-grid-2" style={{ marginBottom: 24 }}>
        {/* Banner 1: AI Video Recap */}
        <div
          className="kl-card"
          style={{
            padding: 24,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #FF4785 0%, #FF758C 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: 12, opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ✨ AI Video Auto Recap
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>Dựng Clip Kỷ Niệm Tháng 9</h3>
            <p style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>AI gom chuỗi ảnh bé dọn dẹp nhà cửa & ghép nhạc cảm động</p>
            <button
              onClick={() => setShowVideoModal(true)}
              className="kl-btn"
              style={{ background: '#fff', color: 'var(--kl-pink)', fontWeight: 800, marginTop: 14, fontSize: 14, borderRadius: 20 }}
            >
              🎬 Xem & Tạo Video Recap
            </button>
          </div>
          <div style={{ fontSize: 64, opacity: 0.9 }}>🎥</div>
        </div>

        {/* Banner 2: Photobook PDF */}
        <div
          className="kl-card"
          style={{
            padding: 24,
            borderRadius: 24,
            background: 'linear-gradient(135deg, #2B44E8 0%, #6E7DFB 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: 12, opacity: 0.9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              📖 Dàn Trang Tự Động
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>Xuất Sách Ảnh Photobook</h3>
            <p style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Tự động đóng tập Photobook PDF 24 trang kỷ niệm in ấn</p>
            <button
              onClick={() => setShowPhotobookModal(true)}
              className="kl-btn"
              style={{ background: '#fff', color: 'var(--kl-primary)', fontWeight: 800, marginTop: 14, fontSize: 14, borderRadius: 20 }}
            >
              📄 Xem Trước Photobook PDF
            </button>
          </div>
          <div style={{ fontSize: 64, opacity: 0.9 }}>📚</div>
        </div>
      </div>

      {/* Main Section: Photo Gallery Stream */}
      <div className="kl-card" style={{ padding: 24, borderRadius: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
            Dòng Thời Gian Việc Nhà Của Bé Minh Anh
          </h2>
          <span style={{ fontSize: 13, color: 'var(--kl-muted)' }}>
            Tổng cộng: <b>{D.memoryLane.totalPhotos} khoảnh khắc</b>
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="web-grid-3">
          {D.memoryLane.photos.map((item) => (
            <div
              key={item.id}
              className="kl-card"
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid var(--kl-border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Placeholder Frame */}
              <div
                style={{
                  height: 160,
                  background: 'radial-gradient(circle at 50% 50%, #F0F4FF 0%, #E2EAFF 100%)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 64,
                  position: 'relative',
                }}
              >
                {item.imageEmoji}
                <span className="kl-badge" style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', color: 'var(--kl-primary)', fontSize: 11, fontWeight: 700 }}>
                  {item.category}
                </span>
              </div>

              {/* Info & Caption */}
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>{item.title}</h4>
                  <span style={{ fontSize: 12, color: 'var(--kl-muted)', display: 'block', marginTop: 4 }}>
                    📅 {item.date} • Tài khoản bé nộp bài
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid #F0F2F8' }}>
                  <button
                    onClick={() => handleHeart(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--kl-pink)', fontWeight: 800, fontSize: 13, background: '#FFF0F5', padding: '6px 12px', borderRadius: 16 }}
                  >
                    <IoHeart size={16} /> {likesCount[item.id]} Tim
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>HD Cloud ✅</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal 1: AI Video Recap Preview */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: 20 }}>
          <div className="kl-card" style={{ width: '100%', maxWidth: 520, padding: 28, borderRadius: 28, position: 'relative', animation: 'scaleUp 0.2s ease' }}>
            <button
              onClick={() => setShowVideoModal(false)}
              style={{ position: 'absolute', top: 20, right: 20, fontSize: 22, color: 'var(--kl-muted)' }}
            >
              <IoClose />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 48 }}>🎬✨</span>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--kl-primary-dark)', marginTop: 8 }}>
                AI Video Recap Tháng 9/2026
              </h3>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Thời lượng 1:45 • BGM Nhạc Nền Cảm Động</p>
            </div>

            <div style={{ height: 220, background: '#0F172A', borderRadius: 20, display: 'grid', placeItems: 'center', color: '#fff', textAlign: 'center', padding: 20, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 40, marginBottom: 10 }}>▶️</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Đang phát: "Minh Anh - Hành Trình Lớn Lên"</div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Ghép từ 42 bức ảnh việc nhà trong tháng 9</div>
              </div>
            </div>

            <button
              onClick={() => { alert('Đã tải video recap về máy thành công! 📲'); setShowVideoModal(false); }}
              className="kl-btn kl-btn-primary kl-btn-block"
              style={{ fontSize: 15, borderRadius: 18 }}
            >
              ⬇️ Tải Video HD Về Điện Thoại
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Photobook PDF Preview */}
      {showPhotobookModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 1000, padding: 20 }}>
          <div className="kl-card" style={{ width: '100%', maxWidth: 560, padding: 28, borderRadius: 28, position: 'relative', animation: 'scaleUp 0.2s ease' }}>
            <button
              onClick={() => setShowPhotobookModal(false)}
              style={{ position: 'absolute', top: 20, right: 20, fontSize: 22, color: 'var(--kl-muted)' }}
            >
              <IoClose />
            </button>

            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 48 }}>📖✨</span>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--kl-primary-dark)', marginTop: 8 }}>
                Bản Thảo Photobook PDF 2026
              </h3>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)' }}>Tạp chí kỷ niệm in ấn gia đình • 24 Trang chuẩn khổ A4</p>
            </div>

            {/* Photobook Spread Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#F1F5F9', padding: 16, borderRadius: 18, marginBottom: 20, border: '1px stroke #CBD5E1' }}>
              <div style={{ background: '#fff', padding: 14, borderRadius: 12, textAlign: 'center', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: 32 }}>🧹</span>
                <span style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Trang 1: Việc Nhà Đầu Tiên</span>
              </div>
              <div style={{ background: '#fff', padding: 14, borderRadius: 12, textAlign: 'center', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: 32 }}>🏆</span>
                <span style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>Trang 2: Huy Hiệu Siêu Sao</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                onClick={() => { alert('Đã xuất file PDF Photobook 24 trang thành công! 📄'); setShowPhotobookModal(false); }}
                className="kl-btn kl-btn-primary"
                style={{ fontSize: 14, borderRadius: 16 }}
              >
                📄 Tải File PDF Về Máy
              </button>
              <button
                onClick={() => { alert('Đã gửi yêu cầu in ấn tới đối tác in sách! Sách sẽ giao tới nhà sau 3-5 ngày. 🚚'); setShowPhotobookModal(false); }}
                className="kl-btn"
                style={{ background: '#E85D04', color: '#fff', fontSize: 14, borderRadius: 16, fontWeight: 700 }}
              >
                🚚 Đặt In Sách Giao Tận Nhà
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
