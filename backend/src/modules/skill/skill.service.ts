import { Skill } from './skill.model';
import { AppError } from '../../shared/errors/AppError';

export class SkillService {
  static async create(data: { name: string; description: string; ageRange: { min: number; max: number }; icon?: string }, createdBy: string) {
    const skill = await Skill.create({ ...data, createdBy });
    return skill;
  }

  static async list(query: { search?: string }) {
    const filter: Record<string, unknown> = {};
    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    return Skill.find(filter).sort({ name: 1 });
  }

  static async update(skillId: string, userId: string, userRole: string, data: { name?: string; description?: string; ageRange?: { min: number; max: number }; icon?: string }) {
    const skill = await Skill.findById(skillId);
    if (!skill) throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');

    // Expert can only update own skills, Admin can update any
    if (userRole === 'EXPERT' && skill.createdBy !== userId) {
      throw new AppError('Not authorized to update this skill', 403, 'FORBIDDEN');
    }

    if (data.name !== undefined) skill.name = data.name;
    if (data.description !== undefined) skill.description = data.description;
    if (data.ageRange !== undefined) skill.ageRange = data.ageRange;
    if (data.icon !== undefined) skill.icon = data.icon;

    await skill.save();
    return skill;
  }

  static async delete(skillId: string) {
    const skill = await Skill.findById(skillId);
    if (!skill) throw new AppError('Skill not found', 404, 'SKILL_NOT_FOUND');
    await Skill.findByIdAndDelete(skillId);
    return { message: 'Skill deleted successfully' };
  }
}
