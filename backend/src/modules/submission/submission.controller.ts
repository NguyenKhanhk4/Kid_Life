import { Request, Response, NextFunction } from 'express';
import { SubmissionService } from './submission.service';
import { sendResponse } from '../../shared/responses/apiResponse';
import { SubmissionStatus } from './submission.model';
import { verifyChildScope } from '../../shared/middleware/auth';
import { AppError } from '../../shared/errors/AppError';
import { MissionService } from '../mission/mission.service';

export class SubmissionController {
  static async createSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const evidenceUrls: string[] = req.body.evidenceUrls || [];
      const missionId = req.params.id;
      if (!missionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid mission ID', 400, 'BAD_REQUEST');
      
      // Controller trust: childId must come from the authenticated user, NOT the body.
      const childId = req.user!.id;
      
      const submission = await SubmissionService.createSubmission(missionId, childId, evidenceUrls);
      return sendResponse(res, 201, submission);
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      // PARENT list submissions must provide childId query to scope it correctly.
      // And we must verify the provided childId belongs to the PARENT.
      const childId = req.query.childId as string;
      if (!childId) {
        // According to user: "PARENT list submissions bắt buộc childId scope."
        // We enforce it at the controller level instead of letting it be empty.
        throw new AppError('childId query parameter is required for listing submissions', 400, 'BAD_REQUEST');
      }

      // We verify the requested childId is allowed for this user
      verifyChildScope(req.user!, childId);

      const status = req.query.status as string;
      if (status && !['pending_review', 'approved', 'rejected'].includes(status)) {
        throw new AppError('Invalid status filter', 400, 'BAD_REQUEST');
      }
      const submissions = await SubmissionService.getSubmissions(childId, status as SubmissionStatus);
      return sendResponse(res, 200, submissions);
    } catch (error) {
      next(error);
    }
  }

  static async getSubmissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const submissionId = req.params.id;
      if (!submissionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid submission ID', 400, 'BAD_REQUEST');
      const submission = await SubmissionService.getSubmissionById(submissionId);
      verifyChildScope(req.user!, submission.childId);
      return sendResponse(res, 200, submission);
    } catch (error) {
      next(error);
    }
  }

  static async reviewSubmission(req: Request, res: Response, next: NextFunction) {
    try {
      const submissionId = req.params.id;
      if (!submissionId.match(/^[0-9a-fA-F]{24}$/)) throw new AppError('Invalid submission ID', 400, 'BAD_REQUEST');
      const submission = await SubmissionService.getSubmissionById(submissionId);
      verifyChildScope(req.user!, submission.childId);

      let { decision, rejectReason } = req.body;
      if (rejectReason && typeof rejectReason === 'string') {
        rejectReason = rejectReason.trim();
        if (rejectReason.length > 500) {
          throw new AppError('Reject reason must be under 500 characters', 400, 'BAD_REQUEST');
        }
      }
      
      const reviewerId = req.user!.id;
      const updated = await SubmissionService.reviewSubmission(submissionId, decision, reviewerId, rejectReason);
      return sendResponse(res, 200, updated);
    } catch (error) {
      next(error);
    }
  }
}
