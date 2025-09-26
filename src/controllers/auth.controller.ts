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
    const registerData: RegisterRequest = registerSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];
    const avatar = files?.find((f) => f.fieldname === 'avatar');

    

    return res.json(success('User registered successfully', {...registerData, avatar}));
  } catch (err) {
    return next(err);
  }
}
