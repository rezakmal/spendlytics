import Link from "next/link";

export default function UpgradeBanner() {
  return (
    <div className="border border-[#3730a3] rounded-[10px] px-4 py-3.5
      flex items-center justify-between gap-3"
      style={{ background: "linear-gradient(135deg,#1e1b4b,#131720)" }}
    >
      <div>
        <p className="text-[12px] font-medium text-dark-indigo">
          Unlock the full Analytics page
        </p>
        <p className="text-[11px] text-[#4338ca] mt-0.5">
          Monthly trends, export, and unlimited budgets with Pro
        </p>
      </div>
      <Link href="/billing"
        className="shrink-0 text-[12px] font-medium bg-dark-primary
          text-white px-3.5 py-1.5 rounded-lg whitespace-nowrap
          hover:bg-indigo-500 transition-colors">
        Upgrade — Rp 75.000
      </Link>
    </div>
  )
}