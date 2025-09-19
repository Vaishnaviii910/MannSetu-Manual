-- Fix the remaining security warning by updating generate_time_slots_for_date function

CREATE OR REPLACE FUNCTION public.generate_time_slots_for_date(
  p_counselor_id UUID,
  p_date DATE
)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
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