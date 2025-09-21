-- Create custom types only if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('student', 'counselor', 'institute');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'rejected', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status') THEN
        CREATE TYPE public.availability_status AS ENUM ('available', 'pending', 'booked', 'blocked');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mood_type') THEN
        CREATE TYPE public.mood_type AS ENUM ('very_happy', 'happy', 'neutral', 'sad', 'very_sad');
    END IF;
END
$$;

-- Create tables for all users, if they don't already exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.institutes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  institute_id UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  date_of_birth DATE,
  phone TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.counselors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  institute_id UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  speciality TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.phq_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 27),
  answers JSONB NOT NULL,
  severity_level TEXT NOT NULL,
  recommendations TEXT,
  test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  mood public.mood_type NOT NULL,
  notes TEXT,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, entry_date)
);

CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  counselor_id UUID NOT NULL REFERENCES public.counselors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  counselor_id UUID NOT NULL REFERENCES public.counselors(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status public.availability_status DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(counselor_id, slot_date, start_time)
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  counselor_id UUID NOT NULL REFERENCES public.counselors(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status public.booking_status DEFAULT 'pending',
  student_notes TEXT,
  counselor_notes TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.session_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  session_notes TEXT,
  session_summary TEXT,
  next_steps TEXT,
  session_rating INTEGER CHECK (session_rating >= 1 AND session_rating <= 5),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phq_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS policies (DROP IF EXISTS added)
DROP FUNCTION IF EXISTS public.get_user_role();
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

DROP FUNCTION IF EXISTS public.get_user_institute_id();
CREATE OR REPLACE FUNCTION public.get_user_institute_id()
RETURNS UUID AS $$
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
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies (DROP IF EXISTS added for each)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for institutes
DROP POLICY IF EXISTS "Institutes can view their own data" ON public.institutes;
CREATE POLICY "Institutes can view their own data" ON public.institutes
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Students and counselors can view their institute" ON public.institutes;
CREATE POLICY "Students and counselors can view their institute" ON public.institutes
FOR SELECT USING (id = public.get_user_institute_id());

DROP POLICY IF EXISTS "Institutes can update their own data" ON public.institutes;
CREATE POLICY "Institutes can update their own data" ON public.institutes
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Institutes can insert their own data" ON public.institutes;
CREATE POLICY "Institutes can insert their own data" ON public.institutes
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for students
DROP POLICY IF EXISTS "Students can view their own data" ON public.students;
CREATE POLICY "Students can view their own data" ON public.students
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Institutes can view their students" ON public.students;
CREATE POLICY "Institutes can view their students" ON public.students
FOR SELECT USING (institute_id = public.get_user_institute_id() AND public.get_user_role() = 'institute');

DROP POLICY IF EXISTS "Counselors can view students from their institute" ON public.students;
CREATE POLICY "Counselors can view students from their institute" ON public.students
FOR SELECT USING (institute_id = public.get_user_institute_id() AND public.get_user_role() = 'counselor');

DROP POLICY IF EXISTS "Students can update their own data" ON public.students;
CREATE POLICY "Students can update their own data" ON public.students
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Students can insert their own data" ON public.students;
CREATE POLICY "Students can insert their own data" ON public.students
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for counselors
DROP POLICY IF EXISTS "Counselors can view their own data" ON public.counselors;
CREATE POLICY "Counselors can view their own data" ON public.counselors
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Students can view counselors from their institute" ON public.counselors;
CREATE POLICY "Students can view counselors from their institute" ON public.counselors
FOR SELECT USING (institute_id = public.get_user_institute_id() AND public.get_user_role() = 'student');

DROP POLICY IF EXISTS "Institutes can view their counselors" ON public.counselors;
CREATE POLICY "Institutes can view their counselors" ON public.counselors
FOR SELECT USING (institute_id = public.get_user_institute_id() AND public.get_user_role() = 'institute');

DROP POLICY IF EXISTS "Institutes can manage their counselors" ON public.counselors;
CREATE POLICY "Institutes can manage their counselors" ON public.counselors
FOR ALL USING (institute_id = public.get_user_institute_id() AND public.get_user_role() = 'institute');

-- RLS Policies for PHQ tests
DROP POLICY IF EXISTS "Students can manage their own PHQ tests" ON public.phq_tests;
CREATE POLICY "Students can manage their own PHQ tests" ON public.phq_tests
FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Counselors can view PHQ tests of their institute students" ON public.phq_tests;
CREATE POLICY "Counselors can view PHQ tests of their institute students" ON public.phq_tests
FOR SELECT USING (
  student_id IN (
    SELECT s.id FROM public.students s
    WHERE s.institute_id = public.get_user_institute_id()
    AND public.get_user_role() = 'counselor'
  )
);

DROP POLICY IF EXISTS "Institutes can view all PHQ tests of their students" ON public.phq_tests;
CREATE POLICY "Institutes can view all PHQ tests of their students" ON public.phq_tests
FOR SELECT USING (
  student_id IN (
    SELECT s.id FROM public.students s
    WHERE s.institute_id = public.get_user_institute_id()
    AND public.get_user_role() = 'institute'
  )
);

-- RLS Policies for mood entries
DROP POLICY IF EXISTS "Students can manage their own mood entries" ON public.mood_entries;
CREATE POLICY "Students can manage their own mood entries" ON public.mood_entries
FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- RLS Policies for availability slots
DROP POLICY IF EXISTS "Counselors can manage their own availability" ON public.availability_slots;
CREATE POLICY "Counselors can manage their own availability" ON public.availability_slots
FOR ALL USING (
  counselor_id IN (SELECT id FROM public.counselors WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can view counselor availability from their institute" ON public.availability_slots;
CREATE POLICY "Students can view counselor availability from their institute" ON public.availability_slots
FOR SELECT USING (
  counselor_id IN (
    SELECT c.id FROM public.counselors c
    WHERE c.institute_id = public.get_user_institute_id()
    AND public.get_user_role() = 'student'
  )
);

-- RLS Policies for time slots
DROP POLICY IF EXISTS "Counselors can manage their own time slots" ON public.time_slots;
CREATE POLICY "Counselors can manage their own time slots" ON public.time_slots
FOR ALL USING (
  counselor_id IN (SELECT id FROM public.counselors WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can view time slots from their institute counselors" ON public.time_slots;
CREATE POLICY "Students can view time slots from their institute counselors" ON public.time_slots
FOR SELECT USING (
  counselor_id IN (
    SELECT c.id FROM public.counselors c
    WHERE c.institute_id = public.get_user_institute_id()
    AND public.get_user_role() = 'student'
  )
);

-- RLS Policies for bookings
DROP POLICY IF EXISTS "Students can manage their own bookings" ON public.bookings;
CREATE POLICY "Students can manage their own bookings" ON public.bookings
FOR ALL USING (
  student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Counselors can manage bookings for their sessions" ON public.bookings;
CREATE POLICY "Counselors can manage bookings for their sessions" ON public.bookings
FOR ALL USING (
  counselor_id IN (SELECT id FROM public.counselors WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Institutes can view all bookings in their institute" ON public.bookings;
CREATE POLICY "Institutes can view all bookings in their institute" ON public.bookings
FOR SELECT USING (
  student_id IN (
    SELECT s.id FROM public.students s
    WHERE s.institute_id = public.get_user_institute_id()
    AND public.get_user_role() = 'institute'
  )
);

-- RLS Policies for session records
DROP POLICY IF EXISTS "Counselors can manage session records for their sessions" ON public.session_records;
CREATE POLICY "Counselors can manage session records for their sessions" ON public.session_records
FOR ALL USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.counselors c ON c.id = b.counselor_id
    WHERE c.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Students can view their own session records" ON public.session_records;
CREATE POLICY "Students can view their own session records" ON public.session_records
FOR SELECT USING (
  booking_id IN (
    SELECT b.id FROM public.bookings b
    JOIN public.students s ON s.id = b.student_id
    WHERE s.user_id = auth.uid()
  )
);

-- RLS Policies for audit logs
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
FOR SELECT USING (user_id = auth.uid());

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create functions for timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_institutes_updated_at ON public.institutes;
CREATE TRIGGER update_institutes_updated_at BEFORE UPDATE ON public.institutes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_counselors_updated_at ON public.counselors;
CREATE TRIGGER update_counselors_updated_at BEFORE UPDATE ON public.counselors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_availability_slots_updated_at ON public.availability_slots;
CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON public.availability_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_time_slots_updated_at ON public.time_slots;
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON public.time_slots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_session_records_updated_at ON public.session_records;
CREATE TRIGGER update_session_records_updated_at BEFORE UPDATE ON public.session_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'STU' || TO_CHAR(NOW(), 'YYYY') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to create time slots based on availability
CREATE OR REPLACE FUNCTION public.generate_time_slots_for_date(
  p_counselor_id UUID,
  p_date DATE
)
RETURNS VOID AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;