"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { Transaction } from "@/types";
import type { Plan } from "@/types";

const COLORS = ["#4F46E5","#06B6D4","#10B981", "#F59E0B","#8B5CF6","#EC4899","#f87171","#94a3b8"];

export default function CategoryChart({ transactions, plan }: { transactions: Transaction[]; plan: Plan }) {
  const expenses = transactions.filter(t => t.type === "expense");
  const byCategory = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-surface border border-dark-border rounded-[10px] p-4 flex flex-col">
      <h2 className="text-[13px] font-medium text-dark-text/80 mb-3">
        By category
      </h2>
      {data.length === 0 ? (
        <p className="text-[13px] text-dark-muted mt-4 text-center">
          No expense data yet.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%"
                innerRadius={48} outerRadius={72}
                dataKey="value" paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i}
                    fill={COLORS[i % COLORS.length]}
                    stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) =>
                  new Intl.NumberFormat("id-ID", {
                    style: "currency", currency: "IDR",
                    minimumFractionDigits: 0
                  }).format(v)}
                contentStyle={{ background:"#1E2535",
                  border:"none", borderRadius:8,
                  color:"#E2E8F0", fontSize:12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className={`flex flex-col gap-1.5 mt-3
            ${plan === "free"
              ? "blur-[3px] pointer-events-none select-none" : ""}`}
          >
            {data.map(({ name, value }, i) => (
              <div key={name}
                className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-dark-text/70">
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: COLORS[i % COLORS.length] }} />
                  {name}
                </div>
                <span className="font-medium text-dark-text/80">
                  {value.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
          {plan === "free" && (
            <div className="mt-2 text-center">
              <a href="/billing"
                className="text-[11px] text-dark-indigo underline">
                Upgrade to see breakdown
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}