/**
 * Auth Module — Comprehensive Test Suite
 * =======================================
 * Framework : Node.js built-in `node:test` + `node:assert`
 * DB        : mongodb-memory-server (isolated, no real DB)
 * Email     : sinon stub (no real email sent)
 *
 * Coverage:
 *  - AuthService: register, login, refresh, logout,
 *    changePassword, forgotPassword, resetPassword, verifyEmail
 *  - Middleware: requireAuth, requireRole, requireChildScope
 *  - Security: brute-force lockout, token rotation, token reuse attack
 */

import assert from 'node:assert';
import { describe, it, before, after, beforeEach } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import sinon from 'sinon';

// ── Modules under test ──────────────────────────────────────────
import { AuthService } from '../src/modules/auth/auth.service';
import { User } from '../src/modules/auth/user.model';
import * as emailUtils from '../src/shared/utils/email';
import { requireAuth, requireRole, requireChildScope } from '../src/shared/middleware/auth';
import { AppError } from '../src/shared/errors/AppError';
import { getErrorCode } from './testUtils';

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────
let mongod: MongoMemoryServer;
let sendEmailStub: sinon.SinonStub;

/** Run a middleware and return the value passed to next() */
function runMiddleware(
  middleware: (req: any, res: any, next: any) => void,
  request: Record<string, unknown> = {},
) {
  let nextValue: unknown = Symbol('not-called');
  middleware(request as any, {} as any, (value?: unknown) => { nextValue = value; });
  return nextValue;
}

/** Create a valid PARENT user and return { user, tokens } from login */
async function createAndLoginUser(overrides: Partial<{
  email: string; password: string; role: string; status: string;
}> = {}) {
  const email = overrides.email ?? `user_${Date.now()}@test.com`;
  const password = overrides.password ?? 'Password123!';
  const role = overrides.role ?? 'PARENT';

  await AuthService.register({ email, password, fullName: 'Test User', role });

  // Force ACTIVE if needed (Expert is PENDING by default)
  if (overrides.status === 'ACTIVE' || role === 'PARENT') {
    await User.updateOne({ email }, { status: 'ACTIVE', isEmailVerified: true });
  }

  const result = await AuthService.login(email, password);
  return { email, password, ...result };
}

// ────────────────────────────────────────────────────────────────
// Suite Setup / Teardown
// ────────────────────────────────────────────────────────────────
before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  sendEmailStub = sinon.stub(emailUtils, 'sendEmail').resolves();
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  sendEmailStub.restore();
});

beforeEach(async () => {
  // Clear all collections before each test for isolation
  await User.deleteMany({});
  sendEmailStub.resetHistory();
});

// ════════════════════════════════════════════════════════════════
// 1. REGISTER
// ════════════════════════════════════════════════════════════════
describe('AuthService.register', () => {
  it('TC-01 — registers a PARENT user and sends verification email', async () => {
    const result = await AuthService.register({
      email: 'parent@test.com',
      password: 'Password123!',
      fullName: 'Parent User',
      role: 'PARENT',
    });

    assert.ok(result.userId, 'Should return userId');
    assert.match(result.message, /verify/i);
    assert.strictEqual(sendEmailStub.callCount, 1, 'Verification email must be sent');

    const saved = await User.findById(result.userId);
    assert.ok(saved);
    assert.strictEqual(saved!.email, 'parent@test.com');
    assert.strictEqual(saved!.status, 'ACTIVE');
    assert.strictEqual(saved!.isEmailVerified, false);
    assert.ok(saved!.emailVerificationToken, 'Verification token should be stored');
  });

  it('TC-02 — registers EXPERT with PENDING status', async () => {
    const result = await AuthService.register({
      email: 'expert@test.com',
      password: 'Password123!',
      fullName: 'Expert User',
      role: 'EXPERT',
    });

    const saved = await User.findById(result.userId);
    assert.strictEqual(saved!.status, 'PENDING', 'Expert should start as PENDING');
  });

  it('TC-03 — throws EMAIL_EXISTS on duplicate email', async () => {
    await AuthService.register({ email: 'dup@test.com', password: 'Password123!', fullName: 'A', role: 'PARENT' });

    try {
      await AuthService.register({ email: 'DUP@test.com', password: 'Other123!', fullName: 'B', role: 'PARENT' });
      assert.fail('Should have thrown EMAIL_EXISTS');
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'EMAIL_EXISTS');
      assert.strictEqual((err as AppError).statusCode, 409);
    }
  });

  it('TC-04 — normalizes email to lowercase before saving', async () => {
    await AuthService.register({ email: 'UPPER@test.com', password: 'Password123!', fullName: 'X', role: 'PARENT' });
    const saved = await User.findOne({ email: 'upper@test.com' });
    assert.ok(saved, 'Email should be stored lowercase');
  });

  it('TC-05 — does not store plain-text password', async () => {
    const result = await AuthService.register({ email: 'nopass@test.com', password: 'MySecret123!', fullName: 'Y', role: 'PARENT' });
    const saved = await User.findById(result.userId);
    assert.notStrictEqual(saved!.passwordHash, 'MySecret123!', 'Password must be hashed');
    assert.ok(saved!.passwordHash.startsWith('$2'), 'Should be bcrypt hash');
  });
});

// ════════════════════════════════════════════════════════════════
// 2. LOGIN
// ════════════════════════════════════════════════════════════════
describe('AuthService.login', () => {
  it('TC-06 — returns token pair + user info on valid credentials', async () => {
    const { accessToken, refreshToken, user } = await createAndLoginUser();

    assert.ok(accessToken, 'Must return accessToken');
    assert.ok(refreshToken, 'Must return refreshToken');
    assert.ok(user.id, 'Must return user id');
    assert.ok(user.email);
    assert.ok(user.role);
    assert.ok(!('passwordHash' in user), 'Must NOT expose passwordHash');
    assert.ok(!('refreshTokens' in user), 'Must NOT expose refreshTokens');
  });

  it('TC-07 — throws INVALID_CREDENTIALS for unknown email', async () => {
    try {
      await AuthService.login('ghost@test.com', 'anything');
      assert.fail('Should throw');
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_CREDENTIALS');
      assert.strictEqual((err as AppError).statusCode, 401);
    }
  });

  it('TC-08 — throws INVALID_CREDENTIALS for wrong password', async () => {
    await createAndLoginUser({ email: 'wp@test.com', password: 'Correct123!' });
    try {
      await AuthService.login('wp@test.com', 'WrongPassword!');
      assert.fail('Should throw');
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_CREDENTIALS');
    }
  });

  it('TC-09 — increments loginAttempts on wrong password', async () => {
    const email = 'attempts@test.com';
    await AuthService.register({ email, password: 'Correct123!', fullName: 'A', role: 'PARENT' });
    await User.updateOne({ email }, { status: 'ACTIVE' });

    for (let i = 0; i < 3; i++) {
      try { await AuthService.login(email, 'Wrong!'); } catch { /* expected */ }
    }

    const user = await User.findOne({ email });
    assert.strictEqual(user!.loginAttempts, 3, 'loginAttempts must increment');
  });

  it('TC-10 — BRUTE-FORCE: locks account after 5 failed attempts', async () => {
    const email = 'brute@test.com';
    await AuthService.register({ email, password: 'Correct123!', fullName: 'A', role: 'PARENT' });
    await User.updateOne({ email }, { status: 'ACTIVE' });

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      try { await AuthService.login(email, 'WrongPassword!'); } catch { /* expected */ }
    }

    const user = await User.findOne({ email });
    assert.ok(user!.lockUntil, 'lockUntil must be set after 5 failed attempts');
    assert.ok(user!.lockUntil! > new Date(), 'lockUntil must be in the future');
    assert.strictEqual(user!.loginAttempts, 0, 'loginAttempts resets to 0 after lock');

    // 6th attempt should get ACCOUNT_LOCKED
    try {
      await AuthService.login(email, 'WrongPassword!');
      assert.fail('Should throw ACCOUNT_LOCKED');
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'ACCOUNT_LOCKED');
      assert.strictEqual((err as AppError).statusCode, 423);
    }
  });

  it('TC-11 — resets loginAttempts to 0 after successful login', async () => {
    const email = 'reset-attempts@test.com';
    await AuthService.register({ email, password: 'Correct123!', fullName: 'A', role: 'PARENT' });
    await User.updateOne({ email }, { status: 'ACTIVE', loginAttempts: 3 });

    await AuthService.login(email, 'Correct123!');
    const user = await User.findOne({ email });
    assert.strictEqual(user!.loginAttempts, 0, 'Attempts should reset on success');
  });

  it('TC-12 — throws ACCOUNT_LOCKED for admin-locked accounts', async () => {
    const email = 'locked@test.com';
    await AuthService.register({ email, password: 'Pw123!pw', fullName: 'A', role: 'PARENT' });
    await User.updateOne({ email }, { status: 'LOCKED' });

    try {
      await AuthService.login(email, 'Pw123!pw');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'ACCOUNT_LOCKED');
      assert.strictEqual((err as AppError).statusCode, 403);
    }
  });

  it('TC-13 — throws ACCOUNT_PENDING for unapproved Expert', async () => {
    const email = 'pending@test.com';
    await AuthService.register({ email, password: 'Pw123!pw', fullName: 'A', role: 'EXPERT' });
    // Expert is PENDING by default

    try {
      await AuthService.login(email, 'Pw123!pw');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'ACCOUNT_PENDING');
      assert.strictEqual((err as AppError).statusCode, 403);
    }
  });

  it('TC-14 — stores refresh token in DB after successful login', async () => {
    const email = 'store-rt@test.com';
    const { refreshToken } = await createAndLoginUser({ email });

    const user = await User.findOne({ email });
    const stored = user!.refreshTokens.find(rt => rt.token === refreshToken);
    assert.ok(stored, 'Refresh token must be stored in user document');
    assert.ok(stored!.expiresAt > new Date(), 'Token expiry must be in the future');
  });
});

// ════════════════════════════════════════════════════════════════
// 3. REFRESH TOKEN
// ════════════════════════════════════════════════════════════════
describe('AuthService.refresh', () => {
  it('TC-15 — issues new token pair on valid refresh token', async () => {
    const { refreshToken: oldRT } = await createAndLoginUser();

    const result = await AuthService.refresh(oldRT);
    assert.ok(result.accessToken, 'Must return new accessToken');
    assert.ok(result.refreshToken, 'Must return new refreshToken');
    assert.notStrictEqual(result.refreshToken, oldRT, 'New refresh token must differ from old');
  });

  it('TC-16 — TOKEN ROTATION: old refresh token is invalidated after use', async () => {
    const email = 'rotation@test.com';
    const { refreshToken: rt1 } = await createAndLoginUser({ email });
    await AuthService.refresh(rt1); // use rt1 → get rt2

    // rt1 should no longer be in DB
    const user = await User.findOne({ email });
    const old = user!.refreshTokens.find(rt => rt.token === rt1);
    assert.strictEqual(old, undefined, 'Old refresh token must be removed after rotation');
  });

  it('TC-17 — TOKEN REUSE ATTACK: revoking ALL tokens when old token reused', async () => {
    const email = 'reuse@test.com';
    const { refreshToken: rt1 } = await createAndLoginUser({ email });
    await AuthService.refresh(rt1); // rt1 consumed → rt2 issued

    // Simulate attacker reusing rt1
    try {
      await AuthService.refresh(rt1);
      assert.fail('Should throw TOKEN_REVOKED');
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'TOKEN_REVOKED');
    }

    // ALL refresh tokens must be wiped
    const user = await User.findOne({ email });
    assert.strictEqual(user!.refreshTokens.length, 0, 'All refresh tokens must be revoked on reuse attack');
  });

  it('TC-18 — throws INVALID_REFRESH_TOKEN for expired/invalid token', async () => {
    try {
      await AuthService.refresh('completely.invalid.token');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_REFRESH_TOKEN');
    }
  });
});

// ════════════════════════════════════════════════════════════════
// 4. LOGOUT
// ════════════════════════════════════════════════════════════════
describe('AuthService.logout', () => {
  it('TC-19 — removes specific refresh token from DB', async () => {
    const email = 'logout@test.com';
    const { refreshToken } = await createAndLoginUser({ email });

    await AuthService.logout(refreshToken);
    const user = await User.findOne({ email });
    const found = user!.refreshTokens.find(rt => rt.token === refreshToken);
    assert.strictEqual(found, undefined, 'Token must be removed on logout');
  });

  it('TC-20 — succeeds gracefully with expired/invalid token', async () => {
    // Should not throw even with bad token
    const result = await AuthService.logout('invalid.token.here');
    assert.ok(result.message);
  });
});

// ════════════════════════════════════════════════════════════════
// 5. CHANGE PASSWORD
// ════════════════════════════════════════════════════════════════
describe('AuthService.changePassword', () => {
  it('TC-21 — changes password and revokes all refresh tokens', async () => {
    const email = 'changepw@test.com';
    const { user } = await createAndLoginUser({ email, password: 'OldPass123!' });

    await AuthService.changePassword(user.id.toString(), 'OldPass123!', 'NewPass456!');

    // Immediately after changePassword: ALL refresh tokens must be cleared
    const dbUserAfterChange = await User.findOne({ email });
    assert.strictEqual(dbUserAfterChange!.refreshTokens.length, 0, 'All refresh tokens revoked on password change');

    // Old password should not work
    try {
      await AuthService.login(email, 'OldPass123!');
      assert.fail('Old password should be rejected');
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_CREDENTIALS');
    }

    // New password works
    const loginResult = await AuthService.login(email, 'NewPass456!');
    assert.ok(loginResult.accessToken);
  });

  it('TC-22 — throws INVALID_PASSWORD when old password is wrong', async () => {
    const { user } = await createAndLoginUser();

    try {
      await AuthService.changePassword(user.id.toString(), 'WrongOld!', 'NewPass456!');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_PASSWORD');
    }
  });
});

// ════════════════════════════════════════════════════════════════
// 6. FORGOT PASSWORD
// ════════════════════════════════════════════════════════════════
describe('AuthService.forgotPassword', () => {
  it('TC-23 — returns success message even for non-existent email (anti-enumeration)', async () => {
    const result = await AuthService.forgotPassword('ghost@unknown.com');
    assert.match(result.message, /if an account exists/i);
    assert.strictEqual(sendEmailStub.callCount, 0, 'Must NOT send email for unknown address');
  });

  it('TC-24 — stores reset token and sends email for existing user', async () => {
    const email = 'forgot@test.com';
    await createAndLoginUser({ email });
    sendEmailStub.resetHistory();

    const result = await AuthService.forgotPassword(email);
    assert.ok(result.message);
    assert.strictEqual(sendEmailStub.callCount, 1, 'Must send reset email');

    const user = await User.findOne({ email });
    assert.ok(user!.resetPasswordToken, 'Reset token must be stored');
    assert.ok(user!.resetPasswordExpires! > new Date(), 'Reset expiry must be in the future');
  });

  it('TC-25 — exposes _devResetToken in development environment', async () => {
    const email = 'forgot-dev@test.com';
    await createAndLoginUser({ email });

    const result = await AuthService.forgotPassword(email);
    assert.ok('_devResetToken' in result, 'Dev reset token should be exposed in development');
  });
});

// ════════════════════════════════════════════════════════════════
// 7. RESET PASSWORD
// ════════════════════════════════════════════════════════════════
describe('AuthService.resetPassword', () => {
  it('TC-26 — resets password and revokes all tokens + clears attempts', async () => {
    const email = 'reset@test.com';
    await createAndLoginUser({ email, password: 'OldPass123!' });

    const forgotResult = await AuthService.forgotPassword(email) as any;
    const resetToken = forgotResult._devResetToken;
    assert.ok(resetToken, 'Need _devResetToken from forgotPassword');

    await AuthService.resetPassword(resetToken, 'BrandNew456!');

    // Immediately after reset: token, attempts, refreshTokens must be cleared
    const dbUserAfterReset = await User.findOne({ email });
    assert.strictEqual(dbUserAfterReset!.resetPasswordToken, undefined, 'Reset token must be cleared');
    assert.strictEqual(dbUserAfterReset!.resetPasswordExpires, undefined, 'Reset expiry must be cleared');
    assert.strictEqual(dbUserAfterReset!.loginAttempts, 0, 'Login attempts must be cleared');
    assert.strictEqual(dbUserAfterReset!.refreshTokens.length, 0, 'All refresh tokens must be revoked');

    // Old password must fail
    try {
      await AuthService.login(email, 'OldPass123!');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_CREDENTIALS');
    }

    // New password must work
    const loginResult = await AuthService.login(email, 'BrandNew456!');
    assert.ok(loginResult.accessToken);
  });

  it('TC-27 — throws INVALID_RESET_TOKEN for invalid token', async () => {
    try {
      await AuthService.resetPassword('bogus-token', 'NewPass123!');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_RESET_TOKEN');
    }
  });

  it('TC-28 — throws INVALID_RESET_TOKEN for expired token', async () => {
    const email = 'expired-reset@test.com';
    await createAndLoginUser({ email });

    // Manually set an expired token
    await User.updateOne({ email }, {
      resetPasswordToken: 'expired-token-123',
      resetPasswordExpires: new Date(Date.now() - 1000), // in the past
    });

    try {
      await AuthService.resetPassword('expired-token-123', 'NewPass456!');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_RESET_TOKEN');
    }
  });
});

// ════════════════════════════════════════════════════════════════
// 8. VERIFY EMAIL
// ════════════════════════════════════════════════════════════════
describe('AuthService.verifyEmail', () => {
  it('TC-29 — marks email as verified and clears verification token', async () => {
    const email = 'verify@test.com';
    const { userId } = await AuthService.register({
      email, password: 'Pass123!', fullName: 'V', role: 'PARENT',
    });

    const dbUser = await User.findById(userId);
    const token = dbUser!.emailVerificationToken!;

    await AuthService.verifyEmail(token);

    const updated = await User.findById(userId);
    assert.strictEqual(updated!.isEmailVerified, true);
    assert.strictEqual(updated!.emailVerificationToken, undefined);
  });

  it('TC-30 — throws INVALID_VERIFICATION_TOKEN for wrong token', async () => {
    try {
      await AuthService.verifyEmail('not-a-real-token');
      assert.fail();
    } catch (err) {
      assert.strictEqual(getErrorCode(err), 'INVALID_VERIFICATION_TOKEN');
    }
  });
});

// ════════════════════════════════════════════════════════════════
// 9. MIDDLEWARE — requireAuth, requireRole, requireChildScope
// ════════════════════════════════════════════════════════════════
describe('Auth Middleware', () => {
  describe('requireAuth', () => {
    it('TC-31 — blocks request without user context (fail-closed)', () => {
      const result = runMiddleware(requireAuth, {});
      assert.ok(result instanceof AppError);
      assert.strictEqual((result as AppError).statusCode, 401);
    });

    it('TC-32 — passes request with valid user context', () => {
      const result = runMiddleware(requireAuth, {
        user: { id: 'u1', role: 'PARENT', familyId: 'f1', allowedChildIds: [] },
      });
      assert.strictEqual(result, undefined);
    });
  });

  describe('requireRole', () => {
    it('TC-33 — allows access for correct role', () => {
      const result = runMiddleware(requireRole(['ADMIN']), {
        user: { id: 'u1', role: 'ADMIN', familyId: null, allowedChildIds: [] },
      });
      assert.strictEqual(result, undefined);
    });

    it('TC-34 — blocks access for wrong role (403)', () => {
      const result = runMiddleware(requireRole(['ADMIN']), {
        user: { id: 'u1', role: 'PARENT', familyId: 'f1', allowedChildIds: [] },
      });
      assert.ok(result instanceof AppError);
      assert.strictEqual((result as AppError).statusCode, 403);
    });
  });

  describe('requireChildScope', () => {
    it('TC-35 — blocks PARENT accessing child outside their allowedChildIds', () => {
      const result = runMiddleware(requireChildScope('childId'), {
        params: { childId: 'child-99' },
        body: {},
        query: {},
        user: { id: 'p1', role: 'PARENT', familyId: 'f1', allowedChildIds: ['child-1'] },
      });
      assert.ok(result instanceof AppError);
      assert.strictEqual((result as AppError).statusCode, 403);
    });

    it('TC-36 — allows PARENT accessing their own child', () => {
      const result = runMiddleware(requireChildScope('childId'), {
        params: { childId: 'child-1' },
        body: {},
        query: {},
        user: { id: 'p1', role: 'PARENT', familyId: 'f1', allowedChildIds: ['child-1'] },
      });
      assert.strictEqual(result, undefined);
    });

    it('TC-37 — blocks CHILD accessing another child profile', () => {
      const result = runMiddleware(requireChildScope('childId'), {
        params: { childId: 'child-other' },
        body: {},
        query: {},
        user: { id: 'child-me', role: 'CHILD', familyId: 'f1', allowedChildIds: [] },
      });
      assert.ok(result instanceof AppError);
      assert.strictEqual((result as AppError).statusCode, 403);
    });

    it('TC-38 — allows ADMIN to bypass all child scope checks', () => {
      const result = runMiddleware(requireChildScope('childId'), {
        params: { childId: 'any-child' },
        body: {},
        query: {},
        user: { id: 'admin-1', role: 'ADMIN', familyId: null, allowedChildIds: [] },
      });
      assert.strictEqual(result, undefined);
    });

    it('TC-39 — reads childId from body and query as well as params', () => {
      const middleware = requireChildScope('childId');

      // From body
      const fromBody = runMiddleware(middleware, {
        params: {},
        body: { childId: 'child-99' },
        query: {},
        user: { id: 'p1', role: 'PARENT', familyId: 'f1', allowedChildIds: ['child-1'] },
      });
      assert.ok(fromBody instanceof AppError);

      // From query
      const fromQuery = runMiddleware(middleware, {
        params: {},
        body: {},
        query: { childId: 'child-99' },
        user: { id: 'p1', role: 'PARENT', familyId: 'f1', allowedChildIds: ['child-1'] },
      });
      assert.ok(fromQuery instanceof AppError);
    });
  });
});
