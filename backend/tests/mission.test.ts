import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { Mission } from '../src/modules/mission/mission.model';
import { MissionService } from '../src/modules/mission/mission.service';
import { requireChildScope } from '../src/shared/middleware/auth';
import { AppError } from '../src/shared/errors/AppError';
import { getErrorCode } from './testUtils';

describe('Mission Module', () => {
  before(async () => {
    // We don't connect to a real DB for pure logic unit tests if they just mock.
    // However, requireChildScope is a middleware that doesn't need DB.
  });

  after(async () => {
  });

  describe('Authorization Boundaries', () => {
    it('requireChildScope should fail if CHILD tries to access another child id', () => {
      const req: any = {
        params: { childId: 'child-1' },
        user: { role: 'CHILD', id: 'child-2' }
      };
      const res: any = {};
      let error: any;
      const next = (err: any) => { error = err; };
      
      const middleware = requireChildScope('childId');
      middleware(req, res, next);
      
      assert.ok(error instanceof AppError);
      assert.strictEqual(error.statusCode, 403);
    });

    it('requireChildScope should fail if PARENT tries to access child outside allowedChildIds', () => {
      const req: any = {
        params: { childId: 'child-3' },
        user: { role: 'PARENT', id: 'parent-1', familyId: 'fam-1', allowedChildIds: ['child-1', 'child-2'] }
      };
      const res: any = {};
      let error: any;
      const next = (err: any) => { error = err; };
      
      const middleware = requireChildScope('childId');
      middleware(req, res, next);
      
      assert.ok(error instanceof AppError);
      assert.strictEqual(error.statusCode, 403);
    });

    it('requireChildScope should read from params, body, and query and block out-of-scope access', () => {
      const middleware = requireChildScope('childId');
      const createReq = (source: 'params'|'body'|'query', role: string, id: string) => {
        const req: any = { params: {}, body: {}, query: {}, user: { role, id, familyId: 'fam-1', allowedChildIds: ['child-1', 'child-2'] } };
        req[source].childId = 'child-3';
        return req;
      };

      const sources: ('params'|'body'|'query')[] = ['params', 'body', 'query'];
      for (const src of sources) {
        let error: any;
        middleware(createReq(src, 'PARENT', 'parent-1'), {} as any, (err: any) => { error = err; });
        assert.ok(error instanceof AppError);
        assert.strictEqual(error.statusCode, 403);
      }
    });

    it('requireChildScope should pass if PARENT accesses allowed child from query', () => {
      const req: any = {
        query: { childId: 'child-1' },
        params: {},
        body: {},
        user: { role: 'PARENT', id: 'parent-1', familyId: 'fam-1', allowedChildIds: ['child-1', 'child-2'] }
      };
      let error: any;
      const next = (err: any) => { error = err; };
      requireChildScope('childId')(req, {} as any, next);
      assert.strictEqual(error, undefined);
    });
  });

  describe('Validation & Input handling', () => {
    it('createMission should throw BAD_REQUEST if title is missing', async () => {
      try {
        await MissionService.createMission({ title: '', description: 'test', childId: new mongoose.Types.ObjectId().toHexString(), rewardPoints: 10, dueDate: new Date() });
        assert.fail('Should have thrown an error');
      } catch (error: unknown) {
        assert.strictEqual(getErrorCode(error), 'BAD_REQUEST');
      }
    });
  });
});

