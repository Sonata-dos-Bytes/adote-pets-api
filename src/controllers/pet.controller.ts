import { Request, Response } from "express";
import { uploadToAWSS3, deleteFromAWSS3 } from "src/services/aws-s3.service";
import { HTTP_STATUS } from "src/utils/constants";
import { createPetSchema, updatePetSchema } from 'src/schemas/pet.schema';
import { prismaClient } from "@config/database";
import { ConflictException } from "src/exceptions/conflict";
import { UnauthorizedException } from "src/exceptions/unauthorized";
import { NotFoundException } from "src/exceptions/not-found";
import { UnprocessableEntityException } from "src/exceptions/validation";
//import { BadRequestException } from "src/exceptions/bad-requests";


export const PetController = {
  // 1️⃣ Listar todos os pets (com filtros via query params)
  async index(req: Request, res: Response) {
    const { species, city, state, uf } = req.query;

    const pets = await prismaClient.pet.findMany({
      where: {
        isAdote: true,
        ...(species ? { species: String(species) } : {}),
        ...(city ? { city: String(city) } : {}),
        ...(state ? { state: String(state) } : {}),
        ...(uf ? { uf: String(uf) } : {}),
      },
      include: {
        files: true,
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return res.status(HTTP_STATUS.OK).json(pets);
  },

  // 2️⃣ Mostrar detalhes de um pet específico
  async show(req: Request, res: Response) {
    const { id } = req.params;
    const pet = await prismaClient.pet.findUnique({
      where: { id: Number(id) },
      include: {
        files: true,
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!pet) throw new NotFoundException("Pet not found");

    return res.status(HTTP_STATUS.OK).json(pet);
  },

  // 3️⃣ Listar pets do usuário autenticado
  async myPets(req: Request, res: Response) {
    const userId = req.user.id;

    const pets = await prisma.pet.findMany({
      where: { ownerId: userId },
      include: { files: true },
    });

    return res.status(HTTP_STATUS.OK).json(pets);
  },

  // 4️⃣ Criar um novo pet (com upload de imagens)
  async store(req: Request, res: Response) {
    // Validação com Zod
    const validated = createPetSchema.safeParse(req.body);
    if (!validated.success) {
      throw new BadRequestException} from
      ("Validation Error", validated.error);
    }
    const data = validated.data;
    const userId = req.user.id;

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw new BadRequestException} from
      ("At least one image is required");
    }

    // Cria o pet
    const pet = await prisma.pet.create({
      data: {
        ...data,
        birthDay: new Date(data.birthDay),
        ownerId: userId,
      },
    });

    // Upload das imagens
    const uploadedFiles = [];
    for (const file of req.files as Express.Multer.File[]) {
      const upload = await uploadToAWSS3({
        bucket: process.env.AWS_BUCKET_NAME!,
        file,
        folder: `pets/${pet.id}`,
      });

      const petFile = await prisma.petFile.create({
        data: {
          petId: pet.id,
          path: upload.key,
          mimeType: upload.contentType,
          size: file.size,
          extension: file.originalname.split(".").pop() || "",
          type: upload.contentType.split("/")[0],
          description: file.originalname,
        },
      });

      uploadedFiles.push(petFile);
    }

    return res.status(HTTP_STATUS.CREATED).json({
      ...pet,
      files: uploadedFiles,
    });
  },

  // 5️⃣ Atualizar um pet
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    // Validação com Zod
    const validated = updatePetSchema.safeParse(req.body);
    if (!validated.success) {
      throw new BadRequestException} from
      ("Validation Error", validated.error);
    }
    const dataToUpdate = validated.data;

    const pet = await prisma.pet.findUnique({ where: { id: Number(id) } });
    if (!pet) throw new NotFoundException("Pet not found");
    if (pet.ownerId !== userId)
      throw new ForbiddenException("You are not allowed to edit this pet");

    if (dataToUpdate.birthDay) {
      dataToUpdate.birthDay = new Date(dataToUpdate.birthDay);
    }

    const updated = await prisma.pet.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    // Upload de novas imagens
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      for (const file of req.files as Express.Multer.File[]) {
        const upload = await uploadToAWSS3({
          bucket: process.env.AWS_BUCKET_NAME!,
          file,
          folder: `pets/${updated.id}`,
        });

        await prisma.petFile.create({
          data: {
            petId: updated.id,
            path: upload.key,
            mimeType: upload.contentType,
            size: file.size,
            extension: file.originalname.split(".").pop() || "",
            type: upload.contentType.split("/")[0],
            description: file.originalname,
          },
        });
      }
    }

    return res.status(HTTP_STATUS.OK).json(updated);
  },

  // 6️⃣ Excluir pet e imagens
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    const pet = await prisma.pet.findUnique({
      where: { id: Number(id) },
      include: { files: true },
    });

    if (!pet) throw new NotFoundException("Pet not found");
    if (pet.ownerId !== userId)
      throw new ForbiddenException("You are not allowed to delete this pet");

    // Apaga imagens do S3
    for (const file of pet.files) {
      await deleteFromAWSS3(process.env.AWS_BUCKET_NAME!, file.path);
    }

    await prisma.pet.delete({ where: { id: Number(id) } });

    return res.status(HTTP_STATUS.NO_CONTENT).send();
  },
};
