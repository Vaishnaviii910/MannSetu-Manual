import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useInstituteData = () => {
  const { user } = useAuth();
  const [instituteData, setInstituteData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [counselors, setCounselors] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [phqTests, setPHQTests] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchInstituteData();
    }
  }, [user]);

  const fetchInstituteData = async () => {
    try {
      // Get institute profile
      const { data: institute } = await supabase
        .from('institutes')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setInstituteData(institute);

      if (institute) {
        // Get students
        const { data: instituteStudents } = await supabase
          .from('students')
          .select('*')
          .eq('institute_id', institute.id)
          .order('created_at', { ascending: false });

        setStudents(instituteStudents || []);

        // Get counselors
        const { data: instituteCounselors } = await supabase
          .from('counselors')
          .select('*')
          .eq('institute_id', institute.id)
          .order('created_at', { ascending: false });

        setCounselors(instituteCounselors || []);

        // Get bookings for institute students
        const studentIds = instituteStudents?.map(s => s.id) || [];
        let instituteBookings: any[] = [];
        let phqTestsData: any[] = [];

        if (studentIds.length > 0) {
          const { data: bookingsData } = await supabase
            .from('bookings')
            .select(`
              *,
              students (
                full_name,
                student_id
              ),
              counselors (
                full_name,
                speciality
              )
            `)
            .in('student_id', studentIds)
            .order('booking_date', { ascending: false });

          instituteBookings = bookingsData || [];
          setBookings(instituteBookings);

          // Get PHQ tests for analytics
          const { data: testsData } = await supabase
            .from('phq_tests')
            .select('*')
            .in('student_id', studentIds);

          phqTestsData = testsData || [];
          setPHQTests(phqTestsData);
        }

        // Calculate analytics
        const totalStudents = instituteStudents?.length || 0;
        const totalCounselors = instituteCounselors?.length || 0;
        const thisMonth = new Date().toISOString().substring(0, 7);
        const sessionsThisMonth = instituteBookings.filter(b => 
          b.booking_date.startsWith(thisMonth) && b.status === 'confirmed'
        ).length;

        const screeningParticipation = totalStudents > 0 
          ? Math.round((phqTestsData.length / totalStudents) * 100)
          : 0;

        const utilizationRate = totalStudents > 0
          ? Math.round((sessionsThisMonth / totalStudents) * 100)
          : 0;

        setAnalytics({
          totalStudents,
          totalCounselors,
          sessionsThisMonth,
          screeningParticipation,
          utilizationRate,
          averageWellnessScore: calculateAverageWellnessScore(phqTestsData),
          highRiskStudents: phqTestsData.filter(t => t.score > 14).length
        });
      }
    } catch (error) {
      console.error('Error fetching institute data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageWellnessScore = (tests: any[]) => {
    if (tests.length === 0) return 0;
    const totalScore = tests.reduce((sum, test) => sum + test.score, 0);
    const averageScore = totalScore / tests.length;
    // Convert to wellness percentage (inverse of depression score)
    return Math.round(100 - (averageScore / 27) * 100);
  };

  const createCounselor = async (counselorData: {
    full_name: string;
    email: string;
    password: string;
    speciality: string;
    qualifications: string;
    phone: string;
    bio?: string;
    experience_years?: number;
  }) => {
    if (!instituteData) return { error: 'No institute data' };

    try {
      // Create auth user for counselor
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: counselorData.email,
        password: counselorData.password,
        options: {
          data: {
            role: 'counselor',
            full_name: counselorData.full_name
          }
        }
      });

      if (authError) return { error: authError };

      if (authData.user) {
        // Create counselor record
        const { error: counselorError } = await supabase
          .from('counselors')
          .insert({
            user_id: authData.user.id,
            institute_id: instituteData.id,
            full_name: counselorData.full_name,
            speciality: counselorData.speciality,
            qualifications: counselorData.qualifications,
            phone: counselorData.phone,
            bio: counselorData.bio,
            experience_years: counselorData.experience_years || 0,
          });

        if (!counselorError) {
          fetchInstituteData(); // Refresh data
        }

        return { error: counselorError };
      }

      return { error: 'Failed to create user' };
    } catch (error) {
      return { error };
    }
  };

  const updateCounselorStatus = async (counselorId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('counselors')
        .update({ is_active: isActive })
        .eq('id', counselorId);

      if (!error) {
        fetchInstituteData(); // Refresh data
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    instituteData,
    students,
    counselors,
    bookings,
    phqTests,
    analytics,
    loading,
    createCounselor,
    updateCounselorStatus,
    refreshData: fetchInstituteData
  };
};