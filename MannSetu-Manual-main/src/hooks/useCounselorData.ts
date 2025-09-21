import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCounselorData = () => {
  const { user } = useAuth();
  const [counselorData, setCounselorData] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCounselorData();
    }
  }, [user]);

  const fetchCounselorData = async () => {
    try {
      // Get counselor profile
      const { data: counselor } = await supabase
        .from('counselors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setCounselorData(counselor);

      if (counselor) {
        // Get all bookings for this counselor
        const { data: counselorBookings } = await supabase
          .from('bookings')
          .select(`
            *,
            students (
              full_name,
              student_id
            )
          `)
          .eq('counselor_id', counselor.id)
          .order('booking_date', { ascending: false });

        setBookings(counselorBookings || []);

        // Filter today's sessions
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = counselorBookings?.filter(booking => 
          booking.booking_date === today && booking.status === 'confirmed'
        ) || [];
        setTodaySessions(todayBookings);

        // Filter pending requests
        const pending = counselorBookings?.filter(booking => 
          booking.status === 'pending'
        ) || [];
        setPendingRequests(pending);

        // Get students for this counselor's institute
        const { data: instituteStudents } = await supabase
          .from('students')
          .select('*')
          .eq('institute_id', counselor.institute_id);

        setStudents(instituteStudents || []);
      }
    } catch (error) {
      console.error('Error fetching counselor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'confirmed' | 'rejected', rejectionReason?: string) => {
    try {
      const updateData: any = { status };
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (!error) {
        // If confirmed, update time slot status
        if (status === 'confirmed') {
          const booking = bookings.find(b => b.id === bookingId);
          if (booking) {
            await supabase
              .from('time_slots')
              .update({ status: 'booked' })
              .eq('id', booking.time_slot_id);
          }
        }
        fetchCounselorData(); // Refresh data
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const createSessionRecord = async (bookingId: string, sessionNotes: string, sessionSummary: string, nextSteps?: string, sessionRating?: number) => {
    try {
      const { error } = await supabase
        .from('session_records')
        .insert({
          booking_id: bookingId,
          session_notes: sessionNotes,
          session_summary: sessionSummary,
          next_steps: nextSteps,
          session_rating: sessionRating,
          completed_at: new Date().toISOString()
        });

      if (!error) {
        // Update booking status to completed
        await supabase
          .from('bookings')
          .update({ status: 'completed' })
          .eq('id', bookingId);
        
        fetchCounselorData(); // Refresh data
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    counselorData,
    bookings,
    students,
    todaySessions,
    pendingRequests,
    loading,
    updateBookingStatus,
    createSessionRecord,
    refreshData: fetchCounselorData
  };
};