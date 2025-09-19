import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, MessageSquare, Users, BarChart3, Settings, Heart, BookOpen, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useBookingSystem } from "@/hooks/useBookingSystem";

const BookSession = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [description, setDescription] = useState("");
  
  const { toast } = useToast();
  const { counselors, availableSlots, loading, getCounselorsForStudent, getAvailableSlots, createBooking } = useBookingSystem();

  useEffect(() => {
    getCounselorsForStudent();
  }, []);

  useEffect(() => {
    if (selectedCounselor && selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      getAvailableSlots(selectedCounselor, dateString);
    }
  }, [selectedCounselor, selectedDate]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedCounselor || !sessionType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const selectedSlot = availableSlots.find(slot => 
      `${slot.start_time}-${slot.end_time}` === selectedTime
    );

    if (selectedSlot) {
      const bookingDate = selectedDate.toISOString().split('T')[0];
      const { error } = await createBooking(
        selectedCounselor,
        selectedSlot.id,
        bookingDate,
        selectedSlot.start_time,
        selectedSlot.end_time,
        description
      );

      if (!error) {
        toast({
          title: "Session Booked Successfully!",
          description: "Your session has been scheduled for counselor approval.",
        });
        // Reset form
        setSelectedDate(undefined);
        setSelectedTime("");
        setSelectedCounselor("");
        setSessionType("");
        setDescription("");
      }
    }
  };

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: BarChart3 },
    { title: "Book Session", url: "/student/book-session", icon: CalendarIcon, isActive: true },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Heart },
    { title: "Peer Support", url: "/student/peer-support", icon: Users },
    { title: "Resources Hub", url: "/student/resources", icon: BookOpen },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageSquare },
    { title: "Settings", url: "/student/settings", icon: Settings },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName="Student">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Book Counseling Session</h1>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Counseling</SelectItem>
                    <SelectItem value="crisis">Crisis Intervention</SelectItem>
                    <SelectItem value="academic">Academic Support</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Counselor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : counselors.length === 0 ? (
                  <p className="text-muted-foreground">No counselors available</p>
                ) : (
                  counselors.map((counselor) => (
                    <Card 
                      key={counselor.id}
                      className={`cursor-pointer ${selectedCounselor === counselor.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedCounselor(counselor.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback>{counselor.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{counselor.full_name}</h4>
                            <p className="text-sm text-muted-foreground">{counselor.speciality || 'General Counseling'}</p>
                            <Badge variant={counselor.is_active ? "default" : "secondary"}>
                              {counselor.is_active ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe what you'd like to discuss..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </CardContent>
            </Card>

            <Button onClick={handleBooking} className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Book Session
            </Button>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Times</CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedCounselor || !selectedDate ? (
                  <p className="text-muted-foreground">Select counselor and date first</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-muted-foreground">No available slots</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {availableSlots.map((slot) => {
                      const timeString = `${slot.start_time}-${slot.end_time}`;
                      return (
                        <Button
                          key={slot.id}
                          variant={selectedTime === timeString ? "default" : "outline"}
                          onClick={() => setSelectedTime(timeString)}
                          size="sm"
                        >
                          {slot.start_time.substring(0, 5)}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookSession;