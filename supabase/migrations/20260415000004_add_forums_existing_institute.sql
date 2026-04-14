-- Add forums to the existing (non-seed) institute
-- Finds the institute that isn't one of the seed institutes and creates forums for it

INSERT INTO public.forums (id, institute_id, title, description, is_active)
SELECT
  gen_random_uuid(),
  i.id,
  t.title,
  t.description,
  true
FROM public.institutes i
CROSS JOIN (
  VALUES
    ('Exam Stress Support', 'A safe space to share and discuss exam-related stress and coping strategies.'),
    ('Wellness & Self-Care', 'Share tips, routines, and resources for maintaining mental wellness.'),
    ('First-Year Adjustment', 'Discussions about adjusting to college life, homesickness, and making friends.'),
    ('Career Anxiety', 'Talk about placement worries, career confusion, and future planning stress.')
) AS t(title, description)
WHERE i.user_id NOT IN (
  'a0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002'
);
