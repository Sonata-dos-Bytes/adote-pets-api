import { Request, Response, NextFunction, response } from 'express';
import { logger } from '../config/logger.js';
import { success } from 'src/utils/response.js';
import { RegisterRequest, registerSchema } from 'src/schemas/auth.schema.js';

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    logger.info(`Signup request received: ${JSON.stringify(req.body)}`);
    const registerData: RegisterRequest = registerSchema.parse(req.body);

    return res.json(success('User registered successfully', registerData));
  } catch (err) {
    return next(err);
  }
}
