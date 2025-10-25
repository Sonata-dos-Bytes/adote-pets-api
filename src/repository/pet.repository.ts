import { Prisma } from "@prisma/client";
import { prismaClient } from "@config/database";
import { CreatePetRequest, UpdatePetRequest } from "src/schemas/pet.schema";
import { QueryRequest } from "src/types/query.request";
import { MetaResponse } from "src/types/meta.response";

export type PetWithRelations = Prisma.PetGetPayload<{
    include: { files: true };
}>;

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

    static async findAll(filters: QueryRequest): Promise<{
        data: PetWithRelations[];
        meta: MetaResponse;
    }> {
        const { species, city, state, uf } = filters;
        const pageNumber = Math.max(
            1,
            Math.floor(Number((filters as any).page ?? 1))
        );
        const perPageNumber = Math.min(
            100,
            Math.max(1, Math.floor(Number((filters as any).perPage ?? 10)))
        );

        const where: Prisma.PetWhereInput = {
            isAdote: false,
            ...(species ? { species: { contains: species } } : {}),
            ...(city ? { city: { contains: city } } : {}),
            ...(state ? { state: { contains: state } } : {}),
            ...(uf ? { uf: { contains: uf } } : {}),
        };

        const [total, pets] = await prismaClient.$transaction([
            prismaClient.pet.count({ where }),
            prismaClient.pet.findMany({
                where,
                include: { files: true },
                skip: (pageNumber - 1) * perPageNumber,
                take: perPageNumber,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        const lastPage = Math.ceil(total / perPageNumber);

        return {
            data: pets,
            meta: {
                total,
                lastPage,
                ...filters,
                page: pageNumber,
                perPage: perPageNumber,
            },
        };
    }

    static async findById(id: number): Promise<PetWithRelations | null> {
        return await prismaClient.pet.findUnique({
            where: { id },
            include: {
                files: true,
            },
        });
    }

    static async findByExternalId(
        externalId: string
    ): Promise<PetWithRelations | null> {
        return await prismaClient.pet.findUnique({
            where: { externalId },
            include: {
                files: true,
            },
        });
    }

    static async findByOwnerId(
        ownerId: number,
        filters: QueryRequest
    ): Promise<{
        data: PetWithRelations[];
        meta: MetaResponse;
    }> {
        const { species, city, state, uf } = filters;
        const pageNumber = Math.max(
            1,
            Math.floor(Number((filters as any).page ?? 1))
        );
        const perPageNumber = Math.min(
            100,
            Math.max(1, Math.floor(Number((filters as any).perPage ?? 10)))
        );

        const where: Prisma.PetWhereInput = {
            ownerId,
            ...(species ? { species: { contains: species } } : {}),
            ...(city ? { city: { contains: city } } : {}),
            ...(state ? { state: { contains: state } } : {}),
            ...(uf ? { uf: { contains: uf } } : {}),
        };

        const [total, pets] = await prismaClient.$transaction([
            prismaClient.pet.count({ where }),
            prismaClient.pet.findMany({
                where,
                include: { files: true },
                skip: (pageNumber - 1) * perPageNumber,
                take: perPageNumber,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        const lastPage = Math.ceil(total / perPageNumber);

        return {
            data: pets,
            meta: {
                total,
                lastPage,
                ...filters,
                page: pageNumber,
                perPage: perPageNumber,
            },
        };
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
