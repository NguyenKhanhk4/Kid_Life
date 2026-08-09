import express from 'express';
import cors from 'cors';
import { errorHandler } from './shared/errors/errorHandler';

import { paymentWebhookRoute } from './modules/payment/payment.webhook';
import { walletRoutes } from './modules/wallet/wallet.routes';
import { petRoutes } from './modules/pet/pet.routes';
import { rewardRoutes } from './modules/reward/reward.routes';
import { certificateRoutes } from './modules/certificate/certificate.routes';
import { paymentRoutes } from './modules/payment/payment.routes';
import { reportRoutes } from './modules/report/report.routes';
import { missionRoutes } from './modules/mission/mission.routes';
import { submissionRoutes } from './modules/submission/submission.routes';

const app = express();

app.use(cors());

// Webhook must use express.raw, so it should be mounted BEFORE express.json
app.use('/api/v1/payments/webhook', paymentWebhookRoute);

app.use(express.json());

// API version prefix
const v1Router = express.Router();

const healthHandler = (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
};

app.get('/health', healthHandler);
v1Router.get('/health', healthHandler);

// Mount feature routes
v1Router.use(walletRoutes);
v1Router.use(petRoutes);
v1Router.use(rewardRoutes);
v1Router.use(certificateRoutes);
v1Router.use(paymentRoutes);
v1Router.use('/reports', reportRoutes);
v1Router.use('/missions', missionRoutes);
v1Router.use('/submissions', submissionRoutes);

app.use('/api/v1', v1Router);

// Global Error Handler
app.use(errorHandler);

export { app };
