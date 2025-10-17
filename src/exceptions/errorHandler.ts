import { Request, Response, NextFunction } from 'express';
import { CustomError } from './customError.js';
import { failure } from '../utils/response.js'; 
import { logger } from '../config/logger.js'; 
import { z } from 'zod';
import { HTTP_STATUS } from 'src/utils/constants.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof z.ZodError) {
    const details = err.issues.map(issue => ({
      path: issue.path.length ? issue.path.join('.') : '(root)',
      message: issue.message,
      code: issue.code
    }));
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(failure('Validation Error', details));
  }
  
  if (err instanceof CustomError) {
    const details = Array.isArray(err.description)
      ? err.description
      : err.description
        ? [err.description]
        : undefined;
    return res.status(err.statusCode).json(failure(err.message, details));
  }
  
  logger.error({ error: err }, 'Internal Server Error');
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error', message: err.message });
}
