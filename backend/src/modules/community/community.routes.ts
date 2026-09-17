// Community Routes — mount tại /api/community
import { Router } from 'express';
import { getPosts, createPost, toggleLike,  createComment,
  getComments,
  getChallenges,
  joinChallenge,
  getLeaderboard,
  reportPost,
} from './community.controller';
import authMiddleware from '../../middleware/authMiddleware';
import validateRequest from '../../middleware/validateRequest';
import { createPostSchema, createCommentSchema } from './community.validation';

const router = Router();

// Tất cả route community đều cần đăng nhập
router.use(authMiddleware);

// GET  /api/community/posts?page=1&tag=kynang
router.get('/posts', getPosts);

// POST /api/community/posts
router.post('/posts', validateRequest(createPostSchema), createPost);

// POST /api/community/posts/:id/like — toggle like (idempotent)
router.post('/posts/:id/like', toggleLike);

// GET  /api/community/posts/:id/comments?limit=3
router.get('/posts/:id/comments', getComments);

// Báo cáo bài viết
router.post('/posts/:id/report', reportPost);

// POST /api/community/posts/:id/comments
router.post('/posts/:id/comments', validateRequest(createCommentSchema), createComment);

// GET  /api/community/challenges
router.get('/challenges', getChallenges);

// POST /api/community/challenges/:id/join
router.post('/challenges/:id/join', joinChallenge);

// GET  /api/community/leaderboard?challengeId=xxx
router.get('/leaderboard', getLeaderboard);

export default router;
