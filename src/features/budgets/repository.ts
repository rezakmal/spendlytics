import type { SupabaseClient } from "@supabase/supabase-js";
import type { BudgetInput } from "./schema";

export async function insertBudget(
  supabase: SupabaseClient,
  userId: string,
  input: BudgetInput
) {
  const { error } = await supabase
    .from("budgets")
    .insert({ ...input, user_id: userId });

  if (error) throw new Error(error.message);
}

export async function countBudgets(supabase: SupabaseClient, userId: string) {
  const { count } = await supabase
    .from("budgets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return count ?? 0;
}
