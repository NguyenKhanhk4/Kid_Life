import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// Contract definitions expected to be injected by Dev1
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
    const targetChildId = req.params[targetChildIdParam] || req.body[targetChildIdParam];
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
