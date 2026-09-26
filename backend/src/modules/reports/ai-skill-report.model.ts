import { Schema, model, type Document, type Types } from 'mongoose';
import type { SuggestedTask } from './ai-skill.scoring';

export interface IAiSkillReport extends Document {
  child_id: Types.ObjectId;
  /** "2026-09" */
  month_period: string;
  tu_lap_score: number; // 0-100
  suc_khoe_score: number;
  tri_tue_score: number;
  chuyen_can_score: number;
  /** Số hoạt động thật dùng để tính điểm (hiển thị cho phụ huynh) */
  activity_points: { tu_lap: number; suc_khoe: number; tri_tue: number; chuyen_can: number };
  ai_recommendation_text: string;
  suggested_task_json: SuggestedTask;
  /** Nguồn sinh lời khuyên: hiện chỉ có 'rules' (chưa gọi AI thật) */
  generated_by: 'rules' | 'llm';
  /** Chặn áp dụng gợi ý nhiều lần */
  is_task_applied: boolean;
  applied_mission_id: Types.ObjectId | null;
  created_at: Date;
  updated_at: Date;
}

const AiSkillReportSchema = new Schema<IAiSkillReport>(
  {
    child_id: { type: Schema.Types.ObjectId, ref: 'Child', required: true },
    month_period: { type: String, required: true, match: /^\d{4}-(0[1-9]|1[0-2])$/ },
    tu_lap_score: { type: Number, required: true, min: 0, max: 100 },
    suc_khoe_score: { type: Number, required: true, min: 0, max: 100 },
    tri_tue_score: { type: Number, required: true, min: 0, max: 100 },
    chuyen_can_score: { type: Number, required: true, min: 0, max: 100 },
    activity_points: {
      tu_lap: { type: Number, default: 0 },
      suc_khoe: { type: Number, default: 0 },
      tri_tue: { type: Number, default: 0 },
      chuyen_can: { type: Number, default: 0 },
    },
    ai_recommendation_text: { type: String, required: true },
    suggested_task_json: {
      title: { type: String, required: true, maxlength: 100 },
      description: { type: String, default: '' },
      reward_xp: { type: Number, required: true, min: 1, max: 500 },
      category: { type: String, required: true },
    },
    generated_by: { type: String, enum: ['rules', 'llm'], default: 'rules' },
    is_task_applied: { type: Boolean, default: false },
    applied_mission_id: { type: Schema.Types.ObjectId, ref: 'Mission', default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'ai_skill_reports' },
);

AiSkillReportSchema.index({ child_id: 1, month_period: -1 }, { unique: true });

export const AiSkillReport = model<IAiSkillReport>('AiSkillReport', AiSkillReportSchema);
