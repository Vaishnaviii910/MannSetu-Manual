-- supabase/migrations/20250920023000_update_handle_new_user_for_students.sql

-- First, drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Now, it's safe to drop and recreate the function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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
$function$;

-- Finally, re-create the trigger to use the updated function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();