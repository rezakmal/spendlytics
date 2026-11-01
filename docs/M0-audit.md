# M0.1 — Repository Audit & Baseline Decision (REZ-203)

Date: 2026-10-27
Baseline branch: `development` (already contains all `feature` work via PR #4 — verified `git merge feature` = "Already up to date").

## Branch inventory

- `main` — create-next-app scaffold + early Supabase clients/middleware/types. Historical only.
- `development` — **selected baseline.** Contains `main` work plus dashboard, auth pages, components, server actions, tailwind config.
- `feature` — fully merged into `development` (PRs #3, #4). No unique commits.

## Keep / refactor / remove

### Keep

- `src/lib/supabase/{client,server}.ts` — thin @supabase/ssr wrappers (env key usage reviewed below).
- `src/components/ui/*` — shadcn primitives (button, card, dialog, input, label, select, sheet, badge, sonner).
- `src/components/{Navbar,Sidebar,SummaryCards,CategoryChart,BudgetUsage,TransactionList,AddTransactionModal}.tsx` — usable UI; minor link fixes only.
- `src/app/auth/{sign-in,sign-up}/page.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/layout.tsx`.
- `src/middleware.ts` — logic sound; needs rename per Next 16 convention and matcher review (M0.3).
- `tailwind.config.ts`, `components.json`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`.

### Refactor (this milestone)

- `src/app/dashboard/dashboard.page.tsx` → `src/app/dashboard/page.tsx` (wrong filename; never became a route).
- `src/app/dashboard/{transactions,analytics,billing}-page.tsx` — **empty files (0 lines)**; delete and create real routes in M0.3.
- `src/lib/action.ts` — "use server" actions with embedded quota logic and no validation; becomes the vertical slice for the feature service layer in M0.4.
- `.env.example` — key name mismatch (`NEXT_PUBLIC_SUPABASE_ANON` vs code's `NEXT_PUBLIC_SUPABASE_ANON_KEY`); Midtrans vars to be removed (M0.2).

### Remove (this milestone)

- `bun.lock`, package.json Bun fields (`ignoreScripts`, `trustedDependencies`) — Bun runtime/package manager.
- `midtrans-client`, `@types/midtrans-client` dependencies.
- `src/lib/midtrans.ts`, `src/app/api/midtrans/`, `src/app/api/webhooks/midtrans/` — **all empty stub files (0 lines)**; Midtrans is not in the target stack (Stripe per PRD).

## Known defects recorded (honest status for README, fixed in M0.2–M0.3)

1. Dashboard route 404s (misnamed page file).
2. `/transactions`, `/analytics`, `/billing` routes don't exist; middleware guards them anyway.
3. Bun lockfile and Bun-only package.json fields.
4. Midtrans remnants (empty files + deps + env vars).
5. No `typecheck` script, no CI, no health endpoint, no ADR.
6. `.env.example` / code env-key mismatch.
7. Quota logic in `action.ts` is non-atomic and unvalidated (real fix is M3; M0 only re-homes the code).

## DB preservation

No migrations, schema files, or seed data exist in the repo; nothing destructive is possible from the codebase. Existing deployed Supabase data inspection is deferred to M1.7/M8.2 (local DB harness / migration backup playbooks) where the tooling exists to do it safely.
