import { NextFunction, Request, Response } from "express";
import { uploadToAWSS3, deleteFromAWSS3 } from "src/services/aws-s3.service";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import {
    CreatePetRequest,
    createPetSchema,
    UpdatePetRequest,
    updatePetSchema,
} from "src/schemas/pet.schema";
import { prismaClient } from "@config/database";
import { ConflictException } from "src/exceptions/conflict";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import { NotFoundException } from "src/exceptions/not-found";
import { UnprocessableEntityException } from "src/exceptions/validation";
import { BadRequestException } from "src/exceptions/bad-requests";
import PetRepository from "src/repository/pet.repository";
import { success } from "src/utils/response";
import { toPetResource, toPetsResource } from "src/resources/pet.resource";
import PetFileRepository from "src/repository/pet-file.repository";
import { ForbiddenException } from "src/exceptions/forbidden";
import { isFileTypeValid } from "src/utils/file-utils";
import { AWS_CONFIG } from "@config/index";
import { QueryRequest } from "src/types/query.request";

export async function index(req: Request, res: Response, next: NextFunction) {
    try {
        const filters: QueryRequest = req.query;
        const pets = await PetRepository.findAll(filters);

        return res.status(HTTP_STATUS.OK).json(
            success("Pets encontrados com sucesso", {
                pets: toPetsResource(pets.data),
                meta: pets.meta,
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function show(req: Request, res: Response, next: NextFunction) {
    try {
        const externalId: string = req.params.externalId;
        const pet = await PetRepository.findByExternalId(externalId);

        if (!pet)
            throw new NotFoundException(
                "Pet não encontrado",
                ErrorCodes.PET_NOT_FOUND
            );
        return res.status(HTTP_STATUS.OK).json(
            success("Pet pegados com sucesso", {
                pet: toPetResource(pet),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function myPets(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user!;
        const pets = await PetRepository.findByOwnerId(user.id);

        return res.status(HTTP_STATUS.OK).json(
            success("Meus pets pegados com sucesso", {
                pets: toPetsResource(pets),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function store(req: Request, res: Response, next: NextFunction) {
    try {
        const petData: CreatePetRequest = createPetSchema.parse(req.body);
        const user = req.user!;
        const files = req.files as Express.Multer.File[];

        for (const file of files) {
            isFileTypeValid(
                file,
                ["image/jpeg", "image/png", "image/jpg", "image/webp"],
                ["files"]
            );
        }

        const pet = await PetRepository.create({
            ...petData,
            ownerId: user.id,
        });

        for (const [index, file] of files.entries()) {
            const upload = await uploadToAWSS3({
                bucket: AWS_CONFIG.bucket!,
                file,
                folder: `pets/${pet.externalId}`,
            });

            await PetFileRepository.create({
                petId: pet.id,
                path: upload.key,
                mimeType: upload.contentType,
                size: file.size,
                extension: file.originalname.split(".").pop() || "",
                type: upload.contentType.split("/")[0],
                description: "",
                orderIndex: index,
            });
        }

        const petWithRelations = await PetRepository.findById(pet.id);

        return res.status(HTTP_STATUS.CREATED).json(
            success("Pet criado com sucesso", {
                pet: toPetResource(petWithRelations!),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {
        const externalId: string = req.params.externalId;
        const petUpdatedData: UpdatePetRequest = updatePetSchema.parse(
            req.body
        );
        const pet = await PetRepository.findByExternalId(externalId);
        const user = req.user!;

        if (!pet)
            throw new NotFoundException(
                "Pet não encontrado",
                ErrorCodes.PET_NOT_FOUND
            );

        if (pet.ownerId !== user.id)
            throw new ForbiddenException(
                "Você não tem permissão para atualizar este pet",
                ErrorCodes.FORBIDDEN
            );

        await PetRepository.update(pet.id, petUpdatedData);

        return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        return next(err);
    }
}

export async function destroy(req: Request, res: Response, next: NextFunction) {
    const externalId: string = req.params.externalId;
    const pet = await PetRepository.findByExternalId(externalId);
    const user = req.user!;

    if (!pet)
        throw new NotFoundException(
            "Pet não encontrado",
            ErrorCodes.PET_NOT_FOUND
        );

    if (pet.ownerId !== user.id)
        throw new ForbiddenException(
            "Você não tem permissão para atualizar este pet",
            ErrorCodes.FORBIDDEN
        );

    for (const file of pet.files) {
        await deleteFromAWSS3(AWS_CONFIG.bucket, file.path);
        await PetFileRepository.delete(file.id);
    }

    await PetRepository.delete(pet.id);

    return res.status(HTTP_STATUS.NO_CONTENT).send();
}
