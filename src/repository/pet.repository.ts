// src/repository/adoption.repository.ts
import { prismaClient } from "@config/database";

export class PetRepository {
   static async findById(id: number) {
    return await prismaClient.pet.findUnique({ where: { id } });
  }

  static async findByExternalId(externalId: string) {
    return await prismaClient.pet.findUnique({ where: { externalId } });
  }
}
