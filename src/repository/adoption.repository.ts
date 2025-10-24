// src/repository/adoption.repository.ts
import { prismaClient } from "@config/database";

interface CreateAdoptionDTO {
  userId: number;
  petId: number;
  reason: string;
}

export class AdoptionRepository {
  static async create(data: CreateAdoptionDTO) {
    return prismaClient.adoteRequest.create({
      data: {
        userId: data.userId,
        petId: data.petId,
        reason: data.reason,
      },
    });
  }

  static async findById(id: number) {
    return await prismaClient.adoteRequest.findUnique({ where: { id } });
  }

  static async findByExternalId(externalId: string) {
    return await prismaClient.adoteRequest.findUnique({ where: { externalId } });
  }

  static async findUserRequestByPet(userId: number, petId: number){
    return await prismaClient.adoteRequest.findFirst({ where: { userId, petId } })
  }
}
