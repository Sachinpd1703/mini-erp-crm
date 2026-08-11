import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { ForbiddenError, UnauthorizedError } from '../common/errors/app-error';

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication required'));
    }

    if (!allowedRoles.includes(req.user.role as Role)) {
      return next(
        new ForbiddenError(
          `Access denied. Role [${req.user.role}] is not authorized for this operation.`
        )
      );
    }

    next();
  };
};
