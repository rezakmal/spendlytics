import { z } from "zod";

export const emailSchema = z.email();

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const updatePasswordSchema = z.object({
  password: z.string().min(6),
});
