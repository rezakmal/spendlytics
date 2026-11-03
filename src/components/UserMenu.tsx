"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/lib/action";

export default function UserMenu({ email, initials }: { email: string; initials: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded-full bg-dark-primary
          flex items-center justify-center text-[11px] font-medium text-white"
        aria-label="Account menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-dark-border
          bg-surface shadow-lg py-1 z-50">
          <p className="px-3 py-2 text-[11px] text-dark-muted truncate border-b border-dark-border">
            {email}
          </p>
          <Link href="/settings"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-[13px] text-dark-text hover:bg-dark-primary/10">
            Settings
          </Link>
          <form action={signOutAction}>
            <button type="submit"
              className="w-full text-left px-3 py-2 text-[13px] text-dark-red hover:bg-dark-primary/10">
              Log out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
