// Family Service — business logic quản lý thành viên gia đình
import { Types } from 'mongoose';
import FamilyMember from './family.model';
import User from '../auth/user.model';
import { InviteMemberInput, UpdateRoleInput } from './family.validation';

// ─── GET members ─────────────────────────────────────────────────────────────
// familyId = user._id của admin (người đứng đầu gia đình)
export async function getFamilyMembersService(adminUserId: string) {
  const members = await FamilyMember.find({ familyId: adminUserId })
    .populate('userId', 'fullName email phone role')
    .sort({ createdAt: 1 })
    .lean();
  return members;
}

// ─── INVITE member ────────────────────────────────────────────────────────────
export async function inviteMemberService(
  adminUserId: string,
  input: InviteMemberInput
) {
  // Kiểm tra trùng SĐT trong gia đình
  const existing = await FamilyMember.findOne({
    familyId: adminUserId,
    phone: input.phone,
  });
  if (existing) {
    const err = new Error('Số điện thoại này đã được mời vào gia đình');
    (err as any).code = 'MEMBER_ALREADY_EXISTS';
    (err as any).statusCode = 409;
    throw err;
  }

  // Tìm user có SĐT này → liên kết luôn nếu có
  const linkedUser = await User.findOne({ phone: input.phone });

  const member = await FamilyMember.create({
    familyId: new Types.ObjectId(adminUserId),
    userId: linkedUser?._id,
    role: input.role,
    phone: input.phone,
    status: linkedUser ? 'active' : 'pending',
  });

  return member;
}

// ─── UPDATE role ──────────────────────────────────────────────────────────────
export async function updateMemberRoleService(
  adminUserId: string,
  memberId: string,
  input: UpdateRoleInput
) {
  const member = await FamilyMember.findOne({
    _id: memberId,
    familyId: adminUserId,
  });
  if (!member) {
    const err = new Error('Không tìm thấy thành viên trong gia đình của bạn');
    (err as any).code = 'MEMBER_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  // Không cho hạ quyền chính admin cuối cùng
  if (member.role === 'admin') {
    const err = new Error('Không thể thay đổi quyền của Admin chính');
    (err as any).code = 'CANNOT_CHANGE_ADMIN_ROLE';
    (err as any).statusCode = 403;
    throw err;
  }

  member.role = input.role;
  await member.save();
  return member;
}
