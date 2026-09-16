import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';

const D = MOCK_KIDLIFE_DATA;

export default function ParentCommunityPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <h1>Cộng đồng KidLife 🏆</h1>
          <p className="page-subtitle">Thi đua và chia sẻ kinh nghiệm cùng các gia đình khác</p>
        </div>
      </div>

      <div className="web-grid-2-1">
        {/* Leaderboard */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <span style={{ fontSize: 20 }}>🏆</span>
              <h2 className="section-title">Thử thách gia đình</h2>
            </div>
            <span className="kl-badge" style={{ background: 'var(--kl-orange-soft)', color: '#B36A00' }}>
              🔥 Đang diễn ra
            </span>
          </div>

          <div className="kl-card" style={{ padding: 20 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--kl-primary)' }}>
                Thử thách rèn luyện 14 ngày
              </span>
              <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 4 }}>Còn 3 ngày nữa kết thúc</p>
            </div>

            {D.leaderboard.map((entry) => (
              <div key={entry.rank} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
                borderBottom: '1px solid var(--kl-border)',
              }}>
                <span style={{ width: 32, fontSize: entry.rank <= 3 ? 22 : 15, fontWeight: 800, textAlign: 'center', color: entry.rank <= 3 ? 'var(--kl-text)' : 'var(--kl-muted)' }}>
                  {entry.medal || `#${entry.rank}`}
                </span>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--kl-primary-soft)', display: 'grid', placeItems: 'center', fontSize: 22 }}>
                  {entry.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{entry.family}</div>
                  <div style={{ fontSize: 12, color: 'var(--kl-muted)' }}>🔥 {entry.streak} ngày streak</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--kl-primary)' }}>
                  {entry.points.toLocaleString()} đ
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forum preview */}
        <div>
          <div className="section-header">
            <div className="section-title-row">
              <span style={{ fontSize: 20 }}>💬</span>
              <h2 className="section-title">Diễn đàn phụ huynh</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            <div className="kl-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--kl-purple-soft)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                  👩
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Nguyễn Thanh Hà</div>
                  <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 6, lineHeight: 1.5 }}>
                    Mọi người ơi, mình muốn hỏi cách dạy con tự giác đánh răng mà không cần nhắc. Bé nhà mình 5 tuổi mà vẫn chưa chịu tự làm...
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--kl-muted)' }}>
                    <span>❤️ 24</span>
                    <span>💬 12 bình luận</span>
                    <span>3 giờ trước</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="kl-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--kl-green-soft)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                  👨
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Trần Minh Đức</div>
                  <p style={{ fontSize: 13, color: 'var(--kl-muted)', marginTop: 6, lineHeight: 1.5 }}>
                    Chia sẻ kinh nghiệm: Mình dùng KidLife để tạo streak 14 ngày cho con, hiệu quả lắm! Con mình giờ tự giác quét nhà mỗi ngày 🎉
                  </p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: 'var(--kl-muted)' }}>
                    <span>❤️ 45</span>
                    <span>💬 8 bình luận</span>
                    <span>5 giờ trước</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
