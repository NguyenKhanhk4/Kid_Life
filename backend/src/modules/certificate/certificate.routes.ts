import { Router } from 'express';
import { CertificateController } from './certificate.controller';
import { requireAuth, requireChildScope } from '../../shared/middleware/auth';

const router = Router();

router.get(
  '/children/:childId/certificates',
  requireAuth,
  requireChildScope('childId'),
  CertificateController.getCertificates
);

export const certificateRoutes = router;
