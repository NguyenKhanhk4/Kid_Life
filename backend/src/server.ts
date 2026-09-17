import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDatabase from './config/database';
import errorHandler from './middleware/errorHandler';
import missionRoutes from './modules/missions/mission.routes';
import rewardRoutes from './modules/rewards/reward.routes';
import submissionRoutes from './modules/submissions/submission.routes';
import lessonRoutes from './modules/lessons/lesson.routes';
import approvalRoutes from './modules/approvals/approval.routes';

// DEV 1 Routes
import authRoutes from './modules/auth/auth.routes';
import familyRoutes from './modules/family/family.routes';
import childRoutes from './modules/children/children.routes';
import communityRoutes from './modules/community/community.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import adminRoutes from './modules/admin/admin.routes';
import supportRoutes from './modules/admin/support.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('KidLife API is running');
});

// === ROUTES ===
app.use('/api/missions', missionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/approvals', approvalRoutes);

// DEV 1 Mount
app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/children', childRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
