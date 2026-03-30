export type Plan = "free" | "pro";
export type TransactionType = "income" | "expense";

export interface Profile {
  id: string,
  email: string,
  plan: Plan,
  paid_at: string | null,
  created_at: string,
}

export interface Budget {
  id: string,
  user_id: string,
  name: string,
  created_at: string
}

export interface Transaction {
  id: string,
  user_id: string,
  budget_id: string,
  amount: number,
  type: TransactionType,
  category: string,
  note: string | null,
  date: string,
  created_at: string
}

// treat the array as a fixed tuple with exact string values, not just a generic string[].
export const CATEGORIES = [
  "Food", "Transport", "Invest", "Health", "Entertainment", "Shopping", "Education", "Other"
] as const;

export type Category = typeof CATEGORIES[number];