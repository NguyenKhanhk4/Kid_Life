// Business logic cho Mission module
import mongoose from 'mongoose';
import Mission, { IMission } from './mission.model';
import Subtask, { ISubtask } from './subtask.model';

export async function getMissionsByChildId(childId: string) {
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    throw new Error('child_id không hợp lệ');
  }

  const missions = await Mission.find({ child_id: childId })
    .sort({ created_at: -1 })
    .lean();

  const missionsWithSubtasks = await Promise.all(
    missions.map(async (mission) => {
      const subtasks = await Subtask.find({ mission_id: mission._id })
        .sort({ step_order: 1 })
        .lean();
      return {
        ...mission,
        subtasks,
      };
    })
  );

  return missionsWithSubtasks;
}

export interface CreateMissionPayload {
  child_id: string;
  title: string;
  category: string;
  reward_xp: number;
  schedule_time?: string;
  subtasks?: string[];
}

export async function createMission(payload: CreateMissionPayload) {
  const { child_id, title, category, reward_xp, schedule_time = '', subtasks = [] } = payload;

  const mission = await Mission.create({
    child_id,
    title,
    category,
    reward_xp,
    schedule_time,
    status: 'todo',
  });

  let createdSubtasks: Record<string, unknown>[] = [];
  if (subtasks && subtasks.length > 0) {
    const subtaskDocs = subtasks.map((taskTitle, index) => ({
      mission_id: mission._id,
      title: taskTitle,
      is_done: false,
      step_order: index + 1,
    }));
    await Subtask.insertMany(subtaskDocs);
    createdSubtasks = await Subtask.find({ mission_id: mission._id })
      .sort({ step_order: 1 })
      .lean();
  }

  return {
    ...mission.toObject(),
    subtasks: createdSubtasks,
  };
}

export interface UpdateMissionPayload {
  title?: string;
  category?: string;
  reward_xp?: number;
  schedule_time?: string;
  status?: string;
  [key: string]: unknown;
}

export async function updateMission(id: string, payload: UpdateMissionPayload) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Mission ID không hợp lệ');
  }

  const updateData = {
    ...payload,
    updated_at: new Date(),
  };

  const updatedMission = await Mission.findByIdAndUpdate(id, updateData, { new: true }).lean();

  if (!updatedMission) {
    throw new Error('Không tìm thấy nhiệm vụ');
  }

  return updatedMission;
}

export async function deleteMission(id: string): Promise<string> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Mission ID không hợp lệ');
  }

  const mission = await Mission.findById(id);
  if (!mission) {
    throw new Error('Không tìm thấy nhiệm vụ');
  }

  await Subtask.deleteMany({ mission_id: id });
  await Mission.findByIdAndDelete(id);

  return 'Xoá nhiệm vụ thành công';
}
