-- Create the reminders table
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for reminders
DROP POLICY IF EXISTS "Students can manage their own reminders" ON public.reminders;
CREATE POLICY "Students can manage their own reminders"
ON public.reminders
FOR ALL
USING (auth.uid() = user_id);
