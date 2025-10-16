import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../exceptions/customError.js';

export const validateSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.issues.map(issue => ({
          path: issue.path.length ? issue.path.join('.') : '(root)',
          message: issue.message,
          code: issue.code
        }));
        next(new ValidationError('Validation failed', details));
      } else {
        next(error);
      }
    }
  };
};