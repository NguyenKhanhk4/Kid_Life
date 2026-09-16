import { useState } from 'react';
import { MOCK_KIDLIFE_DATA } from '@/shared/constants/kidlifeMockData';
import { IoSparkles, IoInformationCircleOutline } from 'react-icons/io5';

const D = MOCK_KIDLIFE_DATA;

export default function ParentAiAnalyticsPage() {
  const [taskApplied, setTaskApplied] = useState(false);

  // Radar chart SVG calculation (4 axes: Tự lập (top), Sức khỏe (right), Trí tuệ (bottom), Tình cảm (left))
  const values = [85, 45, 72, 90];
  const center = 140;
  const radius = 100;

  const getPoint = (val: number, angleDeg: number) => {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return `${x},${y}`;
  };

  const polyPoints = [
    getPoint(values[0], 0),
    getPoint(values[1], 90),
    getPoint(values[2], 180),
    getPoint(values[3], 270),
  ].join(' ');

  const handleApplyAiTask = () => {
    setTaskApplied(true);
    setTimeout(() => {
      alert('Đã tự động tạo & phát hành nhiệm vụ "Đánh răng & Ngủ trước 21h" (+50 XP) thành công sang ứng dụng của bé Minh Anh! 🚀');
    }, 500);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IoSparkles color="var(--kl-purple)" size={20} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-purple)' }}>Báo cáo trí tuệ nhân tạo</span>
          </div>
          <h1>Báo Cáo Phân Tích Kỹ Năng AI 📊</h1>
          <p className="page-subtitle">Phân tích đa chiều sự phát triển toàn diện của bé Minh Anh</p>
        </div>
        <span className="kl-badge" style={{ background: '#F0E8FF', color: 'var(--kl-purple)', fontSize: 13, padding: '8px 16px' }}>
          ✨ AI Cập nhật: Hôm nay, 08:00
        </span>
      </div>

      <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
        {/* Left: Radar Chart & Metrics */}
        <div className="kl-card" style={{ padding: 28, borderRadius: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>
              Biểu đồ Radar 4 Chỉ Số Cốt Lõi
            </h2>
            <span style={{ fontSize: 12, color: 'var(--kl-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <IoInformationCircleOutline size={16} /> Chu kỳ tháng 9/2026
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0 24px' }}>
            {/* SVG Radar Chart */}
            <div style={{ position: 'relative', width: 280, height: 280 }}>
              <svg width="280" height="280" viewBox="0 0 280 280">
                {/* Concentric Grid Circles */}
                {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
                  <polygon
                    key={idx}
                    points={[
                      `${center},${center - radius * scale}`,
                      `${center + radius * scale},${center}`,
                      `${center},${center + radius * scale}`,
                      `${center - radius * scale},${center}`,
                    ].join(' ')}
                    fill="none"
                    stroke="#E8EDFC"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Axes Lines */}
                <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#D5DEFA" strokeWidth="1.5" />
                <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#D5DEFA" strokeWidth="1.5" />

                {/* Filled Radar Area */}
                <polygon
                  points={polyPoints}
                  fill="rgba(43, 68, 232, 0.25)"
                  stroke="var(--kl-primary)"
                  strokeWidth="3"
                />

                {/* Data Points */}
                {[
                  { x: center, y: center - (values[0] / 100) * radius },
                  { x: center + (values[1] / 100) * radius, y: center },
                  { x: center, y: center + (values[2] / 100) * radius },
                  { x: center - (values[3] / 100) * radius, y: center },
                ].map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="var(--kl-primary)" stroke="#fff" strokeWidth="2" />
                ))}

                {/* Axis Labels */}
                <text x={center} y={center - radius - 12} textAnchor="middle" fill="#2B44E8" fontWeight="800" fontSize="13">🏠 Tự lập (85%)</text>
                <text x={center + radius + 14} y={center + 4} textAnchor="start" fill="#FF4785" fontWeight="800" fontSize="13">💪 Sức khỏe (45%)</text>
                <text x={center} y={center + radius + 22} textAnchor="middle" fill="#8E54E9" fontWeight="800" fontSize="13">🧠 Trí tuệ (72%)</text>
                <text x={center - radius - 14} y={center + 4} textAnchor="end" fill="#FF6B9D" fontWeight="800" fontSize="13">💖 Tình cảm (90%)</text>
              </svg>
            </div>

            {/* Indicator Details Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}>
              {D.skills.map((s) => {
                const diff = s.value - s.prev;
                const isPos = diff >= 0;
                return (
                  <div key={s.key} style={{ padding: 14, borderRadius: 16, background: '#F8F9FD', border: '1px solid #E8EDFC' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.icon} {s.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isPos ? 'var(--kl-green)' : 'var(--kl-pink)' }}>
                        {isPos ? `+${diff}%` : `${diff}%`}
                      </span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--kl-primary-dark)', margin: '4px 0' }}>
                      {s.value}%
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--kl-muted)' }}>{s.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: AI Recommendation Box */}
        <div style={{ display: 'grid', gap: 20 }}>
          <div
            className="kl-card"
            style={{
              padding: 24,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #FAF7FF 0%, #F3ECFF 100%)',
              border: '2px solid rgba(142, 84, 233, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--kl-purple)', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 22 }}>
                <IoSparkles />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-purple-dark)' }}>Khuyến Nghị Giáo Dục AI</h3>
                <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Phát hiện bởi KidLife AI Engine</span>
              </div>
            </div>

            <div style={{ background: '#fff', padding: 16, borderRadius: 16, marginBottom: 18, border: '1px solid #EAE0F8' }}>
              <p style={{ fontSize: 14, color: '#4A3B66', lineHeight: 1.6, margin: 0 }}>
                💡 <b>Nhận xét tháng 9:</b> Bé Minh Anh phát triển vượt bậc về <b>Tình cảm (90%)</b> và <b>Tự lập (85%)</b>.
                Tuy nhiên chỉ số <b>Sức khỏe giảm 17%</b> so với tháng trước do có 3 đêm bé đi ngủ sau 21h30.
              </p>
            </div>

            <div style={{ background: 'rgba(255,71,133,0.08)', padding: 16, borderRadius: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#D81B60', display: 'block', marginBottom: 6 }}>
                🎯 Nhiệm vụ AI gợi ý bổ sung ngay:
              </span>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kl-text)' }}>
                "Đánh răng sạch sẽ & Ngủ trước 21:00 tối"
              </div>
              <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>Thưởng: +50 XP • Giúp cải thiện +15% chỉ số Sức khỏe</span>
            </div>

            <button
              onClick={handleApplyAiTask}
              className="kl-btn kl-btn-block"
              style={{
                background: taskApplied ? 'var(--kl-green)' : 'var(--kl-purple)',
                color: '#fff',
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 800,
                borderRadius: 18,
                boxShadow: '0 6px 16px rgba(142, 84, 233, 0.3)',
              }}
              disabled={taskApplied}
            >
              {taskApplied ? '✅ Đã áp dụng nhiệm vụ cho bé' : '🚀 Áp dụng gợi ý nhiệm vụ AI'}
            </button>
          </div>

          {/* AI Insights Card */}
          <div className="kl-card" style={{ padding: 20, borderRadius: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 12 }}>
              📈 Xu Hướng Phát Triển Mới
            </h4>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: 'var(--kl-muted)', display: 'grid', gap: 10 }}>
              <li>Thói quen dọn dẹp phòng khách đã đi vào nếp (đạt chuỗi 11 ngày).</li>
              <li>Bé phản ứng tốt với các phần thưởng trải nghiệm gia đình.</li>
              <li>Khuyên ba mẹ tiếp tục duy trì khen ngợi để nuôi dưỡng sự tự tin.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
