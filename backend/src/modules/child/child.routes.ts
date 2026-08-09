import { Router } from 'express';
import { ChildController } from './child.controller';
import { requireAuth, requireRole } from '../../shared/middleware/auth';
import { validateObjectId } from '../../shared/validation/validators';
import { validateCreateChild, validateUpdateChild } from './child.validator';

const router = Router();

router.post('/', requireAuth, requireRole(['PARENT']), validateCreateChild, ChildController.createChild);
router.get('/', requireAuth, requireRole(['PARENT']), ChildController.getChildren);
router.get('/:id', requireAuth, requireRole(['PARENT']), validateObjectId('id'), ChildController.getChild);
router.put('/:id', requireAuth, requireRole(['PARENT']), validateObjectId('id'), validateUpdateChild, ChildController.updateChild);
router.delete('/:id', requireAuth, requireRole(['PARENT']), validateObjectId('id'), ChildController.deleteChild);

export const childRoutes = router;
