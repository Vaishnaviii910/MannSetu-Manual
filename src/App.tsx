import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/auth/Auth";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import CounselorDashboard from "./pages/dashboards/CounselorDashboard";
import InstituteDashboard from "./pages/dashboards/InstituteDashboard";
import NotFound from "./pages/NotFound";
import BookSession from "./pages/student/BookSession";
import MentalHealthCheckup from "./pages/student/MentalHealthCheckup";
import PeerSupport from "./pages/student/PeerSupport";
import ResourcesHub from "./pages/student/ResourcesHub";
import Chatbot from "./pages/student/Chatbot";
import Bookings from "./pages/counselor/Bookings";
import Records from "./pages/counselor/Records";
import InstituteStudents from "./pages/institute/Students";
import CounselorManagement from "./pages/institute/CounselorManagement";
import Analytics from "./pages/institute/Analytics";
import Settings from "./pages/institute/Settings";
import CounselorAvailability from "./pages/institute/CounselorAvailability";
import MyBookings from "./pages/student/MyBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student Routes */}
            <Route path="/student-dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/book-session" element={
              <ProtectedRoute allowedRoles={['student']}>
                <BookSession />
              </ProtectedRoute>
            } />
            <Route path="/student/mental-health-checkup" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MentalHealthCheckup />
              </ProtectedRoute>
            } />
            <Route path="/student/my-bookings" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/student/peer-support" element={
              <ProtectedRoute allowedRoles={['student']}>
                <PeerSupport />
              </ProtectedRoute>
            } />
            <Route path="/student/resources" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ResourcesHub />
              </ProtectedRoute>
            } />
            <Route path="/student/chatbot" element={
              <ProtectedRoute allowedRoles={['student']}>
                <Chatbot />
              </ProtectedRoute>
            } />

            {/* Counselor Routes */}
            <Route path="/counselor-dashboard" element={
              <ProtectedRoute allowedRoles={['counselor']}>
                <CounselorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/counselor/bookings" element={
              <ProtectedRoute allowedRoles={['counselor']}>
                <Bookings />
              </ProtectedRoute>
            } />
            <Route path="/counselor/records" element={
              <ProtectedRoute allowedRoles={['counselor']}>
                <Records />
              </ProtectedRoute>
            } />

            {/* Institute Routes */}
            <Route path="/institute-dashboard" element={
              <ProtectedRoute allowedRoles={['institute']}>
                <InstituteDashboard />
              </ProtectedRoute>
            } />
            <Route path="/institute/students" element={
              <ProtectedRoute allowedRoles={['institute']}>
                <InstituteStudents />
              </ProtectedRoute>
            } />
            <Route path="/institute/counselors" element={
              <ProtectedRoute allowedRoles={['institute']}>
                <CounselorManagement />
              </ProtectedRoute>
            } />
             <Route path="/institute/counselor-availability/:counselorId" element={
              <ProtectedRoute allowedRoles={['institute']}>
                <CounselorAvailability />
              </ProtectedRoute>
            } />
            <Route path="/institute/analytics" element={
              <ProtectedRoute allowedRoles={['institute']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/institute/settings" element={
              <ProtectedRoute allowedRoles={['institute']}>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;