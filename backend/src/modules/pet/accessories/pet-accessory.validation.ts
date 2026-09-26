import { z } from 'zod';
import { ACCESSORY_CATEGORIES } from './pet-accessory.model';

/** body của buy / equip / unequip (childId được kiểm tra quyền riêng ở resolveChildId) */
export const accessoryActionSchema = z.object({
  childId: z.string().trim().min(1),
  accessoryId: z.string().trim().min(1, 'Thiếu accessoryId'),
});

export const accessoryInputSchema = z.object({
  name: z.string().trim().min(1, 'Tên phụ kiện không được trống').max(60),
  /** Ảnh trong web/public (/assets/...) hoặc URL ảnh ngoài */
  icon: z
    .string()
    .trim()
    .max(300)
    .regex(/^(\/assets\/|https?:\/\/)\S+\.(png|webp|jpe?g|gif|svg)$/i, 'Icon phải là đường dẫn ảnh (.png, .webp...), vd. /assets/pets/accessories/hat/cap.png'),
  category: z.enum(ACCESSORY_CATEGORIES, { errorMap: () => ({ message: 'Danh mục không hợp lệ' }) }),
  priceXP: z.coerce.number().int().min(0, 'Giá phải ≥ 0').max(100_000),
  sortOrder: z.coerce.number().int().optional(),
});
