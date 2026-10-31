import { z } from "zod";

export const transactionInputSchema = z.object({
  budget_id: z.string().uuid(),
  amount: z.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1),
  note: z.string().optional(),
  date: z.string(),
});

export type TransactionInput = z.infer<typeof transactionInputSchema>;
