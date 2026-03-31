"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, BarChart2, CreditCard, User } from "lucide-react";
import type { Plan } from "@/types";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: List },
  { href: "/analytics", label: "Analytics", icon: BarChart2, proOnly: true }
];

const ACCOUNT = [
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ plan }: { plan: Plan }) {
  const pathname = usePathname();
  
  return (
    <aside className="w-[220px] bg-sidebar border-r border-dark-border flex flex-col shrink-0">
      <p className="px-[18px] pt-4 pb-1 text-[10px] font-medium text-dark-border uppercase tracking-widest">
        Menu
      </p>
      {NAV.map(({ href, label, icon: Icon, proOnly }) => {
        const locked = proOnly && plan === "free";
        const active = pathname === href;
        return (
          <Link key={href} href={locked ? "/billing" : href}
          className={`flex items-center gap-[10px] px-[18px] py-[9px]
                text-[13px] transition-colors border-r-2
                ${active
            ? "text-dark-indigo bg-dark-primary/10 border-dark-primary"
            : "text-dark-muted border-transparent hover:text-dark-text/70"}
                ${locked ? "opacity-40" : ""}`}
            >
            <Icon size={15} strokeWidth={1.8} />
            {label}
            {locked && (
              <span className="ml-auto text-[10px] bg-dark-plight text-dark-primary px-[6px] py-[2px] rounded">
                Pro
              </span>
            )}
            </Link>
          );
        })}
    </aside>
  );
}