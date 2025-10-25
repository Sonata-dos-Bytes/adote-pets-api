import { Pet } from "@prisma/client";

export type PetResource = Omit<Pet, 'id'>;

export function toPetResource(pet: Pet): PetResource {
  const { id, ...rest } = pet;
  return {
    ...rest,
  };
}

export function toPetsResource(pets: Pet[]): PetResource[] {
  return pets.map(toPetResource);
}