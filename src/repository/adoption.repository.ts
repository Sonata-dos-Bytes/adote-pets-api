import { prismaClient } from "@config/database";
import { Prisma } from "@prisma/client";
import { QueryRequest } from "src/types/query.request";
import { MetaResponse } from "src/types/meta.response";
import { AdoptionRequest } from "src/schemas/adoption.schema";
import { includes } from "zod";

export type AdoptionWithRelations = Prisma.AdoteRequestGetPayload<{
    include: { user: true; pet: {
        include: { files: true }
    } };
}>;

interface CreateAdoptionDTO extends AdoptionRequest {
    userId: number;
    petId: number;
}

export default class AdoptionRepository {
    static async findById(id: number): Promise<AdoptionWithRelations | null> {
        return await prismaClient.adoteRequest.findUnique(
            { 
                where: { id },
                include: { user: true, pet: {
                    include: { files: true }
                } },
            },
        );
    }

    static async findByExternalId(externalId: string): Promise<AdoptionWithRelations | null> {
        return await prismaClient.adoteRequest.findUnique({
            where: { externalId },
            include: { user: true, pet: {
                include: { files: true }
            } },
        });
    }

    static async findUserRequestByPet(userId: number, petId: number) {
        return await prismaClient.adoteRequest.findFirst({
            where: { userId, petId },
        });
    }

    static async findPetRequests(petId: number) {
        return await prismaClient.adoteRequest.findMany({
            where: { petId },
        });
    }

    static async findRequestsByPet(petId: number, filters: QueryRequest): Promise<{
        data: AdoptionWithRelations[];
        meta: MetaResponse;
    }> {
        const pageNumber = Math.max(
            1,
            Math.floor(Number((filters as any).page ?? 1))
        );

        const perPageNumber = Math.min(
            100,
            Math.max(1, Math.floor(Number((filters as any).perPage ?? 10)))
        );

        const where: Prisma.AdoteRequestWhereInput = {
            petId,
            userId: filters.userId ? Number(filters.userId) : undefined,
        };

        const [total, adoptions] = await prismaClient.$transaction([
            prismaClient.adoteRequest.count({ where }),
            prismaClient.adoteRequest.findMany({
                where,
                include: { user: true, pet: {
                    include: { files: true }
                } },
                skip: (pageNumber - 1) * perPageNumber,
                take: perPageNumber,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        const meta: MetaResponse = {
            total,
            lastPage: Math.ceil(total / perPageNumber),
            ...filters,
            page: pageNumber,
            perPage: perPageNumber,
        };

        return { data: adoptions, meta };
    }

    static async findRequestsByUser(userId: number, filters: QueryRequest): Promise<{
        data: AdoptionWithRelations[];
        meta: MetaResponse;
    }> {
        const pageNumber = Math.max(
            1,
            Math.floor(Number((filters as any).page ?? 1))
        );

        const perPageNumber = Math.min(
            100,
            Math.max(1, Math.floor(Number((filters as any).perPage ?? 10)))
        );

        const where: Prisma.AdoteRequestWhereInput = {
            userId,
        };

        const [total, adoptions] = await prismaClient.$transaction([
            prismaClient.adoteRequest.count({ where }),
            prismaClient.adoteRequest.findMany({
                where,
                include: { user: true, pet: {
                    include: { files: true }
                } },
                skip: (pageNumber - 1) * perPageNumber,
                take: perPageNumber,
                orderBy: { createdAt: "desc" },
            }),
        ]);

        const meta: MetaResponse = {
            total,
            lastPage: Math.ceil(total / perPageNumber),
            ...filters,
            page: pageNumber,
            perPage: perPageNumber,
        };

        return { data: adoptions, meta };
    }

    static async findByUserIdWithPetId(userId: number, petId: number) {
        return await prismaClient.adoteRequest.findFirst({
            where: { userId, petId },
        });
    }

    static async create(data: CreateAdoptionDTO) {
        return prismaClient.adoteRequest.create({
            data: {
                userId: data.userId,
                petId: data.petId,
                reason: data.reason,
            },
        });
    }

    static async delete(id: number) {
        return prismaClient.adoteRequest.delete({ where: { id } });
    }
}
