import { prismaClient } from "@config/database";
import { PetFile } from "@prisma/client";
import { ConflictException } from "src/exceptions/conflict";
import { ErrorCodes } from "src/utils/constants";
import { th } from "zod/v4/locales";

export interface CreatePetFileDTO
    extends Omit<
        PetFile,
        "id" | "externalId" | "createdAt" | "updatedAt" | "orderIndex"
    > {
    orderIndex?: number;
}

export default class PetFileRepository {
    static async findByPetId(petId: number) {
        return await prismaClient.petFile.findMany({
            where: { petId },
            orderBy: { orderIndex: "asc" },
        });
    }

    static async findById(id: number) {
        return await prismaClient.petFile.findUnique({
            where: { id },
        });
    }

    static async findByExternalId(externalId: string) {
        return await prismaClient.petFile.findUnique({
            where: { externalId },
        });
    }

    static async create(data: CreatePetFileDTO) {
        if (data.orderIndex === undefined) {
            const existingFilesCount = await prismaClient.petFile.count({
                where: { petId: data.petId },
            });
            data.orderIndex = existingFilesCount;
        }

        return await prismaClient.petFile.create({
            data: {
                ...data,
            },
        });
    }

    static async delete(id: number) {
        return await prismaClient.$transaction(async (tx) => {
            const fileToDelete = await tx.petFile.findUnique({
                where: { id },
                select: { petId: true, orderIndex: true },
            });

            const { petId, orderIndex } = fileToDelete!;

            const remainingFiles = await tx.petFile.findMany({
                where: { petId, id: { not: id } },
                orderBy: { orderIndex: "asc" },
            });

            if (!remainingFiles.length) {
                throw new ConflictException(
                    "Um pet deve ter ao menos um arquivo associado",
                    ErrorCodes.AT_LEAST_ONE_IMAGE_REQUIRED
                );
            }

            await tx.petFile.delete({
                where: { id },
            });

            for (let i = 0; i < remainingFiles.length; i++) {
                if (remainingFiles[i].orderIndex !== i) {
                    await tx.petFile.update({
                        where: { id: remainingFiles[i].id },
                        data: { orderIndex: i },
                    });
                }
            }

            return fileToDelete!;
        });
    }

    static async update(id: number, data: Partial<CreatePetFileDTO>) {
        return await prismaClient.petFile.update({
            where: { id },
            data: {
                ...data,
            },
        });
    }

    static async setAsMain(id: number) {
        return await prismaClient.$transaction(async (tx) => {
            const mainFile = await tx.petFile.findUnique({
                where: { id },
                select: { petId: true },
            });

            const otherFiles = await tx.petFile.findMany({
                where: { petId: mainFile!.petId, id: { not: id } },
                orderBy: { orderIndex: "asc" },
            });

            await tx.petFile.update({
                where: { id },
                data: { orderIndex: 0 },
            });

            for (let i = 0; i < otherFiles.length; i++) {
                await tx.petFile.update({
                    where: { id: otherFiles[i].id },
                    data: { orderIndex: i + 1 },
                });
            }

            return mainFile;
        });
    }
}
