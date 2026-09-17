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

app.use(errorHandler);

async function startServer(): Promise<void> {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
