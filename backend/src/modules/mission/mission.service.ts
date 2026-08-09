import mongoose, { FilterQuery } from 'mongoose';
import { Mission, IMission, IChecklistItem } from './mission.model';
import { AppError } from '../../shared/errors/AppError';

export class MissionService {
  static async createMission(data: {
    title: string;
    description: string;
    childId: string;
    skillId?: string;
    rewardPoints: number;
    dueDate: string | Date;
    checklist?: { text: string; isDone?: boolean }[];
  }): Promise<IMission> {
    if (!data.title || data.title.trim().length === 0 || data.title.length > 100) throw new AppError('Title is required and must be under 100 characters', 400, 'BAD_REQUEST');
    if (!data.description || data.description.trim().length === 0 || data.description.length > 1000) throw new AppError('Description is required and must be under 1000 characters', 400, 'BAD_REQUEST');
    if (!mongoose.isValidObjectId(data.childId)) throw new AppError('Invalid childId', 400, 'BAD_REQUEST');
    if (data.skillId && !mongoose.isValidObjectId(data.skillId)) throw new AppError('Invalid skillId', 400, 'BAD_REQUEST');
    if (!Number.isInteger(data.rewardPoints) || data.rewardPoints <= 0) throw new AppError('rewardPoints must be a positive integer > 0', 400, 'BAD_REQUEST');
    
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) throw new AppError('Invalid dueDate', 400, 'BAD_REQUEST');

    const checklist = (data.checklist || []).map(c => ({
      text: c.text.trim(),
      isDone: c.isDone || false
    })).filter(c => c.text.length > 0);

    const mission = new Mission({
      title: data.title.trim(),
      description: data.description.trim(),
      childId: data.childId,
      skillId: data.skillId,
      rewardPoints: data.rewardPoints,
      dueDate,
      checklist
    });
    return mission.save();
  }

  static async getMissions(childId: string): Promise<IMission[]> {
    if (!mongoose.isValidObjectId(childId)) throw new AppError('Invalid childId', 400, 'BAD_REQUEST');
    const query: FilterQuery<IMission> = { childId };
    return Mission.find(query).sort({ createdAt: -1 });
  }

  static async getMissionById(id: string): Promise<IMission> {
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
    const mission = await Mission.findById(id);
    if (!mission) {
      throw new AppError('Mission not found', 404, 'NOT_FOUND');
    }
    return mission;
  }

  static async updateMission(id: string, data: {
    title?: string;
    description?: string;
    rewardPoints?: number;
    dueDate?: string | Date;
  }): Promise<IMission> {
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
    
    const updateData: mongoose.UpdateQuery<IMission> = {};
    if (data.title !== undefined) {
      if (data.title.trim().length === 0 || data.title.length > 100) throw new AppError('Title cannot be empty and must be under 100 characters', 400, 'BAD_REQUEST');
      updateData.title = data.title.trim();
    }
    if (data.description !== undefined) {
      if (data.description.trim().length === 0 || data.description.length > 1000) throw new AppError('Description cannot be empty and must be under 1000 characters', 400, 'BAD_REQUEST');
      updateData.description = data.description.trim();
    }
    if (data.rewardPoints !== undefined) {
      if (!Number.isInteger(data.rewardPoints) || data.rewardPoints <= 0) {
        throw new AppError('rewardPoints must be a positive integer > 0', 400, 'BAD_REQUEST');
      }
      updateData.rewardPoints = data.rewardPoints;
    }
    if (data.dueDate !== undefined) {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) throw new AppError('Invalid dueDate', 400, 'BAD_REQUEST');
      updateData.dueDate = dueDate;
    }

    const mission = await Mission.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    if (!mission) {
      throw new AppError('Mission not found', 404, 'NOT_FOUND');
    }
    return mission;
  }

  static async deleteMission(id: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
    const result = await Mission.findByIdAndDelete(id);
    if (!result) {
      throw new AppError('Mission not found', 404, 'NOT_FOUND');
    }
  }

  static async updateChecklist(id: string, itemId: string, isDone: boolean): Promise<IMission> {
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
    if (!mongoose.isValidObjectId(itemId)) throw new AppError('Invalid item ID', 400, 'BAD_REQUEST');
    
    const mission = await Mission.findById(id);
    if (!mission) {
      throw new AppError('Mission not found', 404, 'NOT_FOUND');
    }

    const item = mission.checklist.find(c => c._id?.toString() === itemId);
    if (!item) {
      throw new AppError('Checklist item not found', 404, 'NOT_FOUND');
    }

    item.isDone = isDone;
    return mission.save();
  }
}
