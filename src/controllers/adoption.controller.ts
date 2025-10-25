import { logger } from "@config/logger";
import { Request, Response, NextFunction } from "express";
import { ConflictException } from "src/exceptions/conflict";
import { NotFoundException } from "src/exceptions/not-found";
import AdoptionRepository from "src/repository/adoption.repository";
import PetRepository from "src/repository/pet.repository";
import {
    toAdoteRequestResource,
    toAdoteRequestsResource,
} from "src/resources/adoption.resource";
import { AdoptionRequest, adoptionSchema } from "src/schemas/adoption.schema";
import { QueryRequest } from "src/types/query.request";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { success } from "src/utils/response";

export async function getAdoptionRequestsHistoryByUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = req.user!;
        logger.info(`Usuário ${user.id} está recuperando o histórico de adoções.`);
        const filters: QueryRequest = req.query;
        const adoptions = await AdoptionRepository.findRequestsByUser(user.id, filters);

        return res.status(HTTP_STATUS.OK).json(
            success("Histórico de adoções recuperado com sucesso.", {
                adoptions: toAdoteRequestsResource(adoptions.data),
                meta: adoptions.meta,
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function createAdoptionRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = req.user!;
        const adoptionData: AdoptionRequest = adoptionSchema.parse(req.body);
        const petExternalId = req.params.petExternalId;

        const pet = await PetRepository.findByExternalId(petExternalId);

        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }

        if (pet.isAdote === true) {
            throw new ConflictException(
                "Este pet já foi adotado.",
                ErrorCodes.PET_NOT_FOUND
            );
        }

        if (pet.ownerId === user.id) {
            throw new ConflictException(
                "Você não pode solicitar a adoção do seu próprio pet.",
                ErrorCodes.ADOPTION_OWN_PET
            );
        }

        const existingRequest = await AdoptionRepository.findUserRequestByPet(
            user.id,
            pet.id
        );

        if (existingRequest) {
            throw new ConflictException(
                "Você já solicitou adoção para este pet.",
                ErrorCodes.ADOPTION_ALREADY_EXISTS
            );
        }

        const newRequest = await AdoptionRepository.create({
            userId: user.id,
            petId: pet.id,
            reason: adoptionData.reason,
        });

        const requestWithRelations = await AdoptionRepository.findById(
            newRequest.id
        );

        return res.status(HTTP_STATUS.CREATED).json(
            success("Solicitação criada com sucesso.", {
                adoption: toAdoteRequestResource(requestWithRelations!),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function showPetAdoptionRequests(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId = req.params.petExternalId;
        const pet = await PetRepository.findByExternalId(petExternalId);
        const filters: QueryRequest = req.query;
        const user = req.user!;

        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }

        if (pet.ownerId !== user.id) {
            filters.userId = user.id;
        }

        const requests = await AdoptionRepository.findRequestsByPet(
            pet.id,
            filters
        );

        if (!requests) {
            throw new NotFoundException(
                "Solicitações de adoção não encontrada!",
                ErrorCodes.REQUEST_NOT_FOUND
            );
        }

        return res.status(HTTP_STATUS.OK).json(
            success("Solicitações recuperadas com sucesso.", {
                requests: toAdoteRequestsResource(requests.data),
                meta: requests.meta,
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function showPetAdoptionRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId = req.params.petExternalId;
        const requestExternalId = req.params.externalId;
        const user = req.user!;
        const pet = await PetRepository.findByExternalId(petExternalId);

        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }

        const request = await AdoptionRepository.findByExternalId(requestExternalId);

        if (!request || request.pet.externalId !== pet.externalId) {
            throw new NotFoundException(
                "Solicitação de adoção não encontrada!",
                ErrorCodes.REQUEST_NOT_FOUND
            );
        }

        if (request.pet.ownerId !== user.id && request.userId !== user.id) {
            throw new ConflictException(
                "Você não tem permissão para visualizar esta solicitação de adoção.",
                ErrorCodes.FORBIDDEN
            );
        }

        return res.status(HTTP_STATUS.OK).json(
            success("Solicitação recuperada com sucesso.", {
                request: toAdoteRequestResource(request),
            })
        );
    } catch (err) {
        return next(err);
    }
}

export async function deleteAdoptionRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const petExternalId = req.params.petExternalId;
        const requestExternalId = req.params.externalId;
        const user = req.user!;
        const pet = await PetRepository.findByExternalId(petExternalId);

        if (!pet) {
            throw new NotFoundException(
                "Pet não encontrado!",
                ErrorCodes.PET_NOT_FOUND
            );
        }

        const request = await AdoptionRepository.findByExternalId(requestExternalId);

        if (!request || request.pet.externalId !== pet.externalId) {
            throw new NotFoundException(
                "Solicitação de adoção não encontrada!",
                ErrorCodes.REQUEST_NOT_FOUND
            );
        }

        if (request.userId !== user.id) {
            throw new ConflictException(
                "Você não tem permissão para cancelar esta solicitação de adoção.",
                ErrorCodes.FORBIDDEN
            );
        }

        await AdoptionRepository.delete(request.id);

        return res.status(HTTP_STATUS.NO_CONTENT).json();
    } catch (err) {
        return next(err);
    }
}
