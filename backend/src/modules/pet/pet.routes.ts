import { Router } from 'express';
import { createPetController } from './pet.controller';
import type { PetService } from './pet.service';

/** Mount tại /api/pet (xem app.ts). Khi có auth của Dev 1 thì gắn authMiddleware trước router này. */
export function createPetRouter(service: PetService, options: { allowDelete: boolean }): Router {
  const controller = createPetController(service);
  const router = Router();

  router.get('/', controller.getPet);
  router.post('/', controller.createPet);
  router.post('/feed', controller.feedPet);
  if (options.allowDelete) router.delete('/', controller.deletePet);

  return router;
}
