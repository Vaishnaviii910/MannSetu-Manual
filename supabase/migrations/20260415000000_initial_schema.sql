-- MannSetu Consolidated Schema Migration
-- Generated from old project backup (db_cluster-03-10-2025)

-- ============================================
-- 1. ENUMS
-- ============================================

CREATE TYPE public.availability_status AS ENUM (
    'available',
    'pending',
    'booked',
    'blocked'
);

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'rejected',
    'completed',
    'cancelled'
);

CREATE TYPE public.mood_type AS ENUM (
    'very_happy',
    'happy',
    'neutral',
    'sad',
    'very_sad'
);

CREATE TYPE public.resource_type AS ENUM (
    'article',
    'video',
    'audio'
);

CREATE TYPE public.user_role AS ENUM (
    'student',
    'counselor',
    'institute'
);

-- ============================================
-- 2. HELPER FUNCTIONS (no table dependencies)
-- ============================================

CREATE FUNCTION public.generate_student_id() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;

CREATE FUNCTION public.generate_counselor_id() RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN 'CNS' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================
-- 3. TABLES
-- ============================================

CREATE TABLE public.profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    email text NOT NULL,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.institutes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    institute_name text NOT NULL,
    address text,
    phone text,
    website text,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    verification_document_url text,
    verification_status text DEFAULT 'pending'::text
);

CREATE TABLE public.students (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    student_id text NOT NULL,
    full_name text NOT NULL,
    institute_id uuid NOT NULL,
    date_of_birth date,
    phone text,
    emergency_contact text,
    emergency_phone text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    todays_focus text
);

CREATE TABLE public.counselors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    full_name text NOT NULL,
    institute_id uuid NOT NULL,
    speciality text NOT NULL,
    qualifications text NOT NULL,
    phone text NOT NULL,
    experience_years integer DEFAULT 0,
    bio text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    counselor_id text DEFAULT public.generate_counselor_id() NOT NULL
);

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.availability_slots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    counselor_id uuid NOT NULL,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT availability_slots_day_of_week_check1 CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);

CREATE TABLE public.counselor_availability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    counselor_id uuid NOT NULL,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT availability_slots_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);

CREATE TABLE public.time_slots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    counselor_id uuid NOT NULL,
    slot_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status public.availability_status DEFAULT 'available'::public.availability_status,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    counselor_id uuid NOT NULL,
    time_slot_id uuid NOT NULL,
    booking_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    student_notes text,
    counselor_notes text,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    cancellation_reason text
);

CREATE TABLE public.session_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    booking_id uuid NOT NULL,
    session_notes text,
    session_summary text,
    next_steps text,
    session_rating integer,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT session_records_session_rating_check CHECK (((session_rating >= 1) AND (session_rating <= 5)))
);

CREATE TABLE public.phq_tests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    score integer NOT NULL,
    answers jsonb NOT NULL,
    severity_level text NOT NULL,
    recommendations text,
    test_date timestamp with time zone DEFAULT now() NOT NULL,
    version integer DEFAULT 1,
    CONSTRAINT phq_tests_score_check CHECK (((score >= 0) AND (score <= 27)))
);

CREATE TABLE public.gad_7_tests (
    student_id uuid DEFAULT gen_random_uuid() NOT NULL,
    score integer,
    answers jsonb,
    severity_level text,
    recommendations text,
    test_date timestamp without time zone DEFAULT now(),
    version integer DEFAULT 1,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);

COMMENT ON TABLE public.gad_7_tests IS 'Stores results for GAD-7 anxiety screenings.';

CREATE TABLE public.mood_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    student_id uuid NOT NULL,
    mood public.mood_type NOT NULL,
    notes text,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.reminders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    student_id uuid NOT NULL,
    title text NOT NULL,
    due_date timestamp with time zone,
    is_completed boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.chat_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    message text NOT NULL,
    sender text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chat_history_sender_check CHECK ((sender = ANY (ARRAY['user'::text, 'bot'::text])))
);

CREATE TABLE public.forums (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    institute_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.forum_posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    forum_id uuid NOT NULL,
    student_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_anonymous boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid
);

CREATE TABLE public.forum_replies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    student_id uuid NOT NULL,
    content text NOT NULL,
    is_anonymous boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.forum_likes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    post_id uuid,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.forum_post_reactions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    post_id uuid,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    content jsonb NOT NULL,
    type public.resource_type NOT NULL,
    category text,
    metadata jsonb,
    is_active boolean DEFAULT true
);

-- ============================================
-- 4. PRIMARY KEYS AND UNIQUE CONSTRAINTS
-- ============================================

ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.institutes ADD CONSTRAINT institutes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.institutes ADD CONSTRAINT institutes_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.students ADD CONSTRAINT students_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.students ADD CONSTRAINT students_student_id_key UNIQUE (student_id);
ALTER TABLE ONLY public.students ADD CONSTRAINT students_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.counselors ADD CONSTRAINT counselors_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.counselors ADD CONSTRAINT counselors_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.audit_logs ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.availability_slots ADD CONSTRAINT availability_slots_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.counselor_availability ADD CONSTRAINT availability_slots_pkey1 PRIMARY KEY (id);
ALTER TABLE ONLY public.counselor_availability ADD CONSTRAINT counselor_availability_counselor_id_day_of_week_key UNIQUE (counselor_id, day_of_week);

ALTER TABLE ONLY public.time_slots ADD CONSTRAINT time_slots_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.time_slots ADD CONSTRAINT time_slots_counselor_id_slot_date_start_time_key UNIQUE (counselor_id, slot_date, start_time);

ALTER TABLE ONLY public.bookings ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.bookings ADD CONSTRAINT bookings_unique_slot UNIQUE (counselor_id, booking_date, start_time);

ALTER TABLE ONLY public.session_records ADD CONSTRAINT session_records_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.session_records ADD CONSTRAINT session_records_booking_id_key UNIQUE (booking_id);

ALTER TABLE ONLY public.phq_tests ADD CONSTRAINT phq_tests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.gad_7_tests ADD CONSTRAINT gad_7_tests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.mood_entries ADD CONSTRAINT mood_entries_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.mood_entries ADD CONSTRAINT mood_entries_student_id_entry_date_key UNIQUE (student_id, entry_date);

ALTER TABLE ONLY public.reminders ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.chat_history ADD CONSTRAINT chat_history_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.forums ADD CONSTRAINT forums_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.forum_posts ADD CONSTRAINT forum_posts_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.forum_replies ADD CONSTRAINT forum_replies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.forum_likes ADD CONSTRAINT forum_likes_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.forum_likes ADD CONSTRAINT forum_likes_post_id_user_id_key UNIQUE (post_id, user_id);
ALTER TABLE ONLY public.forum_post_reactions ADD CONSTRAINT forum_post_reactions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.forum_post_reactions ADD CONSTRAINT forum_post_reactions_post_id_user_id_key UNIQUE (post_id, user_id);

ALTER TABLE ONLY public.resources ADD CONSTRAINT resources_pkey PRIMARY KEY (id);

-- Unique index for counselor_id text field
CREATE UNIQUE INDEX idx_counselors_counselor_id ON public.counselors USING btree (counselor_id);

-- ============================================
-- 5. FOREIGN KEYS
-- ============================================

ALTER TABLE ONLY public.profiles ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.institutes ADD CONSTRAINT institutes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.students ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.students ADD CONSTRAINT students_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institutes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.counselors ADD CONSTRAINT counselors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.counselors ADD CONSTRAINT counselors_institute_id_fkey FOREIGN KEY (institute_id) REFERENCES public.institutes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.availability_slots ADD CONSTRAINT availability_slots_counselor_id_fkey1 FOREIGN KEY (counselor_id) REFERENCES public.counselors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.counselor_availability ADD CONSTRAINT availability_slots_counselor_id_fkey FOREIGN KEY (counselor_id) REFERENCES public.counselors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.time_slots ADD CONSTRAINT time_slots_counselor_id_fkey FOREIGN KEY (counselor_id) REFERENCES public.counselors(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.bookings ADD CONSTRAINT bookings_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.bookings ADD CONSTRAINT bookings_counselor_id_fkey FOREIGN KEY (counselor_id) REFERENCES public.counselors(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.bookings ADD CONSTRAINT bookings_time_slot_id_fkey FOREIGN KEY (time_slot_id) REFERENCES public.time_slots(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.session_records ADD CONSTRAINT session_records_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.phq_tests ADD CONSTRAINT phq_tests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.gad_7_tests ADD CONSTRAINT gad_7_tests_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);

ALTER TABLE ONLY public.mood_entries ADD CONSTRAINT mood_entries_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.reminders ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.reminders ADD CONSTRAINT reminders_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.chat_history ADD CONSTRAINT chat_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.forum_likes ADD CONSTRAINT forum_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.forum_likes ADD CONSTRAINT forum_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.forum_post_reactions ADD CONSTRAINT forum_post_reactions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.forum_posts(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.forum_post_reactions ADD CONSTRAINT forum_post_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.forum_posts ADD CONSTRAINT forum_posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ============================================
-- 6. FUNCTIONS (that reference tables)
-- ============================================

CREATE FUNCTION public.get_user_role() RETURNS public.user_role
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;

CREATE FUNCTION public.get_user_institute_id() RETURNS uuid
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT
    CASE
      WHEN p.role = 'institute' THEN i.id
      WHEN p.role = 'student' THEN s.institute_id
      WHEN p.role = 'counselor' THEN c.institute_id
      ELSE NULL
    END
  FROM public.profiles p
  LEFT JOIN public.institutes i ON i.user_id = p.user_id
  LEFT JOIN public.students s ON s.user_id = p.user_id
  LEFT JOIN public.counselors c ON c.user_id = p.user_id
  WHERE p.user_id = auth.uid();
$$;

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data ->> 'role')::public.user_role
  );

  IF (NEW.raw_user_meta_data ->> 'role') = 'institute' THEN
    INSERT INTO public.institutes(user_id, institute_name, address, phone, website, description)
    VALUES(
      NEW.id,
      NEW.raw_user_meta_data ->> 'instituteName',
      NEW.raw_user_meta_data ->> 'address',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'website',
      NEW.raw_user_meta_data ->> 'description'
    );
  ELSIF (NEW.raw_user_meta_data ->> 'role') = 'student' THEN
    INSERT INTO public.students(user_id, student_id, full_name, institute_id, date_of_birth, phone, emergency_contact, emergency_phone)
    VALUES(
      NEW.id,
      NEW.raw_user_meta_data ->> 'studentId',
      NEW.raw_user_meta_data ->> 'fullName',
      (NEW.raw_user_meta_data ->> 'instituteId')::UUID,
      (NEW.raw_user_meta_data ->> 'dateOfBirth')::DATE,
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'emergencyContact',
      NEW.raw_user_meta_data ->> 'emergencyPhone'
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE FUNCTION public.handle_new_counselor() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  IF new.raw_user_meta_data->>'role' = 'counselor' THEN
    INSERT INTO public.counselors (user_id, institute_id, full_name, speciality, qualifications, phone, experience_years, bio)
    VALUES (
      new.id,
      (new.raw_user_meta_data->>'institute_id')::uuid,
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'speciality',
      new.raw_user_meta_data->>'qualifications',
      new.raw_user_meta_data->>'phone',
      (new.raw_user_meta_data->>'experience_years')::integer,
      new.raw_user_meta_data->>'bio'
    );
  END IF;
  RETURN new;
END;
$$;

CREATE FUNCTION public.create_counselor_profile(user_id uuid, institute_id uuid, full_name text, speciality text, qualifications text, phone text, experience_years integer, bio text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.counselors (user_id, institute_id, full_name, speciality, qualifications, phone, experience_years, bio)
  VALUES (user_id, institute_id, full_name, speciality, qualifications, phone, experience_years, bio);
END;
$$;

CREATE FUNCTION public.create_booking_from_generated_slot(p_student_id uuid, p_counselor_id uuid, p_slot_date date, p_start_time time without time zone, p_student_notes text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  v_booking_id uuid;
  v_time_slot_id uuid;
  v_end_time time := (p_start_time::interval + interval '30 minutes')::time;
BEGIN
  PERFORM set_config('search_path', 'public', true);

  IF p_student_id IS NULL OR p_counselor_id IS NULL OR p_slot_date IS NULL OR p_start_time IS NULL THEN
    RAISE EXCEPTION 'Missing parameters';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE counselor_id = p_counselor_id
      AND booking_date = p_slot_date
      AND start_time = p_start_time
      AND status IN ('pending','confirmed')
  ) THEN
    RAISE EXCEPTION 'Slot already booked';
  END IF;

  INSERT INTO public.time_slots (
    id, counselor_id, slot_date, start_time, end_time, status, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), p_counselor_id, p_slot_date, p_start_time, v_end_time,
    'pending'::public.availability_status, now(), now()
  )
  ON CONFLICT (counselor_id, slot_date, start_time)
  DO UPDATE SET end_time = EXCLUDED.end_time, status = EXCLUDED.status, updated_at = now()
  RETURNING id INTO v_time_slot_id;

  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE counselor_id = p_counselor_id
      AND booking_date = p_slot_date
      AND start_time = p_start_time
      AND status IN ('pending','confirmed')
  ) THEN
    RAISE EXCEPTION 'Slot already booked';
  END IF;

  INSERT INTO public.bookings (
    id, student_id, counselor_id, time_slot_id, booking_date, start_time, end_time, status, student_notes, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), p_student_id, p_counselor_id, v_time_slot_id, p_slot_date,
    p_start_time, v_end_time, 'pending'::public.booking_status, p_student_notes, now(), now()
  )
  RETURNING id INTO v_booking_id;

  RETURN v_booking_id;
END;
$$;

CREATE FUNCTION public.get_unbooked_slots_for_date(p_counselor_id uuid, p_date date) RETURNS TABLE(counselor_id uuid, slot_date date, start_time time without time zone, end_time time without time zone, slot_key text)
    LANGUAGE sql
    AS $$
WITH ca AS (
  SELECT *
  FROM public.counselor_availability
  WHERE counselor_id = p_counselor_id
    AND coalesce(is_active, true) = true
    AND day_of_week = extract(dow from p_date)::int
)
SELECT
  ca.counselor_id,
  (gs.ts)::date AS slot_date,
  (gs.ts)::time AS start_time,
  (gs.ts + interval '30 minutes')::time AS end_time,
  (ca.counselor_id::text || '|' || (gs.ts)::date::text || '|' || (gs.ts::time)::text) AS slot_key
FROM ca
JOIN LATERAL (
  SELECT generate_series(
    (p_date::timestamp + (ca.start_time::text)::interval),
    (CASE
       WHEN (p_date::timestamp + (ca.end_time::text)::interval) <= (p_date::timestamp + (ca.start_time::text)::interval)
         THEN ((p_date + 1)::timestamp + (ca.end_time::text)::interval)
       ELSE (p_date::timestamp + (ca.end_time::text)::interval)
     END) - interval '30 minutes',
    '30 minutes'::interval
  ) AS ts
) gs ON true
LEFT JOIN public.bookings b
  ON b.counselor_id = ca.counselor_id
  AND b.booking_date = (gs.ts)::date
  AND b.start_time = (gs.ts)::time
  AND b.status IN ('pending','confirmed')
WHERE b.id IS NULL;
$$;

CREATE FUNCTION public.generate_time_slots_for_date(p_counselor_id uuid, p_date text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_availability_record RECORD;
    v_day_of_week INT;
    v_current_time TIME;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.time_slots
        WHERE counselor_id = p_counselor_id AND slot_date = p_date::DATE
    ) THEN
        v_day_of_week := EXTRACT(DOW FROM p_date::DATE);

        SELECT start_time, end_time
        INTO v_availability_record
        FROM public.counselor_availability
        WHERE
            counselor_id = p_counselor_id AND
            day_of_week = v_day_of_week AND
            is_active = true;

        IF FOUND THEN
            v_current_time := v_availability_record.start_time;
            WHILE v_current_time < v_availability_record.end_time LOOP
                INSERT INTO public.time_slots (counselor_id, slot_date, start_time, end_time, status)
                VALUES (
                    p_counselor_id,
                    p_date::DATE,
                    v_current_time,
                    v_current_time + INTERVAL '30 minutes',
                    'available'::public.availability_status
                );
                v_current_time := v_current_time + INTERVAL '30 minutes';
            END LOOP;
        END IF;
    END IF;
END;
$$;

CREATE FUNCTION public.generate_time_slots() RETURNS void
    LANGUAGE plpgsql
    AS $_$BEGIN
CREATE OR REPLACE FUNCTION public.generate_time_slots(
  p_counselor_id uuid,
  p_date date
)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  v_start_time    time;
  v_end_time      time;
  v_day_of_week   int;
  v_ts_current    timestamp;
  v_ts_end        timestamp;
  v_slots_added   int := 0;
  v_last_added    int;
BEGIN
  v_day_of_week := extract(dow from p_date)::int;

  SELECT start_time, end_time
  INTO   v_start_time, v_end_time
  FROM   public.counselor_availability
  WHERE  counselor_id = p_counselor_id
    AND  day_of_week = v_day_of_week
    AND  coalesce(is_active, true) = true
  LIMIT 1;

  IF NOT FOUND OR v_start_time IS NULL OR v_end_time IS NULL THEN
    RETURN 0;
  END IF;

  v_ts_current := (p_date::timestamp) + v_start_time;
  v_ts_end     := (p_date::timestamp) + v_end_time;
  IF v_ts_end <= v_ts_current THEN
    v_ts_end := (p_date + 1)::timestamp + v_end_time;
  END IF;

  IF v_ts_current >= v_ts_end THEN
    RETURN 0;
  END IF;

  WHILE v_ts_current < v_ts_end LOOP
    INSERT INTO public.time_slots (
      id, counselor_id, slot_date, start_time, end_time, status, created_at, updated_at
    )
    VALUES (
      gen_random_uuid(), p_counselor_id, (v_ts_current)::date, (v_ts_current)::time,
      (v_ts_current + interval '30 minutes')::time, 'available'::public.availability_status, now(), now()
    )
    ON CONFLICT (counselor_id, slot_date, start_time) DO NOTHING;

    GET DIAGNOSTICS v_last_added = ROW_COUNT;
    v_slots_added := v_slots_added + v_last_added;

    v_ts_current := v_ts_current + interval '30 minutes';
  END LOOP;

  RETURN v_slots_added;
END;
$$;
END;$_$;

CREATE FUNCTION public.handle_schedule_update(p_counselor_id uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    DELETE FROM public.time_slots
    WHERE
        counselor_id = p_counselor_id AND
        slot_date >= CURRENT_DATE AND
        status = 'available'::public.availability_status;
END;
$$;

-- ============================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gad_7_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phq_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. RLS POLICIES
-- ============================================

-- Profiles
CREATE POLICY "Allow authenticated users to read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((user_id = auth.uid()));
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((user_id = auth.uid()));

-- Institutes
CREATE POLICY "Institutes can insert their own data" ON public.institutes FOR INSERT WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Institutes can update their own data" ON public.institutes FOR UPDATE USING ((user_id = auth.uid()));
CREATE POLICY "Institutes can view their own data" ON public.institutes FOR SELECT USING ((user_id = auth.uid()));
CREATE POLICY "Public can view all institutes" ON public.institutes FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Students and counselors can view their institute" ON public.institutes FOR SELECT USING ((id = public.get_user_institute_id()));

-- Students
CREATE POLICY "Allow authenticated users to read student data" ON public.students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Students can insert their own data" ON public.students FOR INSERT WITH CHECK ((user_id = auth.uid()));
CREATE POLICY "Students can update their own data" ON public.students FOR UPDATE USING ((user_id = auth.uid()));
CREATE POLICY "Students can view their own data" ON public.students FOR SELECT USING ((user_id = auth.uid()));
CREATE POLICY "Counselors can view students from their institute" ON public.students FOR SELECT USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'counselor'::public.user_role)));
CREATE POLICY "Institutes can view their students" ON public.students FOR SELECT USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'institute'::public.user_role)));

-- Counselors
CREATE POLICY "Counselors can view their own data" ON public.counselors FOR SELECT USING ((user_id = auth.uid()));
CREATE POLICY "Students can view counselors from their institute" ON public.counselors FOR SELECT USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'student'::public.user_role)));
CREATE POLICY "Institutes can manage their counselors" ON public.counselors USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'institute'::public.user_role)));
CREATE POLICY "Institutes can view their counselors" ON public.counselors FOR SELECT USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'institute'::public.user_role)));

-- Availability Slots
CREATE POLICY "Counselors can manage their own availability" ON public.availability_slots USING ((counselor_id IN ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Students can view counselor availability from their institute" ON public.availability_slots FOR SELECT USING ((counselor_id IN ( SELECT c.id FROM public.counselors c WHERE ((c.institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'student'::public.user_role)))));

-- Counselor Availability
CREATE POLICY "Counselors can manage their own availability" ON public.counselor_availability USING ((counselor_id IN ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Counselors can view their own availability" ON public.counselor_availability FOR SELECT USING ((counselor_id IN ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Students can view counselor availability from their institute" ON public.counselor_availability FOR SELECT USING ((counselor_id IN ( SELECT c.id FROM public.counselors c WHERE ((c.institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'student'::public.user_role)))));
CREATE POLICY "Institutes can manage their counselors availability" ON public.counselor_availability USING ((counselor_id IN ( SELECT c.id FROM public.counselors c WHERE (c.institute_id = ( SELECT i.id FROM public.institutes i WHERE (i.user_id = auth.uid()))))));
CREATE POLICY "Institutes can view their counselors availability" ON public.counselor_availability FOR SELECT USING ((counselor_id IN ( SELECT c.id FROM public.counselors c WHERE (c.institute_id = ( SELECT i.id FROM public.institutes i WHERE (i.user_id = auth.uid()))))));

-- Time Slots
CREATE POLICY "Counselors can manage their own time slots" ON public.time_slots USING ((counselor_id IN ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Students can view time slots from their institute counselors" ON public.time_slots FOR SELECT USING ((counselor_id IN ( SELECT c.id FROM public.counselors c WHERE ((c.institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'student'::public.user_role)))));

-- Bookings
CREATE POLICY "Counselors can manage bookings for their sessions" ON public.bookings USING ((counselor_id IN ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Counselors can update their assigned bookings" ON public.bookings FOR UPDATE USING ((counselor_id = ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Counselors can view their assigned bookings" ON public.bookings FOR SELECT USING ((counselor_id = ( SELECT counselors.id FROM public.counselors WHERE (counselors.user_id = auth.uid()))));
CREATE POLICY "Students can create their own bookings" ON public.bookings FOR INSERT WITH CHECK ((student_id = ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Students can manage their own bookings" ON public.bookings USING ((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Students can view their own bookings" ON public.bookings FOR SELECT USING ((student_id = ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Institutes can view all bookings in their institute" ON public.bookings FOR SELECT USING ((student_id IN ( SELECT s.id FROM public.students s WHERE ((s.institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'institute'::public.user_role)))));

-- Session Records
CREATE POLICY "Counselors can manage session records for their sessions" ON public.session_records USING ((booking_id IN ( SELECT b.id FROM (public.bookings b JOIN public.counselors c ON ((c.id = b.counselor_id))) WHERE (c.user_id = auth.uid()))));
CREATE POLICY "Students can view their own session records" ON public.session_records FOR SELECT USING ((booking_id IN ( SELECT b.id FROM (public.bookings b JOIN public.students s ON ((s.id = b.student_id))) WHERE (s.user_id = auth.uid()))));

-- PHQ Tests
CREATE POLICY "Allow student to read own PHQ tests" ON public.phq_tests FOR SELECT TO authenticated USING ((student_id = ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()) LIMIT 1)));
CREATE POLICY "Allow students to insert their own phq_tests" ON public.phq_tests FOR INSERT WITH CHECK ((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Counselors can view PHQ tests of their institute students" ON public.phq_tests FOR SELECT USING ((student_id IN ( SELECT s.id FROM public.students s WHERE ((s.institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'counselor'::public.user_role)))));
CREATE POLICY "Institutes can view all PHQ tests of their students" ON public.phq_tests FOR SELECT USING ((student_id IN ( SELECT s.id FROM public.students s WHERE ((s.institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'institute'::public.user_role)))));

-- GAD-7 Tests
CREATE POLICY "Allow student to read own GAD-7 tests" ON public.gad_7_tests FOR SELECT TO authenticated USING ((student_id = ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()) LIMIT 1)));
CREATE POLICY "Allow students to insert their own gad_7_tests" ON public.gad_7_tests FOR INSERT WITH CHECK ((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Counselors can view GAD-7 tests of their institute students" ON public.gad_7_tests FOR SELECT USING ((student_id IN ( SELECT s.id FROM public.students s WHERE (s.institute_id = public.get_user_institute_id()))));

-- Mood Entries
CREATE POLICY "Students can manage their own mood entries" ON public.mood_entries USING ((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));

-- Reminders
CREATE POLICY "Students can manage their own reminders" ON public.reminders USING ((auth.uid() = user_id));

-- Chat History
CREATE POLICY "Users can insert their own messages." ON public.chat_history FOR INSERT WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Users can view their own chat history." ON public.chat_history FOR SELECT USING ((auth.uid() = user_id));

-- Forums
CREATE POLICY "Students can view forums from their institute" ON public.forums FOR SELECT USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'student'::public.user_role)));
CREATE POLICY "Institutes can manage their forums" ON public.forums USING (((institute_id = public.get_user_institute_id()) AND (public.get_user_role() = 'institute'::public.user_role)));

-- Forum Posts
CREATE POLICY "Allow authenticated users to read all posts" ON public.forum_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow students to create their own posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK ((student_id = ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Allow users to insert their own posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Students can create posts in their institute forums" ON public.forum_posts FOR INSERT WITH CHECK (((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))) AND (forum_id IN ( SELECT forums.id FROM public.forums WHERE (forums.institute_id = public.get_user_institute_id())))));
CREATE POLICY "Students can update their own posts" ON public.forum_posts FOR UPDATE USING ((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Students can view posts in their institute forums" ON public.forum_posts FOR SELECT USING (((forum_id IN ( SELECT forums.id FROM public.forums WHERE (forums.institute_id = public.get_user_institute_id()))) AND (public.get_user_role() = 'student'::public.user_role)));

-- Forum Replies
CREATE POLICY "Students can create replies in their institute forums" ON public.forum_replies FOR INSERT WITH CHECK (((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))) AND (post_id IN ( SELECT forum_posts.id FROM public.forum_posts WHERE (forum_posts.forum_id IN ( SELECT forums.id FROM public.forums WHERE (forums.institute_id = public.get_user_institute_id())))))));
CREATE POLICY "Students can update their own replies" ON public.forum_replies FOR UPDATE USING ((student_id IN ( SELECT students.id FROM public.students WHERE (students.user_id = auth.uid()))));
CREATE POLICY "Students can view replies in their institute forums" ON public.forum_replies FOR SELECT USING (((post_id IN ( SELECT forum_posts.id FROM public.forum_posts WHERE (forum_posts.forum_id IN ( SELECT forums.id FROM public.forums WHERE (forums.institute_id = public.get_user_institute_id()))))) AND (public.get_user_role() = 'student'::public.user_role)));

-- Forum Reactions
CREATE POLICY "Allow authenticated users to see all reactions" ON public.forum_post_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to react to posts" ON public.forum_post_reactions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));
CREATE POLICY "Allow users to remove their own reactions" ON public.forum_post_reactions FOR DELETE TO authenticated USING ((auth.uid() = user_id));

-- Resources
CREATE POLICY "Students and Counselors can view resources" ON public.resources FOR SELECT USING ((is_active = true));

-- Audit Logs
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs FOR SELECT USING ((user_id = auth.uid()));

-- ============================================
-- 9. TRIGGERS
-- ============================================

-- Auth triggers
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER on_auth_user_created_create_counselor_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_counselor();

-- Updated_at triggers
CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON public.availability_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON public.counselor_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_counselors_updated_at BEFORE UPDATE ON public.counselors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forums_updated_at BEFORE UPDATE ON public.forums FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_institutes_updated_at BEFORE UPDATE ON public.institutes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_session_records_updated_at BEFORE UPDATE ON public.session_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON public.time_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 10. GRANTS
-- ============================================

-- Function grants
GRANT ALL ON FUNCTION public.create_booking_from_generated_slot(p_student_id uuid, p_counselor_id uuid, p_slot_date date, p_start_time time without time zone, p_student_notes text) TO anon;
GRANT ALL ON FUNCTION public.create_booking_from_generated_slot(p_student_id uuid, p_counselor_id uuid, p_slot_date date, p_start_time time without time zone, p_student_notes text) TO authenticated;
GRANT ALL ON FUNCTION public.create_booking_from_generated_slot(p_student_id uuid, p_counselor_id uuid, p_slot_date date, p_start_time time without time zone, p_student_notes text) TO service_role;
GRANT ALL ON FUNCTION public.create_counselor_profile(user_id uuid, institute_id uuid, full_name text, speciality text, qualifications text, phone text, experience_years integer, bio text) TO anon;
GRANT ALL ON FUNCTION public.create_counselor_profile(user_id uuid, institute_id uuid, full_name text, speciality text, qualifications text, phone text, experience_years integer, bio text) TO authenticated;
GRANT ALL ON FUNCTION public.create_counselor_profile(user_id uuid, institute_id uuid, full_name text, speciality text, qualifications text, phone text, experience_years integer, bio text) TO service_role;
GRANT ALL ON FUNCTION public.generate_counselor_id() TO anon;
GRANT ALL ON FUNCTION public.generate_counselor_id() TO authenticated;
GRANT ALL ON FUNCTION public.generate_counselor_id() TO service_role;
GRANT ALL ON FUNCTION public.generate_student_id() TO anon;
GRANT ALL ON FUNCTION public.generate_student_id() TO authenticated;
GRANT ALL ON FUNCTION public.generate_student_id() TO service_role;
GRANT ALL ON FUNCTION public.generate_time_slots() TO anon;
GRANT ALL ON FUNCTION public.generate_time_slots() TO authenticated;
GRANT ALL ON FUNCTION public.generate_time_slots() TO service_role;
GRANT ALL ON FUNCTION public.generate_time_slots_for_date(p_counselor_id uuid, p_date text) TO anon;
GRANT ALL ON FUNCTION public.generate_time_slots_for_date(p_counselor_id uuid, p_date text) TO authenticated;
GRANT ALL ON FUNCTION public.generate_time_slots_for_date(p_counselor_id uuid, p_date text) TO service_role;
GRANT ALL ON FUNCTION public.get_unbooked_slots_for_date(p_counselor_id uuid, p_date date) TO anon;
GRANT ALL ON FUNCTION public.get_unbooked_slots_for_date(p_counselor_id uuid, p_date date) TO authenticated;
GRANT ALL ON FUNCTION public.get_unbooked_slots_for_date(p_counselor_id uuid, p_date date) TO service_role;
GRANT ALL ON FUNCTION public.get_user_institute_id() TO anon;
GRANT ALL ON FUNCTION public.get_user_institute_id() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_institute_id() TO service_role;
GRANT ALL ON FUNCTION public.get_user_role() TO anon;
GRANT ALL ON FUNCTION public.get_user_role() TO authenticated;
GRANT ALL ON FUNCTION public.get_user_role() TO service_role;
GRANT ALL ON FUNCTION public.handle_new_counselor() TO anon;
GRANT ALL ON FUNCTION public.handle_new_counselor() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_counselor() TO service_role;
GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;
GRANT ALL ON FUNCTION public.handle_schedule_update(p_counselor_id uuid) TO anon;
GRANT ALL ON FUNCTION public.handle_schedule_update(p_counselor_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.handle_schedule_update(p_counselor_id uuid) TO service_role;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;

-- Table grants
GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;
GRANT ALL ON TABLE public.availability_slots TO anon;
GRANT ALL ON TABLE public.availability_slots TO authenticated;
GRANT ALL ON TABLE public.availability_slots TO service_role;
GRANT ALL ON TABLE public.bookings TO anon;
GRANT ALL ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;
GRANT ALL ON TABLE public.chat_history TO anon;
GRANT ALL ON TABLE public.chat_history TO authenticated;
GRANT ALL ON TABLE public.chat_history TO service_role;
GRANT ALL ON TABLE public.counselor_availability TO anon;
GRANT ALL ON TABLE public.counselor_availability TO authenticated;
GRANT ALL ON TABLE public.counselor_availability TO service_role;
GRANT ALL ON TABLE public.counselors TO anon;
GRANT ALL ON TABLE public.counselors TO authenticated;
GRANT ALL ON TABLE public.counselors TO service_role;
GRANT ALL ON TABLE public.forum_likes TO anon;
GRANT ALL ON TABLE public.forum_likes TO authenticated;
GRANT ALL ON TABLE public.forum_likes TO service_role;
GRANT ALL ON TABLE public.forum_post_reactions TO anon;
GRANT ALL ON TABLE public.forum_post_reactions TO authenticated;
GRANT ALL ON TABLE public.forum_post_reactions TO service_role;
GRANT ALL ON TABLE public.forum_posts TO anon;
GRANT ALL ON TABLE public.forum_posts TO authenticated;
GRANT ALL ON TABLE public.forum_posts TO service_role;
GRANT ALL ON TABLE public.forum_replies TO anon;
GRANT ALL ON TABLE public.forum_replies TO authenticated;
GRANT ALL ON TABLE public.forum_replies TO service_role;
GRANT ALL ON TABLE public.forums TO anon;
GRANT ALL ON TABLE public.forums TO authenticated;
GRANT ALL ON TABLE public.forums TO service_role;
GRANT ALL ON TABLE public.gad_7_tests TO anon;
GRANT ALL ON TABLE public.gad_7_tests TO authenticated;
GRANT ALL ON TABLE public.gad_7_tests TO service_role;
GRANT ALL ON TABLE public.institutes TO anon;
GRANT ALL ON TABLE public.institutes TO authenticated;
GRANT ALL ON TABLE public.institutes TO service_role;
GRANT ALL ON TABLE public.mood_entries TO anon;
GRANT ALL ON TABLE public.mood_entries TO authenticated;
GRANT ALL ON TABLE public.mood_entries TO service_role;
GRANT ALL ON TABLE public.phq_tests TO anon;
GRANT ALL ON TABLE public.phq_tests TO authenticated;
GRANT ALL ON TABLE public.phq_tests TO service_role;
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
GRANT ALL ON TABLE public.reminders TO anon;
GRANT ALL ON TABLE public.reminders TO authenticated;
GRANT ALL ON TABLE public.reminders TO service_role;
GRANT ALL ON TABLE public.resources TO anon;
GRANT ALL ON TABLE public.resources TO authenticated;
GRANT ALL ON TABLE public.resources TO service_role;
GRANT ALL ON TABLE public.session_records TO anon;
GRANT ALL ON TABLE public.session_records TO authenticated;
GRANT ALL ON TABLE public.session_records TO service_role;
GRANT ALL ON TABLE public.students TO anon;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.students TO service_role;
GRANT ALL ON TABLE public.time_slots TO anon;
GRANT ALL ON TABLE public.time_slots TO authenticated;
GRANT ALL ON TABLE public.time_slots TO service_role;
