import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  } | null;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): Response {
  const responsePayload: ApiResponse<T> = {
    success: true,
    data,
    meta,
    error: null,
  };
  return res.status(statusCode).json(responsePayload);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 500,
  code: string = 'INTERNAL_SERVER_ERROR',
  details?: any
): Response {
  const responsePayload: ApiResponse = {
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
  };
  return res.status(statusCode).json(responsePayload);
}
