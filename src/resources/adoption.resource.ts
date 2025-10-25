import { AdoptionWithRelations } from "src/repository/adoption.repository";
import { toUserResource, UserResource } from "./user.resource";
import { PetResource, toPetResource } from "./pet.resource";

export type AdoteRequestResource = Omit<AdoptionWithRelations, 'id' | 'userId' | 'petId' | 'pet' | 'user'> & {
  pet: PetResource;
  user: UserResource;
};

export function toAdoteRequestResource(adoteRequest: AdoptionWithRelations): AdoteRequestResource {
  const { id, petId, userId, pet, user, ...rest } = adoteRequest;
  return {
    ...rest,
    pet: toPetResource(pet),
    user: toUserResource(user),
  };
}

export function toAdoteRequestsResource(adoteRequests: AdoptionWithRelations[]): AdoteRequestResource[] {
  return adoteRequests.map(toAdoteRequestResource);
}