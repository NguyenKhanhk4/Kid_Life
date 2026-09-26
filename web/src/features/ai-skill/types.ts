export type SkillKey = 'tu_lap' | 'suc_khoe' | 'tri_tue' | 'chuyen_can';

/** 1 trục radar — backend đã tính sẵn điểm + % thay đổi */
export interface SkillAxis {
  key: SkillKey;
  label: string;
  score: number;
  previousScore: number | null;
  /** null = không có kỳ trước để so (hoặc kỳ trước = 0) */
  deltaPercent: number | null;
  activities: number;
}

export interface SuggestedTask {
  title: string;
  description: string;
  reward_xp: number;
  category: string;
}

/** GET /api/reports/ai-skill */
export interface AiSkillReport {
  reportId: string;
  childId: string;
  childName: string;
  monthPeriod: string;
  previousMonthPeriod: string;
  axes: SkillAxis[];
  recommendation: string;
  suggestedTask: SuggestedTask;
  /** 'rules' = gợi ý sinh theo quy tắc từ dữ liệu, chưa dùng AI thật */
  generatedBy: 'rules' | 'llm';
  isTaskApplied: boolean;
  appliedMissionId: string | null;
  updatedAt: string;
}
