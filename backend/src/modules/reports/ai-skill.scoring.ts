/**
 * Logic thuần của báo cáo kỹ năng — không đụng DB/HTTP, test độc lập (ai-skill.scoring.test.ts).
 *
 * CÔNG THỨC TẠM (chưa có AI), mọi số liệu đều là hoạt động THẬT của bé trong tháng:
 *
 *   Tự lập / Sức khỏe / Trí tuệ: điểm = min(100, round(số hoạt động / mục tiêu tháng × 100))
 *     Tự lập   ← nhiệm vụ nha_cua + ky_nang + khac          (mục tiêu 16/tháng ≈ 4/tuần)
 *     Sức khỏe ← nhiệm vụ the_chat                          (mục tiêu 12/tháng ≈ 3/tuần)
 *     Trí tuệ  ← nhiệm vụ hoc_tap + lần nhận thưởng quiz    (mục tiêu 12/tháng)
 *     Tháng đang diễn ra: mục tiêu tính theo phần tháng đã trôi qua (ngày 10/30 → mục tiêu × 10/30).
 *
 *   Chuyên cần: điểm = round(số ngày có hoạt động / số ngày đã qua × 100) − 10 × số lần bị phạt
 *     (ngày có hoạt động = ngày có nhiệm vụ được duyệt hoặc có cho thú cưng ăn)
 */

export const SKILL_KEYS = ['tu_lap', 'suc_khoe', 'tri_tue', 'chuyen_can'] as const;
export type SkillKey = (typeof SKILL_KEYS)[number];

export const SKILL_LABEL: Record<SkillKey, string> = {
  tu_lap: 'Tự lập',
  suc_khoe: 'Sức khỏe',
  tri_tue: 'Trí tuệ',
  chuyen_can: 'Chuyên cần',
};

/** Mục tiêu tháng của các chỉ số tính theo số hoạt động */
export const MONTHLY_TARGET: Record<Exclude<SkillKey, 'chuyen_can'>, number> = { tu_lap: 16, suc_khoe: 12, tri_tue: 12 };
export const PENALTY_POINTS = 10;

/** Dữ liệu hoạt động của bé trong 1 tháng (service đếm từ DB). */
export interface MonthActivity {
  /** số nhiệm vụ đã được duyệt theo category của module missions */
  missions: Partial<Record<'hoc_tap' | 'nha_cua' | 'the_chat' | 'ky_nang' | 'khac', number>>;
  quizRewards: number;
  /** số ngày khác nhau có nhiệm vụ được duyệt hoặc có chăm thú cưng */
  activeDays: number;
  /** số ngày của kỳ đã trôi qua (tháng cũ = số ngày của tháng) */
  daysInPeriod: number;
  /** số lần bị phạt (module penalties) */
  penalties: number;
}

export type SkillScores = Record<SkillKey, number>;

/** Số hoạt động của từng chỉ số (Chuyên cần = số ngày có hoạt động) */
export function activityPoints(a: MonthActivity): SkillScores {
  const m = (k: keyof MonthActivity['missions']) => a.missions[k] ?? 0;
  return {
    tu_lap: m('nha_cua') + m('ky_nang') + m('khac'),
    suc_khoe: m('the_chat'),
    tri_tue: m('hoc_tap') + a.quizRewards,
    chuyen_can: a.activeDays,
  };
}

/** elapsedRatio: phần tháng đã trôi qua (0..1], tháng đã kết thúc = 1 */
export function computeScores(a: MonthActivity, elapsedRatio = 1): SkillScores {
  const points = activityPoints(a);
  const ratio = Math.min(1, Math.max(elapsedRatio, 1 / 31));
  const byTarget = (k: keyof typeof MONTHLY_TARGET) =>
    Math.min(100, Math.round((points[k] / (MONTHLY_TARGET[k] * ratio)) * 100));
  const attendance = Math.round((a.activeDays / Math.max(1, a.daysInPeriod)) * 100) - PENALTY_POINTS * a.penalties;
  return {
    tu_lap: byTarget('tu_lap'),
    suc_khoe: byTarget('suc_khoe'),
    tri_tue: byTarget('tri_tue'),
    chuyen_can: Math.max(0, Math.min(100, attendance)),
  };
}

/** % thay đổi so với kỳ trước; null nếu không có kỳ trước hoặc kỳ trước = 0 (không chia cho 0). */
export function deltaPercent(current: number, previous: number | null | undefined): number | null {
  if (previous === null || previous === undefined || previous === 0) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

// ─── Tháng theo múi giờ ─────────────────────────────────────────────────────

const pad = (n: number) => String(n).padStart(2, '0');

/** "2026-09" theo giờ địa phương (tzOffsetMinutes, VN = 420) */
export function monthPeriodOf(date: Date, tzOffsetMinutes: number): string {
  const local = new Date(date.getTime() + tzOffsetMinutes * 60_000);
  return `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}`;
}

export function shiftMonth(period: string, delta: number): string {
  const [y, m] = period.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

/** [start, end) của tháng theo giờ địa phương, quy ra UTC */
export function monthRange(period: string, tzOffsetMinutes: number): { start: Date; end: Date } {
  const [y, m] = period.split('-').map(Number);
  const offset = tzOffsetMinutes * 60_000;
  return {
    start: new Date(Date.UTC(y, m - 1, 1) - offset),
    end: new Date(Date.UTC(y, m, 1) - offset),
  };
}

/** Phần tháng đã trôi qua tại thời điểm now (tháng cũ = 1) */
export function elapsedRatio(period: string, now: Date, tzOffsetMinutes: number): number {
  const { start, end } = monthRange(period, tzOffsetMinutes);
  if (now >= end) return 1;
  return Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime()));
}

/** Số ngày của tháng đã trôi qua tính cả hôm nay (tháng cũ = số ngày của tháng) */
export function elapsedDays(period: string, now: Date, tzOffsetMinutes: number): number {
  const { start, end } = monthRange(period, tzOffsetMinutes);
  const until = now < end ? now : end;
  return Math.max(1, Math.ceil((until.getTime() - start.getTime()) / 86_400_000));
}

// ─── Lời khuyên + nhiệm vụ gợi ý (theo quy tắc) ─────────────────────────────

export interface SuggestedTask {
  title: string;
  description: string;
  reward_xp: number;
  /** category của module missions */
  category: 'hoc_tap' | 'nha_cua' | 'the_chat' | 'ky_nang' | 'khac';
}

const TASKS: Record<SkillKey, Omit<SuggestedTask, 'reward_xp'>[]> = {
  tu_lap: [
    { title: 'Tự gấp quần áo và cất vào tủ', description: 'Bé tự gấp gọn quần áo đã phơi khô và xếp vào đúng ngăn tủ.', category: 'nha_cua' },
    { title: 'Tự dọn bàn học sau khi học xong', description: 'Cất sách vở, bút thước về chỗ và lau sạch mặt bàn.', category: 'nha_cua' },
    { title: 'Tự chuẩn bị cặp sách cho ngày mai', description: 'Xem thời khoá biểu và tự xếp sách vở vào cặp từ tối hôm trước.', category: 'ky_nang' },
  ],
  suc_khoe: [
    { title: 'Đi bộ hoặc đạp xe 20 phút cùng bố mẹ', description: 'Vận động ngoài trời ít nhất 20 phút.', category: 'the_chat' },
    { title: 'Tập 10 động tác thể dục buổi sáng', description: 'Khởi động và tập 10 động tác thể dục ngay sau khi thức dậy.', category: 'the_chat' },
    { title: 'Đánh răng và đi ngủ trước 21:30', description: 'Vệ sinh răng miệng sạch sẽ và lên giường trước 21:30.', category: 'the_chat' },
  ],
  tri_tue: [
    { title: 'Đọc 1 cuốn truyện và kể lại cho bố mẹ', description: 'Đọc hết 1 truyện ngắn rồi kể lại nội dung bằng lời của bé.', category: 'hoc_tap' },
    { title: 'Học 5 từ tiếng Anh mới', description: 'Học và đặt câu với 5 từ tiếng Anh mới.', category: 'hoc_tap' },
    { title: 'Giải 1 trò chơi xếp hình hoặc câu đố', description: 'Tự hoàn thành 1 bộ xếp hình hoặc 3 câu đố logic.', category: 'hoc_tap' },
  ],
  chuyen_can: [
    { title: 'Cho thú cưng ăn đủ 7 ngày liên tiếp', description: 'Mỗi ngày vào app chăm thú cưng, giữ chuỗi 7 ngày không đứt.', category: 'ky_nang' },
    { title: 'Tự dậy đúng giờ 5 buổi sáng', description: 'Tự thức dậy theo báo thức, không cần bố mẹ gọi, trong 5 ngày.', category: 'ky_nang' },
    { title: 'Cùng bố mẹ lập kế hoạch nhiệm vụ tuần', description: 'Chọn mỗi ngày 1 nhiệm vụ nhỏ cho cả tuần và dán lên tường.', category: 'ky_nang' },
  ],
};

const TIP: Record<SkillKey, string> = {
  tu_lap: 'giao cho bé thêm việc nhà vừa sức và để bé tự làm từ đầu đến cuối',
  suc_khoe: 'dành thêm thời gian vận động ngoài trời và giữ giờ ngủ đều đặn',
  tri_tue: 'cùng bé đọc sách, chơi trò chơi tư duy mỗi ngày',
  chuyen_can: 'duy trì mỗi ngày 1 nhiệm vụ nhỏ và nhắc bé chăm thú cưng để giữ chuỗi ngày',
};

export interface Recommendation {
  text: string;
  focus: SkillKey;
  task: SuggestedTask;
}

/**
 * TODO: thay bằng gọi LLM/AI service thật để sinh ai_recommendation_text và suggested_task_json
 * (input giữ nguyên: tên bé, tháng, điểm + % thay đổi, số hoạt động). Hiện tại sinh theo quy tắc:
 * chỉ số thấp nhất (hoà thì chỉ số giảm nhiều nhất) là trọng tâm, nhiệm vụ lấy từ danh sách mẫu.
 */
export function buildRecommendation(input: {
  childName: string;
  period: string;
  scores: SkillScores;
  deltas: Record<SkillKey, number | null>;
}): Recommendation {
  const { childName, period, scores, deltas } = input;
  const month = Number(period.split('-')[1]);
  const byScore = [...SKILL_KEYS].sort(
    (a, b) => scores[a] - scores[b] || (deltas[a] ?? 0) - (deltas[b] ?? 0),
  );
  const focus = byScore[0];
  const strongest = byScore[byScore.length - 1];
  const templates = TASKS[focus];
  const task: SuggestedTask = { ...templates[month % templates.length], reward_xp: 30 };

  let text: string;
  if (SKILL_KEYS.every((k) => scores[k] === 0)) {
    text =
      `Tháng ${month}, ${childName} chưa có hoạt động nào được ghi nhận. ` +
      `Bố mẹ hãy bắt đầu bằng 1 nhiệm vụ nhỏ mỗi ngày để bé làm quen nhé.`;
  } else {
    const parts = [`Tháng ${month}, ${childName} làm tốt nhất ở chỉ số ${SKILL_LABEL[strongest]} (${scores[strongest]}%).`];
    const d = deltas[focus];
    parts.push(
      d !== null && d < 0
        ? `Chỉ số ${SKILL_LABEL[focus]} giảm ${Math.abs(d)}% so với tháng trước (còn ${scores[focus]}%).`
        : `Chỉ số ${SKILL_LABEL[focus]} đang thấp nhất (${scores[focus]}%).`,
    );
    parts.push(`Gợi ý: bố mẹ ${TIP[focus]}.`);
    text = parts.join(' ');
  }
  return { text, focus, task };
}
