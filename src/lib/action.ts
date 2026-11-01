"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { addTransaction } from "@/features/transactions/service";
import { createBudget } from "@/features/budgets/service";

export async function addTransactionAction(formData: {
  budget_id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  date: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await addTransaction(supabase, user.id, formData);

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}

export async function createBudgetAction(name: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await createBudget(supabase, user.id, { name });

  revalidatePath("/dashboard");
}
