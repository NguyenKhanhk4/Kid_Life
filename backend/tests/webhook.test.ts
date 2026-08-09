import test, { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { PaymentService } from '../src/modules/payment/payment.service';
import { Subscription, Transaction } from '../src/modules/payment/payment.model';
import { getErrorCode } from './testUtils';
import { paymentConfig } from '../src/config/payment.config';

describe('WebhookService', () => {
  test('verifyWebhookSignature should throw on missing config or invalid sig', () => {
    // Modify config dynamically for this test
    const origSecret = paymentConfig.webhookSecret;
    paymentConfig.webhookSecret = 'test_secret';

    const payload = Buffer.from(JSON.stringify({ eventId: '1' }));
    
    try {
      PaymentService.verifyWebhookSignature(payload, 'wrong_sig');
      assert.fail();
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INVALID_SIGNATURE');
    }

    const validSig = crypto.createHmac('sha256', 'test_secret').update(payload).digest('hex');
    // Should not throw
    PaymentService.verifyWebhookSignature(payload, validSig);

    paymentConfig.webhookSecret = origSecret;
  });

  test('processWebhookEvent should throw PAYLOAD_MISMATCH if tampered', async () => {
    const mockSession = {
      startTransaction: () => {},
      commitTransaction: () => {},
      abortTransaction: () => {},
      endSession: () => {}
    };
    mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
    
    const mockTx = {
      _id: 'tx_1',
      parentId: 'parent_1',
      amount: 100000,
      planId: 'plan_basic_1m',
      status: 'PENDING'
    };
    mock.method(Transaction, 'findOne', () => ({ session: () => Promise.resolve(mockTx) }));

    try {
      // payload sends amount 1 instead of 100000
      await PaymentService.processWebhookEvent('evt_1', 'tx_1', 1, 'plan_basic_1m', 'parent_1');
      assert.fail();
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'PAYLOAD_MISMATCH');
    }

    mock.restoreAll();
  });

  test('processWebhookEvent should update transaction and subscription', async () => {
    const mockSession = {
      startTransaction: () => {},
      commitTransaction: () => {},
      abortTransaction: () => {},
      endSession: () => {}
    };
    mock.method(mongoose, 'startSession', () => Promise.resolve(mockSession));
    
    const mockTx = {
      _id: 'tx_1',
      parentId: 'parent_1',
      amount: 100000,
      planId: 'plan_basic_1m',
      status: 'PENDING',
      subscriptionId: 'sub_1',
      save: function() { return Promise.resolve(this); }
    };
    
    const mockSub = {
      _id: 'sub_1',
      status: 'PENDING',
      save: function() { return Promise.resolve(this); }
    };

    mock.method(Transaction, 'findOne', () => ({ session: () => Promise.resolve(mockTx) }));
    mock.method(Subscription, 'findOne', () => ({ session: () => Promise.resolve(mockSub) }));

    const result = await PaymentService.processWebhookEvent('evt_1', 'tx_1', 100000, 'plan_basic_1m', 'parent_1');
    
    assert.strictEqual(result.message, 'Processed successfully');
    assert.strictEqual(mockTx.status, 'SUCCESS');
    assert.strictEqual(mockSub.status, 'ACTIVE');

    mock.restoreAll();
  });
});
