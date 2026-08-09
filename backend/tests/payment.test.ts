import test, { describe, mock } from 'node:test';
import assert from 'node:assert';
import { PaymentService } from '../src/modules/payment/payment.service';
import { Subscription } from '../src/modules/payment/payment.model';
import { getErrorCode } from './testUtils';
import { getPaymentGateway } from '../src/modules/payment/payment.gateway';

describe('PaymentService', () => {
  test('subscribe should fail with invalid plan', async () => {
    try {
      await PaymentService.subscribe('parent_1', 'invalid_plan', 'idemp_key_1');
      assert.fail('Should fail');
    } catch (error: unknown) {
      assert.strictEqual(getErrorCode(error), 'INVALID_PLAN');
    }
  });

  test('payment gateway should fail closed until a real provider is integrated', () => {
    assert.throws(() => getPaymentGateway(), (error: unknown) => getErrorCode(error) === 'PAYMENT_NOT_CONFIGURED');
  });

  test('cancelCurrentSubscription should mark status as CANCELED idempotently', async () => {
    const mockSub = {
      _id: 'sub_1',
      parentId: 'parent_1',
      status: 'ACTIVE',
      save: function() {
        return Promise.resolve(this);
      }
    };
    mock.method(Subscription, 'findOne', () => ({ sort: () => Promise.resolve(mockSub) }));

    const res = await PaymentService.cancelCurrentSubscription('parent_1');
    assert.strictEqual(res.status, 'CANCELED');
    
    // Idempotent test
    const mockSubCanceled = { ...mockSub, status: 'CANCELED' };
    mock.method(Subscription, 'findOne', () => ({ sort: () => Promise.resolve(mockSubCanceled) }));
    const resIdempotent = await PaymentService.cancelCurrentSubscription('parent_1');
    assert.strictEqual(resIdempotent.status, 'CANCELED');

    mock.restoreAll();
  });
});
