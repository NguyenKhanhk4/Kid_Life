import { Router } from 'express';
import authMiddleware from '../../middleware/authMiddleware';
import requireRole from '../../middleware/rbacMiddleware';
import { createPetAccessoryRouter } from './accessories/pet-accessory.routes';
import type { PetAccessoryService } from './accessories/pet-accessory.service';
import { createPetController } from './pet.controller';
import type { PetService } from './pet.service';

/** Mount tại /api/pet (xem app.ts). */
export function createPetRouter(service: PetService, accessoryService: PetAccessoryService): Router {
  const controller = createPetController(service);
  const router = Router();

  router.use(authMiddleware);
  router.use(requireRole('admin', 'parent'));

  router.get('/config', controller.getConfig);
  router.get('/', controller.getPet);
  router.post('/', controller.createPet);
  router.post('/feed', controller.feedPet);
  router.use('/accessories', createPetAccessoryRouter(accessoryService));

  return router;
}
