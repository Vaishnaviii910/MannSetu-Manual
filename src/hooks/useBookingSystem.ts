import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useBookingSystem = () => {
  const { user } = useAuth();
  const [counselors, setCounselors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const getCounselorsForStudent = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: student } = await supabase.from('students').select('institute_id').eq('user_id', user.id).single();
      if (student) {
        const { data: instituteCounselors } = await supabase.from('counselors').select('*').eq('institute_id', student.institute_id).eq('is_active', true);
        setCounselors(instituteCounselors || []);
      }
    } catch (error) {
      console.error('Error fetching counselors:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getAvailableSlots = useCallback(
  async (counselorId: string, selectedDate: string | Date) => {
    try {
      setLoadingSlots(true);
      setAvailableSlots([]);

      // normalize date to YYYY-MM-DD
      const slotDate =
        typeof selectedDate === "string"
          ? selectedDate
          : selectedDate.toISOString().split("T")[0];

      const { data: slots, error } = await supabase
        .rpc('get_unbooked_slots_for_date', {
          p_counselor_id: counselorId,
          p_date: slotDate
        });

      if (error) throw error;

      // ensure consistent ids for UI; RPC returns slot_key
      const normalized = (slots || []).map((s: any) => ({
        id: s.slot_key, // unique deterministic id
        counselor_id: s.counselor_id,
        slot_date: s.slot_date,
        start_time: s.start_time,
        end_time: s.end_time
      }));

      setAvailableSlots(normalized);
      return normalized;
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableSlots([]);
      return [];
    } finally {
      setLoadingSlots(false);
    }
  },
  [supabase, setLoadingSlots, setAvailableSlots]
);



  const createBooking = async (
  counselorId: string,
  slotIdOrStartTime: string, // we accept slot_key or start_time depending on your UI
  studentNotes?: string
) => {
  if (!user) return { error: 'Not authenticated' };
  try {
    // fetch student id
    const { data: student, error: studentErr } = await supabase
      .from('students')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (studentErr || !student) return { error: studentErr || 'Student not found' };

    // if you used slot_key as id, parse it: counselorId|YYYY-MM-DD|HH:MM:SS
    const parts = slotIdOrStartTime.split('|');
    let slotDate: string;
    let slotStartTime: string;
    if (parts.length === 3) {
      // slot_key format
      [, slotDate, slotStartTime] = parts;
    } else {
      // older flow: assume slotIdOrStartTime is actual time string and you have selectedDate in state
      // make sure to pass slotDate from your UI in that case
      return { error: 'Invalid slot identifier' };
    }

    // call atomic booking RPC
    const { data: bookingId, error: rpcErr } = await supabase.rpc('create_booking_from_generated_slot', {
      p_student_id: student.id,
      p_counselor_id: counselorId,
      p_slot_date: slotDate,
      p_start_time: slotStartTime,
      p_student_notes: studentNotes ?? ''
    });

    if (rpcErr) {
      // RPC may raise 'Slot already booked' exception which becomes rpcErr
      throw rpcErr;
    }

    // success
    return { error: null, bookingId };
  } catch (error) {
    console.error('Booking error:', error);
    return { error };
  }
};


  useEffect(() => {
    getCounselorsForStudent();
  }, [getCounselorsForStudent]);

  return {
    counselors,
    availableSlots,
    loading,
    loadingSlots,
    getCounselorsForStudent,
    getAvailableSlots,
    createBooking
  };
};

