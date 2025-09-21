import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useBookingSystem = () => {
  const { user } = useAuth();
  const [counselors, setCounselors] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getCounselorsForStudent = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get student data to find institute
      const { data: student } = await supabase
        .from('students')
        .select('institute_id')
        .eq('user_id', user.id)
        .single();

      if (student) {
        // Get counselors from same institute
        const { data: instituteCounselors } = await supabase
          .from('counselors')
          .select('*')
          .eq('institute_id', student.institute_id)
          .eq('is_active', true);

        setCounselors(instituteCounselors || []);
      }
    } catch (error) {
      console.error('Error fetching counselors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = async (counselorId: string, selectedDate: string) => {
    try {
      setLoading(true);
      
      // First generate time slots for the date if they don't exist
      await supabase.rpc('generate_time_slots_for_date', {
        p_counselor_id: counselorId,
        p_date: selectedDate
      });

      // Get available time slots
      const { data: slots } = await supabase
        .from('time_slots')
        .select('*')
        .eq('counselor_id', counselorId)
        .eq('slot_date', selectedDate)
        .eq('status', 'available')
        .order('start_time');

      setAvailableSlots(slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (
    counselorId: string, 
    timeSlotId: string, 
    bookingDate: string, 
    startTime: string, 
    endTime: string,
    studentNotes?: string
  ) => {
    if (!user) return { error: 'Not authenticated' };

    try {
      // Get student data
      const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!student) return { error: 'Student not found' };

      // Create booking
      const { error } = await supabase
        .from('bookings')
        .insert({
          student_id: student.id,
          counselor_id: counselorId,
          time_slot_id: timeSlotId,
          booking_date: bookingDate,
          start_time: startTime,
          end_time: endTime,
          student_notes: studentNotes,
          status: 'pending'
        });

      if (!error) {
        // Update time slot status to pending
        await supabase
          .from('time_slots')
          .update({ status: 'pending' })
          .eq('id', timeSlotId);
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    counselors,
    availableSlots,
    loading,
    getCounselorsForStudent,
    getAvailableSlots,
    createBooking
  };
};