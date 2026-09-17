// Community Controller
import { Request, Response } from 'express';
import {
  getPostsService,
  createPostService,
  toggleLikeService,
  createCommentService,
  getCommentsService,
  getChallengesService,
  joinChallengeService,
  getLeaderboardService,
  reportPostService,
} from './community.service';
import { successResponse } from '../../utils/responseHelper';

export async function getPosts(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const tag = req.query.tag as string | undefined;
    const result = await getPostsService(page, tag);
    res.status(200).json(successResponse(result, 'Lấy danh sách bài viết thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_POSTS_ERROR', message: err.message },
    });
  }
}

export async function createPost(req: Request, res: Response): Promise<void> {
  try {
    const post = await createPostService(req.user!.id, req.body);
    res.status(201).json(successResponse(post, 'Đăng bài viết thành công', 201));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'CREATE_POST_ERROR', message: err.message },
    });
  }
}

export async function toggleLike(req: Request, res: Response): Promise<void> {
  try {
    const result = await toggleLikeService(req.user!.id, req.params.id);
    res.status(200).json(successResponse(result, result.liked ? 'Đã thả tim ❤️' : 'Đã bỏ tim'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'LIKE_ERROR', message: err.message },
    });
  }
}

export async function createComment(req: Request, res: Response): Promise<void> {
  try {
    const comment = await createCommentService(req.user!.id, req.params.id, req.body);
    res.status(201).json(successResponse(comment, 'Bình luận thành công', 201));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'COMMENT_ERROR', message: err.message },
    });
  }
}

export async function getComments(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 3;
    const comments = await getCommentsService(req.params.id, limit);
    res.status(200).json(successResponse(comments, 'Lấy bình luận thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_COMMENTS_ERROR', message: err.message },
    });
  }
}

export async function reportPost(req: Request, res: Response): Promise<void> {
  try {
    const result = await reportPostService(req.params.id);
    res.status(200).json(successResponse(result, 'Đã báo cáo bài viết'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'REPORT_POST_ERROR', message: err.message },
    });
  }
}

// ─── Challenge / Leaderboard ─────────────────────────────────────────────────────────────────────
export async function getChallenges(req: Request, res: Response): Promise<void> {
  try {
    const challenges = await getChallengesService();
    res.status(200).json(successResponse(challenges, 'Lấy danh sách thử thách thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_CHALLENGES_ERROR', message: err.message },
    });
  }
}

export async function joinChallenge(req: Request, res: Response): Promise<void> {
  try {
    const entry = await joinChallengeService(req.user!.id, req.params.id);
    res.status(201).json(successResponse(entry, 'Tham gia thử thách thành công!', 201));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'JOIN_CHALLENGE_ERROR', message: err.message },
    });
  }
}

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
  try {
    const { challengeId } = req.query;
    if (!challengeId || typeof challengeId !== 'string') {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_CHALLENGE_ID', message: 'challengeId là bắt buộc' },
      });
      return;
    }
    const leaderboard = await getLeaderboardService(challengeId);
    res.status(200).json(successResponse(leaderboard, 'Lấy bảng xếp hạng thành công'));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: { code: err.code || 'GET_LEADERBOARD_ERROR', message: err.message },
    });
  }
}
