    -- Create the table to store GAD-7 test results
    CREATE TABLE IF NOT EXISTS public.gad_7_tests (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
      score INTEGER NOT NULL CHECK (score >= 0 AND score <= 21),
      answers JSONB NOT NULL,
      severity_level TEXT NOT NULL,
      recommendations TEXT,
      test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      version INTEGER DEFAULT 1
    );

    -- Enable Row Level Security
    ALTER TABLE public.gad_7_tests ENABLE ROW LEVEL SECURITY;

    -- Create a policy that allows students to manage their own test results
    CREATE POLICY "Students can manage their own GAD-7 tests"
    ON public.gad_7_tests
    FOR ALL USING (
      student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

    -- Create a policy for counselors to view their students' results
    CREATE POLICY "Counselors can view GAD-7 tests of their institute students"
    ON public.gad_7_tests
    FOR SELECT USING (
      student_id IN (
        SELECT s.id FROM public.students s
        WHERE s.institute_id = public.get_user_institute_id()
        AND public.get_user_role() = 'counselor'
      )
    );

    -- Create a policy for institutes to view their students' results
    CREATE POLICY "Institutes can view all GAD-7 tests of their students"
    ON public.gad_7_tests
    FOR SELECT USING (
      student_id IN (
        SELECT s.id FROM public.students s
        WHERE s.institute_id = public.get_user_institute_id()
        AND public.get_user_role() = 'institute'
      )
    );
    
