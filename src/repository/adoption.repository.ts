import { prismaClient } from "@config/database"

interface CreateAdoptionDTO {
  userId: number
  petId: number
  reason: string
}

export class AdoptionRepository {
  static async findById(id: number) {
    return await prismaClient.adoteRequest.findUnique({ where: { id } })
  }

  static async findByExternalId(externalId: string) {
    return await prismaClient.adoteRequest.findUnique({ where: { externalId } })
  }

  static async findUserRequestByPet(userId: number, petId: number) {
    return await prismaClient.adoteRequest.findFirst({
      where: { userId, petId },
    })
  }

  static async findPetRequests(petId: number) {
    return await prismaClient.adoteRequest.findMany({
      where: { petId },
    })
  }

  static async findRequestsByPet(petId: number) {
    return await prismaClient.adoteRequest.findMany({
      where: { petId },
    })
  }

  static async findRequestsByUser(userId: number) {
    return await prismaClient.adoteRequest.findMany({
      where: { userId },
    })
  }

  static async findByUserIdWithPetId(userId: number, petId: number) {
    return await prismaClient.adoteRequest.findFirst({
      where: { userId, petId },
    })
  }

  static async create(data: CreateAdoptionDTO) {
    return prismaClient.adoteRequest.create({
      data: {
        userId: data.userId,
        petId: data.petId,
        reason: data.reason,
      },
    })
  }

  static async delete(id: number) {
    return prismaClient.adoteRequest.delete({ where: { id } })
  }
}
