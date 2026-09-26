import { z } from 'zod';
import { HttpError } from '../../../shared/http';
import { ACCESSORY_CATEGORIES } from './pet-accessory.model';

/** body của buy / equip / unequip (childId được kiểm tra quyền riêng ở resolveChildId) */
export const accessoryActionSchema = z.object({
  childId: z.string().trim().min(1),
  accessoryId: z.string().trim().min(1, 'Thiếu accessoryId'),
});

export const accessoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Tên phụ kiện không được trống').max(60),
  icon: z.string().trim().min(1, 'Thiếu icon').max(300),
  category: z.enum(ACCESSORY_CATEGORIES, { errorMap: () => ({ message: 'Danh mục không hợp lệ' }) }),
  priceXP: z.coerce.number().int().min(0, 'Giá phải ≥ 0').max(100_000),
  sortOrder: z.coerce.number().int().optional(),
});

/** Parse body bằng zod; sai → HttpError 400 để errorHandler trả về đúng định dạng. */
export function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, 'VALIDATION_ERROR', result.error.issues.map((i) => i.message).join(', '));
  }
  return result.data;
}
