import type { Request } from 'express';
import { HttpError, asyncHandler } from '../../shared/http';
import type { PetService } from './pet.service';

/**
 * childId: khi có auth (Dev 1) sẽ lấy từ token (req.user.childId).
 * Tạm thời cho truyền qua ?childId= hoặc body.childId để web/Postman test được.
 */
function getChildId(req: Request): string {
  const fromAuth = (req as Request & { user?: { childId?: string } }).user?.childId;
  const raw = fromAuth ?? req.query.childId ?? req.body?.childId;
  if (typeof raw !== 'string' || !raw.trim() || raw.length > 64) {
    throw new HttpError(400, 'CHILD_ID_REQUIRED', 'Thiếu hoặc sai childId');
  }
  return raw.trim();
}

export function createPetController(service: PetService) {
  return {
    /** GET /api/pet?childId= → { pet: PetDTO | null } (null = bé chưa chọn loài) */
    getPet: asyncHandler(async (req, res) => {
      res.json({ pet: await service.getPet(getChildId(req)) });
    }),

    /** POST /api/pet { childId, speciesId } → 201 { pet } */
    createPet: asyncHandler(async (req, res) => {
      const pet = await service.createPet(getChildId(req), req.body?.speciesId);
      res.status(201).json({ pet });
    }),

    /** POST /api/pet/feed { childId } → { pet, result } */
    feedPet: asyncHandler(async (req, res) => {
      res.json(await service.feedPet(getChildId(req)));
    }),

    /** DELETE /api/pet?childId= → 204 */
    deletePet: asyncHandler(async (req, res) => {
      const deleted = await service.deletePet(getChildId(req));
      if (!deleted) throw new HttpError(404, 'PET_NOT_FOUND', 'Bé chưa chọn thú cưng');
      res.status(204).end();
    }),
  };
}
