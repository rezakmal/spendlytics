import type { SupabaseClient } from "@supabase/supabase-js";
import { budgetInputSchema, type BudgetInput } from "./schema";
import { insertBudget, countBudgets } from "./repository";

export const FREE_BUDGET_LIMIT = 1;

export async function createBudget(
  supabase: SupabaseClient,
  userId: string,
  rawInput: BudgetInput
) {
  const input = budgetInputSchema.parse(rawInput);

  // NOTE(M0): carried over from recovered code. Primary-budget invariant and
  // atomic one-budget guard for Free land in M2.2.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  if (profile?.plan === "free") {
    const count = await countBudgets(supabase, userId);
    if (count >= FREE_BUDGET_LIMIT) {
      throw new Error("Free tier limited reached. Upgrade to Pro");
    }
  }

  await insertBudget(supabase, userId, input);
}
