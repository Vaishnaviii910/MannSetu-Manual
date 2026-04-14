-- Seed data for MannSetu
-- All users have password: password123

-- ============================================
-- 1. INSTITUTE USERS (create first, triggers will create profile + institute)
-- ============================================

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, recovery_token,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'delhi.tech@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "institute", "instituteName": "Delhi Technical University", "address": "Shahbad Daulatpur, Delhi-110042", "phone": "9876543210", "website": "https://dtu.ac.in", "description": "Premier technical university in Delhi"}',
  now(), now()
),
(
  'a0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'mumbai.uni@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "institute", "instituteName": "Mumbai National Institute", "address": "Powai, Mumbai-400076", "phone": "9876543211", "website": "https://mni.ac.in", "description": "Leading research institute in Mumbai"}',
  now(), now()
);

-- Wait for triggers to fire and get the institute IDs
-- Now fetch the auto-created institute IDs for subsequent inserts

-- ============================================
-- 2. COUNSELOR USERS (triggers create profile + counselor)
-- ============================================

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, recovery_token,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'dr.sharma@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'counselor',
    'institute_id', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000001'),
    'full_name', 'Dr. Priya Sharma',
    'speciality', 'Anxiety & Stress Management',
    'qualifications', 'Ph.D. Clinical Psychology, NIMHANS',
    'phone', '9876500001',
    'experience_years', 8,
    'bio', 'Specializes in helping students manage academic stress, anxiety, and building resilience.'
  ),
  now(), now()
),
(
  'b0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'dr.patel@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'counselor',
    'institute_id', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000001'),
    'full_name', 'Dr. Rajesh Patel',
    'speciality', 'Depression & Mood Disorders',
    'qualifications', 'M.D. Psychiatry, AIIMS Delhi',
    'phone', '9876500002',
    'experience_years', 12,
    'bio', 'Expert in mood disorders, depression, and emotional wellness with a focus on young adults.'
  ),
  now(), now()
),
(
  'b0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'dr.gupta@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'counselor',
    'institute_id', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000002'),
    'full_name', 'Dr. Neha Gupta',
    'speciality', 'Relationship & Social Anxiety',
    'qualifications', 'M.Phil Clinical Psychology, TISS Mumbai',
    'phone', '9876500003',
    'experience_years', 5,
    'bio', 'Helps students navigate relationship issues, social anxiety, and peer pressure.'
  ),
  now(), now()
);

-- ============================================
-- 3. STUDENT USERS (triggers create profile + student)
-- ============================================

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, recovery_token,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'aarav.kumar@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'student',
    'studentId', 'STU20260001',
    'fullName', 'Aarav Kumar',
    'instituteId', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000001'),
    'dateOfBirth', '2004-03-15',
    'phone', '9876600001',
    'emergencyContact', 'Vikram Kumar',
    'emergencyPhone', '9876600010'
  ),
  now(), now()
),
(
  'c0000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'meera.singh@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'student',
    'studentId', 'STU20260002',
    'fullName', 'Meera Singh',
    'instituteId', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000001'),
    'dateOfBirth', '2003-07-22',
    'phone', '9876600002',
    'emergencyContact', 'Sunita Singh',
    'emergencyPhone', '9876600020'
  ),
  now(), now()
),
(
  'c0000000-0000-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'rohan.desai@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'student',
    'studentId', 'STU20260003',
    'fullName', 'Rohan Desai',
    'instituteId', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000002'),
    'dateOfBirth', '2004-11-08',
    'phone', '9876600003',
    'emergencyContact', 'Amit Desai',
    'emergencyPhone', '9876600030'
  ),
  now(), now()
),
(
  'c0000000-0000-0000-0000-000000000004',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'ananya.joshi@example.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), '', '',
  '{"provider": "email", "providers": ["email"]}',
  jsonb_build_object(
    'role', 'student',
    'studentId', 'STU20260004',
    'fullName', 'Ananya Joshi',
    'instituteId', (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000002'),
    'dateOfBirth', '2005-01-30',
    'phone', '9876600004',
    'emergencyContact', 'Deepa Joshi',
    'emergencyPhone', '9876600040'
  ),
  now(), now()
);

-- ============================================
-- 3b. AUTH IDENTITIES (required for signInWithPassword to work)
-- ============================================

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
);

-- ============================================
-- 4. COUNSELOR AVAILABILITY (weekly schedules)
-- ============================================

INSERT INTO public.counselor_availability (counselor_id, day_of_week, start_time, end_time, is_active) VALUES
-- Dr. Sharma: Mon-Fri 9am-5pm
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000001'), 1, '09:00', '17:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000001'), 2, '09:00', '17:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000001'), 3, '09:00', '17:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000001'), 4, '09:00', '17:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000001'), 5, '09:00', '17:00', true),
-- Dr. Patel: Mon, Wed, Fri 10am-4pm
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000002'), 1, '10:00', '16:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000002'), 3, '10:00', '16:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000002'), 5, '10:00', '16:00', true),
-- Dr. Gupta: Tue-Thu 11am-6pm
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000003'), 2, '11:00', '18:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000003'), 3, '11:00', '18:00', true),
((SELECT id FROM public.counselors WHERE user_id = 'b0000000-0000-0000-0000-000000000003'), 4, '11:00', '18:00', true);

-- ============================================
-- 5. FORUMS
-- ============================================

INSERT INTO public.forums (id, institute_id, title, description, is_active) VALUES
(
  'f0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000001'),
  'Exam Stress Support',
  'A safe space to share and discuss exam-related stress and coping strategies.',
  true
),
(
  'f0000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000001'),
  'Wellness & Self-Care',
  'Share tips, routines, and resources for maintaining mental wellness.',
  true
),
(
  'f0000000-0000-0000-0000-000000000003',
  (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000002'),
  'First-Year Adjustment',
  'Discussions about adjusting to college life, homesickness, and making friends.',
  true
),
(
  'f0000000-0000-0000-0000-000000000004',
  (SELECT id FROM public.institutes WHERE user_id = 'a0000000-0000-0000-0000-000000000002'),
  'Career Anxiety',
  'Talk about placement worries, career confusion, and future planning stress.',
  true
);

-- ============================================
-- 6. FORUM POSTS
-- ============================================

INSERT INTO public.forum_posts (id, forum_id, student_id, title, content, is_anonymous, user_id) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'f0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'),
  'How do you handle back-to-back exams?',
  'I have 3 exams in 4 days next week and I am already feeling overwhelmed. Any tips on how to manage the preparation without burning out?',
  false,
  'c0000000-0000-0000-0000-000000000001'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'f0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'),
  'Panic attacks before exams',
  'I have been getting panic attacks the night before every exam. Has anyone else dealt with this? What helped you?',
  true,
  'c0000000-0000-0000-0000-000000000002'
),
(
  'd0000000-0000-0000-0000-000000000003',
  'f0000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'),
  'Morning routine that changed my life',
  'Started waking up at 6 AM, doing 15 min meditation, and journaling. My anxiety levels have dropped significantly. Sharing in case it helps someone!',
  false,
  'c0000000-0000-0000-0000-000000000001'
),
(
  'd0000000-0000-0000-0000-000000000004',
  'f0000000-0000-0000-0000-000000000003',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000003'),
  'Missing home a lot',
  'It has been 2 months since I moved here and I still feel homesick every evening. Is this normal? When does it get better?',
  false,
  'c0000000-0000-0000-0000-000000000003'
),
(
  'd0000000-0000-0000-0000-000000000005',
  'f0000000-0000-0000-0000-000000000004',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000004'),
  'No idea what career to choose',
  'Everyone around me seems to know what they want to do. I am in 2nd year and still have no clue. Feeling lost and anxious about placements.',
  true,
  'c0000000-0000-0000-0000-000000000004'
);

-- ============================================
-- 7. FORUM REPLIES
-- ============================================

INSERT INTO public.forum_replies (post_id, student_id, content, is_anonymous) VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'),
  'I break my study sessions into 45 min blocks with 15 min breaks. Also, I prioritize subjects by difficulty. The Pomodoro technique really helps!',
  false
),
(
  'd0000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'),
  'I used to get them too. Deep breathing exercises (4-7-8 technique) before bed helped me a lot. Also, try to avoid studying right before sleeping.',
  false
),
(
  'd0000000-0000-0000-0000-000000000004',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000004'),
  'Totally normal! I felt the same way. It got better for me around month 3-4. Try joining clubs or study groups - it really helps to build a new support system.',
  false
),
(
  'd0000000-0000-0000-0000-000000000005',
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000003'),
  'Same here! I spoke with a counselor about this and they helped me explore my interests. Highly recommend booking a session - it gave me clarity.',
  false
);

-- ============================================
-- 8. MOOD ENTRIES (last 7 days for some students)
-- ============================================

INSERT INTO public.mood_entries (student_id, mood, notes, entry_date) VALUES
-- Aarav's mood entries
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'neutral', 'Regular day, nothing special', CURRENT_DATE - 6),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'sad', 'Had a tough assignment deadline', CURRENT_DATE - 5),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'sad', 'Still stressed about grades', CURRENT_DATE - 4),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'neutral', 'Talked to friends, felt a bit better', CURRENT_DATE - 3),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'happy', 'Went for a walk, mood improved', CURRENT_DATE - 2),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'happy', 'Got good feedback on project', CURRENT_DATE - 1),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'very_happy', 'Feeling optimistic about this week', CURRENT_DATE),
-- Meera's mood entries
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'), 'happy', 'Good lecture today', CURRENT_DATE - 4),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'), 'neutral', NULL, CURRENT_DATE - 3),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'), 'sad', 'Exam coming up, feeling anxious', CURRENT_DATE - 2),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'), 'very_sad', 'Could not sleep properly', CURRENT_DATE - 1),
((SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'), 'neutral', 'Trying to stay calm', CURRENT_DATE);

-- ============================================
-- 9. PHQ-9 TEST RESULTS
-- ============================================

INSERT INTO public.phq_tests (student_id, score, answers, severity_level, recommendations) VALUES
(
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'),
  8,
  '[1, 1, 1, 0, 1, 1, 1, 1, 1]',
  'Mild depression',
  'Consider talking to a counselor. Practice regular exercise and maintain a sleep schedule.'
),
(
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'),
  14,
  '[2, 2, 1, 2, 1, 2, 1, 2, 1]',
  'Moderate depression',
  'We recommend scheduling a session with a counselor. You deserve support during this time.'
);

-- ============================================
-- 10. GAD-7 TEST RESULTS
-- ============================================

INSERT INTO public.gad_7_tests (student_id, score, answers, severity_level, recommendations) VALUES
(
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'),
  6,
  '[1, 1, 1, 0, 1, 1, 1]',
  'Mild anxiety',
  'Try relaxation techniques like deep breathing and mindfulness meditation.'
),
(
  (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000003'),
  12,
  '[2, 2, 2, 1, 2, 1, 2]',
  'Moderate anxiety',
  'Please consider speaking with a counselor. Anxiety at this level is manageable with the right support.'
);

-- ============================================
-- 11. SOME RESOURCES
-- ============================================

INSERT INTO public.resources (title, description, content, type, category, is_active) VALUES
(
  'Understanding Exam Anxiety',
  'A comprehensive guide to recognizing and managing exam-related anxiety.',
  '{"url": "https://example.com/exam-anxiety-guide", "duration": "10 min read"}',
  'article',
  'Anxiety',
  true
),
(
  'Guided Meditation for Students',
  'A 10-minute guided meditation specifically designed for stressed students.',
  '{"url": "https://example.com/student-meditation", "duration": "10 min"}',
  'audio',
  'Mindfulness',
  true
),
(
  'How to Build Healthy Study Habits',
  'Video explaining the science behind effective studying and mental wellness.',
  '{"url": "https://example.com/study-habits-video", "duration": "15 min"}',
  'video',
  'Academic',
  true
),
(
  'Coping with Homesickness',
  'Tips and strategies for dealing with homesickness during your first year.',
  '{"url": "https://example.com/homesickness-tips", "duration": "7 min read"}',
  'article',
  'Adjustment',
  true
);

-- ============================================
-- 12. REMINDERS FOR STUDENTS
-- ============================================

INSERT INTO public.reminders (user_id, student_id, title, due_date, is_completed) VALUES
('c0000000-0000-0000-0000-000000000001', (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'Book counseling session', now() + interval '2 days', false),
('c0000000-0000-0000-0000-000000000001', (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000001'), 'Complete mindfulness exercise', now() + interval '1 day', false),
('c0000000-0000-0000-0000-000000000002', (SELECT id FROM public.students WHERE user_id = 'c0000000-0000-0000-0000-000000000002'), 'Take GAD-7 assessment', now() + interval '3 days', false);
