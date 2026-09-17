import mongoose from 'mongoose';
import Submission from '../submissions/submission.model';
import Mission from '../missions/mission.model';
import Wallet, { IWallet } from '../wallets/wallet.model';
import WalletTransaction from '../wallets/wallet-transaction.model';

function calculateLevel(total_xp: number): number {
  if (total_xp >= 2000) return 5;
  if (total_xp >= 1000) return 4;
  if (total_xp >= 500) return 3;
  if (total_xp >= 200) return 2;
  return 1;
}

export async function getPendingSubmissions() {
  const submissions = await Submission.find({ status: 'submitted' }).sort({ submitted_at: -1 }).lean();
  
  const submissionsWithMissions = await Promise.all(
    submissions.map(async (sub) => {
      const mission = await Mission.findById(sub.mission_id).lean();
      return { ...sub, mission: mission || null };
    })
  );
  
  return submissionsWithMissions;
}

export async function approveSubmission(submissionId: string, action: 'approved' | 'rejected', feedback: string) {
  if (!mongoose.Types.ObjectId.isValid(submissionId)) {
    throw new Error('submissionId không hợp lệ');
  }

  const submission = await Submission.findById(submissionId);
  if (!submission) {
    throw new Error('Không tìm thấy bài nộp');
  }

  if (submission.status !== 'submitted') {
    throw new Error('Bài nộp này đã được xử lý rồi');
  }

  const mission = await Mission.findById(submission.mission_id);
  if (!mission) {
    throw new Error('Không tìm thấy nhiệm vụ liên quan');
  }

  const [updatedSubmission] = await Promise.all([
    Submission.findByIdAndUpdate(
      submissionId,
      { status: action, reviewed_at: new Date() },
      { new: true }
    ).lean(),
    Mission.findByIdAndUpdate(
      mission._id,
      { status: action === 'approved' ? 'done' : 'todo', updated_at: new Date() }
    )
  ]);

  let wallet: IWallet | null = null;
  let new_level: number = 1;

  if (action === 'approved') {
    try {
      let foundWallet = await Wallet.findOne({ child_id: submission.child_id });
      if (!foundWallet) {
        foundWallet = await Wallet.create({ child_id: submission.child_id, total_xp: 0, current_level: 1 });
      }

      const old_level = foundWallet.current_level;
      const new_total_xp = foundWallet.total_xp + mission.reward_xp;
      new_level = calculateLevel(new_total_xp);

      wallet = await Wallet.findByIdAndUpdate(
        foundWallet._id,
        { total_xp: new_total_xp, current_level: new_level, updated_at: new Date() },
        { new: true }
      ).lean();

      await WalletTransaction.create({
        wallet_id: foundWallet._id,
        child_id: submission.child_id,
        amount: mission.reward_xp,
        type: 'mission_reward',
        reference_id: submission._id,
        description: `Hoàn thành nhiệm vụ: ${mission.title}`
      });
      
      const level_up = new_level > old_level;
      
      return {
        submission: updatedSubmission,
        wallet,
        xp_earned: mission.reward_xp,
        new_level,
        level_up
      };

    } catch (xpError) {
      console.error('❌ Lỗi cộng XP:', xpError);
      return {
        submission: updatedSubmission,
        wallet: null,
        xp_earned: mission.reward_xp,
        new_level: null,
        level_up: false
      };
    }
  }

  return {
    submission: updatedSubmission,
    wallet: null,
    xp_earned: 0,
    new_level: null,
    level_up: false
  };
}

export async function getWalletByChildId(childId: string) {
  if (!mongoose.Types.ObjectId.isValid(childId)) {
    throw new Error('childId không hợp lệ');
  }

  const wallet = await Wallet.findOne({ child_id: childId }).lean();
  
  if (!wallet) {
    return {
      child_id: childId,
      total_xp: 0,
      current_level: 1,
      transactions: []
    };
  }

  const transactions = await WalletTransaction.find({ child_id: childId })
    .sort({ created_at: -1 })
    .limit(20)
    .lean();

  return { ...wallet, transactions };
}
