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

  const getAvailableSlots = useCallback(async (counselorId: string, selectedDate: string) => {
    try {
      setLoadingSlots(true);
      setAvailableSlots([]);
      
      // ** NEW: Call the database function to generate slots before fetching. **
      await supabase.rpc('generate_time_slots_for_date', {
        p_counselor_id: counselorId,
        p_date: selectedDate
      });

      const { data: slots, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('counselor_id', counselorId)
        .eq('slot_date', selectedDate)
        .eq('status', 'available')
        .order('start_time');
      
      if (error) throw error;
      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  const createBooking = async (counselorId: string, timeSlotId: string, studentNotes?: string) => {
    if (!user) return { error: 'Not authenticated' };
    try {
      const { data: student } = await supabase.from('students').select('id').eq('user_id', user.id).single();
      if (!student) return { error: 'Student not found' };
      
      const { data: slotData } = await supabase.from('time_slots').select('*').eq('id', timeSlotId).single();
      if (!slotData) return { error: 'Time slot not found' };

      const { error } = await supabase.from('bookings').insert({
        student_id: student.id,
        counselor_id: counselorId,
        time_slot_id: timeSlotId,
        booking_date: slotData.slot_date,
        start_time: slotData.start_time,
        end_time: slotData.end_time,
        student_notes: studentNotes,
        status: 'pending'
      });
      if (error) throw error;
      
      await supabase.from('time_slots').update({ status: 'pending' }).eq('id', timeSlotId);
      return { error: null };
    } catch (error) {
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

