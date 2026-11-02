-- M1.1/M1.7 (REZ-210, REZ-216): disposable fixtures.
-- Two confirmed users (A and B) with known passwords for local dev and tests.
-- Password for both: password123
-- The handle_new_user trigger creates their Free profiles automatically.

insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password,
   email_confirmed_at, created_at, updated_at,
   raw_app_meta_data, raw_user_meta_data, is_super_admin,
   confirmation_token, recovery_token,
   email_change_token_current, email_change_token_new, phone_change_token,
   reauthentication_token, email_change)
values
  ('00000000-0000-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated',
   'usera@example.com', crypt('password123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"User A"}', false,
   '', '', '', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated',
   'userb@example.com', crypt('password123', gen_salt('bf')),
   now(), now(), now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"User B"}', false,
   '', '', '', '', '', '', '');

-- User A: primary budget "Daily" with category allocations (PRD fixture).
insert into public.budgets (id, user_id, name, is_primary)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '11111111-1111-1111-1111-111111111111',
        'Daily', true);

insert into public.budget_limits (budget_id, user_id, category, monthly_limit)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111', 'Food', 500000),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111', 'Transport', 300000);

-- User A: October 2026 fixture (income 6.000.000, expense 1.450.000).
insert into public.transactions
  (id, budget_id, user_id, amount, type, category, note, occurred_on)
values
  ('b1111111-1111-4111-8111-111111111111',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   6000000, 'income', 'Salary', 'October salary', '2026-10-01'),
  ('b1111111-1111-4111-8111-111111111112',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   850000, 'expense', 'Food', 'Groceries', '2026-10-05'),
  ('b1111111-1111-4111-8111-111111111113',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   600000, 'expense', 'Transport', 'Fuel', '2026-10-12');

-- User B: a private budget + transaction, used to prove cross-user isolation.
insert into public.budgets (id, user_id, name, is_primary)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '22222222-2222-2222-2222-222222222222',
        'Personal', true);

insert into public.transactions
  (id, budget_id, user_id, amount, type, category, note, occurred_on)
values
  ('c2222222-2222-4222-8222-222222222222',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   '22222222-2222-2222-2222-222222222222',
   100000, 'expense', 'Food', 'User B lunch', '2026-10-07');
