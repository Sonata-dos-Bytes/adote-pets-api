import { prismaClient } from "@config/database";
import { Request, Response, NextFunction } from "express";
import { ConflictException } from "src/exceptions/conflict";
import { NotFoundException } from "src/exceptions/not-found";
import { AdoptionRepository } from "src/repository/adoption.repository";
import { PetRepository } from "src/repository/pet.repository";
import { toAdoteRequestResource } from "src/resources/adoption.resource";
import { AdoptionRequest, adoptionSchema } from "src/schemas/adoption.schema";
import { ErrorCodes, HTTP_STATUS } from "src/utils/constants";
import { success } from "src/utils/response";


export async function getAdoption(req: Request, res: Response, next: NextFunction) {
  try {
    const adoptions = await prismaClient.adoteRequest.findMany();

    return res.status(HTTP_STATUS.OK).json(adoptions);
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
