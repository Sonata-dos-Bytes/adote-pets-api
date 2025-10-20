import { prismaClient } from "@config/database";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "src/utils/constants";


export async function getAdoption(req: Request, res: Response, next: NextFunction) {
    try {
        const adoptions = await prismaClient.AdoteRequest.findMany();

        return res.status(HTTP_STATUS.OK).json(adoptions);
    } catch (err) {
        return next(err);
    }
}