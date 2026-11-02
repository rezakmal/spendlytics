-- M1.1 (REZ-210): Target schema for Spendlytics MVP.
-- Types are strict: UUID PKs, BIGINT money, DATE for calendar days,
-- TIMESTAMPTZ for instants, CHECK constraints for domain rules.

create extension if not exists pgcrypto;

-- ─────────────────────────────── profiles ───────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  plan        text not null default 'free' check (plan in ('free', 'pro')),
  currency    text not null default 'IDR' check (currency = 'IDR'),
  timezone    text not null default 'Asia/Jakarta',
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────── budgets ────────────────────────────────

create table public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 1 and 80),
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

create unique index budgets_one_primary_per_user
  on public.budgets (user_id) where is_primary;

-- Composite FK targets (budgets.id, budgets.user_id) require uniqueness.
create unique index budgets_id_user_key
  on public.budgets (id, user_id);

-- ──────────────────────────── budget_limits ─────────────────────────────

create table public.budget_limits (
  budget_id     uuid not null,
  user_id       uuid not null,
  category      text not null check (char_length(btrim(category)) between 1 and 40),
  monthly_limit bigint not null check (monthly_limit >= 0),
  primary key (budget_id, category),
  foreign key (budget_id, user_id)
    references public.budgets (id, user_id) on delete cascade
);

-- ──────────────────────────── transactions ──────────────────────────────

create table public.transactions (
  id           uuid primary key default gen_random_uuid(),
  budget_id    uuid not null,
  user_id      uuid not null,
  amount       bigint not null check (amount > 0),
  type         text not null check (type in ('income', 'expense')),
  category     text not null check (char_length(btrim(category)) between 1 and 40),
  note         text,
  occurred_on  date not null,
  created_at   timestamptz not null default now(),
  foreign key (budget_id, user_id)
    references public.budgets (id, user_id) on delete cascade
);

create index transactions_owner_date_idx
  on public.transactions (user_id, occurred_on desc, id);

-- ──────────────────────────── usage_monthly ─────────────────────────────
-- Written only by trusted server-side functions (RLS denies client access;
-- atomic counter logic lands in M3.3).

create table public.usage_monthly (
  user_id   uuid not null references auth.users (id) on delete cascade,
  month     date not null,
  tx_count  integer not null default 0 check (tx_count >= 0),
  primary key (user_id, month)
);

-- ────────────────────────── stripe_customers ────────────────────────────

create table public.stripe_customers (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at       timestamptz not null default now()
);

-- ──────────────────────────── subscriptions ─────────────────────────────

create table public.subscriptions (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users (id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_price_id      text not null,
  status               text not null,
  current_period_end   timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ───────────────────────── stripe_webhook_events ────────────────────────

create table public.stripe_webhook_events (
  stripe_event_id text primary key,
  type            text not null,
  processed_at    timestamptz not null default now()
);

-- ──────────────────────────── auth trigger ──────────────────────────────
-- Every confirmed signup gets exactly one Free profile, idempotently.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Guard: tier/currency/timezone/owner can only change via trusted paths
-- (service role), never from the client. Enforced together with RLS.

create or replace function public.prevent_profile_privilege_escalation()
returns trigger
language plpgsql
as $$
begin
  if current_setting('request.jwt.claims', true) is not null
     and coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'role'), '') = 'authenticated'
  then
    if new.plan is distinct from old.plan
       or new.currency is distinct from old.currency
       or new.timezone is distinct from old.timezone
       or new.id is distinct from old.id
    then
      raise exception 'Forbidden: plan, currency, timezone and id are read-only';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_no_client_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_privilege_escalation();
