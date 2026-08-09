import test, { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert';
import { SubmissionService } from '../src/modules/submission/submission.service';
import { SubmissionController } from '../src/modules/submission/submission.controller';
import { Submission } from '../src/modules/submission/submission.model';
import mongoose from 'mongoose';
import { getErrorCode } from './testUtils';
import { WalletService } from '../src/modules/wallet/wallet.service';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../src/shared/errors/AppError';

describe('Submission Module', () => {
  afterEach(() => {
    mock.restoreAll();
  });

  describe('Validation (Controller & Service)', () => {
    const mockReq = (params = {}, body = {}, query = {}, user = { id: '60c72b2f9b1d8b001c8e4d2a', role: 'PARENT', familyId: 'fam_1', allowedChildIds: ['60c72b2f9b1d8b001c8e4d2b'] }) => ({
      params,
      body,
      query,
      user,
    } as unknown as Request);
    
    const mockRes = () => {
      const res: any = {};
      res.status = mock.fn((code: number) => {
        res.statusCode = code;
        return res;
      });
      res.json = mock.fn((data: any) => {
        res.data = data;
        return res;
      });
      return res as Response;
    };
    const mockNext = mock.fn() as NextFunction;

    it('should throw BAD_REQUEST if invalid missionId is passed', async () => {
      try {
        await SubmissionService.createSubmission('invalid-id', '60c72b2f9b1d8b001c8e4d2b', []);
        assert.fail('Should have thrown an error');
      } catch (error: unknown) {
        assert.strictEqual(getErrorCode(error), 'BAD_REQUEST');
      }
    });

    it('reviewSubmission should throw BAD_REQUEST if decision is invalid', async () => {
      try {
        await SubmissionService.reviewSubmission('60c72b2f9b1d8b001c8e4d2a', 'invalid_decision' as any, '60c72b2f9b1d8b001c8e4d2b');
        assert.fail('Should have thrown an error');
      } catch (error: unknown) {
        assert.strictEqual(getErrorCode(error), 'BAD_REQUEST');
      }
    });

    it('reviewSubmission should throw BAD_REQUEST if rejected without reason', async () => {
      try {
        await SubmissionService.reviewSubmission('60c72b2f9b1d8b001c8e4d2a', 'rejected', '60c72b2f9b1d8b001c8e4d2b');
        assert.fail('Should have thrown an error');
      } catch (error: unknown) {
        assert.strictEqual(getErrorCode(error), 'BAD_REQUEST');
      }
    });

    it('Controller: reviewSubmission should return BAD_REQUEST if reason > 500 chars', async () => {
      const req = mockReq({ id: '60c72b2f9b1d8b001c8e4d2a' }, { decision: 'rejected', rejectReason: 'A'.repeat(501) });
      const res = mockRes();
      const localMockNext = mock.fn();
      
      mock.method(SubmissionService, 'getSubmissionById', () => Promise.resolve({ childId: '60c72b2f9b1d8b001c8e4d2b' }));

      await SubmissionController.reviewSubmission(req, res, localMockNext as unknown as NextFunction);
      assert.strictEqual(localMockNext.mock.callCount(), 1);
      const err: any = localMockNext.mock.calls[0].arguments[0];
      assert.ok(err instanceof AppError);
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.errorCode, 'BAD_REQUEST');
    });

    it('Controller: getSubmissions should return BAD_REQUEST for invalid status filter', async () => {
      const req = mockReq({}, {}, { childId: '60c72b2f9b1d8b001c8e4d2b', status: 'invalid' });
      const res = mockRes();
      const localMockNext = mock.fn();
      await SubmissionController.getSubmissions(req, res, localMockNext as unknown as NextFunction);
      assert.strictEqual(localMockNext.mock.callCount(), 1);
      const err: any = localMockNext.mock.calls[0].arguments[0];
      assert.ok(err instanceof AppError);
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.errorCode, 'BAD_REQUEST');
    });
  });

  describe('Idempotency & Double Approve', () => {
    it('reviewSubmission should throw DOUBLE_APPROVE if status is already approved and addPoints callCount=0', async () => {
      const mockSession = {
        startTransaction: () => {},
        commitTransaction: () => {},
        abortTransaction: () => {},
        endSession: () => {}
      };
      mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
      mock.method(Submission, 'findOneAndUpdate', () => Promise.resolve(null));
      
      const mockExisting = { session: () => Promise.resolve({ status: 'approved' }) };
      mock.method(Submission, 'findById', () => mockExisting);

      const addPointsMock = mock.method(WalletService, 'addPoints', () => Promise.resolve({}));

      try {
        await SubmissionService.reviewSubmission('60c72b2f9b1d8b001c8e4d2c', 'approved', '60c72b2f9b1d8b001c8e4d2a');
        assert.fail('Should have thrown an error');
      } catch (error: unknown) {
        assert.strictEqual(getErrorCode(error), 'CONFLICT'); // From DOUBLE_APPROVE check
      }

      assert.strictEqual(addPointsMock.mock.callCount(), 0);
    });

    it('createSubmission should throw CONFLICT on double submit', async () => {
      const { Mission } = require('../src/modules/mission/mission.model');
      mock.method(Mission, 'findById', () => Promise.resolve({ childId: '60c72b2f9b1d8b001c8e4d2b' }));
      
      mock.method(Submission.prototype, 'save', () => {
        const error = new Error('MongoServerError') as any;
        error.name = 'MongoServerError';
        error.code = 11000;
        return Promise.reject(error);
      });

      try {
        await SubmissionService.createSubmission('60c72b2f9b1d8b001c8e4d2d', '60c72b2f9b1d8b001c8e4d2b', []);
        assert.fail('Should have thrown an error');
      } catch (error: unknown) {
        assert.strictEqual(getErrorCode(error), 'CONFLICT');
      }
    });

    it('reviewSubmission should call WalletService.addPoints exactly once with session', async () => {
      const mockSession = {
        startTransaction: () => {},
        commitTransaction: () => {},
        abortTransaction: () => {},
        endSession: () => {}
      };
      mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
      
      const mockSubmission = { _id: '60c72b2f9b1d8b001c8e4d2c', missionId: '60c72b2f9b1d8b001c8e4d2d', childId: '60c72b2f9b1d8b001c8e4d2b', status: 'approved' };
      mock.method(Submission, 'findOneAndUpdate', () => Promise.resolve(mockSubmission));
      
      const { Mission } = require('../src/modules/mission/mission.model');
      mock.method(Mission, 'findById', () => ({ session: () => Promise.resolve({ rewardPoints: 50 }) }));

      const addPointsMock = mock.method(WalletService, 'addPoints', () => Promise.resolve({}));

      await SubmissionService.reviewSubmission('60c72b2f9b1d8b001c8e4d2c', 'approved', '60c72b2f9b1d8b001c8e4d2a');
      
      assert.strictEqual(addPointsMock.mock.callCount(), 1);
      const callArgs = addPointsMock.mock.calls[0].arguments;
      assert.strictEqual(callArgs[0], '60c72b2f9b1d8b001c8e4d2b');
      assert.strictEqual(callArgs[1], 50);
      assert.strictEqual(callArgs[5], mockSession);
    });

    it('reviewSubmission should abort transaction (abort=1, commit=0) if WalletService fails', async () => {
      let aborted = 0;
      let committed = 0;
      const mockSession = {
        startTransaction: () => {},
        commitTransaction: () => { committed++; },
        abortTransaction: () => { aborted++; },
        endSession: () => {}
      };
      mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
      
      const mockSubmission = { _id: '60c72b2f9b1d8b001c8e4d2c', missionId: '60c72b2f9b1d8b001c8e4d2d', childId: '60c72b2f9b1d8b001c8e4d2b', status: 'approved' };
      mock.method(Submission, 'findOneAndUpdate', () => Promise.resolve(mockSubmission));
      
      const { Mission } = require('../src/modules/mission/mission.model');
      mock.method(Mission, 'findById', () => ({ session: () => Promise.resolve({ rewardPoints: 50 }) }));

      mock.method(WalletService, 'addPoints', () => Promise.reject(new Error('Wallet Error')));

      try {
        await SubmissionService.reviewSubmission('60c72b2f9b1d8b001c8e4d2c', 'approved', '60c72b2f9b1d8b001c8e4d2a');
        assert.fail('Should have thrown an error');
      } catch (error: any) {
        assert.strictEqual(error.message, 'Wallet Error');
      }
      
      assert.strictEqual(aborted, 1);
      assert.strictEqual(committed, 0);
    });
  });
});
