import { User } from "@prisma/client";
import { PetFileResource, toPetFilesResource } from "./pet-file.resource";
import { PetWithRelations } from "src/repository/pet.repository";

export type PetResource = Omit<PetWithRelations, "id" | "ownerId" | "files" | "owner"> & {
  files: PetFileResource[];
  owner?: {
    externalId: string;
  }
};

export function toPetResource(pet: PetWithRelations): PetResource {
  const { id, ownerId, files, owner, ...rest } = pet;
  return {
    ...rest,
    files: files ? toPetFilesResource(files) : [],
    owner: owner ? { externalId: owner.externalId } : undefined,
  };
}

export function toPetsResource(pets: PetWithRelations[]): PetResource[] {
  return pets.map(toPetResource);
}