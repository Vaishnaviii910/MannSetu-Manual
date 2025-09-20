-- Fix security warnings by updating functions with proper search_path

-- Update generate_student_id function
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$;

-- Update handle_new_user function  
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Insert basic profile record
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')::public.user_role
  );
  
  RETURN NEW;
END;
$$;