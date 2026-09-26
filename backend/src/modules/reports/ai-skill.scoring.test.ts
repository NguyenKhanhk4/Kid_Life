import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildRecommendation,
  computeScores,
  deltaPercent,
  elapsedDays,
  elapsedRatio,
  monthPeriodOf,
  monthRange,
  shiftMonth,
  type MonthActivity,
} from './ai-skill.scoring';

const VN = 420;
const base: MonthActivity = { missions: {}, quizRewards: 0, activeDays: 0, daysInPeriod: 30, penalties: 0 };

describe('ai-skill.scoring', () => {
  it('Tự lập/Sức khỏe/Trí tuệ = hoạt động / mục tiêu, tối đa 100; "khac" tính vào Tự lập', () => {
    const s = computeScores({ ...base, missions: { nha_cua: 4, ky_nang: 2, khac: 2, the_chat: 30, hoc_tap: 3 }, quizRewards: 3 });
    assert.equal(s.tu_lap, 50);
    assert.equal(s.suc_khoe, 100);
    assert.equal(s.tri_tue, 50);
  });

  it('tháng đang diễn ra: mục tiêu co theo phần tháng đã qua', () => {
    const half = computeScores({ ...base, missions: { the_chat: 6 } }, 0.5);
    assert.equal(half.suc_khoe, 100);
  });

  it('Chuyên cần = ngày có hoạt động / ngày đã qua, trừ 10 điểm mỗi lần bị phạt, không âm', () => {
    assert.equal(computeScores({ ...base, activeDays: 15, daysInPeriod: 20 }).chuyen_can, 75);
    assert.equal(computeScores({ ...base, activeDays: 15, daysInPeriod: 20, penalties: 2 }).chuyen_can, 55);
    assert.equal(computeScores({ ...base, activeDays: 1, daysInPeriod: 20, penalties: 3 }).chuyen_can, 0);
  });

  it('delta %: null khi không có kỳ trước hoặc kỳ trước = 0 (không chia cho 0)', () => {
    assert.equal(deltaPercent(50, null), null);
    assert.equal(deltaPercent(50, 0), null);
    assert.equal(deltaPercent(60, 50), 20);
    assert.equal(deltaPercent(17, 50), -66);
  });

  it('tháng theo giờ VN: 1h sáng 1/9 giờ VN (18h 31/8 UTC) đã là tháng 9', () => {
    assert.equal(monthPeriodOf(new Date('2026-08-31T18:00:00Z'), VN), '2026-09');
    assert.equal(shiftMonth('2026-01', -1), '2025-12');
    const { start, end } = monthRange('2026-09', VN);
    assert.equal(start.toISOString(), '2026-08-31T17:00:00.000Z');
    assert.equal(end.toISOString(), '2026-09-30T17:00:00.000Z');
    assert.equal(elapsedRatio('2026-08', new Date('2026-09-10T00:00:00Z'), VN), 1);
    assert.equal(elapsedDays('2026-08', new Date('2026-09-10T00:00:00Z'), VN), 31);
    assert.equal(elapsedDays('2026-09', new Date('2026-09-15T17:00:00Z'), VN), 15);
  });

  it('lời khuyên: trọng tâm là chỉ số thấp nhất, nhiệm vụ đúng category', () => {
    const rec = buildRecommendation({
      childName: 'Na',
      period: '2026-09',
      scores: { tu_lap: 90, suc_khoe: 20, tri_tue: 60, chuyen_can: 70 },
      deltas: { tu_lap: 10, suc_khoe: -50, tri_tue: null, chuyen_can: 0 },
    });
    assert.equal(rec.focus, 'suc_khoe');
    assert.equal(rec.task.category, 'the_chat');
    assert.match(rec.text, /Tự lập \(90%\)/);
    assert.match(rec.text, /Sức khỏe giảm 50%/);
  });

  it('chưa có hoạt động nào → lời khuyên bắt đầu nhẹ nhàng', () => {
    const zero = { tu_lap: 0, suc_khoe: 0, tri_tue: 0, chuyen_can: 0 };
    const rec = buildRecommendation({ childName: 'Na', period: '2026-09', scores: zero, deltas: { tu_lap: null, suc_khoe: null, tri_tue: null, chuyen_can: null } });
    assert.match(rec.text, /chưa có hoạt động/);
  });
});
