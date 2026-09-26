import mongoose from 'mongoose';
import { HttpError } from '../../shared/http';
import Child from '../children/children.model';
import Mission from '../missions/mission.model';
import Penalty from '../penalties/penalty.model';
import Submission from '../submissions/submission.model';
import WalletTransaction from '../wallets/wallet-transaction.model';
import { AiSkillReport, type IAiSkillReport } from './ai-skill-report.model';
import {
  SKILL_KEYS,
  SKILL_LABEL,
  activityPoints,
  buildRecommendation,
  computeScores,
  deltaPercent,
  elapsedDays,
  elapsedRatio,
  monthPeriodOf,
  monthRange,
  shiftMonth,
  type MonthActivity,
  type SkillKey,
  type SkillScores,
  type SuggestedTask,
} from './ai-skill.scoring';
import type { ITaskService } from './ai-skill.task';

export interface SkillAxisDTO {
  key: SkillKey;
  label: string;
  score: number;
  previousScore: number | null;
  /** % thay đổi so với tháng trước (backend tính sẵn); null nếu không so được */
  deltaPercent: number | null;
  /** số hoạt động thật đã tính vào chỉ số này */
  activities: number;
}

export interface AiSkillReportDTO {
  reportId: string;
  childId: string;
  childName: string;
  monthPeriod: string;
  previousMonthPeriod: string;
  axes: SkillAxisDTO[];
  recommendation: string;
  suggestedTask: SuggestedTask;
  /** 'rules' = sinh theo quy tắc, chưa dùng AI thật */
  generatedBy: 'rules' | 'llm';
  isTaskApplied: boolean;
  appliedMissionId: string | null;
  updatedAt: string;
}

type ReportDoc = IAiSkillReport;

const scoresOf = (
  r: Pick<IAiSkillReport, 'tu_lap_score' | 'suc_khoe_score' | 'tri_tue_score' | 'chuyen_can_score'>,
): SkillScores => ({
  tu_lap: r.tu_lap_score,
  suc_khoe: r.suc_khoe_score,
  tri_tue: r.tri_tue_score,
  chuyen_can: r.chuyen_can_score,
});

const DAY_MS = 24 * 60 * 60 * 1000;

export class AiSkillReportService {
  constructor(
    private readonly tasks: ITaskService,
    private readonly tzOffsetMinutes: number,
    private readonly now: () => Date = () => new Date(),
  ) {}

  /** Đếm hoạt động THẬT của bé trong tháng từ các module missions / submissions / wallet (pet, quiz) / penalties. */
  async collectActivity(childId: string, period: string): Promise<MonthActivity> {
    const { start, end } = monthRange(period, this.tzOffsetMinutes);
    const range = { $gte: start, $lt: end };

    const [approved, doneMissions, quizRewards, petFeeds, penalties] = await Promise.all([
      Submission.find({ child_id: childId, status: 'approved', reviewed_at: range }).select('mission_id reviewed_at').lean(),
      // nhiệm vụ phụ huynh đánh dấu xong trực tiếp (không qua nộp ảnh)
      Mission.find({ child_id: childId, status: 'done', updated_at: range }).select('_id updated_at').lean(),
      WalletTransaction.countDocuments({ child_id: childId, type: 'quiz_reward', created_at: range }),
      WalletTransaction.find({ child_id: childId, type: 'pet_feed', created_at: range }).select('created_at').lean(),
      Penalty.countDocuments({ child_id: childId, created_at: range }),
    ]);

    const missionIds = new Set([...approved.map((s) => String(s.mission_id)), ...doneMissions.map((m) => String(m._id))]);
    const missions = await Mission.find({ _id: { $in: [...missionIds] } }).select('category').lean();
    const counts: MonthActivity['missions'] = {};
    for (const m of missions) {
      const c = m.category as keyof MonthActivity['missions'];
      counts[c] = (counts[c] ?? 0) + 1;
    }

    // Chuyên cần: số ngày (giờ địa phương) có nhiệm vụ được duyệt hoặc có chăm thú cưng
    const offset = this.tzOffsetMinutes * 60_000;
    const dayOf = (d: Date | null | undefined) => (d ? Math.floor((d.getTime() + offset) / DAY_MS) : null);
    const activeDays = new Set(
      [
        ...approved.map((s) => dayOf(s.reviewed_at)),
        ...doneMissions.map((m) => dayOf(m.updated_at)),
        ...petFeeds.map((t) => dayOf(t.created_at)),
      ].filter((d): d is number => d !== null),
    ).size;

    return {
      missions: counts,
      quizRewards,
      activeDays,
      daysInPeriod: elapsedDays(period, this.now(), this.tzOffsetMinutes),
      penalties,
    };
  }

  /**
   * Sinh (hoặc cập nhật) báo cáo 1 tháng rồi lưu vào ai_skill_reports.
   * Tháng đã qua: có rồi thì dùng lại (số liệu đã chốt). Tháng hiện tại: tính lại mỗi lần xem.
   * TODO: khi có AI thật, phần lời khuyên + nhiệm vụ gợi ý sẽ gọi LLM tại buildRecommendation.
   */
  async generateAiSkillReport(childId: string, period: string, childName: string): Promise<ReportDoc> {
    const currentPeriod = monthPeriodOf(this.now(), this.tzOffsetMinutes);
    const existing = await AiSkillReport.findOne({ child_id: childId, month_period: period });
    if (existing && period < currentPeriod) return existing;

    const activity = await this.collectActivity(childId, period);
    const scores = computeScores(activity, elapsedRatio(period, this.now(), this.tzOffsetMinutes));
    const points = activityPoints(activity);

    const prev = await this.findOrGeneratePrevious(childId, period, childName);
    const deltas = this.deltas(scores, prev ? scoresOf(prev) : null);
    const rec = buildRecommendation({ childName, period, scores, deltas });

    const doc = existing ?? new AiSkillReport({ child_id: childId, month_period: period });
    doc.set({
      tu_lap_score: scores.tu_lap,
      suc_khoe_score: scores.suc_khoe,
      tri_tue_score: scores.tri_tue,
      chuyen_can_score: scores.chuyen_can,
      activity_points: points,
      ai_recommendation_text: rec.text,
      generated_by: 'rules',
    });
    // đã áp dụng thì giữ nguyên nhiệm vụ gợi ý đã phát hành
    if (!doc.is_task_applied) doc.set({ suggested_task_json: rec.task });

    try {
      return await doc.save();
    } catch (err) {
      // 2 request cùng tạo báo cáo 1 tháng → lấy bản đã lưu
      if ((err as { code?: number }).code === 11000) {
        const saved = await AiSkillReport.findOne({ child_id: childId, month_period: period });
        if (saved) return saved;
      }
      throw err;
    }
  }

  /** Kỳ trước: dùng bản đã lưu; chưa có thì tính từ dữ liệu (không đệ quy thêm tháng nữa). */
  private async findOrGeneratePrevious(childId: string, period: string, childName: string): Promise<ReportDoc | null> {
    const prevPeriod = shiftMonth(period, -1);
    const saved = await AiSkillReport.findOne({ child_id: childId, month_period: prevPeriod });
    if (saved) return saved;

    const activity = await this.collectActivity(childId, prevPeriod);
    const points = activityPoints(activity);
    if (SKILL_KEYS.every((k) => points[k] === 0)) return null; // tháng trước chưa có hoạt động → không so sánh

    const scores = computeScores(activity);
    const rec = buildRecommendation({
      childName,
      period: prevPeriod,
      scores,
      deltas: { tu_lap: null, suc_khoe: null, tri_tue: null, chuyen_can: null },
    });
    try {
      return await AiSkillReport.create({
        child_id: childId,
        month_period: prevPeriod,
        tu_lap_score: scores.tu_lap,
        suc_khoe_score: scores.suc_khoe,
        tri_tue_score: scores.tri_tue,
        chuyen_can_score: scores.chuyen_can,
        activity_points: points,
        ai_recommendation_text: rec.text,
        suggested_task_json: rec.task,
      });
    } catch (err) {
      if ((err as { code?: number }).code === 11000) {
        return AiSkillReport.findOne({ child_id: childId, month_period: prevPeriod });
      }
      throw err;
    }
  }

  private deltas(current: SkillScores, previous: SkillScores | null): Record<SkillKey, number | null> {
    const out = {} as Record<SkillKey, number | null>;
    for (const k of SKILL_KEYS) out[k] = deltaPercent(current[k], previous?.[k]);
    return out;
  }

  async getReport(childId: string, month?: string): Promise<AiSkillReportDTO> {
    const currentPeriod = monthPeriodOf(this.now(), this.tzOffsetMinutes);
    const period = month ?? currentPeriod;
    if (period > currentPeriod) throw new HttpError(400, 'INVALID_MONTH', 'Chưa có báo cáo cho tháng trong tương lai');

    const child = await Child.findById(childId).select('name').lean();
    const childName = child?.name ?? 'Bé';
    const report = await this.generateAiSkillReport(childId, period, childName);
    const prev = await AiSkillReport.findOne({ child_id: childId, month_period: shiftMonth(period, -1) }).lean();
    return this.toDTO(report, prev ? scoresOf(prev) : null, childName);
  }

  private toDTO(r: ReportDoc, prevScores: SkillScores | null, childName: string): AiSkillReportDTO {
    const scores = scoresOf(r);
    return {
      reportId: String(r._id),
      childId: String(r.child_id),
      childName,
      monthPeriod: r.month_period,
      previousMonthPeriod: shiftMonth(r.month_period, -1),
      axes: SKILL_KEYS.map((key) => ({
        key,
        label: SKILL_LABEL[key],
        score: scores[key],
        previousScore: prevScores?.[key] ?? null,
        deltaPercent: deltaPercent(scores[key], prevScores?.[key]),
        activities: r.activity_points?.[key] ?? 0,
      })),
      recommendation: r.ai_recommendation_text,
      suggestedTask: {
        title: r.suggested_task_json.title,
        description: r.suggested_task_json.description,
        reward_xp: r.suggested_task_json.reward_xp,
        category: r.suggested_task_json.category,
      },
      generatedBy: r.generated_by,
      isTaskApplied: r.is_task_applied,
      appliedMissionId: r.applied_mission_id ? String(r.applied_mission_id) : null,
      updatedAt: r.updated_at.toISOString(),
    };
  }

  /** Phát hành nhiệm vụ gợi ý của báo cáo cho bé — mỗi báo cáo chỉ áp dụng được 1 lần. */
  async applyAiTask(childId: string, reportId: string): Promise<{ report: AiSkillReportDTO; mission: { id: string; title: string } }> {
    if (!mongoose.isValidObjectId(reportId)) throw new HttpError(400, 'INVALID_REPORT', 'Mã báo cáo không hợp lệ');

    // Đánh dấu "đã áp dụng" có điều kiện trong 1 lệnh → bấm 2 lần cùng lúc cũng chỉ tạo 1 nhiệm vụ
    const report = await AiSkillReport.findOneAndUpdate(
      { _id: reportId, child_id: childId, is_task_applied: false },
      { is_task_applied: true },
      { new: true },
    );
    if (!report) {
      const exists = await AiSkillReport.exists({ _id: reportId, child_id: childId });
      if (!exists) throw new HttpError(404, 'REPORT_NOT_FOUND', 'Không tìm thấy báo cáo của bé');
      throw new HttpError(409, 'TASK_ALREADY_APPLIED', 'Gợi ý này đã được áp dụng rồi');
    }

    let mission: { id: string; title: string };
    try {
      mission = await this.tasks.createTask(childId, report.suggested_task_json);
    } catch (err) {
      await AiSkillReport.updateOne({ _id: report._id }, { is_task_applied: false }); // tạo lỗi → cho áp dụng lại
      throw err;
    }
    report.applied_mission_id = new mongoose.Types.ObjectId(mission.id);
    await report.save();

    const child = await Child.findById(childId).select('name').lean();
    const prev = await AiSkillReport.findOne({ child_id: childId, month_period: shiftMonth(report.month_period, -1) }).lean();
    return { report: this.toDTO(report, prev ? scoresOf(prev) : null, child?.name ?? 'Bé'), mission };
  }
}
