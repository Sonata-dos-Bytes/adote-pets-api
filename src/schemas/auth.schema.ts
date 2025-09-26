import { z } from 'zod';

export const loginSchema = z.object({
    login: z.string().nonempty('Login is required'),
    password: z.string().nonempty('Password is required'),
});

export const registerSchema = z.object(
    {
        name: z
            .string()
            .min(1, "O nome é obrigatório.")
            .max(100, "O nome deve ter no máximo 100 caracteres."),
        email: z
            .string()
            .email("Digite um email válido.")
            .min(1, "O email é obrigatório."),
        password: z.string()
            .min(8, "A senha deve ter no mínimo 8 caracteres.")
            .max(50, "A senha deve ter no máximo 50 caracteres."),
        passwordConfirmation: z.string()
            .min(8, "A confirmação de senha deve ter no mínimo 8 caracteres.")
            .max(50, "A confirmação de senha deve ter no máximo 50 caracteres."),
        avatar: z
            .union([z.string(), z.instanceof(File)])
            .nullable()
            .optional()
        ,
        phone: z
            .string()
            .max(20, "O telefone deve ter no máximo 20 caracteres.")
            .nullable()
            .optional(),
    })
    .refine(
        (data) => data.password === data.passwordConfirmation,
        {
            message: "As senhas devem ser iguais.",
            path: ["passwordConfirmation"],
        }
    )

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;