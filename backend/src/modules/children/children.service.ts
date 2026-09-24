// Children Service â€” business logic quáº£n lÃ½ há»“ sÆ¡ tráº» em
import bcrypt from 'bcryptjs';
import Child from './children.model';
import { CreateChildInput, UpdateChildInput, ResetPinInput } from './children.validation';

const SALT_ROUNDS = 10;

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function assertOwnership(childParentId: any, userId: string) {
  if (String(childParentId) !== userId) {
    const err = new Error('Báº¡n khÃ´ng cÃ³ quyá»n thao tÃ¡c trÃªn há»“ sÆ¡ bÃ© nÃ y');
    (err as any).code = 'FORBIDDEN';
    (err as any).statusCode = 403;
    throw err;
  }
}

// â”€â”€â”€ GET children of parent â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getChildrenService(parentId: string) {
  return Child.find({ parentId }).sort({ createdAt: 1 }).lean();
}

// â”€â”€â”€ CREATE child â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function createChildService(parentId: string, input: CreateChildInput) {
  const pinCodeHash = await bcrypt.hash(input.pinCode, SALT_ROUNDS);

  const child = await Child.create({
    parentId,
    name: input.name,
    age: input.age,
    avatar: input.avatar ?? 'ðŸ§’',
    pinCodeHash,
  });

  // KhÃ´ng tráº£ vá» pinCodeHash trong response
  const { pinCodeHash: _, ...safeChild } = child.toObject();
  return safeChild;
}

// â”€â”€â”€ UPDATE child (tÃªn/tuá»•i/avatar â€” khÃ´ng update PIN á»Ÿ Ä‘Ã¢y) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function updateChildService(
  parentId: string,
  childId: string,
  input: UpdateChildInput
) {
  const child = await Child.findById(childId);
  if (!child) {
    const err = new Error('KhÃ´ng tÃ¬m tháº¥y há»“ sÆ¡ bÃ©');
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

// â”€â”€â”€ RESET PIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function resetPinService(
  parentId: string,
  childId: string,
  input: ResetPinInput
) {
  const child = await Child.findById(childId).select('+pinCodeHash');
  if (!child) {
    const err = new Error('KhÃ´ng tÃ¬m tháº¥y há»“ sÆ¡ bÃ©');
    (err as any).code = 'CHILD_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  assertOwnership(child.parentId, parentId);

  child.pinCodeHash = await bcrypt.hash(input.newPinCode, SALT_ROUNDS);
  await child.save();

  return { message: 'Äáº·t láº¡i mÃ£ PIN thÃ nh cÃ´ng' };
}

// â”€â”€â”€ CHECK CHILD STATUS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function isChildLocked(childId: string): Promise<boolean> {
  const child = await Child.findById(childId).select('status');
  if (!child) return false; // Tráº£ vá» false náº¿u khÃ´ng tÃ¬m tháº¥y (hoáº·c throw error tuá»³ ngá»¯ cáº£nh, Ä‘á»ƒ an toÃ n tráº£ false/true)
  return child.status === 'locked';
}

// â”€â”€â”€ DELETE child â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function deleteChildService(parentId: string, childId: string) {
  const child = await Child.findById(childId);
  if (!child) {
    const err = new Error('KhÃ´ng tÃ¬m tháº¥y há»“ sÆ¡ bÃ©');
    (err as any).code = 'CHILD_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }
  
  assertOwnership(child.parentId, parentId);
  
  await Child.findByIdAndDelete(childId);
  return { message: 'XÃ³a há»“ sÆ¡ bÃ© thÃ nh cÃ´ng' };
}

export async function verifyPinService(childId: string, pinCode: string) {
  const child = await Child.findById(childId).select('+pinCodeHash');
  if (!child) {
    const err = new Error('Không tìm th?y h? so bé');
    (err as any).code = 'CHILD_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }
  const isMatch = await bcrypt.compare(pinCode, child.pinCodeHash);
  if (!isMatch) {
    const err = new Error('Mã PIN không chính xác');
    (err as any).code = 'INVALID_PIN';
    (err as any).statusCode = 400;
    throw err;
  }
  return { message: 'Xác th?c mã PIN thành công' };
}

