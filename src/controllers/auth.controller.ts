import { Request, Response, NextFunction, response } from 'express';
import { logger } from '../config/logger.js';
import { success } from 'src/utils/response.js';
import { RegisterRequest, registerSchema } from 'src/schemas/auth.schema.js';
import { prismaClient } from '@config/database.js';
import { CustomError } from 'src/exceptions/customError.js';
import { HTTP_STATUS } from 'src/utils/constants.js';
import { hashPassword } from 'src/utils/encryption.js';

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const registerData: RegisterRequest = registerSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];
    const avatar = files?.find((f) => f.fieldname === 'avatar');

    let user = await prismaClient.user.findFirst({where: {email: registerData.email}})
    if (user) {
      throw new CustomError("User already exists!", HTTP_STATUS.NOT_FOUND);
    }

    user = await prismaClient.user.create({
      data: {
        name: registerData.name,
        email: registerData.email,
        password: await hashPassword(registerData.password),
        phone: registerData.phone || null,
        avatar: null,
      }
    })

    return res.json(success('User registered successfully', user));
  } catch (err) {
    return next(err);
  }
}
