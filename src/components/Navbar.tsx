import type { Plan } from "@/types";

export default function Navbar({ email, plan }: {email: string, plan: Plan}) {
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <header className="h-[52px] bg-base border-b border-dark-border flex items-center justify-between px-5 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-[26px] h-[26px] bg-dark-primary rounded-[7px]
          flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="2">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <span className="text-[15px] font-medium text-dark-text">Budgr</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-medium bg-dark-plight text-dark-indigo
          px-[10px] py-[3px] rounded-full border border-[#3730a3]">
          {plan === "pro" ? "Pro plan" : "Free plan"}
        </span>
        <div className="w-7 h-7 rounded-full bg-dark-primary
          flex items-center justify-center text-[11px] font-medium text-white">
          {initials}
        </div>
      </div>
    </header>
  );
}