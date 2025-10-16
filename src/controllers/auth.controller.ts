import { Request, Response, NextFunction } from 'express';
import { success } from 'src/utils/response.js';
import { RegisterRequest, registerSchema } from 'src/schemas/auth.schema.js';
import { CustomError } from 'src/exceptions/customError.js';
import { HTTP_STATUS } from 'src/utils/constants.js';
import { hashPassword } from 'src/utils/encryption.js';
import UserRepository from 'src/repository/user.repository.js';

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const registerData: RegisterRequest = registerSchema.parse(req.body);
    const files = req.files as Express.Multer.File[];
    const avatar = files?.find((f) => f.fieldname === 'avatar');

    let user = await UserRepository.findByEmail(registerData.email);
    if (user) {
      throw new CustomError("User already exists!", HTTP_STATUS.NOT_FOUND);
    }

    user = await UserRepository.createUser({
      ...registerData,
      password: await hashPassword(registerData.password),
    });

    return res.json(success('User registered successfully', user));
  } catch (err) {
    return next(err);
  }
}
