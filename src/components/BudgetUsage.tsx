import type { Transaction } from "@/types";

const LIMITS: Record<string, number> = {
  Food:500000, Transport:300000, Housing:1200000,
  Health:200000, Entertainment:500000,
  Shopping:400000, Education:300000, Other:300000,
};

const fmt = (n: number) => new Intl.NumberFormat("id-ID", {
  style:"currency", currency:"IDR", maximumFractionDigits:0
}).format(n);

function barColor(pct: number) {
  if (pct >= 100) return "#34d399";
  if (pct >= 80)  return "#f87171";
  if (pct >= 60)  return "#F59E0B";
  return "#a5b4fc";
}

export default function BudgetUsage({ transactions }: { transactions: Transaction[] }) {
  const byCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
      return acc;
  }, {} as Record<string, number>);

  const items = Object.entries(LIMITS).map(([cat, limit]) => ({
    cat,
    limit,
    spent: byCategory[cat] ?? 0,
    pct: Math.min(Math.round(((byCategory[cat] ?? 0) / limit) * 100), 100),
  }));

  return (
    <div className="bg-surface border border-dark-border rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-medium text-dark-text/80">
          Budget usage
        </h2>
        <span className="text-[11px] text-dark-sub">
          {new Date().toLocaleString("id-ID",
            { month: "long", year: "numeric" })}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2.5">
        {items.map(({ cat, limit, spent, pct }) => (
          <div key={cat} className="bg-base rounded-[8px] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-dark-sub">{cat}</span>
              <span className="text-[11px] text-dark-muted">{pct}%</span>
            </div>
            <p className="text-[14px] font-medium text-dark-text/80 mb-2">
              {fmt(spent)}
              <span className="text-[11px] font-normal text-dark-sub">
                {" "}/ {fmt(limit)}
              </span>
            </p>
            <div className="h-1 bg-dark-border rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width:`${pct}%`, background:barColor(pct) }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}