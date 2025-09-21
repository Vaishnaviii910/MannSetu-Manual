-- supabase/migrations/20250920021200_fix_student_signup.sql

-- First, drop the old, more restrictive policy if it exists
DROP POLICY IF EXISTS "Students and counselors can view their institute" ON public.institutes;

-- Create a new policy that allows anyone to read the list of institutes
CREATE POLICY "Public can view all institutes"
ON public.institutes
FOR SELECT
TO anon, authenticated
USING (true);