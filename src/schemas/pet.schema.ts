import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lore: z.string().optional(),
  birthDay: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid birthDay date",
  }),
  species: z.string().min(1, "Species is required"),
  breed: z.string().min(1, "Breed is required"),
  gender: z.enum(['male', 'female'], "Gender must be 'male' or 'female'"),
  color: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  uf: z.string().min(2, "UF must have 2 characters"),
  isCastrated: z.boolean(),
  isAdote: z.boolean(),
  files: z.array(z.any()).min(1, "At least one file is required").max(10, "No more than 10 files are allowed"),
});

export const updatePetSchema = createPetSchema.partial();

export type CreatePetRequest = z.infer<typeof createPetSchema>;
export type UpdatePetRequest = z.infer<typeof updatePetSchema>;
