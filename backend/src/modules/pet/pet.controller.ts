import { asyncHandler } from '../../shared/http';
import { resolveChildId } from '../../shared/childAccess';
import type { PetService } from './pet.service';

export function createPetController(service: PetService) {
  return {
    /** GET /api/pet/config → các con số của pet (EXP, lượt ăn, giá XP, danh sách loài) */
    getConfig: asyncHandler(async (_req, res) => {
      res.json({ config: service.getConfig() });
    }),

    /** GET /api/pet?childId= → { pet: PetDTO | null, xpBalance } (pet null = bé chưa chọn loài) */
    getPet: asyncHandler(async (req, res) => {
      const childId = await resolveChildId(req);
      const [pet, xpBalance] = await Promise.all([service.getPet(childId), service.getXpBalance(childId)]);
      res.json({ pet, xpBalance });
    }),

    /** POST /api/pet { childId, speciesId } → 201 { pet } */
    createPet: asyncHandler(async (req, res) => {
      const pet = await service.createPet(await resolveChildId(req), req.body?.speciesId);
      res.status(201).json({ pet });
    }),

    /** POST /api/pet/feed { childId } → { pet, result } */
    feedPet: asyncHandler(async (req, res) => {
      res.json(await service.feedPet(await resolveChildId(req)));
    }),
  };
}
