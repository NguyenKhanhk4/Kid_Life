import { Router } from 'express';
import { getPet, feedPet } from '../controllers/pet.controller';

const router = Router();

// Giả định route này đã được mount ở /api/pet sau authMiddleware
router.get('/', getPet);
router.post('/feed', feedPet);

export default router;
