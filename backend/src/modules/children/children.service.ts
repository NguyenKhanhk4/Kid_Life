// Children Service — business logic quản lý hồ sơ trẻ em
import bcrypt from 'bcryptjs';
import Child from './children.model';
import { CreateChildInput, UpdateChildInput, ResetPinInput } from './children.validation';

const SALT_ROUNDS = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function assertOwnership(childParentId: any, userId: string) {
  if (String(childParentId) !== userId) {
    const err = new Error('Bạn không có quyền thao tác trên hồ sơ bé này');
    (err as any).code = 'FORBIDDEN';
    (err as any).statusCode = 403;
    throw err;
  }
}

// ─── GET children of parent ───────────────────────────────────────────────────
export async function getChildrenService(parentId: string) {
  return Child.find({ parentId }).sort({ createdAt: 1 }).lean();
}

// ─── CREATE child ─────────────────────────────────────────────────────────────
export async function createChildService(parentId: string, input: CreateChildInput) {
  const pinCodeHash = await bcrypt.hash(input.pinCode, SALT_ROUNDS);

  const child = await Child.create({
    parentId,
    name: input.name,
    age: input.age,
    avatar: input.avatar ?? '🧒',
    pinCodeHash,
  });

  // Không trả về pinCodeHash trong response
  const { pinCodeHash: _, ...safeChild } = child.toObject();
  return safeChild;
}

// ─── UPDATE child (tên/tuổi/avatar — không update PIN ở đây) ─────────────────
export async function updateChildService(
  parentId: string,
  childId: string,
  input: UpdateChildInput
) {
  const child = await Child.findById(childId);
  if (!child) {
    const err = new Error('Không tìm thấy hồ sơ bé');
    (err as any).code = 'CHILD_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  assertOwnership(child.parentId, parentId);

  if (input.name !== undefined) child.name = input.name;
  if (input.age !== undefined) child.age = input.age;
  if (input.avatar !== undefined) child.avatar = input.avatar;

  await child.save();
  return child.toObject();
}

// ─── RESET PIN ─────────────────────────────────────────────────────────────────
export async function resetPinService(
  parentId: string,
  childId: string,
  input: ResetPinInput
) {
  const child = await Child.findById(childId).select('+pinCodeHash');
  if (!child) {
    const err = new Error('Không tìm thấy hồ sơ bé');
    (err as any).code = 'CHILD_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  assertOwnership(child.parentId, parentId);

  child.pinCodeHash = await bcrypt.hash(input.newPinCode, SALT_ROUNDS);
  await child.save();

  return { message: 'Đặt lại mã PIN thành công' };
}

// ─── CHECK CHILD STATUS ────────────────────────────────────────────────────────
export async function isChildLocked(childId: string): Promise<boolean> {
  const child = await Child.findById(childId).select('status');
  if (!child) return false; // Trả về false nếu không tìm thấy (hoặc throw error tuỳ ngữ cảnh, để an toàn trả false/true)
  return child.status === 'locked';
}
