import { createMission } from '../missions/mission.service';
import type { SuggestedTask } from './ai-skill.scoring';

/** Báo cáo chỉ cần 1 thao tác của module nhiệm vụ → phụ thuộc qua interface (test có thể thay). */
export interface ITaskService {
  /** Phát hành nhiệm vụ mới cho bé, trả về id nhiệm vụ */
  createTask(childId: string, task: SuggestedTask): Promise<{ id: string; title: string }>;
}

/** Tạo nhiệm vụ thật qua module missions (Dev 2) — bé thấy ngay ở mục Nhiệm vụ. */
export class MissionTaskService implements ITaskService {
  async createTask(childId: string, task: SuggestedTask) {
    const mission = await createMission({
      child_id: childId,
      title: task.title,
      category: task.category,
      reward_xp: task.reward_xp,
    });
    return { id: String(mission._id), title: mission.title };
  }
}
