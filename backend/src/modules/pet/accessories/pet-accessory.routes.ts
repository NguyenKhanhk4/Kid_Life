import { Router } from 'express';
import authMiddleware from '../../../middleware/authMiddleware';
import requireRole from '../../../middleware/rbacMiddleware';
import { createPetAccessoryAdminController, createPetAccessoryController } from './pet-accessory.controller';
import type { PetAccessoryService } from './pet-accessory.service';

/** Mount tại /api/pet/accessories (bên trong pet router, đã có auth). */
export function createPetAccessoryRouter(service: PetAccessoryService): Router {
  const controller = createPetAccessoryController(service);
  const router = Router();
  router.get('/', controller.list);
  router.post('/buy', controller.buy);
  router.post('/equip', controller.equip);
  router.post('/unequip', controller.unequip);
  return router;
}

/** Mount tại /api/admin/master-data/accessories — chỉ admin. */
export function createPetAccessoryAdminRouter(service: PetAccessoryService): Router {
  const controller = createPetAccessoryAdminController(service);
  const router = Router();
  router.use(authMiddleware);
  router.use(requireRole('admin'));
  router.get('/', controller.list);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}
