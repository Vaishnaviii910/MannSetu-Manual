drop extension if exists "pg_net";

drop policy "Students can manage their own reminders" on "public"."reminders";

revoke delete on table "public"."audit_logs" from "anon";

revoke insert on table "public"."audit_logs" from "anon";

revoke references on table "public"."audit_logs" from "anon";

revoke select on table "public"."audit_logs" from "anon";

revoke trigger on table "public"."audit_logs" from "anon";

revoke truncate on table "public"."audit_logs" from "anon";

revoke update on table "public"."audit_logs" from "anon";

revoke delete on table "public"."audit_logs" from "authenticated";

revoke insert on table "public"."audit_logs" from "authenticated";

revoke references on table "public"."audit_logs" from "authenticated";

revoke select on table "public"."audit_logs" from "authenticated";

revoke trigger on table "public"."audit_logs" from "authenticated";

revoke truncate on table "public"."audit_logs" from "authenticated";

revoke update on table "public"."audit_logs" from "authenticated";

revoke delete on table "public"."audit_logs" from "service_role";

revoke insert on table "public"."audit_logs" from "service_role";

revoke references on table "public"."audit_logs" from "service_role";

revoke select on table "public"."audit_logs" from "service_role";

revoke trigger on table "public"."audit_logs" from "service_role";

revoke truncate on table "public"."audit_logs" from "service_role";

revoke update on table "public"."audit_logs" from "service_role";

revoke delete on table "public"."availability_slots" from "anon";

revoke insert on table "public"."availability_slots" from "anon";

revoke references on table "public"."availability_slots" from "anon";

revoke select on table "public"."availability_slots" from "anon";

revoke trigger on table "public"."availability_slots" from "anon";

revoke truncate on table "public"."availability_slots" from "anon";

revoke update on table "public"."availability_slots" from "anon";

revoke delete on table "public"."availability_slots" from "authenticated";

revoke insert on table "public"."availability_slots" from "authenticated";

revoke references on table "public"."availability_slots" from "authenticated";

revoke select on table "public"."availability_slots" from "authenticated";

revoke trigger on table "public"."availability_slots" from "authenticated";

revoke truncate on table "public"."availability_slots" from "authenticated";

revoke update on table "public"."availability_slots" from "authenticated";

revoke delete on table "public"."availability_slots" from "service_role";

revoke insert on table "public"."availability_slots" from "service_role";

revoke references on table "public"."availability_slots" from "service_role";

revoke select on table "public"."availability_slots" from "service_role";

revoke trigger on table "public"."availability_slots" from "service_role";

revoke truncate on table "public"."availability_slots" from "service_role";

revoke update on table "public"."availability_slots" from "service_role";

revoke delete on table "public"."bookings" from "anon";

revoke insert on table "public"."bookings" from "anon";

revoke references on table "public"."bookings" from "anon";

revoke select on table "public"."bookings" from "anon";

revoke trigger on table "public"."bookings" from "anon";

revoke truncate on table "public"."bookings" from "anon";

revoke update on table "public"."bookings" from "anon";

revoke delete on table "public"."bookings" from "authenticated";

revoke insert on table "public"."bookings" from "authenticated";

revoke references on table "public"."bookings" from "authenticated";

revoke select on table "public"."bookings" from "authenticated";

revoke trigger on table "public"."bookings" from "authenticated";

revoke truncate on table "public"."bookings" from "authenticated";

revoke update on table "public"."bookings" from "authenticated";

revoke delete on table "public"."bookings" from "service_role";

revoke insert on table "public"."bookings" from "service_role";

revoke references on table "public"."bookings" from "service_role";

revoke select on table "public"."bookings" from "service_role";

revoke trigger on table "public"."bookings" from "service_role";

revoke truncate on table "public"."bookings" from "service_role";

revoke update on table "public"."bookings" from "service_role";

revoke delete on table "public"."counselors" from "anon";

revoke insert on table "public"."counselors" from "anon";

revoke references on table "public"."counselors" from "anon";

revoke select on table "public"."counselors" from "anon";

revoke trigger on table "public"."counselors" from "anon";

revoke truncate on table "public"."counselors" from "anon";

revoke update on table "public"."counselors" from "anon";

revoke delete on table "public"."counselors" from "authenticated";

revoke insert on table "public"."counselors" from "authenticated";

revoke references on table "public"."counselors" from "authenticated";

revoke select on table "public"."counselors" from "authenticated";

revoke trigger on table "public"."counselors" from "authenticated";

revoke truncate on table "public"."counselors" from "authenticated";

revoke update on table "public"."counselors" from "authenticated";

revoke delete on table "public"."counselors" from "service_role";

revoke insert on table "public"."counselors" from "service_role";

revoke references on table "public"."counselors" from "service_role";

revoke select on table "public"."counselors" from "service_role";

revoke trigger on table "public"."counselors" from "service_role";

revoke truncate on table "public"."counselors" from "service_role";

revoke update on table "public"."counselors" from "service_role";

revoke delete on table "public"."forum_posts" from "anon";

revoke insert on table "public"."forum_posts" from "anon";

revoke references on table "public"."forum_posts" from "anon";

revoke select on table "public"."forum_posts" from "anon";

revoke trigger on table "public"."forum_posts" from "anon";

revoke truncate on table "public"."forum_posts" from "anon";

revoke update on table "public"."forum_posts" from "anon";

revoke delete on table "public"."forum_posts" from "authenticated";

revoke insert on table "public"."forum_posts" from "authenticated";

revoke references on table "public"."forum_posts" from "authenticated";

revoke select on table "public"."forum_posts" from "authenticated";

revoke trigger on table "public"."forum_posts" from "authenticated";

revoke truncate on table "public"."forum_posts" from "authenticated";

revoke update on table "public"."forum_posts" from "authenticated";

revoke delete on table "public"."forum_posts" from "service_role";

revoke insert on table "public"."forum_posts" from "service_role";

revoke references on table "public"."forum_posts" from "service_role";

revoke select on table "public"."forum_posts" from "service_role";

revoke trigger on table "public"."forum_posts" from "service_role";

revoke truncate on table "public"."forum_posts" from "service_role";

revoke update on table "public"."forum_posts" from "service_role";

revoke delete on table "public"."forum_replies" from "anon";

revoke insert on table "public"."forum_replies" from "anon";

revoke references on table "public"."forum_replies" from "anon";

revoke select on table "public"."forum_replies" from "anon";

revoke trigger on table "public"."forum_replies" from "anon";

revoke truncate on table "public"."forum_replies" from "anon";

revoke update on table "public"."forum_replies" from "anon";

revoke delete on table "public"."forum_replies" from "authenticated";

revoke insert on table "public"."forum_replies" from "authenticated";

revoke references on table "public"."forum_replies" from "authenticated";

revoke select on table "public"."forum_replies" from "authenticated";

revoke trigger on table "public"."forum_replies" from "authenticated";

revoke truncate on table "public"."forum_replies" from "authenticated";

revoke update on table "public"."forum_replies" from "authenticated";

revoke delete on table "public"."forum_replies" from "service_role";

revoke insert on table "public"."forum_replies" from "service_role";

revoke references on table "public"."forum_replies" from "service_role";

revoke select on table "public"."forum_replies" from "service_role";

revoke trigger on table "public"."forum_replies" from "service_role";

revoke truncate on table "public"."forum_replies" from "service_role";

revoke update on table "public"."forum_replies" from "service_role";

revoke delete on table "public"."forums" from "anon";

revoke insert on table "public"."forums" from "anon";

revoke references on table "public"."forums" from "anon";

revoke select on table "public"."forums" from "anon";

revoke trigger on table "public"."forums" from "anon";

revoke truncate on table "public"."forums" from "anon";

revoke update on table "public"."forums" from "anon";

revoke delete on table "public"."forums" from "authenticated";

revoke insert on table "public"."forums" from "authenticated";

revoke references on table "public"."forums" from "authenticated";

revoke select on table "public"."forums" from "authenticated";

revoke trigger on table "public"."forums" from "authenticated";

revoke truncate on table "public"."forums" from "authenticated";

revoke update on table "public"."forums" from "authenticated";

revoke delete on table "public"."forums" from "service_role";

revoke insert on table "public"."forums" from "service_role";

revoke references on table "public"."forums" from "service_role";

revoke select on table "public"."forums" from "service_role";

revoke trigger on table "public"."forums" from "service_role";

revoke truncate on table "public"."forums" from "service_role";

revoke update on table "public"."forums" from "service_role";

revoke delete on table "public"."institutes" from "anon";

revoke insert on table "public"."institutes" from "anon";

revoke references on table "public"."institutes" from "anon";

revoke select on table "public"."institutes" from "anon";

revoke trigger on table "public"."institutes" from "anon";

revoke truncate on table "public"."institutes" from "anon";

revoke update on table "public"."institutes" from "anon";

revoke delete on table "public"."institutes" from "authenticated";

revoke insert on table "public"."institutes" from "authenticated";

revoke references on table "public"."institutes" from "authenticated";

revoke select on table "public"."institutes" from "authenticated";

revoke trigger on table "public"."institutes" from "authenticated";

revoke truncate on table "public"."institutes" from "authenticated";

revoke update on table "public"."institutes" from "authenticated";

revoke delete on table "public"."institutes" from "service_role";

revoke insert on table "public"."institutes" from "service_role";

revoke references on table "public"."institutes" from "service_role";

revoke select on table "public"."institutes" from "service_role";

revoke trigger on table "public"."institutes" from "service_role";

revoke truncate on table "public"."institutes" from "service_role";

revoke update on table "public"."institutes" from "service_role";

revoke delete on table "public"."mood_entries" from "anon";

revoke insert on table "public"."mood_entries" from "anon";

revoke references on table "public"."mood_entries" from "anon";

revoke select on table "public"."mood_entries" from "anon";

revoke trigger on table "public"."mood_entries" from "anon";

revoke truncate on table "public"."mood_entries" from "anon";

revoke update on table "public"."mood_entries" from "anon";

revoke delete on table "public"."mood_entries" from "authenticated";

revoke insert on table "public"."mood_entries" from "authenticated";

revoke references on table "public"."mood_entries" from "authenticated";

revoke select on table "public"."mood_entries" from "authenticated";

revoke trigger on table "public"."mood_entries" from "authenticated";

revoke truncate on table "public"."mood_entries" from "authenticated";

revoke update on table "public"."mood_entries" from "authenticated";

revoke delete on table "public"."mood_entries" from "service_role";

revoke insert on table "public"."mood_entries" from "service_role";

revoke references on table "public"."mood_entries" from "service_role";

revoke select on table "public"."mood_entries" from "service_role";

revoke trigger on table "public"."mood_entries" from "service_role";

revoke truncate on table "public"."mood_entries" from "service_role";

revoke update on table "public"."mood_entries" from "service_role";

revoke delete on table "public"."phq_tests" from "anon";

revoke insert on table "public"."phq_tests" from "anon";

revoke references on table "public"."phq_tests" from "anon";

revoke select on table "public"."phq_tests" from "anon";

revoke trigger on table "public"."phq_tests" from "anon";

revoke truncate on table "public"."phq_tests" from "anon";

revoke update on table "public"."phq_tests" from "anon";

revoke delete on table "public"."phq_tests" from "authenticated";

revoke insert on table "public"."phq_tests" from "authenticated";

revoke references on table "public"."phq_tests" from "authenticated";

revoke select on table "public"."phq_tests" from "authenticated";

revoke trigger on table "public"."phq_tests" from "authenticated";

revoke truncate on table "public"."phq_tests" from "authenticated";

revoke update on table "public"."phq_tests" from "authenticated";

revoke delete on table "public"."phq_tests" from "service_role";

revoke insert on table "public"."phq_tests" from "service_role";

revoke references on table "public"."phq_tests" from "service_role";

revoke select on table "public"."phq_tests" from "service_role";

revoke trigger on table "public"."phq_tests" from "service_role";

revoke truncate on table "public"."phq_tests" from "service_role";

revoke update on table "public"."phq_tests" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."reminders" from "anon";

revoke insert on table "public"."reminders" from "anon";

revoke references on table "public"."reminders" from "anon";

revoke select on table "public"."reminders" from "anon";

revoke trigger on table "public"."reminders" from "anon";

revoke truncate on table "public"."reminders" from "anon";

revoke update on table "public"."reminders" from "anon";

revoke delete on table "public"."reminders" from "authenticated";

revoke insert on table "public"."reminders" from "authenticated";

revoke references on table "public"."reminders" from "authenticated";

revoke select on table "public"."reminders" from "authenticated";

revoke trigger on table "public"."reminders" from "authenticated";

revoke truncate on table "public"."reminders" from "authenticated";

revoke update on table "public"."reminders" from "authenticated";

revoke delete on table "public"."reminders" from "service_role";

revoke insert on table "public"."reminders" from "service_role";

revoke references on table "public"."reminders" from "service_role";

revoke select on table "public"."reminders" from "service_role";

revoke trigger on table "public"."reminders" from "service_role";

revoke truncate on table "public"."reminders" from "service_role";

revoke update on table "public"."reminders" from "service_role";

revoke delete on table "public"."session_records" from "anon";

revoke insert on table "public"."session_records" from "anon";

revoke references on table "public"."session_records" from "anon";

revoke select on table "public"."session_records" from "anon";

revoke trigger on table "public"."session_records" from "anon";

revoke truncate on table "public"."session_records" from "anon";

revoke update on table "public"."session_records" from "anon";

revoke delete on table "public"."session_records" from "authenticated";

revoke insert on table "public"."session_records" from "authenticated";

revoke references on table "public"."session_records" from "authenticated";

revoke select on table "public"."session_records" from "authenticated";

revoke trigger on table "public"."session_records" from "authenticated";

revoke truncate on table "public"."session_records" from "authenticated";

revoke update on table "public"."session_records" from "authenticated";

revoke delete on table "public"."session_records" from "service_role";

revoke insert on table "public"."session_records" from "service_role";

revoke references on table "public"."session_records" from "service_role";

revoke select on table "public"."session_records" from "service_role";

revoke trigger on table "public"."session_records" from "service_role";

revoke truncate on table "public"."session_records" from "service_role";

revoke update on table "public"."session_records" from "service_role";

revoke delete on table "public"."students" from "anon";

revoke insert on table "public"."students" from "anon";

revoke references on table "public"."students" from "anon";

revoke select on table "public"."students" from "anon";

revoke trigger on table "public"."students" from "anon";

revoke truncate on table "public"."students" from "anon";

revoke update on table "public"."students" from "anon";

revoke delete on table "public"."students" from "authenticated";

revoke insert on table "public"."students" from "authenticated";

revoke references on table "public"."students" from "authenticated";

revoke select on table "public"."students" from "authenticated";

revoke trigger on table "public"."students" from "authenticated";

revoke truncate on table "public"."students" from "authenticated";

revoke update on table "public"."students" from "authenticated";

revoke delete on table "public"."students" from "service_role";

revoke insert on table "public"."students" from "service_role";

revoke references on table "public"."students" from "service_role";

revoke select on table "public"."students" from "service_role";

revoke trigger on table "public"."students" from "service_role";

revoke truncate on table "public"."students" from "service_role";

revoke update on table "public"."students" from "service_role";

revoke delete on table "public"."time_slots" from "anon";

revoke insert on table "public"."time_slots" from "anon";

revoke references on table "public"."time_slots" from "anon";

revoke select on table "public"."time_slots" from "anon";

revoke trigger on table "public"."time_slots" from "anon";

revoke truncate on table "public"."time_slots" from "anon";

revoke update on table "public"."time_slots" from "anon";

revoke delete on table "public"."time_slots" from "authenticated";

revoke insert on table "public"."time_slots" from "authenticated";

revoke references on table "public"."time_slots" from "authenticated";

revoke select on table "public"."time_slots" from "authenticated";

revoke trigger on table "public"."time_slots" from "authenticated";

revoke truncate on table "public"."time_slots" from "authenticated";

revoke update on table "public"."time_slots" from "authenticated";

revoke delete on table "public"."time_slots" from "service_role";

revoke insert on table "public"."time_slots" from "service_role";

revoke references on table "public"."time_slots" from "service_role";

revoke select on table "public"."time_slots" from "service_role";

revoke trigger on table "public"."time_slots" from "service_role";

revoke truncate on table "public"."time_slots" from "service_role";

revoke update on table "public"."time_slots" from "service_role";

alter table "public"."reminders" drop constraint "reminders_student_id_fkey";

alter table "public"."reminders" drop constraint "reminders_user_id_fkey";

alter table "public"."reminders" drop constraint "reminders_pkey";

drop index if exists "public"."reminders_pkey";

drop table "public"."reminders";

alter table "public"."students" add column "todays_focus" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_counselor_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN 'CNS' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_student_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_time_slots_for_date(p_counselor_id uuid, p_date date)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_institute_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_role()
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;


