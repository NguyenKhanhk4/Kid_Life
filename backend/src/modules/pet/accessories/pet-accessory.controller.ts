import type { Request, Response } from 'express';
import { HttpError, asyncHandler } from '../../../shared/http';
import { successResponse } from '../../../utils/responseHelper';
import { resolveChildId } from '../../../shared/childAccess';
import type { PetAccessoryService } from './pet-accessory.service';
import { parseBody } from '../../../shared/parseBody';
import { accessoryActionSchema, accessoryInputSchema } from './pet-accessory.validation';

export function createPetAccessoryController(service: PetAccessoryService) {
  const action = (run: (childId: string, accessoryId: string) => Promise<unknown>) =>
    asyncHandler(async (req, res) => {
      const { accessoryId } = parseBody(accessoryActionSchema, req.body);
      res.json(await run(await resolveChildId(req), accessoryId));
    });

  return {
    /** GET /api/pet/accessories?childId= → { accessories, xpBalance } */
    list: asyncHandler(async (req, res) => {
      res.json(await service.getWardrobe(await resolveChildId(req)));
    }),
    /** POST /api/pet/accessories/buy { childId, accessoryId } → { accessories, xpBalance } */
    buy: action((childId, accessoryId) => service.buy(childId, accessoryId)),
    /** POST /api/pet/accessories/equip { childId, accessoryId } */
    equip: action((childId, accessoryId) => service.equip(childId, accessoryId)),
    /** POST /api/pet/accessories/unequip { childId, accessoryId } */
    unequip: action((childId, accessoryId) => service.unequip(childId, accessoryId)),
  };
}

/** Trang admin dùng định dạng { success, data } / { success: false, error } như các API admin khác. */
function adminHandler(run: (req: Request) => Promise<{ data: unknown; message: string; status?: number }>) {
  return async (req: Request, res: Response) => {
    try {
      const { data, message, status = 200 } = await run(req);
      res.status(status).json(successResponse(data, message, status));
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ success: false, error: { code: err.code, message: err.message } });
        return;
      }
      console.error(err);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Lỗi máy chủ' } });
    }
  };
}

export function createPetAccessoryAdminController(service: PetAccessoryService) {
  return {
    list: adminHandler(async () => ({ data: await service.adminList(), message: 'Danh sách phụ kiện' })),
    create: adminHandler(async (req) => ({
      data: await service.adminCreate(parseBody(accessoryInputSchema, req.body)),
      message: 'Đã thêm phụ kiện',
      status: 201,
    })),
    update: adminHandler(async (req) => ({
      data: await service.adminUpdate(req.params.id, parseBody(accessoryInputSchema, req.body)),
      message: 'Đã cập nhật phụ kiện',
    })),
    remove: adminHandler(async (req) => {
      await service.adminDelete(req.params.id);
      return { data: null, message: 'Đã ngừng bán phụ kiện' };
    }),
  };
}
