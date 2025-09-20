-- supabase/migrations/20250920012300_fix_handle_new_user.sql

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Insert basic profile record for all users
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    (NEW.raw_user_meta_data ->> 'role')::public.user_role
  );

  -- Create role-specific profile
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
$function$;