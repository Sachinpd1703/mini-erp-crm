import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors/app-error';
import { sendError } from '../common/utils/response';
import { logger } from '../config/logger';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(`AppError [${err.code}]: ${err.message}`);
    return sendError(res, err.message, err.statusCode, err.code);
  }

  logger.error('Unhandled Application Exception:', err);
  const detailMessage = err?.message || 'An unexpected error occurred on the server';
  return sendError(
    res,
    `Server Error: ${detailMessage}`,
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
