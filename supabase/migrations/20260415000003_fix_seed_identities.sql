-- Fix: Add missing auth.identities records for seed users
-- Supabase GoTrue v2 requires auth.identities for signInWithPassword to work.
-- Direct INSERT into auth.users (as done by seed data) does NOT auto-create identities.

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
VALUES
-- Institute users
(
  gen_random_uuid(),
  'a0000000-0000-0000-0000-000000000001',
  jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000001', 'email', 'delhi.tech@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'a0000000-0000-0000-0000-000000000001',
  now(), now(), now()
),
(
  gen_random_uuid(),
  'a0000000-0000-0000-0000-000000000002',
  jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000002', 'email', 'mumbai.uni@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'a0000000-0000-0000-0000-000000000002',
  now(), now(), now()
),
-- Counselor users
(
  gen_random_uuid(),
  'b0000000-0000-0000-0000-000000000001',
  jsonb_build_object('sub', 'b0000000-0000-0000-0000-000000000001', 'email', 'dr.sharma@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'b0000000-0000-0000-0000-000000000001',
  now(), now(), now()
),
(
  gen_random_uuid(),
  'b0000000-0000-0000-0000-000000000002',
  jsonb_build_object('sub', 'b0000000-0000-0000-0000-000000000002', 'email', 'dr.patel@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'b0000000-0000-0000-0000-000000000002',
  now(), now(), now()
),
(
  gen_random_uuid(),
  'b0000000-0000-0000-0000-000000000003',
  jsonb_build_object('sub', 'b0000000-0000-0000-0000-000000000003', 'email', 'dr.gupta@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'b0000000-0000-0000-0000-000000000003',
  now(), now(), now()
),
-- Student users
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000001',
  jsonb_build_object('sub', 'c0000000-0000-0000-0000-000000000001', 'email', 'aarav.kumar@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'c0000000-0000-0000-0000-000000000001',
  now(), now(), now()
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000002',
  jsonb_build_object('sub', 'c0000000-0000-0000-0000-000000000002', 'email', 'meera.singh@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'c0000000-0000-0000-0000-000000000002',
  now(), now(), now()
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000003',
  jsonb_build_object('sub', 'c0000000-0000-0000-0000-000000000003', 'email', 'rohan.desai@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'c0000000-0000-0000-0000-000000000003',
  now(), now(), now()
),
(
  gen_random_uuid(),
  'c0000000-0000-0000-0000-000000000004',
  jsonb_build_object('sub', 'c0000000-0000-0000-0000-000000000004', 'email', 'ananya.joshi@example.com', 'email_verified', true, 'phone_verified', false),
  'email',
  'c0000000-0000-0000-0000-000000000004',
  now(), now(), now()
)
ON CONFLICT DO NOTHING;

-- Also reload PostgREST schema cache to ensure relationship queries work
NOTIFY pgrst, 'reload schema';
