import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PET_CONFIG } from './pet.config';
import { activeStreak, applyFeed, computeMood, createPetState, feedsLeftToday, type PetState } from './pet.logic';

const TZ = 420; // UTC+7
const day = (n: number, hour = 9) => new Date(Date.UTC(2026, 0, 1 + n, hour - 7)); // hour theo giờ VN

/** Cho ăn tối đa mỗi ngày trong `days` ngày, trả về state cuối + số ngày đã dùng khi đạt stage */
function feedDaily(state: PetState, days: number, startDay = 0) {
  const reachedOn: Record<number, number> = {};
  for (let d = startDay; d < startDay + days; d++) {
    for (let i = 0; i < PET_CONFIG.maxFeedsPerDay; i++) {
      const r = applyFeed(state, day(d, 8 + i), TZ);
      assert.ok(r, 'còn lượt thì phải cho ăn được');
      state = r.state;
      if (r.evolved) reachedOn[state.stage] = d + 1;
    }
  }
  return { state, reachedOn };
}

describe('pet.logic', () => {
  it('nhịp lớn: 1→2 trong ngày đầu, các stage sau lâu dần, ~2 tháng mới max', () => {
    const { state, reachedOn } = feedDaily(createPetState('c1', 'cat'), 90);
    assert.equal(reachedOn[2], 1);
    assert.ok(reachedOn[3] - reachedOn[2] >= 6, 'stage 2→3 phải mất ~1 tuần');
    assert.ok(reachedOn[4] - reachedOn[3] > reachedOn[3] - reachedOn[2], 'stage sau lâu hơn stage trước');
    assert.ok(reachedOn[5] - reachedOn[4] > reachedOn[4] - reachedOn[3]);
    assert.ok(reachedOn[5] >= 50 && reachedOn[5] <= 70, `max ở ngày ${reachedOn[5]}, mong đợi ~2 tháng`);
    assert.equal(state.stage, PET_CONFIG.maxStage);
  });

  it('giới hạn số lần cho ăn mỗi ngày, sang ngày mới thì có lại', () => {
    let s = createPetState('c1', 'dog');
    for (let i = 0; i < PET_CONFIG.maxFeedsPerDay; i++) s = applyFeed(s, day(0, 10 + i), TZ)!.state;
    assert.equal(feedsLeftToday(s, day(0, 20), TZ), 0);
    assert.equal(applyFeed(s, day(0, 21), TZ), null);
    // 23h30 VN vẫn là cùng ngày; 0h30 hôm sau là ngày mới
    assert.equal(feedsLeftToday(s, new Date(Date.UTC(2026, 0, 1, 16, 30)), TZ), 0);
    assert.equal(feedsLeftToday(s, new Date(Date.UTC(2026, 0, 1, 17, 30)), TZ), PET_CONFIG.maxFeedsPerDay);
  });

  it('streak: liên tiếp thì tăng, bỏ 1 ngày thì về 1; mốc 14 ngày được thưởng EXP', () => {
    let s = createPetState('c1', 'fox');
    let bonusDays: number[] = [];
    for (let d = 0; d < 14; d++) {
      const r = applyFeed(s, day(d), TZ)!;
      if (r.streakBonus) bonusDays.push(d);
      s = r.state;
    }
    assert.equal(s.streakDays, 14);
    assert.deepEqual(bonusDays, [13]);
    assert.equal(activeStreak(s, day(14), TZ), 14);
    assert.equal(activeStreak(s, day(15), TZ), 0, 'bỏ 1 ngày → chuỗi đứt');
    s = applyFeed(s, day(15), TZ)!.state;
    assert.equal(s.streakDays, 1);
  });

  it('đã max stage vẫn cho ăn được nhưng không cộng EXP', () => {
    const s: PetState = { ...createPetState('c1', 'owl'), stage: PET_CONFIG.maxStage };
    const r = applyFeed(s, day(0), TZ)!;
    assert.equal(r.gainedExp, 0);
    assert.equal(r.state.stage, PET_CONFIG.maxStage);
    assert.equal(r.state.feedsToday, 1);
  });

  it('tâm trạng theo thời gian từ lần cho ăn gần nhất', () => {
    const fed = day(0, 9);
    assert.equal(computeMood(null, fed), 'neutral');
    assert.equal(computeMood(fed, new Date(fed.getTime() + 5 * 60_000)), 'excited');
    assert.equal(computeMood(fed, new Date(fed.getTime() + 3 * 3_600_000)), 'happy');
    assert.equal(computeMood(fed, new Date(fed.getTime() + 24 * 3_600_000)), 'neutral');
    assert.equal(computeMood(fed, new Date(fed.getTime() + 48 * 3_600_000)), 'sad');
  });
});
