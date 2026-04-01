"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: {
  budget_id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  note?: string;
  date: string;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();

  if (profile?.plan === "free") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase.from("transactions").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", startOfMonth.toISOString());
    if ((count ?? 0) >= 20) {
      throw new Error("Free tier limited reached. Upgrade to Pro.");
    }
  }

  const { error } = await supabase.from("transactions").insert({ ...formData, user_id: user.id });
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
}

export async function createBudget(name: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase.from("profiles").select("plan").eq("id", user.id).single();
  if (profile?.plan === "free") {
    const { count } = await supabase.from("budgets").select("*", { count: "exact", head: true }).eq("user_id", user.id);

    if ((count ?? 0) >= 1) {
      throw new Error("Free tier limited reached. Upgrade to Pro");
    }
  }

  const { error } = await supabase.from("budgets").insert({ name, user_id: user.id });
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
}