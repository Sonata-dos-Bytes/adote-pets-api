import { prismaClient } from "@config/database";
import { PetFile } from "@prisma/client";

export interface CreatePetFileDTO extends Omit<PetFile, 'id'|'externalId'|'createdAt'|'updatedAt'> {}

export default class PetFileRepository {
    static async create(data: CreatePetFileDTO) {
        return await prismaClient.petFile.create({
            data: {
                ...data,
            },
        });
    }
}
