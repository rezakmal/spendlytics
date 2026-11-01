# Spendlytics

A personal finance tracker web app. Users sign up, create monthly budgets, and manually record income and expenses in Indonesian Rupiah (IDR). The dashboard visualizes spending against budget limits, and a free-tier usage quota keeps usage fair per account.

## How it works

- **Authentication** — Email/password sign-up and sign-in via Supabase Auth. Unauthenticated visitors are redirected to the sign-in page (`src/proxy.ts`).
- **Budgets** — Each user has one or more budgets with a monthly limit and per-category limits. The free tier is limited to 1 budget.
- **Transactions** — Users manually add income or expense entries. Each entry belongs to a budget and a category. The free tier allows 20 transactions per month; the quota is validated server-side in the transaction server actions.
- **Dashboard & reports** — The dashboard shows budget usage with charts (Recharts). Monthly reports are IDR-based. The analytics and billing pages are currently placeholders.
- **Pro subscription** — Stripe integration is planned for a paid tier (unlimited budgets/transactions, trends, CSV export). The `stripe` package is already installed; checkout is not wired up yet.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Runtime | Node.js 24 LTS + npm (see `.nvmrc`) |
| Auth & database | Supabase (Auth + PostgreSQL, `@supabase/ssr` for cookie-based sessions) |
| Payments | Stripe (planned) |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI primitives, Lucide icons, Recharts, sonner (toasts) |
| Validation | Zod |
| Code quality | ESLint 9, `tsc --noEmit` |

## Project structure

The codebase is a modular monolith. Each domain lives in `src/features/<domain>` with three layers:

```
src/
├── app/                  # App Router pages & API routes
│   ├── (auth)/           # sign-in / sign-up
│   ├── dashboard/        # main dashboard
│   ├── transactions/     # transaction list
│   ├── analytics/        # placeholder
│   ├── billing/          # placeholder
│   └── api/v1/health     # health check endpoint
├── features/
│   ├── auth/             # schema.ts, service.ts, repository.ts
│   ├── budgets/          # same 3-layer pattern
│   ├── transactions/     # same 3-layer pattern
│   ├── reports/          # stub
│   └── billing/          # stub
├── components/           # shared UI components
├── lib/                  # env validation, server actions, Supabase clients
├── proxy.ts              # auth guard / route redirection (Next.js proxy)
└── types/
```

Layer responsibilities:

- `schema.ts` — Zod input validation
- `service.ts` — business rules (e.g. quota checks)
- `repository.ts` — database access via Supabase

Thin `"use server"` actions in `src/lib/action.ts` only wire auth context and revalidation. See [docs/adr/ADR-001-modular-monolith.md](docs/adr/ADR-001-modular-monolith.md) for the full rationale.

## Running locally

Prerequisites: Node.js 24 LTS and npm.

```bash
npm ci
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase project values:

```bash
NEXT_PUBLIC_SUPABASE_URL=        # from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # public anon key, safe for the browser
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=       # server-only, never commit this
```

Then start the dev server:

```bash
npm run dev
```

Open http://localhost:3000. Health check: http://localhost:3000/api/v1/health

### Database setup

The app expects `profiles`, `budgets`, and `transactions` tables to already exist in your Supabase project. Migrations and Row Level Security policies are not yet included in this repo — create the tables in the Supabase dashboard (or SQL editor) before using the app.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check without emitting |

## CI

Every push to `main` or `development` and every pull request runs the pipeline in `.github/workflows/ci.yml`: install → lint → typecheck → build (with placeholder Supabase env vars).

## Known limitations

- Free-tier quota checks (20 tx/month, 1 budget) are validated server-side but are **not atomic** — concurrent requests could bypass them.
- Month boundaries for the quota use server-local time, not Asia/Jakarta.
- Money amounts are handled as JS numbers in the UI; high-precision decimal handling is not implemented yet.
- `/transactions`, `/analytics`, and `/billing` are placeholder pages.
- Out of scope by design: bank account linking, OCR receipt scanning, AI insights, recurring entries, multi-currency.

## Documentation

- [docs/M0-audit.md](docs/M0-audit.md) — repository audit and baseline decisions
- [docs/adr/ADR-001-modular-monolith.md](docs/adr/ADR-001-modular-monolith.md) — architecture decision record
