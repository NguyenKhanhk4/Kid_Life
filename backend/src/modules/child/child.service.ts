import { ChildProfile } from './childProfile.model';
import { hashPassword } from '../../shared/utils/password';
import { AppError } from '../../shared/errors/AppError';
import { WalletService } from '../wallet/wallet.service';
import { Pet } from '../pet/pet.model';

export class ChildService {
  static async createChild(parentId: string, data: {
    name: string;
    dateOfBirth: string;
    avatarUrl?: string;
    loginUsername: string;
    loginPassword: string;
    preferredSkills?: string[];
  }) {
    const existing = await ChildProfile.findOne({ loginUsername: data.loginUsername.toLowerCase() });
    if (existing) {
      throw new AppError('Username already taken', 409, 'USERNAME_EXISTS');
    }

    const loginPasswordHash = await hashPassword(data.loginPassword);

    const child = await ChildProfile.create({
      parentId,
      name: data.name.trim(),
      dateOfBirth: new Date(data.dateOfBirth),
      avatarUrl: data.avatarUrl,
      loginUsername: data.loginUsername.toLowerCase().trim(),
      loginPasswordHash,
      preferredSkills: data.preferredSkills || [],
    });

    const childId = child._id.toString();

    // Auto-create Wallet and Pet for the new child
    const wallet = await WalletService.ensureWallet(childId);

    let pet;
    try {
      pet = await Pet.create({ childId, name: `${data.name}'s Pet` });
    } catch (error: unknown) {
      // If pet already exists (race condition), just find it
      const existing = await Pet.findOne({ childId });
      pet = existing;
      if (!pet) throw error;
    }

    return {
      child,
      walletId: wallet?._id,
      petId: pet?._id,
    };
  }

  static async getChildren(parentId: string) {
    return ChildProfile.find({ parentId }).sort({ createdAt: -1 });
  }

  static async getChild(parentId: string, childId: string) {
    const child = await ChildProfile.findById(childId);
    if (!child) throw new AppError('Child not found', 404, 'CHILD_NOT_FOUND');
    if (child.parentId !== parentId) {
      throw new AppError('Child does not belong to this parent', 403, 'FORBIDDEN');
    }
    return child;
  }

  static async updateChild(parentId: string, childId: string, data: {
    name?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    preferredSkills?: string[];
    restrictions?: { maxScreenTime?: number; allowedHours?: { start: string; end: string } };
  }) {
    const child = await ChildProfile.findById(childId);
    if (!child) throw new AppError('Child not found', 404, 'CHILD_NOT_FOUND');
    if (child.parentId !== parentId) throw new AppError('Forbidden', 403, 'FORBIDDEN');

    if (data.name !== undefined) child.name = data.name.trim();
    if (data.dateOfBirth !== undefined) child.dateOfBirth = new Date(data.dateOfBirth);
    if (data.avatarUrl !== undefined) child.avatarUrl = data.avatarUrl;
    if (data.preferredSkills !== undefined) child.preferredSkills = data.preferredSkills;
    if (data.restrictions !== undefined) child.restrictions = data.restrictions;

    await child.save();
    return child;
  }

  static async deleteChild(parentId: string, childId: string) {
    const child = await ChildProfile.findById(childId);
    if (!child) throw new AppError('Child not found', 404, 'CHILD_NOT_FOUND');
    if (child.parentId !== parentId) throw new AppError('Forbidden', 403, 'FORBIDDEN');

    await ChildProfile.findByIdAndDelete(childId);
    return { message: 'Child profile deleted successfully' };
  }
}
