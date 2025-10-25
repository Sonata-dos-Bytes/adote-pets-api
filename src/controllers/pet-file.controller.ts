import { NextFunction, Request, Response } from "express";
import { uploadToAWSS3, deleteFromAWSS3 } from "src/services/aws-s3.service";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { AWS_CONFIG } from "@config/index";
import PetRepository from "src/repository/pet.repository";
import { NotFoundException } from "src/exceptions/not-found";
import { ForbiddenException } from "src/exceptions/forbidden";
import { UnprocessableEntityException } from "src/exceptions/validation";
import PetFileRepository from "src/repository/pet-file.repository";
import { isFileTypeValid } from "src/utils/file-utils";
import { success } from "src/utils/response";
import { toPetFileResource, toPetFilesResource } from "src/resources/pet-file.resource";

export async function getPetFiles(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId: string = req.params.petExternalId;
        const pet = await PetRepository.findByExternalId(petExternalId);
        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }

        const petFiles = await PetFileRepository.findByPetId(pet.id);

        return res.status(HTTP_STATUS.OK).json(success(
            "Arquivos do pet encontrados com sucesso", { 
                petFiles: toPetFilesResource(petFiles),
            }
        ));
    } catch (err) {
        return next(err);
    }
}

export async function uploadPetFile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId = req.params.petExternalId;
        const user = req.user!;
        const files = req.files as Express.Multer.File[];
        const file = files?.find((f) => f.fieldname === "file");
        if (!file) {
            throw new UnprocessableEntityException(
                "É necessário enviar uma imagem do pet.",
                [
                    {
                        code: "custom",
                        path: ["file"],
                        message: "É necessário enviar uma imagem do pet.",
                    },
                ]
            );
        }

        const pet = await PetRepository.findByExternalId(petExternalId);
        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }
        if (pet.ownerId !== user.id) {
            throw new ForbiddenException(
                "Você não tem permissão para atualizar este pet",
                ErrorCodes.FORBIDDEN
            );
        }

        isFileTypeValid(
            file,
            ["image/jpeg", "image/png", "image/jpg", "image/webp"],
            ["files"]
        );
        const upload = await uploadToAWSS3({
            bucket: AWS_CONFIG.bucket!,
            file,
            folder: `pets/${pet.externalId}`,
        });

        const petFile = await PetFileRepository.create({
            petId: pet.id,
            path: upload.key,
            mimeType: upload.contentType,
            size: file.size,
            extension: file.originalname.split(".").pop() || "",
            type: upload.contentType.split("/")[0],
            description: "",
        });

        return res.status(HTTP_STATUS.CREATED).json(success(
            "Arquivo do pet enviado com sucesso", { 
                petFile: toPetFileResource(petFile), 
            }
        ));
    } catch (err) {
        return next(err);
    }
}

export async function deletePetFile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId = req.params.petExternalId;
        const petFileId = req.params.externalId;
        const user = req.user!;

        const pet = await PetRepository.findByExternalId(petExternalId);
        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }
        if (pet.ownerId !== user.id) {
            throw new ForbiddenException(
                "Você não tem permissão para atualizar este pet",
                ErrorCodes.FORBIDDEN
            );
        }

        const petFile = await PetFileRepository.findByExternalId(petFileId);
        if (!petFile || petFile.petId !== pet.id) {
            throw new NotFoundException(
                "Arquivo do pet não encontrado!",
                ErrorCodes.PET_FILE_NOT_FOUND
            );
        }

        await deleteFromAWSS3(AWS_CONFIG.bucket, petFile.path);
        await PetFileRepository.delete(petFile.id);

        return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        return next(err);
    }
}

export async function setPetFileAsMain(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId = req.params.petExternalId;
        const petFileId = req.params.externalId;
        const user = req.user!;

        const pet = await PetRepository.findByExternalId(petExternalId);
        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }
        if (pet.ownerId !== user.id) {
            throw new ForbiddenException(
                "Você não tem permissão para atualizar este pet",
                ErrorCodes.FORBIDDEN
            );
        }

        const petFile = await PetFileRepository.findByExternalId(petFileId);
        if (!petFile || petFile.petId !== pet.id) {
            throw new NotFoundException(
                "Arquivo do pet não encontrado!",
                ErrorCodes.PET_FILE_NOT_FOUND
            );
        }

        await PetFileRepository.setAsMain(petFile.id);

        return res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (err) {
        return next(err);
    }
}
