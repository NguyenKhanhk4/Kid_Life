import { Router } from 'express';
import { SkillController } from './skill.controller';
import { requireAuth, requireRole } from '../../shared/middleware/auth';
import { validateObjectId } from '../../shared/validation/validators';

const router = Router();

router.get('/', requireAuth, SkillController.list);
router.post('/', requireAuth, requireRole(['EXPERT', 'ADMIN']), SkillController.create);
router.put('/:id', requireAuth, requireRole(['EXPERT', 'ADMIN']), validateObjectId('id'), SkillController.update);
router.delete('/:id', requireAuth, requireRole(['ADMIN']), validateObjectId('id'), SkillController.delete);

export const skillRoutes = router;
