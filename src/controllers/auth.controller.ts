import { Request, Response, NextFunction } from "express";
import { success } from "src/utils/response.js";
import {
    LoginRequest,
    RegisterRequest,
    registerSchema,
    loginSchema,
} from "src/schemas/auth.schema.js";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants.js";
import { comparePassword, hashPassword } from "src/utils/encryption.js";
import UserRepository from "src/repository/user.repository.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@config/index";
import { toUserResource } from "src/resources/user.resource";
import { BadRequestException } from "src/exceptions/bad-requests";
import { ConflictException } from "src/exceptions/conflict";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import { NotFoundException } from "src/exceptions/not-found";

export async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const registerData: RegisterRequest = registerSchema.parse(req.body);
        const files = req.files as Express.Multer.File[];
        const avatar = files?.find((f) => f.fieldname === "avatar");

        let user = await UserRepository.findByEmail(registerData.email);
        if (user) {
            throw new ConflictException("User already exists!", ErrorCodes.EMAIL_ALREADY_EXISTS);
        }

        user = await UserRepository.createUser({
            ...registerData,
            password: await hashPassword(registerData.password),
        });

        return res.status(HTTP_STATUS.CREATED).json(
            success("User registered successfully", {
                user: toUserResource(user),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const loginData: LoginRequest = loginSchema.parse(req.body);

        let user = await UserRepository.findByEmail(loginData.login);
        if (!user) {
            throw new NotFoundException("User does not exists!", ErrorCodes.USER_NOT_FOUND);
        }
        if (!comparePassword(loginData.password, user.password)) {
            throw new UnauthorizedException("Invalid credentials!", ErrorCodes.INVALID_CREDENTIALS);
        }

        const token = jwt.sign({ externalId: user.externalId }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        return res.status(HTTP_STATUS.OK).json(
            success("User logged in successfully", {
                user: toUserResource(user),
                token,
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function me(req: Request, res: Response, next: NextFunction) {
    return res.status(HTTP_STATUS.OK).json(
        success("User retrieved successfully", {
            user: toUserResource(req.user!),
        })
    );
}
