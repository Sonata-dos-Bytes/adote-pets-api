import { Request, Response, NextFunction } from "express";
import { success } from "src/utils/response.js";
import {
    LoginRequest,
    RegisterRequest,
    registerSchema,
    loginSchema,
} from "src/schemas/auth.schema.js";
import { CustomError } from "src/exceptions/customError.js";
import { HTTP_STATUS } from "src/utils/constants.js";
import { comparePassword, hashPassword } from "src/utils/encryption.js";
import UserRepository from "src/repository/user.repository.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@config/index";

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const registerData: RegisterRequest = registerSchema.parse(req.body);
        const files = req.files as Express.Multer.File[];
        const avatar = files?.find((f) => f.fieldname === "avatar");

        let user = await UserRepository.findByEmail(registerData.email);
        if (user) {
            throw new CustomError(
                "User already exists!",
                HTTP_STATUS.NOT_FOUND
            );
        }

        user = await UserRepository.createUser({
            ...registerData,
            password: await hashPassword(registerData.password),
        });

        return res
            .json(success("User registered successfully", user))
            .status(HTTP_STATUS.CREATED);
    } catch (err) {
        return next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const loginData: LoginRequest = loginSchema.parse(req.body);

        let user = await UserRepository.findByEmail(loginData.login);
        if (!user) {
            throw new CustomError(
                "User does not exists!",
                HTTP_STATUS.NOT_FOUND
            );
        }
        if (!comparePassword(loginData.password, user.password)) {
            throw new CustomError(
                "Invalid credentials!",
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return res
            .json(success("User logged in successfully", { user, token }))
            .status(HTTP_STATUS.OK);
    } catch (err) {
        return next(err);
    }
}
