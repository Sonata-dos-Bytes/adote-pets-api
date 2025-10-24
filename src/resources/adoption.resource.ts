import { AdoteRequest } from "@prisma/client";

export type AdoteRequestResource = Omit<AdoteRequest, 'id' | 'password'>;

export function toAdoteRequestResource(adoteRequest: AdoteRequest): AdoteRequestResource {
  const { id, ...rest } = adoteRequest;
  return {
    ...rest,
  };
}

export function toAdoteRequestsResource(adoteRequests: AdoteRequest[]): AdoteRequestResource[] {
  return adoteRequests.map(toAdoteRequestResource);
}