import mongoose, { FilterQuery } from 'mongoose';
import { Submission, ISubmission, SubmissionStatus } from './submission.model';
import { Mission } from '../mission/mission.model';
import { WalletService } from '../wallet/wallet.service';
import { AppError } from '../../shared/errors/AppError';

export class SubmissionService {
  static async createSubmission(missionId: string, childId: string, evidenceUrls: string[]): Promise<ISubmission> {
    if (!mongoose.isValidObjectId(missionId)) throw new AppError('Invalid missionId', 400, 'BAD_REQUEST');
    if (!mongoose.isValidObjectId(childId)) throw new AppError('Invalid childId', 400, 'BAD_REQUEST');

    const mission = await Mission.findById(missionId);
    if (!mission) {
      throw new AppError('Mission not found', 404, 'NOT_FOUND');
    }
    if (mission.childId !== childId) {
      throw new AppError('Forbidden - Mission does not belong to this child', 403, 'FORBIDDEN');
    }

    if (!Array.isArray(evidenceUrls) || evidenceUrls.length > 5) {
      throw new AppError('Invalid evidence URLs', 400, 'BAD_REQUEST');
    }
    
    // Validate URLs basic
    for (const url of evidenceUrls) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
          throw new Error('Invalid protocol');
        }
      } catch (err) {
        throw new AppError('Invalid evidence URL format', 400, 'BAD_REQUEST');
      }
    }

    const submission = new Submission({
      missionId,
      childId,
      evidenceUrls,
      status: 'pending_review',
    });
    try {
      return await submission.save();
    } catch (error: any) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new AppError('Cannot submit again. A submission is already pending or approved.', 409, 'CONFLICT');
      }
      throw error;
    }
  }

  static async getSubmissions(childId?: string, status?: SubmissionStatus): Promise<ISubmission[]> {
    if (childId && !mongoose.isValidObjectId(childId)) throw new AppError('Invalid childId', 400, 'BAD_REQUEST');
    const query: FilterQuery<ISubmission> = {};
    if (childId) query.childId = childId;
    if (status) query.status = status;
    return Submission.find(query).sort({ createdAt: -1 });
  }

  static async getSubmissionById(id: string): Promise<ISubmission> {
    if (!mongoose.isValidObjectId(id)) throw new AppError('Invalid submission ID', 400, 'BAD_REQUEST');
    const submission = await Submission.findById(id);
    if (!submission) {
      throw new AppError('Submission not found', 404, 'NOT_FOUND');
    }
    return submission;
  }

  static async reviewSubmission(
    submissionId: string,
    decision: 'approved' | 'rejected',
    reviewerId: string,
    rejectReason?: string
  ): Promise<ISubmission> {
    if (!mongoose.isValidObjectId(submissionId)) throw new AppError('Invalid submission ID', 400, 'BAD_REQUEST');
    if (!mongoose.isValidObjectId(reviewerId)) throw new AppError('Invalid reviewer ID', 400, 'BAD_REQUEST');
    if (decision !== 'approved' && decision !== 'rejected') {
      throw new AppError('Invalid decision. Must be approved or rejected', 400, 'BAD_REQUEST');
    }
    if (decision === 'rejected' && (!rejectReason || rejectReason.trim() === '')) {
      throw new AppError('Reject reason is required when rejecting a submission', 400, 'BAD_REQUEST');
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const submission = await Submission.findOneAndUpdate(
        { _id: submissionId, status: 'pending_review' },
        { 
          $set: { 
            status: decision, 
            reviewedBy: reviewerId, 
            rejectReason: decision === 'rejected' ? rejectReason : undefined 
          },
          $unset: decision === 'approved' ? { rejectReason: 1 } : {}
        },
        { new: true, session }
      );

      if (!submission) {
        const existing = await Submission.findById(submissionId).session(session);
        if (existing && existing.status !== 'pending_review') {
          throw new AppError('DOUBLE_APPROVE - Submission is already processed', 409, 'CONFLICT');
        }
        throw new AppError('Submission not found', 404, 'NOT_FOUND');
      }

      const mission = await Mission.findById(submission.missionId).session(session);
      if (!mission) {
        throw new AppError('Mission not found', 404, 'NOT_FOUND');
      }

      if (decision === 'approved' && mission.rewardPoints > 0) {
        const idempotencyKey = `MISSION_APP_${submission._id}`;
        await WalletService.addPoints(
          submission.childId,
          mission.rewardPoints,
          'TASK',
          submission._id.toString(),
          idempotencyKey,
          session
        );
      }

      await session.commitTransaction();
      return submission;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
