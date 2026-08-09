import { Router, Request, Response } from 'express';
import express from 'express';
import { PaymentService } from './payment.service';
import { AppError } from '../../shared/errors/AppError';
import { sendResponse } from '../../shared/responses/apiResponse';

const router = Router();

interface WebhookPayload {
  eventId: string;
  transactionId: string;
  amount: number;
  planId: string;
  parentId: string;
}

const parseWebhookPayload = (body: Buffer): WebhookPayload => {
  let value: unknown;
  try {
    value = JSON.parse(body.toString('utf8'));
  } catch {
    throw new AppError('Invalid JSON payload', 400, 'BAD_REQUEST');
  }
  if (!value || typeof value !== 'object') {
    throw new AppError('Invalid webhook payload', 400, 'BAD_REQUEST');
  }
  const payload = value as Record<string, unknown>;
  if (
    typeof payload.eventId !== 'string' ||
    typeof payload.transactionId !== 'string' ||
    typeof payload.amount !== 'number' ||
    !Number.isFinite(payload.amount) ||
    payload.amount <= 0 ||
    typeof payload.planId !== 'string' ||
    typeof payload.parentId !== 'string'
  ) {
    throw new AppError('Invalid webhook payload', 400, 'BAD_REQUEST');
  }
  return payload as unknown as WebhookPayload;
};

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response, next) => {
    try {
      const signature = req.headers['x-payment-signature'];
      if (!signature || typeof signature !== 'string') {
        throw new AppError('Missing signature', 401, 'INVALID_SIGNATURE');
      }

      if (!Buffer.isBuffer(req.body)) {
        throw new AppError('Webhook body must be raw JSON', 400, 'BAD_REQUEST');
      }
      PaymentService.verifyWebhookSignature(req.body, signature);
      const { eventId, transactionId, amount, planId, parentId } = parseWebhookPayload(req.body);

      const result = await PaymentService.processWebhookEvent(eventId, transactionId, amount, planId, parentId);
      
      // Do not use next() to avoid standard error handler for webhooks if we want explicit status
      // but sendResponse works fine for success.
      return sendResponse(res, 200, result);
    } catch (error) {
      next(error);
    }
  }
);

export const paymentWebhookRoute = router;
