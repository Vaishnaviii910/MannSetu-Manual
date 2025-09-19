import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useStudentData = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [phqTests, setPHQTests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      // Get student profile
      const { data: student } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setStudentData(student);

      if (student) {
        // Get PHQ tests
        const { data: tests } = await supabase
          .from('phq_tests')
          .select('*')
          .eq('student_id', student.id)
          .order('test_date', { ascending: false });

        setPHQTests(tests || []);

        // Get bookings with counselor details
        const { data: studentBookings } = await supabase
          .from('bookings')
          .select(`
            *,
            counselors (
              full_name,
              speciality
            )
          `)
          .eq('student_id', student.id)
          .order('booking_date', { ascending: false });

        setBookings(studentBookings || []);

        // Get mood entries
        const { data: moods } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('student_id', student.id)
          .order('entry_date', { ascending: false })
          .limit(7);

        setMoodEntries(moods || []);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitPHQTest = async (answers: Record<number, number>) => {
    if (!studentData) return;

    try {
      const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
      
      let severityLevel = 'Minimal';
      let recommendations = 'Continue maintaining good mental health practices.';
      
      if (score > 19) {
        severityLevel = 'Severe';
        recommendations = 'Please consider scheduling an immediate consultation with a mental health professional.';
      } else if (score > 14) {
        severityLevel = 'Moderately Severe';
        recommendations = 'We recommend scheduling an appointment with one of our counselors.';
      } else if (score > 9) {
        severityLevel = 'Moderate';
        recommendations = 'Consider speaking with a counselor about your symptoms.';
      } else if (score > 4) {
        severityLevel = 'Mild';
        recommendations = 'Monitor your symptoms and consider self-care activities.';
      }

      const { error } = await supabase
        .from('phq_tests')
        .insert({
          student_id: studentData.id,
          score,
          answers,
          severity_level: severityLevel,
          recommendations
        });

      if (!error) {
        fetchStudentData(); // Refresh data
      }

      return { error, score, severityLevel, recommendations };
    } catch (error) {
      return { error };
    }
  };

  const addMoodEntry = async (mood: number, notes?: string) => {
    if (!studentData) return;

    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          student_id: studentData.id,
          mood: mood.toString() as any,
          notes,
          entry_date: new Date().toISOString().split('T')[0]
        });

      if (!error) {
        fetchStudentData(); // Refresh data
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  return {
    studentData,
    phqTests,
    bookings,
    moodEntries,
    loading,
    submitPHQTest,
    addMoodEntry,
    refreshData: fetchStudentData
  };
};