-- M1.2 (REZ-211): RLS isolation + privilege-escalation guards (pgTAP).
-- Runs against a disposable test DB seeded with fixtures from seed.sql.

begin;
select plan(12);

-- ── helper: act as a given user ──────────────────────────────────────────
-- We impersonate via the claims Supabase itself injects on every request.

select set_config('role', 'authenticated', false);
select set_config('request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}',
  false);

-- 1. User A reads own profile
select is(
  (select count(*) from public.profiles
    where id = '11111111-1111-1111-1111-111111111111'),
  1::bigint, 'user A can select own profile');

-- 2. User A cannot read User B's profile
select is(
  (select count(*) from public.profiles
    where id = '22222222-2222-2222-2222-222222222222'),
  0::bigint, 'user A cannot select user B profile');

-- 3. User A cannot read User B's transactions
select is(
  (select count(*) from public.transactions
    where user_id = '22222222-2222-2222-2222-222222222222'),
  0::bigint, 'user A cannot select user B transactions');

-- 4. User A sees own October fixture (3 rows)
select is(
  (select count(*) from public.transactions
    where user_id = '11111111-1111-1111-1111-111111111111'),
  3::bigint, 'user A sees own transactions');

-- 5. Composite FK stops a forged owner: act as user B but reference
--    user A's budget. RLS passes (row claims user_id = B); the FK must not.
select set_config('request.jwt.claims',
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}',
  false);

select throws_ok(
  $$ insert into public.transactions
       (budget_id, user_id, amount, type, category, occurred_on)
     values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
             '22222222-2222-2222-2222-222222222222',
             1000, 'expense', 'Food', '2026-10-08') $$,
  '23503', null, 'forged-owner transaction rejected by composite FK');

select set_config('request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}',
  false);

-- 6. Invalid type rejected by CHECK
select throws_ok(
  $$ insert into public.transactions
       (budget_id, user_id, amount, type, category, occurred_on)
     values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
             '11111111-1111-1111-1111-111111111111',
             1000, 'refund', 'Food', '2026-10-08') $$,
  '23514', null, 'invalid transaction type rejected');

-- 7. Non-positive amount rejected by CHECK
select throws_ok(
  $$ insert into public.transactions
       (budget_id, user_id, amount, type, category, occurred_on)
     values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
             '11111111-1111-1111-1111-111111111111',
             0, 'expense', 'Food', '2026-10-08') $$,
  '23514', null, 'zero amount rejected');

-- 8. Client cannot self-assign Pro
select throws_ok(
  $$ update public.profiles
       set plan = 'pro'
     where id = '11111111-1111-1111-1111-111111111111' $$,
  'P0001', null, 'client cannot escalate own plan to pro');

-- 9. Client cannot write usage_monthly
select throws_ok(
  $$ insert into public.usage_monthly (user_id, month, tx_count)
     values ('11111111-1111-1111-1111-111111111111', '2026-10-01', 5) $$,
  '42501', null, 'usage_monthly denied to clients');

-- 10. Client cannot write subscriptions
select throws_ok(
  $$ insert into public.subscriptions
       (user_id, stripe_subscription_id, stripe_price_id, status)
     values ('11111111-1111-1111-1111-111111111111',
             'sub_test', 'price_test', 'active') $$,
  '42501', null, 'subscriptions denied to clients');

-- 11. Client cannot write stripe_customers
select throws_ok(
  $$ insert into public.stripe_customers (user_id, stripe_customer_id)
     values ('11111111-1111-1111-1111-111111111111', 'cus_test') $$,
  '42501', null, 'stripe_customers denied to clients');

-- 12. Client cannot write stripe_webhook_events
select throws_ok(
  $$ insert into public.stripe_webhook_events (stripe_event_id, type)
     values ('evt_test', 'customer.subscription.updated') $$,
  '42501', null, 'stripe_webhook_events denied to clients');

select * from finish();
rollback;
