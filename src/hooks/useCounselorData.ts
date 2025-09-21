import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCounselorData = () => {
  const { user } = useAuth();
  const [counselorData, setCounselorData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCounselorData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Fetch counselor profile
      const { data: counselor, error: counselorError } = await supabase
        .from('counselors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (counselorError) throw counselorError;
      setCounselorData(counselor);

      if (counselor) {
        // Fetch all bookings for this counselor, selecting only existing columns
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*, students(full_name, student_id)')
          .eq('counselor_id', counselor.id)
          .order('booking_date', { ascending: false });
        
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error fetching counselor data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCounselorData();
  }, [fetchCounselorData]);

  const approveBooking = useCallback(async (bookingId: string, timeSlotId: string) => {
    try {
      // 1. Update booking status to 'confirmed'
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);
      if (bookingError) throw bookingError;

      // 2. Update time slot status to 'booked'
      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ status: 'booked' })
        .eq('id', timeSlotId);
      if (slotError) throw slotError;

      // 3. Refresh data
      await fetchCounselorData();
      return { error: null };
    } catch (error) {
      return { error };
    }
  }, [fetchCounselorData]);
  
  const rejectBooking = useCallback(async (bookingId: string, timeSlotId: string, reason: string) => {
    try {
      // 1. Update booking status to 'rejected' and add reason
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', bookingId);
      if (bookingError) throw bookingError;

      // 2. Update time slot status back to 'available'
      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ status: 'available' })
        .eq('id', timeSlotId);
      if (slotError) throw slotError;

      // 3. Refresh data
      await fetchCounselorData();
      return { error: null };
    } catch (error) {
      return { error };
    }
  }, [fetchCounselorData]);

  return {
    counselorData,
    bookings,
    loading,
    approveBooking,
    rejectBooking,
    refreshData: fetchCounselorData,
  };
};

