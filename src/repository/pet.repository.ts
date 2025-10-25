import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const petRepository = {
  async create(data: any) {
    return await prisma.pet.create({
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
  },

  async findAll() {
    return await prisma.pet.findMany({
      include: {
        files: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async findById(id: number) {
    return await prisma.pet.findUnique({
      where: { id },
      include: {
        files: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  async update(id: number, data: any) {
    return await prisma.pet.update({
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
  },

  async delete(id: number) {
    return await prisma.pet.delete({
      where: { id },
    });
  },
};
