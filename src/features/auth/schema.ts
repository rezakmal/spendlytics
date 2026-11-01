import { z } from "zod";

// Placeholder — real auth schemas land with M1.
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
