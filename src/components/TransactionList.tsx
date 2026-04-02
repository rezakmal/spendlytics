"use client";

import type { Transaction } from "@/types";

const ICONS: Record<string, string> = {
  Food:"🛒", Transport:"🚗", Housing:"🏠",
  Health:"💊", Entertainment:"🎬", Shopping:"🛍️",
  Education:"📚", Other:"📋", income:"💰",
};

const ICON_BG: Record<string, string> = {
  Food:"#1a2e1a", Transport:"#2e1a1a", Housing:"#1a1a2e",
  Health:"#1e1a2e", Entertainment:"#2e1e1a", Shopping:"#1a2a2a",
  Education:"#1e2e1a", Other:"#1e1e2e", income:"#1a2e20",
};

const fmt = (n: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", minimumFractionDigits: 0
}).format(n);

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-surface border border-dark-border rounded-[10px] p-4">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[13px] font-medium text-dark-text/80">
          Recent transactions
        </h2>
        <a href="/transactions"
          className="text-[11px] text-dark-muted border border-dark-border
            rounded-md px-2.5 py-1 hover:text-dark-text transition-colors">
          View all
        </a>
      </div>
      {transactions.length === 0 ? (
        <p className="text-[13px] text-dark-muted py-6 text-center">
          No transactions yet.
        </p>
      ) : (
        <div className="flex flex-col gap-0.5">
          {transactions.map(tx => (
            <div key={tx.id}
              className="grid items-center gap-2.5 px-1.5 py-2
                rounded-lg hover:bg-white/[0.03] cursor-default"
              style={{ gridTemplateColumns: "28px 1fr auto" }}
            >
              <div className="w-7 h-7 rounded-[8px] flex items-center
                justify-center text-[13px] shrink-0"
                style={{ background: tx.type === "income"
                  ? ICON_BG.income : (ICON_BG[tx.category] ?? "#1e1e2e") }}
              >
                {tx.type === "income"
                  ? ICONS.income : (ICONS[tx.category] ?? "📋")}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] text-dark-text/80 truncate">
                  {tx.note ?? tx.category}
                </p>
                <p className="text-[11px] text-dark-sub mt-0.5">
                  {tx.category} · {new Date(tx.date)
                    .toLocaleDateString("id-ID",
                    { month: "short", day: "numeric" })}
                </p>
              </div>
              <span className={`text-[13px] font-medium whitespace-nowrap
                ${tx.type === "income" ? "text-dark-green" : "text-dark-red"}`}
              >
                {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}