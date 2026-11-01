import type { SupabaseClient } from "@supabase/supabase-js";
import type { TransactionInput } from "./schema";

export async function insertTransaction(
  supabase: SupabaseClient,
  userId: string,
  input: TransactionInput
) {
  const { error } = await supabase
    .from("transactions")
    .insert({ ...input, user_id: userId });

  if (error) throw new Error(error.message);
}

export async function countMonthlyCreates(
  supabase: SupabaseClient,
  userId: string,
  monthStart: Date
) {
  const { count } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  return count ?? 0;
}
