import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { requireAuth, requireRole } from '../../shared/middleware/auth';

const router = Router();

router.get('/plans', PaymentController.getPlans);
router.post('/subscriptions', requireAuth, requireRole(['PARENT']), PaymentController.subscribe);
router.get('/subscriptions/me', requireAuth, requireRole(['PARENT']), PaymentController.getMySubscriptions);
router.patch('/subscriptions/me/cancel', requireAuth, requireRole(['PARENT']), PaymentController.cancelSubscription);
router.get('/transactions', requireAuth, requireRole(['PARENT']), PaymentController.getTransactions);

export const paymentRoutes = router;
