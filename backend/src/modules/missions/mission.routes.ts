// Định nghĩa routes cho Mission module
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { createMissionSchema, updateMissionSchema } from './mission.validation';
import {
  getMissions,
  createMission,
  updateMission,
  deleteMission,
} from './mission.controller';

const router = Router();

router.get('/', getMissions);
router.post('/', validateRequest(createMissionSchema), createMission);
router.put('/:id', validateRequest(updateMissionSchema), updateMission);
router.delete('/:id', deleteMission);

export default router;
