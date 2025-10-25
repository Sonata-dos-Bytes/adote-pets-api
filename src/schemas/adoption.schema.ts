import { z } from "zod";

export const adoptionSchema = z
    .object({
        reason: z
            .string()
            .min(1, "O razão é obrigatório.")
            .max(100, "O razão deve ter no máximo 100 caracteres."),  
    });

export type AdoptionRequest = z.infer<typeof adoptionSchema>;