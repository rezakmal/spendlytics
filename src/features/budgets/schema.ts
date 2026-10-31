import { z } from "zod";

export const budgetInputSchema = z.object({
  name: z.string().trim().min(1).max(80),
});

export type BudgetInput = z.infer<typeof budgetInputSchema>;
