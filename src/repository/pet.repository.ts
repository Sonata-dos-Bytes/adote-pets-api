import { Prisma } from "@prisma/client";
import { prismaClient } from "@config/database";
import { CreatePetRequest, UpdatePetRequest } from "src/schemas/pet.schema";

export type PetWithRelations = Prisma.PetGetPayload<{
  include: { files: true };
}>;

export interface PetFilter {
  species?: string;
  city?: string;
  state?: string;
  uf?: string;
}

export interface CreatePetDTO extends CreatePetRequest {
  ownerId: number;
}

export default class PetRepository {
  static async create(data: CreatePetDTO) {
    return await prismaClient.pet.create({
      data: {
        name: data.name,
        lore: data.lore,
        birthDay: new Date(data.birthDay),
        species: data.species,
        breed: data.breed,
        gender: data.gender,
        color: data.color,
        city: data.city,
        state: data.state,
        uf: data.uf,
        isCastrated: data.isCastrated,
        isAdote: data.isAdote,
        ownerId: data.ownerId,
      },
    });
  }

  static async findAll(filters: PetFilter): Promise<PetWithRelations[]> {
    return await prismaClient.pet.findMany({
      where: {
        isAdote: false,
        ...(filters.species ? { species: String(filters.species) } : {}),
        ...(filters.city ? { city: String(filters.city) } : {}),
        ...(filters.state ? { state: String(filters.state) } : {}),
        ...(filters.uf ? { uf: String(filters.uf) } : {}),
      },
      include: {
        files: true,
      },
    });
  }

  static async findById(id: number): Promise<PetWithRelations | null> {
    return await prismaClient.pet.findUnique({
      where: { id },
      include: {
        files: true,
      },
    });
  }

  static async findByOwnerId(ownerId: number): Promise<PetWithRelations[]> {
    return await prismaClient.pet.findMany({
      where: { ownerId },
      include: {
        files: true,
      },
    });
  }

  static async update(id: number, data: UpdatePetRequest) {
    return await prismaClient.pet.update({
      where: { id },
      data: {
        name: data.name,
        lore: data.lore,
        birthDay: data.birthDay ? new Date(data.birthDay) : undefined,
        species: data.species,
        breed: data.breed,
        gender: data.gender,
        color: data.color,
        city: data.city,
        state: data.state,
        uf: data.uf,
        isCastrated: data.isCastrated,
        isAdote: data.isAdote,
      },
    });
  }

  static async delete(id: number) {
    return await prismaClient.pet.delete({
      where: { id },
    });
  }
}
