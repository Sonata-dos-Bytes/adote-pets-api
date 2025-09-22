import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ValidationError } from '../errors/customError.js';

export const validateSchema = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map(err => err.message);
        next(new ValidationError('Validation failed', messages.join(', ')));
      } else {
        next(error);
      }
    }
  };
};