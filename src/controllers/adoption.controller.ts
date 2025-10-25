import { Request, Response, NextFunction } from "express";
import { ConflictException } from "src/exceptions/conflict";
import { NotFoundException } from "src/exceptions/not-found";
import AdoptionRepository from "src/repository/adoption.repository";
import PetRepository from "src/repository/pet.repository";
import { toAdoteRequestResource } from "src/resources/adoption.resource";
import { AdoptionRequest, adoptionSchema } from "src/schemas/adoption.schema";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { success } from "src/utils/response";

export async function getAdoptionRequestsHistoryByUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!;

    const adoptions = await AdoptionRepository.findRequestsByUser(user.id);

    return res
      .status(HTTP_STATUS.OK)
      .json(success("Histórico de adoções recuperado com sucesso.", {
        adoptions: adoptions.map(toAdoteRequestResource),
      }));
  } catch (err) {
    return next(err);
  }
}

export async function createAdoptionRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!;
    const adoptionData: AdoptionRequest = adoptionSchema.parse(req.body);
    const petId = Number(req.params.petId);

    const pet = await PetRepository.findById(petId);

    if (!pet) {
      throw new NotFoundException("Pet não encontrado!", ErrorCodes.PET_NOT_FOUND);
    }

    const existingRequest = await AdoptionRepository.findUserRequestByPet(user.id, pet.id)

    if (existingRequest) {
      throw new ConflictException("Você já solicitou adoção para este pet.", ErrorCodes.ADOPTION_ALREADY_EXISTS)
    }

    const newRequest = await AdoptionRepository.create({
      userId: user.id, 
      petId: pet.id,
      reason: adoptionData.reason,
    });

    return res
      .status(HTTP_STATUS.CREATED)
      .json(success("Solicitação criada com sucesso.", {
        adoption: toAdoteRequestResource(newRequest), 
      }));
  } catch (err) {
    return next(err);
  }
}

export async function showPetAdoptionRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const petId = Number(req.params.petId);
    const pet = await PetRepository.findById(petId);

    if (!pet) {
      throw new NotFoundException("Pet não encontrado!", ErrorCodes.PET_NOT_FOUND);
    }

    const requests = await AdoptionRepository.findRequestsByPet(pet.id);

    if (!requests || requests.length === 0) {
      throw new NotFoundException("Solicitações de adoção não encontrada!", ErrorCodes.REQUEST_NOT_FOUND);
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(success("Solicitações recuperadas com sucesso.", {
        requests: requests.map(toAdoteRequestResource),
      }));
  } catch (err) {
    return next(err);
  }
}

export async function showPetAdoptionRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const petId = Number(req.params.petId);
    const requestId = Number(req.params.requestId);

    const pet = await PetRepository.findById(petId);

    if (!pet) {
      throw new NotFoundException("Pet não encontrado!", ErrorCodes.PET_NOT_FOUND);
    }

    const request = await AdoptionRepository.findById(requestId);

    if (!request || request.petId !== pet.id) {
      throw new NotFoundException("Solicitação de adoção não encontrada!", ErrorCodes.REQUEST_NOT_FOUND);
    }

    return res
      .status(HTTP_STATUS.OK)
      .json(success("Solicitação recuperada com sucesso.", {
        request: toAdoteRequestResource(request),
      }));
  } catch (err) {
    return next(err);
  }
}

export async function deleteAdoptionRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const petId = Number(req.params.petId);
    const user = req.user!;

    const pet = await PetRepository.findById(petId);

    if (!pet) {
      throw new NotFoundException("Pet não encontrado!", ErrorCodes.PET_NOT_FOUND);
    }

    const request = await AdoptionRepository.findRequestsByPet(pet.id)

    if (!request) {
      throw new NotFoundException("Solicitação de adoção não encontrada!", ErrorCodes.REQUEST_NOT_FOUND);
    }

    await AdoptionRepository.findByUserIdWithPetId(user.id, pet.id)

    return res
      .status(HTTP_STATUS.NO_CONTENT)
      .json();
  } catch (err) {
    return next(err);
  }
}
