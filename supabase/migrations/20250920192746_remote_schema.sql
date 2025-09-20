
\restrict RBRxcPhUhHaFczfzXMxioIhfh49EWEx91vbGTLT6Da7N3qd8uC5dQ1MimwHKXmX


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."availability_status" AS ENUM (
    'available',
    'pending',
    'booked',
    'blocked'
);


ALTER TYPE "public"."availability_status" OWNER TO "postgres";


CREATE TYPE "public"."booking_status" AS ENUM (
    'pending',
    'confirmed',
    'rejected',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."booking_status" OWNER TO "postgres";


CREATE TYPE "public"."mood_type" AS ENUM (
    'very_happy',
    'happy',
    'neutral',
    'sad',
    'very_sad'
);


ALTER TYPE "public"."mood_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'student',
    'counselor',
    'institute'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_counselor_id"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN 'CNS' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;


ALTER FUNCTION "public"."generate_counselor_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_student_id"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;


ALTER FUNCTION "public"."generate_student_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_time_slots_for_date"("p_counselor_id" "uuid", "p_date" "date") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  availability_record RECORD;
  slot_start TIME;
  slot_end TIME;
BEGIN
  -- Get availability for the day of week
  FOR availability_record IN 
    SELECT start_time, end_time
    FROM public.availability_slots
    WHERE counselor_id = p_counselor_id
    AND day_of_week = EXTRACT(DOW FROM p_date)
    AND is_active = true
  LOOP
    -- Generate 1-hour slots
    slot_start := availability_record.start_time;
    
    WHILE slot_start < availability_record.end_time LOOP
      slot_end := slot_start + INTERVAL '1 hour';
      
      -- Insert time slot if it doesn't exist
      INSERT INTO public.time_slots (counselor_id, slot_date, start_time, end_time, status)
      VALUES (p_counselor_id, p_date, slot_start, slot_end, 'available')
      ON CONFLICT (counselor_id, slot_date, start_time) DO NOTHING;
      
      slot_start := slot_end;
    END LOOP;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."generate_time_slots_for_date"("p_counselor_id" "uuid", "p_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_institute_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."get_user_institute_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"() RETURNS "public"."user_role"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$;


ALTER FUNCTION "public"."get_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  -- First, create the common profile entry
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data ->> 'role')::public.user_role
  );

  -- Now, create the role-specific entry
  IF (NEW.raw_user_meta_data ->> 'role') = 'institute' THEN
    INSERT INTO public.institutes(user_id, institute_name, address, phone, website)
    VALUES(
      NEW.id,
      NEW.raw_user_meta_data ->> 'instituteName',
      NEW.raw_user_meta_data ->> 'address',
      NEW.raw_user_meta_data ->> 'phone',
      NEW.raw_user_meta_data ->> 'website'
    );
  ELSIF (NEW.raw_user_meta_data ->> 'role') = 'student' THEN
    INSERT INTO public.students(user_id, student_id, full_name, institute_id)
    VALUES(
      NEW.id,
      NEW.raw_user_meta_data ->> 'studentId',
      NEW.raw_user_meta_data ->> 'fullName',
      (NEW.raw_user_meta_data ->> 'instituteId')::UUID
    );
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" "text" NOT NULL,
    "table_name" "text" NOT NULL,
    "record_id" "uuid",
    "old_values" "jsonb",
    "new_values" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."availability_slots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "counselor_id" "uuid" NOT NULL,
    "day_of_week" integer NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "availability_slots_day_of_week_check" CHECK ((("day_of_week" >= 0) AND ("day_of_week" <= 6)))
);


ALTER TABLE "public"."availability_slots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "counselor_id" "uuid" NOT NULL,
    "time_slot_id" "uuid" NOT NULL,
    "booking_date" "date" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "status" "public"."booking_status" DEFAULT 'pending'::"public"."booking_status",
    "student_notes" "text",
    "counselor_notes" "text",
    "rejection_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."counselors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "institute_id" "uuid" NOT NULL,
    "speciality" "text" NOT NULL,
    "qualifications" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "experience_years" integer DEFAULT 0,
    "bio" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "counselor_id" "text" DEFAULT "public"."generate_counselor_id"() NOT NULL
);


ALTER TABLE "public"."counselors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "forum_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "is_anonymous" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forum_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forum_replies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "is_anonymous" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forum_replies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forums" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "institute_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."forums" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."institutes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "institute_name" "text" NOT NULL,
    "address" "text",
    "phone" "text",
    "website" "text",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."institutes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mood_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "mood" "public"."mood_type" NOT NULL,
    "notes" "text",
    "entry_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."mood_entries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."phq_tests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "score" integer NOT NULL,
    "answers" "jsonb" NOT NULL,
    "severity_level" "text" NOT NULL,
    "recommendations" "text",
    "test_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "version" integer DEFAULT 1,
    CONSTRAINT "phq_tests_score_check" CHECK ((("score" >= 0) AND ("score" <= 27)))
);


ALTER TABLE "public"."phq_tests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "public"."user_role" DEFAULT 'student'::"public"."user_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reminders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "due_date" timestamp with time zone,
    "is_completed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."reminders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid" NOT NULL,
    "session_notes" "text",
    "session_summary" "text",
    "next_steps" "text",
    "session_rating" integer,
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "session_records_session_rating_check" CHECK ((("session_rating" >= 1) AND ("session_rating" <= 5)))
);


ALTER TABLE "public"."session_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "student_id" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "institute_id" "uuid" NOT NULL,
    "date_of_birth" "date",
    "phone" "text",
    "emergency_contact" "text",
    "emergency_phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "todays_focus" "text"
);


ALTER TABLE "public"."students" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."time_slots" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "counselor_id" "uuid" NOT NULL,
    "slot_date" "date" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "status" "public"."availability_status" DEFAULT 'available'::"public"."availability_status",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."time_slots" OWNER TO "postgres";


ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."availability_slots"
    ADD CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."counselors"
    ADD CONSTRAINT "counselors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."counselors"
    ADD CONSTRAINT "counselors_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."forum_posts"
    ADD CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forum_replies"
    ADD CONSTRAINT "forum_replies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forums"
    ADD CONSTRAINT "forums_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."institutes"
    ADD CONSTRAINT "institutes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."institutes"
    ADD CONSTRAINT "institutes_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."mood_entries"
    ADD CONSTRAINT "mood_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mood_entries"
    ADD CONSTRAINT "mood_entries_student_id_entry_date_key" UNIQUE ("student_id", "entry_date");



ALTER TABLE ONLY "public"."phq_tests"
    ADD CONSTRAINT "phq_tests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_records"
    ADD CONSTRAINT "session_records_booking_id_key" UNIQUE ("booking_id");



ALTER TABLE ONLY "public"."session_records"
    ADD CONSTRAINT "session_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_student_id_key" UNIQUE ("student_id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."time_slots"
    ADD CONSTRAINT "time_slots_counselor_id_slot_date_start_time_key" UNIQUE ("counselor_id", "slot_date", "start_time");



ALTER TABLE ONLY "public"."time_slots"
    ADD CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "idx_counselors_counselor_id" ON "public"."counselors" USING "btree" ("counselor_id");



CREATE OR REPLACE TRIGGER "update_availability_slots_updated_at" BEFORE UPDATE ON "public"."availability_slots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bookings_updated_at" BEFORE UPDATE ON "public"."bookings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_counselors_updated_at" BEFORE UPDATE ON "public"."counselors" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forum_posts_updated_at" BEFORE UPDATE ON "public"."forum_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forum_replies_updated_at" BEFORE UPDATE ON "public"."forum_replies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_forums_updated_at" BEFORE UPDATE ON "public"."forums" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_institutes_updated_at" BEFORE UPDATE ON "public"."institutes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_session_records_updated_at" BEFORE UPDATE ON "public"."session_records" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_students_updated_at" BEFORE UPDATE ON "public"."students" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_time_slots_updated_at" BEFORE UPDATE ON "public"."time_slots" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."availability_slots"
    ADD CONSTRAINT "availability_slots_counselor_id_fkey" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_counselor_id_fkey" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slots"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."counselors"
    ADD CONSTRAINT "counselors_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."counselors"
    ADD CONSTRAINT "counselors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."institutes"
    ADD CONSTRAINT "institutes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mood_entries"
    ADD CONSTRAINT "mood_entries_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."phq_tests"
    ADD CONSTRAINT "phq_tests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reminders"
    ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_records"
    ADD CONSTRAINT "session_records_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "public"."institutes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."time_slots"
    ADD CONSTRAINT "time_slots_counselor_id_fkey" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("id") ON DELETE CASCADE;



CREATE POLICY "Counselors can manage bookings for their sessions" ON "public"."bookings" USING (("counselor_id" IN ( SELECT "counselors"."id"
   FROM "public"."counselors"
  WHERE ("counselors"."user_id" = "auth"."uid"()))));



CREATE POLICY "Counselors can manage session records for their sessions" ON "public"."session_records" USING (("booking_id" IN ( SELECT "b"."id"
   FROM ("public"."bookings" "b"
     JOIN "public"."counselors" "c" ON (("c"."id" = "b"."counselor_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Counselors can manage their own availability" ON "public"."availability_slots" USING (("counselor_id" IN ( SELECT "counselors"."id"
   FROM "public"."counselors"
  WHERE ("counselors"."user_id" = "auth"."uid"()))));



CREATE POLICY "Counselors can manage their own time slots" ON "public"."time_slots" USING (("counselor_id" IN ( SELECT "counselors"."id"
   FROM "public"."counselors"
  WHERE ("counselors"."user_id" = "auth"."uid"()))));



CREATE POLICY "Counselors can view PHQ tests of their institute students" ON "public"."phq_tests" FOR SELECT USING (("student_id" IN ( SELECT "s"."id"
   FROM "public"."students" "s"
  WHERE (("s"."institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'counselor'::"public"."user_role")))));



CREATE POLICY "Counselors can view students from their institute" ON "public"."students" FOR SELECT USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'counselor'::"public"."user_role")));



CREATE POLICY "Counselors can view their own data" ON "public"."counselors" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Institutes can insert their own data" ON "public"."institutes" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Institutes can manage their counselors" ON "public"."counselors" USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'institute'::"public"."user_role")));



CREATE POLICY "Institutes can manage their forums" ON "public"."forums" USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'institute'::"public"."user_role")));



CREATE POLICY "Institutes can update their own data" ON "public"."institutes" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Institutes can view all PHQ tests of their students" ON "public"."phq_tests" FOR SELECT USING (("student_id" IN ( SELECT "s"."id"
   FROM "public"."students" "s"
  WHERE (("s"."institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'institute'::"public"."user_role")))));



CREATE POLICY "Institutes can view all bookings in their institute" ON "public"."bookings" FOR SELECT USING (("student_id" IN ( SELECT "s"."id"
   FROM "public"."students" "s"
  WHERE (("s"."institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'institute'::"public"."user_role")))));



CREATE POLICY "Institutes can view their counselors" ON "public"."counselors" FOR SELECT USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'institute'::"public"."user_role")));



CREATE POLICY "Institutes can view their own data" ON "public"."institutes" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Institutes can view their students" ON "public"."students" FOR SELECT USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'institute'::"public"."user_role")));



CREATE POLICY "Public can view all institutes" ON "public"."institutes" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Students can create posts in their institute forums" ON "public"."forum_posts" FOR INSERT WITH CHECK ((("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))) AND ("forum_id" IN ( SELECT "forums"."id"
   FROM "public"."forums"
  WHERE ("forums"."institute_id" = "public"."get_user_institute_id"())))));



CREATE POLICY "Students can create replies in their institute forums" ON "public"."forum_replies" FOR INSERT WITH CHECK ((("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))) AND ("post_id" IN ( SELECT "forum_posts"."id"
   FROM "public"."forum_posts"
  WHERE ("forum_posts"."forum_id" IN ( SELECT "forums"."id"
           FROM "public"."forums"
          WHERE ("forums"."institute_id" = "public"."get_user_institute_id"())))))));



CREATE POLICY "Students can insert their own data" ON "public"."students" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Students can manage their own PHQ tests" ON "public"."phq_tests" USING (("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))));



CREATE POLICY "Students can manage their own bookings" ON "public"."bookings" USING (("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))));



CREATE POLICY "Students can manage their own mood entries" ON "public"."mood_entries" USING (("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))));



CREATE POLICY "Students can manage their own reminders" ON "public"."reminders" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Students can update their own data" ON "public"."students" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Students can update their own posts" ON "public"."forum_posts" FOR UPDATE USING (("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))));



CREATE POLICY "Students can update their own replies" ON "public"."forum_replies" FOR UPDATE USING (("student_id" IN ( SELECT "students"."id"
   FROM "public"."students"
  WHERE ("students"."user_id" = "auth"."uid"()))));



CREATE POLICY "Students can view counselor availability from their institute" ON "public"."availability_slots" FOR SELECT USING (("counselor_id" IN ( SELECT "c"."id"
   FROM "public"."counselors" "c"
  WHERE (("c"."institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'student'::"public"."user_role")))));



CREATE POLICY "Students can view counselors from their institute" ON "public"."counselors" FOR SELECT USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'student'::"public"."user_role")));



CREATE POLICY "Students can view forums from their institute" ON "public"."forums" FOR SELECT USING ((("institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'student'::"public"."user_role")));



CREATE POLICY "Students can view posts in their institute forums" ON "public"."forum_posts" FOR SELECT USING ((("forum_id" IN ( SELECT "forums"."id"
   FROM "public"."forums"
  WHERE ("forums"."institute_id" = "public"."get_user_institute_id"()))) AND ("public"."get_user_role"() = 'student'::"public"."user_role")));



CREATE POLICY "Students can view replies in their institute forums" ON "public"."forum_replies" FOR SELECT USING ((("post_id" IN ( SELECT "forum_posts"."id"
   FROM "public"."forum_posts"
  WHERE ("forum_posts"."forum_id" IN ( SELECT "forums"."id"
           FROM "public"."forums"
          WHERE ("forums"."institute_id" = "public"."get_user_institute_id"()))))) AND ("public"."get_user_role"() = 'student'::"public"."user_role")));



CREATE POLICY "Students can view their own data" ON "public"."students" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Students can view their own session records" ON "public"."session_records" FOR SELECT USING (("booking_id" IN ( SELECT "b"."id"
   FROM ("public"."bookings" "b"
     JOIN "public"."students" "s" ON (("s"."id" = "b"."student_id")))
  WHERE ("s"."user_id" = "auth"."uid"()))));



CREATE POLICY "Students can view time slots from their institute counselors" ON "public"."time_slots" FOR SELECT USING (("counselor_id" IN ( SELECT "c"."id"
   FROM "public"."counselors" "c"
  WHERE (("c"."institute_id" = "public"."get_user_institute_id"()) AND ("public"."get_user_role"() = 'student'::"public"."user_role")))));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own audit logs" ON "public"."audit_logs" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."availability_slots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."counselors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forum_replies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forums" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."institutes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."mood_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."phq_tests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reminders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."session_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."students" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."time_slots" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."generate_counselor_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_counselor_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_counselor_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_student_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_student_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_student_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_time_slots_for_date"("p_counselor_id" "uuid", "p_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."generate_time_slots_for_date"("p_counselor_id" "uuid", "p_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_time_slots_for_date"("p_counselor_id" "uuid", "p_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_institute_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_institute_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_institute_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."availability_slots" TO "anon";
GRANT ALL ON TABLE "public"."availability_slots" TO "authenticated";
GRANT ALL ON TABLE "public"."availability_slots" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."counselors" TO "anon";
GRANT ALL ON TABLE "public"."counselors" TO "authenticated";
GRANT ALL ON TABLE "public"."counselors" TO "service_role";



GRANT ALL ON TABLE "public"."forum_posts" TO "anon";
GRANT ALL ON TABLE "public"."forum_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_posts" TO "service_role";



GRANT ALL ON TABLE "public"."forum_replies" TO "anon";
GRANT ALL ON TABLE "public"."forum_replies" TO "authenticated";
GRANT ALL ON TABLE "public"."forum_replies" TO "service_role";



GRANT ALL ON TABLE "public"."forums" TO "anon";
GRANT ALL ON TABLE "public"."forums" TO "authenticated";
GRANT ALL ON TABLE "public"."forums" TO "service_role";



GRANT ALL ON TABLE "public"."institutes" TO "anon";
GRANT ALL ON TABLE "public"."institutes" TO "authenticated";
GRANT ALL ON TABLE "public"."institutes" TO "service_role";



GRANT ALL ON TABLE "public"."mood_entries" TO "anon";
GRANT ALL ON TABLE "public"."mood_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."mood_entries" TO "service_role";



GRANT ALL ON TABLE "public"."phq_tests" TO "anon";
GRANT ALL ON TABLE "public"."phq_tests" TO "authenticated";
GRANT ALL ON TABLE "public"."phq_tests" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reminders" TO "anon";
GRANT ALL ON TABLE "public"."reminders" TO "authenticated";
GRANT ALL ON TABLE "public"."reminders" TO "service_role";



GRANT ALL ON TABLE "public"."session_records" TO "anon";
GRANT ALL ON TABLE "public"."session_records" TO "authenticated";
GRANT ALL ON TABLE "public"."session_records" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."time_slots" TO "anon";
GRANT ALL ON TABLE "public"."time_slots" TO "authenticated";
GRANT ALL ON TABLE "public"."time_slots" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























\unrestrict RBRxcPhUhHaFczfzXMxioIhfh49EWEx91vbGTLT6Da7N3qd8uC5dQ1MimwHKXmX

RESET ALL;
