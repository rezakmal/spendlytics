import { createClient } from "@/lib/supabase/server";
import SummaryCards from "@/components/SummaryCards";
import TransactionList from "@/components/TransactionList";
import CategoryChart from "@/components/CategoryChart";
import BudgetUsage from "@/components/BudgetUsage";
import UpgradeBanner from "@/components/UpgradeBanner";
import AddTransactionModal from "@/components/AddTransactionModal";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
 
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
 
  const { data: budgets } = await supabase.from("budgets").select("*").eq("user_id", user!.id).order("created_at");
 
  const budget = budgets?.[0] ?? null;
  const plan = profile?.plan ?? "free";
 
  const { data: transactions } = budget
    ? await supabase.from("transactions").select("*")
        .eq("budget_id", budget.id)
        .order("date", { ascending: false })
    : { data: [] };
 
  const txs = transactions ?? [];
  const totalIncome  = txs.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = txs.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const monthLabel = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
 
  return (
    <div className="flex flex-col gap-4 max-w-[1100px] mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-medium text-dark-text">Dashboard</h1>
          <p className="text-[12px] text-dark-sub mt-0.5">
            {monthLabel} — {budget?.name ?? "No budget yet"}
          </p>
        </div>
        <div className="flex gap-2">
          {plan === "pro" && (
            <button className="text-[12px] font-medium text-dark-muted
              border border-dark-border rounded-lg px-3 py-1.5
              hover:text-dark-text transition-colors">
              Export CSV
            </button>
          )}
          {budget && <AddTransactionModal budgetId={budget.id} />}
        </div>
      </div>
      <SummaryCards income={totalIncome} expense={totalExpense} />
      <div className="grid grid-cols-[1fr_300px] gap-4">
        <TransactionList transactions={txs.slice(0, 8)} />
        <CategoryChart transactions={txs} plan={plan} />
      </div>
      <BudgetUsage transactions={txs} />
      {plan === "free" && <UpgradeBanner />}
    </div>
  );
}
