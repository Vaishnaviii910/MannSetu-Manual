import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from "@/hooks/use-toast";

export const useStudentData = () => {
  const { user } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [phqTests, setPHQTests] = useState<any[]>([]);
  const [gad7Tests, setGAD7Tests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAllData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentError || !student) {
        console.error('Error fetching student data:', studentError);
        setLoading(false);
        return;
      }

      setStudentData(student);

      const [
        { data: phqData },
        { data: gad7Data },
        { data: bookingData },
        { data: moodData },
        { data: reminderData }
      ] = await Promise.all([
        supabase.from('phq_tests').select('*').eq('student_id', student.id).order('created_at', { ascending: false }),
        supabase.from('gad_7_tests').select('*').eq('student_id', student.id).order('created_at', { ascending: false }),
        supabase.from('bookings').select('*, counselors(full_name, speciality)').eq('student_id', student.id).order('booking_date', { ascending: false }),
        supabase.from('mood_entries').select('*').eq('student_id', student.id).order('created_at', { ascending: false }).limit(7),
        supabase.from('reminders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ]);

      setPHQTests(phqData || []);
      setGAD7Tests(gad7Data || []);
      setBookings(bookingData || []);
      setMoodEntries(moodData || []);
      setReminders(reminderData || []);

    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if(user){
      fetchAllData();
    }
  }, [user, fetchAllData]);

  const submitPHQTest = async (answers: Record<number, number>) => {
    if (!studentData) return { error: { message: "Student not found" }};
    const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
    let severityLevel = 'Minimal';
    if (score > 19) severityLevel = 'Severe';
    else if (score > 14) severityLevel = 'Moderately Severe';
    else if (score > 9) severityLevel = 'Moderate';
    else if (score > 4) severityLevel = 'Mild';
    
    const { data, error } = await supabase.from('phq_tests').insert({ student_id: studentData.id, score, answers, severity_level: severityLevel }).select().single();
    if (!error) fetchAllData();
    return { data, error, score, severityLevel };
  };
  
  const submitGAD7Test = async (answers: Record<number, number>) => {
    if (!studentData) return { error: { message: "Student not found" }};
    const score = Object.values(answers).reduce((sum, value) => sum + value, 0);
    let severityLevel = 'Minimal';
    if (score >= 15) severityLevel = 'Severe';
    else if (score >= 10) severityLevel = 'Moderate';
    else if (score >= 5) severityLevel = 'Mild';

    const { data, error } = await supabase.from('gad_7_tests').insert({ student_id: studentData.id, score, answers, interpretation: severityLevel }).select().single();
    if (!error) fetchAllData();
    return { data, error, score, severityLevel };
  };

  const addMoodEntry = async (mood: string, notes?: string) => {
    if (!studentData) return;
    const { error } = await supabase.from('mood_entries').insert([{ student_id: studentData.id, mood: mood as any, notes }]);
    if (!error) {
        toast({ title: "Mood Saved!", description: "Your mood for today has been recorded." });
        fetchAllData();
    } else {
        toast({ title: "Error", description: `Failed to save mood: ${error.message}`, variant: "destructive" });
    }
  };

  const updateTodaysFocus = async (focusText: string) => {
    if (!studentData) return;
    const { error } = await supabase.from('students').update({ todays_focus: focusText }).eq('id', studentData.id).select();
    if (!error) {
      toast({ title: "Focus Updated!", description: "Your focus for today has been saved." });
      fetchAllData();
    } else {
      toast({ title: "Error", description: "Could not save your focus.", variant: "destructive" });
    }
  };

  const addReminder = async (title: string) => {
    if (!user || !studentData) return;
    const { error } = await supabase.from('reminders').insert([{ user_id: user.id, student_id: studentData.id, title }]);
    if (!error) {
      toast({ title: "Reminder Added", description: `"${title}" has been added.` });
      fetchAllData();
    } else {
      toast({ title: "Error", description: `Could not add reminder: ${error.message}`, variant: "destructive" });
    }
  };

  const toggleReminder = async (id: string, is_completed: boolean) => {
    const { error } = await supabase.from('reminders').update({ is_completed: !is_completed }).eq('id', id).select();
    if (!error) fetchAllData();
    else toast({ title: "Error", description: "Could not update reminder.", variant: "destructive" });
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from('reminders').delete().eq('id', id).select();
    if (!error) {
      toast({ title: "Reminder Deleted" });
      fetchAllData();
    } else {
      toast({ title: "Error", description: "Could not delete reminder.", variant: "destructive" });
    }
  };

  const cancelBooking = useCallback(async (bookingId: string, timeSlotId: string) => {
    try {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);
      if (bookingError) throw bookingError;

      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ status: 'available' })
        .eq('id', timeSlotId);
      if (slotError) throw slotError;

      await fetchAllData();
      return { error: null };
    } catch (error) {
      return { error };
    }
  }, [fetchAllData]);

  const upcomingBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'confirmed' && new Date(b.booking_date) >= new Date());
  }, [bookings]);

  return {
    studentData,
    phqTests,
    gad7Tests,
    bookings,
    moodEntries,
    reminders,
    loading,
    submitPHQTest,
    submitGAD7Test,
    addMoodEntry,
    updateTodaysFocus,
    addReminder,
    toggleReminder,
    deleteReminder,
    cancelBooking,
    upcomingBookings,
    refreshData: fetchAllData
  };
};




// import { useState, useEffect, useCallback } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from './useAuth';
// import { useToast } from "@/hooks/use-toast";

// export const useStudentData = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [studentData, setStudentData] = useState<any>(null);
//   const [phqTests, setPHQTests] = useState<any[]>([]);
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [moodEntries, setMoodEntries] = useState<any[]>([]);
//   const [reminders, setReminders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchStudentData = useCallback(async () => {
//     if (!user) return;

//     try {
//       setLoading(true);
//       const { data: student, error: studentError } = await supabase
//         .from('students')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (studentError) throw studentError;
//       setStudentData(student);

//       if (student) {
//         // Parallel fetch for related data for faster loading
//         const [
//           { data: tests },
//           { data: studentBookings },
//           { data: moods },
//           { data: studentReminders }
//         ] = await Promise.all([
//           supabase.from('phq_tests').select('*').eq('student_id', student.id).order('test_date', { ascending: false }),
//           supabase.from('bookings').select('*, counselors(full_name, speciality)').eq('student_id', student.id).order('booking_date', { ascending: false }),
//           supabase.from('mood_entries').select('*').eq('student_id', student.id).order('entry_date', { ascending: false }).limit(7),
//           supabase.from('reminders').select('*').eq('user_id', user.id).order('created_at', { ascending: true })
//         ]);

//         setPHQTests(tests || []);
//         setBookings(studentBookings || []);
//         setMoodEntries(moods || []);
//         setReminders(studentReminders || []);
//       }
//     } catch (error) {
//       console.error('Error fetching student data:', error);
//       toast({ title: "Error", description: "Could not fetch your dashboard data.", variant: "destructive" });
//     } finally {
//       setLoading(false);
//     }
//   }, [user, toast]);

//   useEffect(() => {
//     fetchStudentData();
//   }, [fetchStudentData]);

//   const submitPHQTest = async (answers: Record<number, number>) => {
//     if (!studentData) return { error: 'Student not found' };
//     // ... implementation remains the same
//     return { error: null, score: 0, severityLevel: '', recommendations: ''};
//   };

//   const addMoodEntry = async (mood: string, notes?: string) => {
//     if (!studentData) return;
//     try {
//       const { error } = await supabase
//         .from('mood_entries')
//         .insert([{ student_id: studentData.id, mood: mood as any, notes, entry_date: new Date().toISOString().split('T')[0] }])
//         .select();

//       if (error) throw error;
//       toast({ title: "Mood Saved!", description: "Your mood for today has been recorded." });
//       fetchStudentData();
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to save your mood. Please try again.", variant: "destructive" });
//     }
//   };

//   const updateTodaysFocus = async (focusText: string) => {
//     if (!studentData) return { error: 'Student not found' };
//     try {
//       const { error } = await supabase
//         .from('students')
//         .update({ todays_focus: focusText })
//         .eq('id', studentData.id)
//         .select();

//       if (error) throw error;
//       toast({ title: "Focus Updated", description: "Your focus for the day has been saved." });
//       fetchStudentData();
//     } catch (error: any) {
//       console.error("Supabase update error:", error);
//       toast({ title: "Error", description: `Failed to save focus: ${error.message}`, variant: "destructive" });
//     }
//   };
  
//   const addReminder = async (title: string) => {
//     if (!user || !studentData) {
//       console.error("Add Reminder Error: User or student data not available.");
//       toast({ title: "Error", description: "Could not add reminder. Please try again.", variant: "destructive" });
//       return;
//     }
    
//     console.log("Attempting to add reminder for user:", user.id, "student:", studentData.id, "with title:", title);
//     try {
//       const { data, error } = await supabase
//         .from('reminders')
//         .insert([{ user_id: user.id, student_id: studentData.id, title }])
//         .select();

//       if (error) {
//         console.error("Supabase insert error:", error);
//         throw error;
//       }
//       console.log("Supabase insert successful, data:", data);

//       toast({ title: "Reminder Added", description: `"${title}" has been added.` });
//       fetchStudentData();
//     } catch (error) {
//       toast({ title: "Error", description: "Could not add reminder.", variant: "destructive" });
//     }
//   };

//   const toggleReminder = async (id: string, is_completed: boolean) => {
//     try {
//       const { error } = await supabase.from('reminders').update({ is_completed: !is_completed }).eq('id', id).select();
//       if (error) throw error;
//       toast({ title: "Reminder Updated" });
//       fetchStudentData();
//     } catch (error) {
//       toast({ title: "Error", description: "Could not update reminder.", variant: "destructive" });
//     }
//   };

//   const deleteReminder = async (id: string) => {
//     try {
//       const { error } = await supabase.from('reminders').delete().eq('id', id).select();
//       if (error) throw error;
//       toast({ title: "Reminder Deleted" });
//       fetchStudentData();
//     } catch (error) {
//       toast({ title: "Error", description: "Could not delete reminder.", variant: "destructive" });
//     }
//   };

//   return {
//     studentData,
//     phqTests,
//     bookings,
//     moodEntries,
//     reminders,
//     loading,
//     submitPHQTest,
//     addMoodEntry,
//     updateTodaysFocus,
//     addReminder,
//     toggleReminder,
//     deleteReminder,
//     refreshData: fetchStudentData
//   };
// };










