import type { SupabaseClient } from "@supabase/supabase-js";
import { transactionInputSchema, type TransactionInput } from "./schema";
import { insertTransaction, countMonthlyCreates } from "./repository";

export const FREE_MONTHLY_CREATE_LIMIT = 20;

export async function addTransaction(
  supabase: SupabaseClient,
  userId: string,
  rawInput: TransactionInput
) {
  const input = transactionInputSchema.parse(rawInput);

  // NOTE(M0): non-atomic quota check carried over from the recovered code.
  // The atomic counter + Jakarta-month semantics land in M3.3.
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  if (profile?.plan === "free") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const created = await countMonthlyCreates(supabase, userId, startOfMonth);
    if (created >= FREE_MONTHLY_CREATE_LIMIT) {
      throw new Error("Free tier limited reached. Upgrade to Pro.");
    }
  }

  await insertTransaction(supabase, userId, input);
}
