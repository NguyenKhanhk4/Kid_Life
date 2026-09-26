import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoSparkles, IoInformationCircleOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { RadarChart } from '@/features/ai-skill/components/RadarChart';
import { useAiSkillReport } from '@/features/ai-skill/useAiSkillReport';
import type { SkillAxis, SkillKey } from '@/features/ai-skill/types';

const SKILL_STYLE: Record<SkillKey, { icon: string; color: string; desc: string }> = {
  tu_lap: { icon: '🏠', color: '#2B44E8', desc: 'Việc nhà, kỹ năng & việc khác' },
  suc_khoe: { icon: '💪', color: '#FF4785', desc: 'Nhiệm vụ vận động, thể chất' },
  tri_tue: { icon: '🧠', color: '#8E54E9', desc: 'Nhiệm vụ học tập & bài kiểm tra' },
  chuyen_can: { icon: '🔥', color: '#FF8A00', desc: 'Ngày có làm nhiệm vụ hoặc chăm thú cưng' },
};

const CATEGORY_LABEL: Record<string, string> = {
  hoc_tap: 'Học tập',
  nha_cua: 'Nhà cửa',
  the_chat: 'Thể chất',
  ky_nang: 'Kỹ năng',
  khac: 'Khác',
};

/** "2026-09" ± n tháng */
function shiftMonth(period: string, delta: number) {
  const [y, m] = period.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}
const thisMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
const monthLabel = (period: string) => {
  const [y, m] = period.split('-');
  return `tháng ${Number(m)}/${y}`;
};

function Delta({ axis }: { axis: SkillAxis }) {
  if (axis.deltaPercent === null) {
    return <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--kl-muted)' }} title="Chưa có tháng trước để so sánh">—</span>;
  }
  const up = axis.deltaPercent >= 0;
  return (
    <span style={{ fontSize: 12, fontWeight: 800, color: up ? 'var(--kl-green)' : 'var(--kl-pink)' }}>
      {up ? '▲' : '▼'} {up ? '+' : ''}
      {axis.deltaPercent}%
    </span>
  );
}

export default function ParentAiAnalyticsPage() {
  /** undefined = tháng hiện tại */
  const [month, setMonth] = useState<string | undefined>(undefined);
  const { child, childStatus, report, loading, error, applying, notice, reload, applyTask } = useAiSkillReport(month);

  if (childStatus === 'no-auth') return <div className="kl-card" style={{ padding: 28 }}>Vui lòng đăng nhập để xem báo cáo.</div>;
  if (childStatus === 'no-child') {
    return <div className="kl-card" style={{ padding: 28 }}>Chưa có hồ sơ bé nào. Hãy tạo hồ sơ bé ở mục Tài khoản trước nhé.</div>;
  }

  const viewing = report?.monthPeriod;
  const isCurrent = !month;

  return (
    <div>
      {/* Page Header */}
      <div className="web-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <IoSparkles color="var(--kl-purple)" size={20} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--kl-purple)' }}>Báo cáo phát triển kỹ năng</span>
          </div>
          <h1>Báo Cáo Phân Tích Kỹ Năng 📊</h1>
          <p className="page-subtitle">Phân tích 4 chỉ số phát triển của bé {child?.name ?? '...'} từ hoạt động thật trong tháng</p>
        </div>
        {report && (
          <span className="kl-badge" style={{ background: '#F0E8FF', color: 'var(--kl-purple)', fontSize: 13, padding: '8px 16px' }}>
            Cập nhật: {new Date(report.updatedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
          </span>
        )}
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="kl-card"
            style={{ padding: '12px 16px', marginBottom: 16, background: '#F0FDF4', border: '1px solid #BBF7D0', fontWeight: 700, color: '#166534' }}
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      {error && !report && (
        <div className="kl-card" style={{ padding: 24, marginBottom: 16 }}>
          Không tải được báo cáo: {error}{' '}
          <button className="kl-btn kl-btn-primary kl-btn-sm" onClick={() => void reload()}>Thử lại</button>
        </div>
      )}

      {(loading && !report) ? (
        <div className="kl-card" style={{ padding: 28, textAlign: 'center', color: 'var(--kl-muted)' }}>Đang phân tích hoạt động của bé… 📊</div>
      ) : report && (
        <div className="web-grid-2-1" style={{ marginBottom: 24 }}>
          {/* Left: Radar Chart & Metrics */}
          <div className="kl-card" style={{ padding: 28, borderRadius: 24, opacity: loading ? 0.6 : 1, transition: 'opacity .2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 12, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--kl-primary-dark)' }}>Biểu đồ Radar 4 Chỉ Số Cốt Lõi</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--kl-muted)' }}>
                <button
                  className="kl-btn kl-btn-sm"
                  aria-label="Tháng trước"
                  onClick={() => setMonth(shiftMonth(viewing!, -1))}
                  style={{ padding: '4px 8px' }}
                >
                  <IoChevronBack />
                </button>
                <span>Chu kỳ {monthLabel(viewing!)}</span>
                <button
                  className="kl-btn kl-btn-sm"
                  aria-label="Tháng sau"
                  disabled={isCurrent}
                  onClick={() => {
                    const next = shiftMonth(viewing!, 1);
                    setMonth(next >= thisMonth() ? undefined : next); // tới tháng hiện tại → báo cáo đang diễn ra
                  }}
                  style={{ padding: '4px 8px', opacity: isCurrent ? 0.4 : 1 }}
                >
                  <IoChevronForward />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 20px' }}>
              <RadarChart
                key={`${report.childId}-${report.monthPeriod}`}
                axes={report.axes.map((a) => ({
                  label: `${SKILL_STYLE[a.key].icon} ${a.label}`,
                  value: a.score,
                  color: SKILL_STYLE[a.key].color,
                }))}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, width: '100%' }}>
              {report.axes.map((a) => (
                <div key={a.key} style={{ padding: 14, borderRadius: 16, background: '#F8F9FD', border: '1px solid #E8EDFC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: SKILL_STYLE[a.key].color }}>
                      {SKILL_STYLE[a.key].icon} {a.label}
                    </span>
                    <Delta axis={a} />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--kl-primary-dark)', margin: '4px 0' }}>{a.score}%</div>
                  <span style={{ fontSize: 11, color: 'var(--kl-muted)' }}>
                    {a.activities} {a.key === 'chuyen_can' ? 'ngày' : 'hoạt động'} • {SKILL_STYLE[a.key].desc}
                    {a.previousScore !== null && ` • tháng trước ${a.previousScore}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Recommendation Box */}
          <div style={{ display: 'grid', gap: 20, alignContent: 'start' }}>
            <motion.div
              key={report.reportId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
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
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--kl-purple-dark)' }}>Khuyến Nghị Giáo Dục</h3>
                  <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>
                    {report.generatedBy === 'llm' ? 'Sinh bởi AI' : 'Gợi ý tự động từ dữ liệu hoạt động của bé'}
                  </span>
                </div>
              </div>

              <div style={{ background: '#fff', padding: 16, borderRadius: 16, marginBottom: 18, border: '1px solid #EAE0F8' }}>
                <p style={{ fontSize: 14, color: '#4A3B66', lineHeight: 1.6, margin: 0 }}>💡 {report.recommendation}</p>
              </div>

              <div style={{ background: 'rgba(255,71,133,0.08)', padding: 16, borderRadius: 16, marginBottom: 20 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#D81B60', display: 'block', marginBottom: 6 }}>
                  🎯 Nhiệm vụ gợi ý bổ sung:
                </span>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--kl-text)' }}>"{report.suggestedTask.title}"</div>
                {report.suggestedTask.description && (
                  <div style={{ fontSize: 13, color: 'var(--kl-muted)', margin: '4px 0' }}>{report.suggestedTask.description}</div>
                )}
                <span style={{ fontSize: 12, color: 'var(--kl-muted)' }}>
                  Thưởng: +{report.suggestedTask.reward_xp} XP • Loại: {CATEGORY_LABEL[report.suggestedTask.category] ?? report.suggestedTask.category}
                </span>
              </div>

              <motion.button
                whileTap={report.isTaskApplied || applying ? undefined : { scale: 0.95 }}
                onClick={() => void applyTask()}
                className="kl-btn kl-btn-block"
                style={{
                  background: report.isTaskApplied ? 'var(--kl-green)' : 'var(--kl-purple)',
                  color: '#fff',
                  padding: '14px 20px',
                  fontSize: 15,
                  fontWeight: 800,
                  borderRadius: 18,
                  boxShadow: '0 6px 16px rgba(142, 84, 233, 0.3)',
                  opacity: applying ? 0.7 : 1,
                }}
                disabled={report.isTaskApplied || applying}
              >
                {report.isTaskApplied ? 'Đã áp dụng ✓' : applying ? 'Đang giao nhiệm vụ…' : '🚀 Áp dụng gợi ý nhiệm vụ'}
              </motion.button>
            </motion.div>

            {/* Cách tính điểm (minh bạch cho phụ huynh) */}
            <div className="kl-card" style={{ padding: 20, borderRadius: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: 'var(--kl-primary-dark)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <IoInformationCircleOutline size={18} /> Cách tính điểm
              </h4>
              <ul style={{ paddingLeft: 18, margin: 0, fontSize: 13, color: 'var(--kl-muted)', display: 'grid', gap: 8 }}>
                <li>Điểm tính từ hoạt động thật của bé (nhiệm vụ đã được duyệt) so với mục tiêu tháng.</li>
                <li>Tự lập: 16 nhiệm vụ nhà cửa/kỹ năng/khác • Sức khỏe: 12 nhiệm vụ thể chất • Trí tuệ: 12 nhiệm vụ học tập.</li>
                <li>Chuyên cần: số ngày bé có hoạt động (nhiệm vụ được duyệt hoặc chăm thú cưng) / số ngày đã qua, trừ 10 điểm mỗi lần bị phạt.</li>
                <li>Tháng đang diễn ra: mục tiêu tính theo số ngày đã qua.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
