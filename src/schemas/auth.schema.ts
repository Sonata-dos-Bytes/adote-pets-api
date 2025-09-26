import { z } from 'zod';

export const loginSchema = z.object({
    login: z.string().nonempty('Login is required'),
    password: z.string().nonempty('Password is required'),
}).transform((data) => ({
    login: data.login,
    password: data.password
}));

export const registerSchema = z.object({
    login: z.string().nonempty('Login is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    password_confirmation: z.string().nonempty('Confirm Password is required'),
    email: z.string().email('Invalid email address'),
    name: z.string().nonempty('Name is required'),
}).superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['password_confirmation'],
            message: 'Passwords must match',
        });
    }
}).transform((data) => ({
    login: data.login,
    password: data.password,
    passwordConfirmation: data.password_confirmation,
    email: data.email,
    name: data.name
}));

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;