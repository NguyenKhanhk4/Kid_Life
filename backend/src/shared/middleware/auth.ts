import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { verifyToken } from '../utils/jwt';
import { User } from '../../modules/auth/user.model';
import { ChildProfile } from '../../modules/child/childProfile.model';

// Contract definitions expected to be injected by Dev1
// NOW IMPLEMENTED: jwtAuthMiddleware below parses JWT and populates req.user
export interface AuthUser {
  id: string;
  role: 'ADMIN' | 'EXPERT' | 'PARENT' | 'CHILD';
  familyId?: string; // Required for PARENT and CHILD to access family resources
  allowedChildIds?: readonly string[]; // Trusted ownership scope populated by Dev1
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * STRICT FAIL-CLOSED AUTH MIDDLEWARE
 * This expects Dev1 middleware (running before this) to populate req.user.
 * If req.user is missing, it returns 401 immediately.
 * No mock tokens are parsed here.
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError('Unauthorized - No valid authentication context found', 401, 'UNAUTHORIZED'));
  }
  next();
};

export const requireRole = (roles: AuthUser['role'][]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden - Insufficient permissions', 403, 'FORBIDDEN'));
    }
    next();
  };
};

/**
 * Ensures the caller is acting within the bounds of a child scope.
 * - If caller is a CHILD, they must own the resource (req.user.id === targetChildId).
 * - If caller is a PARENT, they must be in the same family as the target child.
 * 
 * Note: This validation checks the context *before* querying the DB to prevent enumeration attacks.
 */
export const requireChildScope = (targetChildIdParam: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetChildId = req.params[targetChildIdParam] || req.body[targetChildIdParam] || req.query[targetChildIdParam];
    if (!targetChildId) {
      return next(new AppError('Child ID is required', 400, 'BAD_REQUEST'));
    }

    const { user } = req;
    if (!user) return next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));

    if (user.role === 'CHILD') {
      if (user.id !== targetChildId) {
        return next(new AppError('Forbidden - Cannot access another child profile', 403, 'FORBIDDEN'));
      }
    } else if (user.role === 'PARENT') {
      // Fail closed until Dev1 supplies both the family and its verified child scope.
      if (!user.familyId || !user.allowedChildIds?.includes(targetChildId)) {
        return next(new AppError('Forbidden - Child is outside the trusted family scope', 403, 'FORBIDDEN'));
      }
    } else if (user.role !== 'ADMIN') {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }

    next();
  };
};

export const verifyChildScope = (user: AuthUser, targetChildId: string) => {
  if (user.role === 'CHILD') {
    if (user.id !== targetChildId) {
      throw new AppError('Forbidden - Cannot access another child profile', 403, 'FORBIDDEN');
    }
  } else if (user.role === 'PARENT') {
    if (!user.familyId || !user.allowedChildIds?.includes(targetChildId)) {
      throw new AppError('Forbidden - Child is outside the trusted family scope', 403, 'FORBIDDEN');
    }
  } else if (user.role !== 'ADMIN') {
    throw new AppError('Forbidden', 403, 'FORBIDDEN');
  }
};

/**
 * JWT AUTH MIDDLEWARE — Dev1 implementation
 * Parses Bearer token from Authorization header, verifies JWT,
 * loads user from DB, and populates req.user with full auth context.
 * This middleware should be mounted BEFORE requireAuth/requireRole/requireChildScope.
 */
export const jwtAuthMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token — let downstream middleware (requireAuth) handle the 401
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return next(new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'));
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return next(new AppError('User not found', 401, 'USER_NOT_FOUND'));
    }

    if (user.status === 'LOCKED') {
      return next(new AppError('Account is locked', 403, 'ACCOUNT_LOCKED'));
    }

    // Build the AuthUser context
    const authUser: AuthUser = {
      id: user._id.toString(),
      role: user.role as AuthUser['role'],
    };

    // For PARENT users, populate familyId and allowedChildIds
    if (user.role === 'PARENT') {
      authUser.familyId = user._id.toString(); // Parent IS the family anchor
      const children = await ChildProfile.find({ parentId: user._id.toString() }).select('_id');
      authUser.allowedChildIds = children.map(c => c._id.toString());
    }

    req.user = authUser;
    next();
  } catch (error) {
    next(error);
  }
};
