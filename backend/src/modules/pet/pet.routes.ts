import { Router } from 'express';
import { PetController } from './pet.controller';
import { requireAuth, requireChildScope } from '../../shared/middleware/auth';

const router = Router();

router.get('/children/:childId/pet', requireAuth, requireChildScope('childId'), PetController.getPet);
router.post('/children/:childId/pet/feed', requireAuth, requireChildScope('childId'), PetController.feedPet);

export const petRoutes = router;
