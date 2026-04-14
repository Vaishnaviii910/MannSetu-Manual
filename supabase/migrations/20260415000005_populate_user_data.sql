-- Add forum posts and user data for deepbansal2745@gmail.com
-- to make the app look populated and polished

DO $$
DECLARE
  v_user_id uuid;
  v_student_id uuid;
  v_institute_id uuid;
  v_forum1 uuid;
  v_forum2 uuid;
  v_forum3 uuid;
  v_forum4 uuid;
  v_post1 uuid;
  v_post2 uuid;
  v_post3 uuid;
  v_post4 uuid;
  v_post5 uuid;
  v_post6 uuid;
  v_post7 uuid;
  v_post8 uuid;
BEGIN
  -- Get user and student IDs
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'deepbansal2745@gmail.com';
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User deepbansal2745@gmail.com not found, skipping';
    RETURN;
  END IF;

  SELECT id, institute_id INTO v_student_id, v_institute_id FROM public.students WHERE user_id = v_user_id;
  IF v_student_id IS NULL THEN
    RAISE NOTICE 'Student record not found for user, skipping';
    RETURN;
  END IF;

  -- Get forum IDs for this institute
  SELECT id INTO v_forum1 FROM public.forums WHERE institute_id = v_institute_id AND title = 'Exam Stress Support' LIMIT 1;
  SELECT id INTO v_forum2 FROM public.forums WHERE institute_id = v_institute_id AND title = 'Wellness & Self-Care' LIMIT 1;
  SELECT id INTO v_forum3 FROM public.forums WHERE institute_id = v_institute_id AND title = 'First-Year Adjustment' LIMIT 1;
  SELECT id INTO v_forum4 FROM public.forums WHERE institute_id = v_institute_id AND title = 'Career Anxiety' LIMIT 1;

  -- ============================================
  -- 1. MOOD ENTRIES (last 10 days — nice graph)
  -- ============================================
  INSERT INTO public.mood_entries (student_id, mood, notes, entry_date) VALUES
  (v_student_id, 'sad',       'Couldn''t sleep well, assignment pressure',        CURRENT_DATE - 9),
  (v_student_id, 'very_sad',  'Had a fight with roommate, feeling low',           CURRENT_DATE - 8),
  (v_student_id, 'sad',       'Still upset, skipped lunch',                        CURRENT_DATE - 7),
  (v_student_id, 'neutral',   'Talked to a friend, feeling slightly better',       CURRENT_DATE - 6),
  (v_student_id, 'neutral',   'Normal day, attended all classes',                  CURRENT_DATE - 5),
  (v_student_id, 'happy',     'Got good marks in surprise quiz!',                  CURRENT_DATE - 4),
  (v_student_id, 'happy',     'Evening walk with friends helped a lot',            CURRENT_DATE - 3),
  (v_student_id, 'very_happy','Finished project ahead of deadline',                CURRENT_DATE - 2),
  (v_student_id, 'happy',     'Productive day, meditated in the morning',          CURRENT_DATE - 1),
  (v_student_id, 'very_happy','Feeling great, optimistic about this week',         CURRENT_DATE);

  -- ============================================
  -- 2. PHQ-9 TEST RESULTS (2 tests over time)
  -- ============================================
  INSERT INTO public.phq_tests (student_id, score, answers, severity_level, recommendations, test_date) VALUES
  (v_student_id, 12, '[2, 1, 2, 1, 1, 2, 1, 1, 1]', 'Moderate',
   'Consider scheduling regular sessions with a counselor. Maintain a consistent sleep schedule and try mindfulness exercises.',
   now() - interval '21 days'),
  (v_student_id, 6, '[1, 1, 0, 1, 0, 1, 1, 0, 1]', 'Mild',
   'Your scores have improved! Keep up the positive habits. Light exercise and journaling can help maintain progress.',
   now() - interval '3 days');

  -- ============================================
  -- 3. GAD-7 TEST RESULTS (2 tests over time)
  -- ============================================
  INSERT INTO public.gad_7_tests (student_id, score, answers, severity_level, recommendations, test_date) VALUES
  (v_student_id, 14, '[2, 2, 2, 2, 2, 1, 2]', 'Moderate',
   'Your anxiety levels are moderate. We recommend speaking with a counselor and trying breathing exercises daily.',
   now() - interval '21 days'),
  (v_student_id, 5, '[1, 1, 0, 1, 1, 0, 1]', 'Mild',
   'Good improvement! Continue with relaxation techniques. Regular physical activity and social connection help reduce anxiety.',
   now() - interval '3 days');

  -- ============================================
  -- 4. REMINDERS
  -- ============================================
  INSERT INTO public.reminders (user_id, student_id, title, due_date, is_completed) VALUES
  (v_user_id, v_student_id, 'Take weekly GAD-7 assessment',          CURRENT_DATE + 4,  false),
  (v_user_id, v_student_id, 'Book follow-up counseling session',     CURRENT_DATE + 2,  false),
  (v_user_id, v_student_id, 'Complete mindfulness exercise',         CURRENT_DATE + 1,  false),
  (v_user_id, v_student_id, 'Journal about today''s feelings',       CURRENT_DATE,      false),
  (v_user_id, v_student_id, 'Morning meditation - 10 min',           CURRENT_DATE - 1,  true),
  (v_user_id, v_student_id, 'Read wellness article on sleep hygiene',CURRENT_DATE - 3,  true);

  -- ============================================
  -- 5. FORUM POSTS (spread across forums)
  -- ============================================
  v_post1 := gen_random_uuid();
  v_post2 := gen_random_uuid();
  v_post3 := gen_random_uuid();
  v_post4 := gen_random_uuid();
  v_post5 := gen_random_uuid();
  v_post6 := gen_random_uuid();
  v_post7 := gen_random_uuid();
  v_post8 := gen_random_uuid();

  IF v_forum1 IS NOT NULL THEN
    INSERT INTO public.forum_posts (id, forum_id, student_id, title, content, is_anonymous, user_id, created_at) VALUES
    (v_post1, v_forum1, v_student_id,
     'How do you deal with back-to-back exams?',
     'I have 3 exams in 5 days next week and I''m already feeling the pressure. Any tips for managing revision without burning out? I''ve tried timetables but I always end up falling behind.',
     false, v_user_id, now() - interval '3 days'),
    (v_post2, v_forum1, v_student_id,
     'Breathing techniques that actually work during exams',
     'Sharing something that helped me — the 4-7-8 breathing technique. Breathe in for 4 seconds, hold for 7, exhale for 8. I used it during my mid-terms and it genuinely calmed me down. Try it!',
     false, v_user_id, now() - interval '1 day');
  END IF;

  IF v_forum2 IS NOT NULL THEN
    INSERT INTO public.forum_posts (id, forum_id, student_id, title, content, is_anonymous, user_id, created_at) VALUES
    (v_post3, v_forum2, v_student_id,
     'Morning routine that changed my semester',
     'Started waking up at 6:30 AM, doing 15 min yoga, then journaling for 10 min before breakfast. It''s been 3 weeks and my focus in lectures has improved dramatically. Sharing in case it helps someone!',
     false, v_user_id, now() - interval '5 days'),
    (v_post4, v_forum2, v_student_id,
     'Best apps for meditation?',
     'Looking for a good free meditation app. I''ve tried Headspace but the free version is limited. Any recommendations from fellow students?',
     false, v_user_id, now() - interval '2 days');
  END IF;

  IF v_forum3 IS NOT NULL THEN
    INSERT INTO public.forum_posts (id, forum_id, student_id, title, content, is_anonymous, user_id, created_at) VALUES
    (v_post5, v_forum3, v_student_id,
     'Feeling homesick even after months',
     'It''s been almost a full semester and I still miss home every evening. The weekends are the worst. Is this normal? When does it actually get better?',
     true, v_user_id, now() - interval '6 days'),
    (v_post6, v_forum3, v_student_id,
     'Tips for making friends in a new city',
     'Joining the coding club was the best decision I made. If you''re struggling to find your people, try joining any club — even if the topic doesn''t fully interest you. It''s about the connections.',
     false, v_user_id, now() - interval '4 days');
  END IF;

  IF v_forum4 IS NOT NULL THEN
    INSERT INTO public.forum_posts (id, forum_id, student_id, title, content, is_anonymous, user_id, created_at) VALUES
    (v_post7, v_forum4, v_student_id,
     'Anyone else confused about placements vs higher studies?',
     'I''m in my 3rd year and everyone around me seems to have a plan. Some are grinding DSA for placements, others are preparing for GATE. I honestly have no idea what I want. Feeling lost.',
     true, v_user_id, now() - interval '7 days'),
    (v_post8, v_forum4, v_student_id,
     'Imposter syndrome is real',
     'Got selected for a good internship but I constantly feel like I don''t deserve it. Anyone else deal with this? How do you push through the self-doubt?',
     false, v_user_id, now() - interval '1 day');
  END IF;

  -- ============================================
  -- 6. FORUM REPLIES (self-replies / follow-ups)
  -- ============================================
  IF v_forum1 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, student_id, content, is_anonymous, created_at) VALUES
    (v_post1, v_student_id, 'Update: I tried the Pomodoro technique (25 min study, 5 min break) and it actually helped. Got through 2 subjects today!', false, now() - interval '2 days'),
    (v_post2, v_student_id, 'Also, progressive muscle relaxation before sleep has been a game changer for exam nights.', false, now() - interval '12 hours');
  END IF;

  IF v_forum2 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, student_id, content, is_anonymous, created_at) VALUES
    (v_post3, v_student_id, 'Week 4 update — still going strong! Added a 10-min evening walk too. Highly recommend.', false, now() - interval '1 day'),
    (v_post4, v_student_id, 'Found Insight Timer — it''s free and has tons of guided meditations. Loving it so far!', false, now() - interval '1 day');
  END IF;

  IF v_forum3 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, student_id, content, is_anonymous, created_at) VALUES
    (v_post5, v_student_id, 'Thanks everyone for the kind words. Booked a counseling session, hoping that helps.', true, now() - interval '4 days'),
    (v_post6, v_student_id, 'Also started a study group — it doubles as socializing and productivity!', false, now() - interval '2 days');
  END IF;

  IF v_forum4 IS NOT NULL THEN
    INSERT INTO public.forum_replies (post_id, student_id, content, is_anonymous, created_at) VALUES
    (v_post7, v_student_id, 'Spoke to the career counselor — they said it''s completely okay to be undecided. Taking it one step at a time.', true, now() - interval '5 days'),
    (v_post8, v_student_id, 'A senior told me "everyone feels like a fraud sometimes." That oddly helped. We''re all figuring it out.', false, now() - interval '6 hours');
  END IF;

  -- ============================================
  -- 7. FORUM REACTIONS (likes on own posts)
  -- ============================================
  INSERT INTO public.forum_post_reactions (post_id, user_id) VALUES
  (v_post3, v_user_id),
  (v_post6, v_user_id),
  (v_post8, v_user_id);

END $$;
