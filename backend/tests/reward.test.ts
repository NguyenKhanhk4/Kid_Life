import test, { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { RewardService } from '../src/modules/reward/reward.service';
import { RewardRedemption } from '../src/modules/reward/reward.model';
import { WalletService } from '../src/modules/wallet/wallet.service';
import { getErrorCode } from './testUtils';

describe('RewardService', () => {
  test('approveRedemption should fail if already processed', async () => {
    const mockSession = {
      startTransaction: () => {},
      commitTransaction: () => {},
      abortTransaction: () => {},
      endSession: () => {}
    };
    mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
    mock.method(RewardRedemption, 'findOneAndUpdate', () => Promise.resolve(null));

    try {
      await RewardService.approveRedemption('redemp_3', 'parent_1', 'family_1');
      assert.fail('Should have thrown ALREADY_PROCESSED');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'ALREADY_PROCESSED');
    }

    mock.restoreAll();
  });

  test('requestRedemption should throw DUPLICATE_PENDING if already pending', async () => {
    mock.method(RewardRedemption, 'findOne', () => Promise.resolve({ status: 'PENDING' }));

    // Mock Reward.findOne to simulate reward existing
    const mockReward = { _id: 'reward_1', familyId: 'family_1', status: 'ACTIVE', title: 'Toy', cost: 100 };
    mock.method(mongoose.Model, 'findOne', (filter: Record<string, unknown>) => {
      if (filter && filter._id === 'reward_1') return Promise.resolve(mockReward);
      return Promise.resolve({ status: 'PENDING' }); // RewardRedemption fallback
    });

    try {
      await RewardService.requestRedemption('child_1', 'reward_1', 'family_1');
      assert.fail('Should have thrown DUPLICATE_PENDING error');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'DUPLICATE_PENDING');
    }

    mock.restoreAll();
  });
});

