import assert from 'node:assert';
import { describe, test } from 'node:test';
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../src/shared/errors/AppError';
import { requireAuth, requireChildScope } from '../src/shared/middleware/auth';

const response = {} as Response;

const runMiddleware = (
  middleware: (req: Request, res: Response, next: NextFunction) => void,
  request: Partial<Request>,
) => {
  let nextValue: unknown = Symbol('not-called');
  middleware(request as Request, response, ((value?: unknown) => {
    nextValue = value;
  }) as NextFunction);
  return nextValue;
};

describe('authentication boundaries', () => {
  test('requireAuth fails closed without trusted context', () => {
    const result = runMiddleware(requireAuth, {});
    assert.ok(result instanceof AppError);
    assert.strictEqual(result.statusCode, 401);
  });

  test('parent cannot access a child outside trusted ownership scope', () => {
    const result = runMiddleware(requireChildScope('childId'), {
      params: { childId: 'child-2' },
      body: {},
      user: {
        id: 'parent-1',
        role: 'PARENT',
        familyId: 'family-1',
        allowedChildIds: ['child-1'],
      },
    });
    assert.ok(result instanceof AppError);
    assert.strictEqual(result.statusCode, 403);
  });

  test('parent can access a child inside trusted ownership scope', () => {
    const result = runMiddleware(requireChildScope('childId'), {
      params: { childId: 'child-1' },
      body: {},
      user: {
        id: 'parent-1',
        role: 'PARENT',
        familyId: 'family-1',
        allowedChildIds: ['child-1'],
      },
    });
    assert.strictEqual(result, undefined);
  });
});
