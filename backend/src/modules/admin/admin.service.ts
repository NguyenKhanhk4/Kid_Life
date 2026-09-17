import User from '../auth/user.model';
import FamilyMember from '../family/family.model';
import Child from '../children/children.model';
import Challenge from '../community/challenge.model';
import SystemSetting from './system_setting.model';
import AuditLog from './audit_log.model';
import SupportTicket from './support_ticket.model';
import { ForumPost, ForumComment } from '../community/community.model';

export async function getAdminStatsService() {
  // Đếm families (chỉ tính những user có role = parent và được xem là chủ gia đình)
  // Thực tế, mỗi parent đăng ký là 1 gia đình, hoặc có thể đếm User role='parent'
  const totalFamilies = await User.countDocuments({ role: 'parent' });
  const totalChildren = await Child.countDocuments();
  
  // TODO: Chờ Dev 2 export model Mission (hoặc hàm countCompletedMissions)
  // Tạm thời để 0 hoặc gọi fake nếu chưa có. Không được tự import đường dẫn nội bộ của missions.
  const totalMissionsCompleted = 0; 
  
  // Đếm active users today (fake logic dựa trên updated at hoặc token, 
  // ở đây đếm user có updatedAt trong hôm nay)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalActiveUsersToday = await User.countDocuments({
    updatedAt: { $gte: today },
  });

  // NHÓM A - CÁC FIELD MỚI
  // TODO: Chờ Dev 2 export model Redemption, Wallet, Lesson (QuizSubmission)
  console.warn('[admin.stats] TODO: cần Dev 2 export Model Redemption, Wallet, QuizSubmission');
  const totalRedemptions = 0;
  const totalXPCirculating = 0;
  const totalLessonsCompleted = 0;

  // TODO: Chờ Dev 3 export model Pet, ChildWish
  console.warn('[admin.stats] TODO: cần Dev 3 export Model Pet, ChildWish');
  const petsByStage = { stage1: 0, stage2: 0, stage3: 0, stage4: 0 };
  const pendingWishesCount = 0;

  const totalForumPosts = await ForumPost.countDocuments();
  const totalForumComments = await ForumComment.countDocuments();

  // Aggregate users mới trong 7 ngày qua
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const newUsersAgg = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  const newUsersLast7Days = newUsersAgg.map(d => ({ date: d._id, count: d.count }));

  return {
    totalFamilies,
    totalChildren,
    totalMissionsCompleted,
    totalActiveUsersToday,
    totalRedemptions,
    totalXPCirculating,
    totalLessonsCompleted,
    petsByStage,
    pendingWishesCount,
    totalForumPosts,
    totalForumComments,
    newUsersLast7Days
  };
}

export async function getUsersService(page: number = 1, role?: string, status?: string) {
  const limit = 20;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
}

export async function updateUserStatusService(userId: string, status: 'active' | 'locked') {
  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );

  if (!user) {
    const err = new Error('Không tìm thấy người dùng');
    (err as any).code = 'USER_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }

  return user;
}

// ─── NHÓM B: QUẢN LÝ GIA ĐÌNH & TRẺ EM ──────────────────────────────────────────

export async function getFamilyDetailService(userId: string) {
  const owner = await User.findById(userId).select('-passwordHash -refreshToken');
  if (!owner) throw new Error('Không tìm thấy người dùng');

  const members = await FamilyMember.find({ familyId: userId }).populate('userId', 'fullName email role status avatar');
  const children = await Child.find({ parentId: userId });

  // TODO: Lấy totalMissionsCompleted của từng bé qua export của Dev 2
  console.warn('[admin.families] TODO: Cần Dev 2 export hàm đếm nhiệm vụ của bé');

  return {
    owner,
    members,
    children: children.map(c => ({
      ...c.toObject(),
      totalMissionsCompleted: 0 // Placeholder
    }))
  };
}

export async function updateChildStatusService(childId: string, status: 'active' | 'locked') {
  const child = await Child.findByIdAndUpdate(
    childId,
    { status },
    { new: true }
  );
  if (!child) {
    const err = new Error('Không tìm thấy bé');
    (err as any).code = 'CHILD_NOT_FOUND';
    (err as any).statusCode = 404;
    throw err;
  }
  return child;
}

export async function getPendingInvitesService() {
  const invites = await FamilyMember.find({ status: 'pending' })
    .populate('familyId', 'fullName email')
    .sort({ createdAt: -1 });
  return invites;
}

// ─── NHÓM C: KIỂM DUYỆT CỘNG ĐỒNG ──────────────────────────────────────────────

export async function getReportedPostsService() {
  return ForumPost.find({ reportsCount: { $gt: 0 } })
    .sort({ reportsCount: -1 })
    .populate('authorId', 'fullName email')
    .lean();
}

export async function hidePostService(postId: string, isHidden: boolean) {
  const post = await ForumPost.findByIdAndUpdate(
    postId,
    { isHidden },
    { new: true }
  );
  if (!post) throw new Error('Không tìm thấy bài viết');
  return post;
}

export async function createChallengeService(data: any) {
  const challenge = await Challenge.create(data);
  return challenge;
}

export async function closeChallengeService(challengeId: string) {
  const challenge = await Challenge.findByIdAndUpdate(
    challengeId,
    { endDate: new Date() }, // Đóng ngay lập tức
    { new: true }
  );
  if (!challenge) throw new Error('Không tìm thấy thử thách');
  return challenge;
}

// ─── NHÓM E: CẤU HÌNH HỆ THỐNG ───────────────────────────────────────────────

export async function getSettingsService() {
  return SystemSetting.find().sort({ key: 1 }).populate('updatedBy', 'fullName').lean();
}

export async function updateSettingService(key: string, value: any, userId: string) {
  const setting = await SystemSetting.findOneAndUpdate(
    { key },
    { value, updatedBy: userId },
    { new: true, upsert: true }
  );
  return setting;
}

// Helper export dùng chung cho các module khác
export async function getSetting(key: string, defaultValue: any): Promise<any> {
  const setting = await SystemSetting.findOne({ key }).lean();
  return setting ? setting.value : defaultValue;
}

// ─── NHÓM F: VẬN HÀNH & GIÁM SÁT ──────────────────────────────────────────────

export async function logAdminAction(actorId: string, action: string, targetType?: string, targetId?: string, metaJson?: any) {
  try {
    await AuditLog.create({ actorId, action, targetType, targetId, metaJson });
  } catch (err) {
    console.error('Failed to log admin action:', err);
  }
}

export async function getAuditLogsService(page: number = 1, actionFilter?: string) {
  const limit = 20;
  const skip = (page - 1) * limit;
  const filter: any = {};
  if (actionFilter) filter.action = actionFilter;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('actorId', 'fullName email').lean(),
    AuditLog.countDocuments(filter)
  ]);

  return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + limit < total } };
}

export async function createSupportTicketService(userId: string, subject: string, message: string) {
  return SupportTicket.create({ userId, subject, message });
}

export async function getSupportTicketsService() {
  return SupportTicket.find().sort({ status: 1, createdAt: -1 }).populate('userId', 'fullName email').lean();
}

export async function resolveSupportTicketService(ticketId: string) {
  const ticket = await SupportTicket.findByIdAndUpdate(ticketId, { status: 'resolved' }, { new: true });
  if (!ticket) throw new Error('Không tìm thấy ticket');
  return ticket;
}
