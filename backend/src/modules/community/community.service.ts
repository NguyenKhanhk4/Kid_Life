// Community Service — business logic diễn đàn phụ huynh + Thử thách + Bảng xếp hạng
import { Types } from 'mongoose';
import { ForumPost, ForumComment } from './community.model';
import { CreatePostInput, CreateCommentInput } from './community.validation';
import Challenge from './challenge.model';
import Leaderboard from './leaderboard.model';

const DEFAULT_LIMIT = 10;

// ─── GET posts (phân trang + lọc tag) ────────────────────────────────────────
export async function getPostsService(page: number = 1, tag?: string) {
  const limit = DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = { isHidden: false };
  if (tag) filter.tags = tag;

  const [posts, total] = await Promise.all([
    ForumPost.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'fullName') // Chỉ lấy fullName — không lộ email/phone
      .lean(),
    ForumPost.countDocuments(filter),
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

// ─── CREATE post ──────────────────────────────────────────────────────────────
export async function createPostService(userId: string, input: CreatePostInput) {
  const post = await ForumPost.create({
    authorId: new Types.ObjectId(userId),
    title: input.title,
    content: input.content,
    tags: input.tags,
  });

  const populated = await ForumPost.findById(post._id)
    .populate('authorId', 'fullName')
    .lean();

  return populated;
}

// ─── TOGGLE like (idempotent) ─────────────────────────────────────────────────
export async function toggleLikeService(userId: string, postId: string) {
  const post = await ForumPost.findById(postId);
  if (!post) {
    const err = new Error('Không tìm thấy bài viết');
    (err as any).code = 'POST_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  const uid = new Types.ObjectId(userId);
  const alreadyLiked = post.likedBy.some((id) => id.equals(uid));

  if (alreadyLiked) {
    // Unlike
    post.likedBy = post.likedBy.filter((id) => !id.equals(uid));
  } else {
    // Like
    post.likedBy.push(uid);
  }

  post.likesCount = post.likedBy.length;
  await post.save();

  return { liked: !alreadyLiked, likesCount: post.likesCount };
}

// ─── REPORT post ──────────────────────────────────────────────────────────────
export async function reportPostService(postId: string) {
  const post = await ForumPost.findByIdAndUpdate(
    postId,
    { $inc: { reportsCount: 1 } },
    { new: true }
  );
  if (!post) {
    const err = new Error('Không tìm thấy bài viết');
    (err as any).code = 'POST_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }
  return { message: 'Đã báo cáo bài viết', reportsCount: post.reportsCount };
}

// ─── CREATE comment ───────────────────────────────────────────────────────────
export async function createCommentService(
  userId: string,
  postId: string,
  input: CreateCommentInput
) {
  const post = await ForumPost.findById(postId);
  if (!post) {
    const err = new Error('Không tìm thấy bài viết');
    (err as any).code = 'POST_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  const comment = await ForumComment.create({
    postId: new Types.ObjectId(postId),
    authorId: new Types.ObjectId(userId),
    commentText: input.commentText,
  });

  // Tăng commentsCount
  post.commentsCount += 1;
  await post.save();

  const populated = await ForumComment.findById(comment._id)
    .populate('authorId', 'fullName')
    .lean();

  return populated;
}

// ─── GET comments của 1 post (3 gần nhất) ────────────────────────────────────
export async function getCommentsService(postId: string, limit: number = 3) {
  const comments = await ForumComment.find({ postId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('authorId', 'fullName')
    .lean();

  return comments.reverse(); // Đảo lại để hiển thị cũ → mới
}

// ─── GET challenges đang mở (endDate >= hôm nay) ────────────────────────────────────────────
export async function getChallengesService() {
  const now = new Date();
  return Challenge.find({ endDate: { $gte: now } })
    .sort({ startDate: -1 })
    .lean();
}

// ─── JOIN challenge ────────────────────────────────────────────────────────────────────────────
export async function joinChallengeService(userId: string, challengeId: string) {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    const err = new Error('Không tìm thấy thử thách');
    (err as any).code = 'CHALLENGE_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  if (new Date() > challenge.endDate) {
    const err = new Error('Thử thách này đã kết thúc');
    (err as any).code = 'CHALLENGE_ENDED';
    (err as any).statusCode = 400;
    throw err;
  }

  const existing = await Leaderboard.findOne({
    challengeId: new Types.ObjectId(challengeId),
    familyId: new Types.ObjectId(userId),
  });
  if (existing) {
    const err = new Error('Gia đình bạn đã tham gia thử thách này rồi');
    (err as any).code = 'ALREADY_JOINED';
    (err as any).statusCode = 409;
    throw err;
  }

  const entry = await Leaderboard.create({
    challengeId: new Types.ObjectId(challengeId),
    familyId: new Types.ObjectId(userId),
    points: 0,
    streak: 0,
  });

  return entry;
}

// ─── GET leaderboard Top 50 (rank tính động) ──────────────────────────────────────────
export async function getLeaderboardService(challengeId: string) {
  const entries = await Leaderboard.find({ challengeId })
    .sort({ points: -1, streak: -1 })
    .limit(50)
    .populate('familyId', 'fullName')
    .lean();

  // Tính rank động bằng index (không lưu cứng trong DB)
  return entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}

// ─── INCREMENT points (EXPORT Để DEV 2 DÙNG) ────────────────────────────────────────────────────
// Dev 2 import và gọi khi duyệt nhiệm vụ hoàn thành:
//   import { incrementLeaderboardPoints } from '../../community/community.service';
//   await incrementLeaderboardPoints(familyId, challengeId, rewardXp);
export async function incrementLeaderboardPoints(
  familyId: string,
  challengeId: string,
  amount: number
): Promise<void> {
  await Leaderboard.findOneAndUpdate(
    {
      challengeId: new Types.ObjectId(challengeId),
      familyId: new Types.ObjectId(familyId),
    },
    { $inc: { points: amount } },
    { new: true }
  );
}
