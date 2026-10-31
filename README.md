# Spendlytics

Personal finance tracker (MVP) — one-user-at-a-time budgets, manual income/expense tracking, IDR monthly reports, Free quotas, and an optional Stripe Pro subscription.

**Status: M0 (repository recovery & foundation) complete.** Authentication, budgets, and transactions have a working UI wired to Supabase, but the database schema, RLS policies, and real business rules land in M1–M3 — see "Honest status" below.

## Stack

- Node.js 24 LTS + npm (Bun was removed in M0)
- Next.js 16 (App Router, React 19, strict TypeScript)
- Supabase (Auth + PostgreSQL, RLS + migrations in M1)
- Stripe Checkout/Portal/webhooks (M5)
- Zod, Vitest + Playwright + pgTAP (test baseline lands in M7)

## Architecture

Modular monolith: each domain lives in `src/features/<domain>` with three layers — `schema.ts` (Zod validation), `service.ts` (business rules), `repository.ts` (Supabase access). Thin `"use server"` actions in `src/lib/action.ts` and route handlers only wire auth context and revalidation. See [docs/adr/ADR-001-modular-monolith.md](docs/adr/ADR-001-modular-monolith.md).

Domains: `auth`, `budgets`, `transactions` (vertical slice implemented), `reports` and `billing` (stubs).

## Getting started

Requires Node 24 (see `.nvmrc`) and npm.

```bash
npm ci
cp .env.example .env.local   # fill in Supabase values
npm run dev
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`.

## Roadmap (gated milestones)

| Milestone | Deliverable |
|---|---|
| M0 | Runnable Node/npm foundation ← **current** |
| M1 | PostgreSQL schema, RLS, Supabase SSR auth |
| M2 | Budget CRUD, primary budget, category limits |
| M3 | Transaction CRUD, atomic Free quota, idempotency |
| M4 | Monthly dashboard & reports |
| M5 | Stripe subscription lifecycle |
| M6 | Pro trends & CSV export |
| M7 | Contracts, security & CI verification |
| M8 | 32-step UAT & MVP release |

## Honest status (known gaps)

- Quota checks (20 tx/month Free, 1 budget Free) exist but are **non-atomic** and month logic is server-local, not Asia/Jakarta — fixed in M3.3.
- No database migrations or RLS policies exist yet; the app expects `profiles`, `budgets`, `transactions` tables to already exist in Supabase.
- Money amounts are handled as JS numbers in the UI — BIGINT/decimal-string handling lands with M3.1.
- `/transactions`, `/analytics`, `/billing` are placeholder pages until M3/M4/M6.
- The authoritative spec is the Spendlytics PRD (v1.0); out-of-scope items (bank linking, OCR, AI insights, recurring entries, multi-currency, microservices, …) are deliberately excluded.

## Documentation

- [docs/M0-audit.md](docs/M0-audit.md) — repository audit and baseline decision
- [docs/adr/ADR-001-modular-monolith.md](docs/adr/ADR-001-modular-monolith.md) — architecture decision record
