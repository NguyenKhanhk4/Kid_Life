import { env } from './env';

export interface PlanConfig {
  id: string;
  name: string;
  amount: number;
  currency: string;
  durationMonths: number;
}

export const paymentConfig = {
  webhookSecret: env.payment.webhookSecret,
  plans: Object.freeze([
    {
      id: 'plan_basic_1m',
      name: 'Basic 1 Month',
      amount: 100000,
      currency: 'VND',
      durationMonths: 1,
    },
    {
      id: 'plan_premium_6m',
      name: 'Premium 6 Months',
      amount: 500000,
      currency: 'VND',
      durationMonths: 6,
    }
  ] satisfies readonly PlanConfig[]),
};

export const getPlan = (planId: string): PlanConfig | undefined => {
  return paymentConfig.plans.find((p) => p.id === planId);
};
