import { Router } from 'express';
import { WalletController } from './wallet.controller';
import { requireAuth, requireRole, requireChildScope } from '../../shared/middleware/auth';
import { validatePagination } from '../../shared/validation/validators';

const router = Router();

// Allow parent and child within the correct scope
router.get('/children/:childId/wallet', requireAuth, requireChildScope('childId'), WalletController.getWallet);
router.get('/children/:childId/wallet/transactions', requireAuth, requireChildScope('childId'), validatePagination, WalletController.getHistory);

// Admin manual adjustments
router.post('/children/:childId/wallet/adjust', requireAuth, requireRole(['ADMIN']), WalletController.adminAdjust);

export const walletRoutes = router;
