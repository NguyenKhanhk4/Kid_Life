import type { Request } from 'express';
import mongoose from 'mongoose';
import { HttpError } from '../../shared/http';
import Child from '../children/children.model';

/**
 * Token hiện là của phụ huynh (bé đăng nhập bằng PIN trên máy của bố mẹ), nên bé nào đang dùng
 * được gửi qua ?childId= hoặc body.childId. Chỉ cho thao tác với bé thuộc tài khoản đang đăng nhập
 * (admin xem được mọi bé).
 */
export async function resolveChildId(req: Request): Promise<string> {
  const raw = req.query.childId ?? req.body?.childId;
  if (typeof raw !== 'string' || !mongoose.isValidObjectId(raw.trim())) {
    throw new HttpError(400, 'CHILD_ID_REQUIRED', 'Thiếu hoặc sai childId');
  }
  const childId = raw.trim();

  const child = await Child.findById(childId).select('parentId').lean();
  if (!child) throw new HttpError(404, 'CHILD_NOT_FOUND', 'Không tìm thấy hồ sơ bé');
  if (req.user?.role !== 'admin' && String(child.parentId) !== req.user?.id) {
    throw new HttpError(403, 'FORBIDDEN', 'Bạn không có quyền xem thú cưng của bé này');
  }
  return childId;
}
