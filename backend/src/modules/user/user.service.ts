import { User } from '../auth/user.model';
import { AppError } from '../../shared/errors/AppError';

export class UserService {
  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return user;
  }

  static async updateProfile(userId: string, data: { fullName?: string; avatarUrl?: string; phone?: string }) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    if (data.fullName !== undefined) user.fullName = data.fullName.trim();
    if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;
    if (data.phone !== undefined) user.phone = data.phone;

    await user.save();
    return user;
  }

  static async listUsers(query: { page?: number; limit?: number; role?: string; status?: string; search?: string }) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { fullName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async updateUserStatus(userId: string, status: 'ACTIVE' | 'LOCKED') {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role === 'ADMIN') throw new AppError('Cannot change admin status', 403, 'FORBIDDEN');

    user.status = status;
    if (status === 'ACTIVE') {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }
    await user.save();
    return user;
  }

  static async approveExpert(expertId: string, approved: boolean) {
    const user = await User.findById(expertId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role !== 'EXPERT') throw new AppError('User is not an expert', 400, 'NOT_EXPERT');
    if (user.status !== 'PENDING') throw new AppError('Expert is not pending approval', 400, 'NOT_PENDING');

    user.status = approved ? 'ACTIVE' : 'LOCKED';
    await user.save();
    return user;
  }

  static async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    if (user.role === 'ADMIN') throw new AppError('Cannot delete admin', 403, 'FORBIDDEN');

    await User.findByIdAndDelete(userId);
    return { message: 'User deleted successfully' };
  }
}
