-- First, let's fix the profile creation trigger that should run when users sign up
-- The existing handle_new_user function needs to be updated to handle all user types properly

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Insert basic profile record for all users
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')::public.user_role
  );
  
  RETURN NEW;
END;
$function$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a function to generate counselor IDs
CREATE OR REPLACE FUNCTION public.generate_counselor_id()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  RETURN 'CNS' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$function$;

-- Update counselors table to auto-generate counselor_id if not provided
ALTER TABLE public.counselors ADD COLUMN IF NOT EXISTS counselor_id text;

-- Create unique index on counselor_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_counselors_counselor_id ON public.counselors(counselor_id);

-- Add default for counselor_id generation
ALTER TABLE public.counselors ALTER COLUMN counselor_id SET DEFAULT generate_counselor_id();

-- Update counselors that don't have counselor_id yet
UPDATE public.counselors SET counselor_id = generate_counselor_id() WHERE counselor_id IS NULL OR counselor_id = '';

-- Make counselor_id required
ALTER TABLE public.counselors ALTER COLUMN counselor_id SET NOT NULL;