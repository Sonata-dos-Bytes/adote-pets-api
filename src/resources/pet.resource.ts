import { PetFileResource, toPetFilesResource } from "./pet-file.resource";
import { PetWithRelations } from "src/repository/pet.repository";

export type PetResource = Omit<PetWithRelations, "id" | "ownerId" | "files"> & {
  files: PetFileResource[];
};

export function toPetResource(pet: PetWithRelations): PetResource {
  const { id, ownerId, files, ...rest } = pet;
  return {
    ...rest,
    files: files ? toPetFilesResource(files) : [],
  };
}

export function toPetsResource(pets: PetWithRelations[]): PetResource[] {
  return pets.map(toPetResource);
}