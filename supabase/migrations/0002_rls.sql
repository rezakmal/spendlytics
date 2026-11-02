-- M1.2 (REZ-211): Row Level Security.
-- Client (anon/authenticated) can only ever touch rows it owns; quota,
-- billing and webhook state are service-role only.

alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_limits enable row level security;
alter table public.transactions enable row level security;
alter table public.usage_monthly enable row level security;
alter table public.stripe_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

-- ── profiles: owner only, display_name editable ──────────────────────────

create policy profiles_select_own on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── budgets: owner full CRUD ─────────────────────────────────────────────

create policy budgets_select_own on public.budgets
  for select to authenticated using (auth.uid() = user_id);

create policy budgets_insert_own on public.budgets
  for insert to authenticated with check (auth.uid() = user_id);

create policy budgets_update_own on public.budgets
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy budgets_delete_own on public.budgets
  for delete to authenticated using (auth.uid() = user_id);

-- ── budget_limits: owner full CRUD ───────────────────────────────────────

create policy budget_limits_select_own on public.budget_limits
  for select to authenticated using (auth.uid() = user_id);

create policy budget_limits_insert_own on public.budget_limits
  for insert to authenticated with check (auth.uid() = user_id);

create policy budget_limits_update_own on public.budget_limits
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy budget_limits_delete_own on public.budget_limits
  for delete to authenticated using (auth.uid() = user_id);

-- ── transactions: owner full CRUD ────────────────────────────────────────

create policy transactions_select_own on public.transactions
  for select to authenticated using (auth.uid() = user_id);

create policy transactions_insert_own on public.transactions
  for insert to authenticated with check (auth.uid() = user_id);

create policy transactions_update_own on public.transactions
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy transactions_delete_own on public.transactions
  for delete to authenticated using (auth.uid() = user_id);

-- ── service-role-only tables: deny every client operation ────────────────

create policy usage_monthly_deny_all on public.usage_monthly
  for all to anon, authenticated using (false) with check (false);

create policy stripe_customers_deny_all on public.stripe_customers
  for all to anon, authenticated using (false) with check (false);

create policy subscriptions_deny_all on public.subscriptions
  for all to anon, authenticated using (false) with check (false);

create policy stripe_webhook_events_deny_all on public.stripe_webhook_events
  for all to anon, authenticated using (false) with check (false);
