import test, { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { WalletService } from '../src/modules/wallet/wallet.service';
import { Wallet, WalletTransaction } from '../src/modules/wallet/wallet.model';
import mongoose from 'mongoose';
import { getErrorCode } from './testUtils';

describe('WalletService', () => {
  test('addPoints should throw error if amount is negative', async () => {
    try {
      await WalletService.addPoints('child_1', -10, 'ADMIN', 'admin_1', 'idemp_1');
      assert.fail('Should have thrown an error');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INVALID_AMOUNT');
    }
  });

  test('addPoints should throw IDEMPOTENCY_MISMATCH if payload is different', async () => {
    const mockTx = { 
      _id: 'tx_1', 
      childId: 'child_1', 
      amount: 100, 
      type: 'CREDIT', 
      sourceType: 'ADMIN', 
      sourceId: 'admin_1' 
    };
    mock.method(WalletTransaction, 'findOne', () => Promise.resolve(mockTx));

    try {
      // Amount is 50, but existing is 100
      await WalletService.addPoints('child_1', 50, 'ADMIN', 'admin_1', 'idemp_2');
      assert.fail('Should have thrown an error');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'IDEMPOTENCY_MISMATCH');
    }
    mock.restoreAll();
  });

  test('deductPoints should throw INSUFFICIENT_BALANCE if wallet balance is too low', async () => {
    mock.method(WalletTransaction, 'findOne', () => Promise.resolve(null));
    mock.method(WalletService, 'ensureWallet', () => Promise.resolve({ childId: 'child_1' }));
    
    const mockSession = {
      startTransaction: () => {},
      commitTransaction: () => {},
      abortTransaction: () => {},
      endSession: () => {}
    };
    mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));

    mock.method(Wallet, 'findOneAndUpdate', () => Promise.resolve(null));
    const mockWalletChain = { session: () => Promise.resolve({ childId: 'child_1', availableBalance: 10 }) };
    mock.method(Wallet, 'findOne', () => mockWalletChain);

    try {
      await WalletService.deductPoints('child_1', 50, 'REWARD', 'reward_1', 'idemp_3');
      assert.fail('Should have thrown INSUFFICIENT_BALANCE error');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INSUFFICIENT_BALANCE');
    }

    mock.restoreAll();
  });
});

