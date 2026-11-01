const fmt  = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function SummaryCards({ income, expense }: { income: number; expense: number }) {
  const net = income - expense;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Total income",   value: fmt(income),  sub: "+12% from last month", cls: "text-dark-green"  },
        { label: "Total expenses", value: fmt(expense), sub: "+5% from last month",  cls: "text-dark-red"    },
        { label: "Net balance",    value: fmt(net),
          sub: `Savings rate ${savingsRate}%`,
          cls: net >= 0 ? "text-dark-indigo" : "text-dark-red" },
      ].map(({ label, value, sub, cls }) => (
        <div key={label}
          className="bg-surface border border-dark-border rounded-[10px] px-4 py-3.5">
          <p className="text-[11px] font-medium text-dark-sub uppercase
            tracking-[0.04em] mb-2">{label}</p>
          <p className={`text-[22px] font-medium ${cls}`}>{value}</p>
          <p className="text-[11px] text-dark-border mt-1">{sub}</p>
        </div>
      ))}
    </div>
  );
}