import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Calendar } from "../../components/ui/calendar";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useBookingSystem } from "../../hooks/useBookingSystem";
import { useToast } from "../../hooks/use-toast";
import { BarChart3, Calendar as CalendarIcon, Heart, Users, BookOpen, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Header } from "@radix-ui/react-accordion";

const BookSession = () => {
    const { 
        counselors, 
        availableSlots, 
        loading, 
        loadingSlots, 
        getCounselorsForStudent, 
        getAvailableSlots, 
        createBooking 
    } = useBookingSystem();
    const { toast } = useToast();

    const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [studentNotes, setStudentNotes] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    const sidebarItems = [
        { title: "Dashboard", url: "/student-dashboard", icon: BarChart3 },
        { title: "Book Session", url: "/student/book-session", icon: CalendarIcon, isActive: true },
        { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Heart },
        { title: "Peer Support", url: "/student/peer-support", icon: Users },
        { title: "Resources Hub", url: "/student/resources", icon: BookOpen },
        { title: "AI Chatbot", url: "/student/chatbot", icon: MessageSquare },
    ];

    useEffect(() => {
        getCounselorsForStudent();
    }, [getCounselorsForStudent]);

    const fetchSlots = useCallback(() => {
        if (selectedCounselor && selectedDate) {
            getAvailableSlots(selectedCounselor, format(selectedDate, "yyyy-MM-dd"));
        }
    }, [selectedCounselor, selectedDate, getAvailableSlots]);

    useEffect(() => {
        fetchSlots();
    }, [fetchSlots]);

    const handleBooking = async () => {
        if (!selectedCounselor || !selectedTime) {
            toast({ title: "Incomplete Selection", description: "Please select a counselor and a time slot.", variant: "destructive" });
            return;
        }
        setIsBooking(true);
        const { error } = await createBooking(selectedCounselor, selectedTime, studentNotes);
        if (error) {
            toast({ title: "Booking Failed", description: "Could not book the session. Please try again.", variant: "destructive" });
        } else {
            toast({ title: "Booking Request Sent", description: "Your request has been sent to the counselor for approval." });
            setSelectedTime(null);
            // Refetch slots to show updated availability
            fetchSlots();
        }
        setIsBooking(false);
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };
    
    const handleCounselorChange = (counselorId: string) => {
        setSelectedCounselor(counselorId);
        setSelectedTime(null);
    };

    return (
        <DashboardLayout sidebarItems={sidebarItems} userType="student" userName="Student">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Book a Counseling Session</CardTitle>
                        <CardDescription>Find a time that works for you and connect with one of our professional counselors.</CardDescription>
                    </CardHeader>
                </Card>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Select a Counselor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <p>Loading counselors...</p>
                                ) : (
                                    <Select onValueChange={handleCounselorChange} value={selectedCounselor || undefined}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a counselor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {counselors.map(counselor => (
                                                <SelectItem key={counselor.id} value={counselor.id}>
                                                    {counselor.full_name} - <span className="text-muted-foreground">{counselor.speciality || "General"}</span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Select a Date</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateChange}
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                    className="rounded-md border"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>3. Select an Available Time</CardTitle>
                                <CardDescription>Choose a time slot from the list below.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingSlots ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                ) : availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableSlots.map((slot) => (
                                            <Button
                                                key={slot.id}
                                                variant={selectedTime === slot.id ? "default" : "outline"}
                                                onClick={() => setSelectedTime(slot.id)}
                                                className="flex flex-col h-auto py-2"
                                            >
                                                <span className="font-semibold">{format(new Date(`1970-01-01T${slot.start_time}`), 'p')}</span>
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">
                                        {selectedCounselor && selectedDate ? "No available slots for this day. Please try another date." : "Please select a counselor and date first."}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>4. Add Notes & Confirm</CardTitle>
                                <CardDescription>Optionally, add a brief note for the counselor.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="e.g., I'd like to talk about exam stress."
                                    value={studentNotes}
                                    onChange={(e) => setStudentNotes(e.target.value)}
                                />
                                <Button onClick={handleBooking} disabled={!selectedTime || isBooking} className="w-full">
                                    {isBooking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    {isBooking ? "Booking..." : "Request Session"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BookSession;

