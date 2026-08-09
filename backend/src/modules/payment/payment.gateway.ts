import { PlanConfig } from '../../config/payment.config';
import { AppError } from '../../shared/errors/AppError';

export interface PaymentGateway {
  createCheckoutUrl(transactionId: string, plan: PlanConfig, parentId: string): Promise<string>;
}

export const getPaymentGateway = (): PaymentGateway => {
  throw new AppError('Payment is not available yet', 503, 'PAYMENT_NOT_CONFIGURED');
};
