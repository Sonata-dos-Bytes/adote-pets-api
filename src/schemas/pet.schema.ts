import { z } from 'zod';

// Schema para criação de pet
export const createPetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lore: z.string().optional(),
  birthDay: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid birthDay date",
  }),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female'], "Gender must be 'male' or 'female'"),
  color: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  uf: z.string().min(2, "UF must have 2 characters"),
  isCastrated: z.boolean(),
  isAdote: z.boolean(),
});

// Schema para atualização de pet (todos campos opcionais)
export const updatePetSchema = createPetSchema.partial();
