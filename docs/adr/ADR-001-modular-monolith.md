# ADR-001: Modular Monolith with Layered Feature Modules

Status: accepted (M0)
Date: 2026-10-27

## Context

Spendlytics is a one-user-at-a-time personal-finance SaaS (Next.js 16 App Router, Supabase, Stripe). The recovered codebase had all data access and business rules embedded in `"use server"` action functions, untyped and untestable. The PRD requires the MVP to ship as a single Next.js deployment.

Options considered:

1. **Plain Next.js** (route handlers + lib helpers) — what the recovered code had. Fails: business rules scattered, no enforced boundaries, hard to test money/quota logic.
2. **Microservices / separate backend** — explicitly prohibited by the PRD (single deployment, solo maintainer).
3. **Modular monolith with layered modules** — each domain lives in `src/features/<domain>` with three layers: `schema.ts` (Zod request validation), `service.ts` (business rules: quotas, entitlements, invariants), `repository.ts` (Supabase data access). Thin `"use server"` actions and route handlers sit on top and only wire auth context + revalidation.

## Decision

Option 3. Domains: `auth`, `budgets`, `transactions`, `reports`, `billing`.

Layering rules:

- UI components and server actions never call Supabase directly — only through a feature service.
- Services own business rules and invariants (money in whole IDR, quota checks, entitlement checks). They receive an authenticated `SupabaseClient` and `userId`; they never resolve auth themselves.
- Repositories own all SQL/table access and return plain data.
- Privileged writes (quota counters, subscription state) must live in server functions/SQL (RLS-enforced), never in client code — enforced by review until M7 adds pgTAP adversarial tests.

## Consequences

- Each milestone (M1–M6) fills in one or more feature modules without restructuring.
- Unit tests target services with a mocked repository; integration tests target repositories against a real Postgres (M7).
- The thin action layer keeps Next.js specifics (revalidatePath, cookies) out of business logic.
- Risk: layers can be bypassed by impatient edits; mitigated by CI checks (M7.6) and code review.
