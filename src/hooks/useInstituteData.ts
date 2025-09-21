import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useInstituteData = () => {
  const { user } = useAuth();
  const [instituteData, setInstituteData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInstituteData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: institute } = await supabase
        .from('institutes')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setInstituteData(institute);

      if (institute) {
        const { data: instituteCounselors } = await supabase
          .from('counselors')
          .select('*')
          .eq('institute_id', institute.id)
          .order('created_at', { ascending: false });
        setCounselors(instituteCounselors || []);

        const { data: instituteStudents } = await supabase
          .from('students')
          .select('*')
          .eq('institute_id', institute.id)
          .order('created_at', { ascending: false });
        setStudents(instituteStudents || []);
        
        const studentIds = instituteStudents?.map(s => s.id) || [];
        if (studentIds.length > 0) {
            const { data: bookingsData } = await supabase
                .from('bookings')
                .select('*, students (full_name, student_id), counselors (full_name)')
                .in('student_id', studentIds);
            setBookings(bookingsData || []);
        }
      }
    } catch (error) {
      console.error('Error fetching institute data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInstituteData();
  }, [fetchInstituteData]);

  const createCounselor = async (counselorData: any) => {
    if (!instituteData) return { error: { message: 'No institute data' } };

    const { email, password, ...profileData } = counselorData;

    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: { 
                data: { 
                    role: 'counselor', 
                    institute_id: instituteData.id,
                    ...profileData 
                } 
            }
        });

        if (authError) return { error: authError };
        
        if(authData.user){
            // A short delay can sometimes help ensure the trigger has fired before refetching.
            setTimeout(() => {
                fetchInstituteData();
            }, 500);
        }

    } catch (error) {
        return { error };
    }
    return { error: null };
  };
  
  const updateCounselorStatus = async (counselorId: string, isActive: boolean) => {
    const { error } = await supabase.from('counselors').update({ is_active: isActive }).eq('id', counselorId);
    if (!error) fetchInstituteData();
    return { error };
  };

  const getCounselorAvailability = useCallback(async (counselorId: string) => {
    const { data, error } = await supabase
      .from('counselor_availability')
      .select('*')
      .eq('counselor_id', counselorId);
    if (error) {
      console.error("Error fetching availability:", error);
      return [];
    }
    return data || [];
  }, []);

  const updateCounselorAvailability = useCallback(async (counselorId: string, availability: any[]) => {
    const recordsToUpsert = availability.map(({ id, ...rest }) => ({
      ...rest,
      counselor_id: counselorId,
    }));
    const { error } = await supabase
      .from('counselor_availability')
      .upsert(recordsToUpsert, { onConflict: 'counselor_id,day_of_week' });
    return { error };
  }, []);

  return {
    instituteData,
    students,
    counselors,
    bookings,
    loading,
    createCounselor,
    updateCounselorStatus,
    getCounselorAvailability,
    updateCounselorAvailability,
    refreshData: fetchInstituteData
  };
};

