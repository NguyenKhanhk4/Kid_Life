import { createApp } from './app';
import { env } from './config/env';
import { connectMongo, disconnectMongo } from './database/mongo';
import 'dotenv/config';

// DEV 1 Routes
import authRoutes from './modules/auth/auth.routes';
import familyRoutes from './modules/family/family.routes';
import childRoutes from './modules/children/children.routes';
import communityRoutes from './modules/community/community.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import adminRoutes from './modules/admin/admin.routes';
import supportRoutes from './modules/admin/support.routes';

// DEV 2 Routes
import missionRoutes from './modules/missions/mission.routes';
import rewardRoutes from './modules/rewards/reward.routes';
import submissionRoutes from './modules/submissions/submission.routes';
import lessonRoutes from './modules/lessons/lesson.routes';
import approvalRoutes from './modules/approvals/approval.routes';
import penaltyRoutes from './modules/penalties/penalty.routes';
import virtualBankRoutes from './modules/virtual-bank/virtual-bank.routes';
import scheduleDailyInterest from './modules/virtual-bank/virtual-bank.cron';
import { processInterest } from './modules/virtual-bank/virtual-bank.service';

async function main() {
  await connectMongo(env.mongoUri);

  const { app, registerErrorHandlers } = createApp();

  // === DEV 1 Routes ===
  app.use('/api/auth', authRoutes);
  app.use('/api/family', familyRoutes);
  app.use('/api/children', childRoutes);
  app.use('/api/community', communityRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/support', supportRoutes);

  // === DEV 2 Routes ===
  app.use('/api/missions', missionRoutes);
  app.use('/api/rewards', rewardRoutes);
  app.use('/api/submissions', submissionRoutes);
  app.use('/api/lessons', lessonRoutes);
  app.use('/api/approvals', approvalRoutes);
  app.use('/api/penalties', penaltyRoutes);
  app.use('/api/virtual-bank', virtualBankRoutes);

  // Schedule cron jobs
  scheduleDailyInterest(processInterest);

  // Error handlers phải đăng ký SAU tất cả routes
  registerErrorHandlers();

  const server = app.listen(env.port, () => {
    console.log(`KidLife API chạy tại http://localhost:${env.port} (MongoDB: ${env.mongoUri})`);
  });

  const shutdown = () => {
    server.close(() => {
      disconnectMongo().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('Không khởi động được server:', err);
  process.exit(1);
});
