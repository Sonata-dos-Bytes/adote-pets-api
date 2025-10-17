import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "src/exceptions/customError";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@config/index";
import UserRepository from "src/repository/user.repository";
import { logger } from "@config/logger";

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

    if (!token) {
        throw new UnauthorizedError("No token provided");
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await UserRepository.findByExternalId(payload.externalId);

        if (!user) {
            throw new UnauthorizedError("Token is invalid");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new UnauthorizedError("Token is invalid");
    }
};

export default authMiddleware;
