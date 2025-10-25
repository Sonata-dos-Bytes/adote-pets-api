import { AWS_CONFIG } from "@config/index";
import { PetFile } from "@prisma/client";
import { buildPublicUrl } from "src/services/aws-s3.service";

export type PetFileResource = Omit<PetFile, 'id' | 'petId'>;

export function toPetFileResource(petFile: PetFile): PetFileResource {
  const { id, petId, ...rest } = petFile;
  return {
    ...rest,
    path: petFile.path ? buildPublicUrl(AWS_CONFIG.bucket, petFile.path) ?? '' : '',
  };
}

export function toPetFilesResource(petFiles: PetFile[]): PetFileResource[] {
  return petFiles.map(toPetFileResource);
}