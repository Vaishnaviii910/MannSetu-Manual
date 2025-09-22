import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useStudentData } from '@/hooks/useStudentData';
import { useToast } from '@/hooks/use-toast';
import { Brain, Calendar as CalendarIcon, Heart, Users, BookOpen, MessageCircle, Clock, X, Loader2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const getBadgeVariant = (status:string) => {
  switch (status) {
    case 'confirmed': return 'default';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    case 'cancelled': return 'outline';
    default: return 'secondary';
  }
};

const BookingCard = ({ booking, onCancel }: { booking: any, onCancel: () => void }) => {
  const canCancel = booking.status === 'confirmed' || booking.status === 'pending';

  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{booking.counselors.full_name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className='flex justify-between items-start'>
            <div>
              <p className="font-semibold">{booking.counselors.full_name}</p>
              <p className="text-sm text-muted-foreground">{booking.counselors.speciality || "General Counseling"}</p>
            </div>
            <Badge variant={getBadgeVariant(booking.status)} className="capitalize">{booking.status}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>{format(new Date(booking.booking_date), 'PPP')}</span>
            <Clock className="h-4 w-4" />
            <span>{format(new Date(`1970-01-01T${booking.start_time}`), 'p')}</span>
          </div>
           {booking.rejection_reason && booking.status === 'rejected' && (
            <div className="mt-2 text-sm p-2 bg-destructive/10 border border-destructive/20 text-destructive-foreground rounded-md flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-1" />
              <span><strong>Rejection Reason:</strong> {booking.rejection_reason}</span>
            </div>
          )}
        </div>
        {canCancel && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm"><X className="h-4 w-4 mr-2" /> Cancel</Button>
            </DialogTrigger>
             <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This will cancel your booking request. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogTrigger asChild><Button variant="outline">Back</Button></DialogTrigger>
                  <Button variant="destructive" onClick={onCancel}>Confirm Cancellation</Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};


const MyBookings = () => {
  const { studentData, bookings, loading, cancelBooking } = useStudentData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle },
    { title: "Book Session", url: "/student/book-session", icon: CalendarIcon },
    { title: "My Bookings", url: "/student/my-bookings", icon: CalendarIcon, isActive: true },
    { title: "Peer Support", url: "/student/peer-support", icon: Users },
    { title: "Resources Hub", url: "/student/resources", icon: BookOpen },
  ];

  const handleCancel = async (bookingId: string, timeSlotId: string) => {
    setIsSubmitting(true);
    const { error } = await cancelBooking(bookingId, timeSlotId);
    if (error) {
      toast({ title: "Error", description: "Failed to cancel booking.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Booking cancelled successfully." });
    }
     const trigger = document.querySelector('[data-state="open"]');
    if (trigger instanceof HTMLElement) trigger.click();
    setIsSubmitting(false);
  };

  const filteredBookings = useMemo(() => {
    const upcoming = bookings.filter(b => (b.status === 'confirmed' || b.status === 'pending') && new Date(b.booking_date) >= new Date());
    const past = bookings.filter(b => b.status !== 'pending' && new Date(b.booking_date) < new Date());
    return { upcoming, past };
  }, [bookings]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">My Bookings</CardTitle>
                    <CardDescription>Review the status of your booking requests and manage your upcoming sessions.</CardDescription>
                </CardHeader>
            </Card>

            {isSubmitting && <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-white"/></div>}

            <Tabs defaultValue="upcoming">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming & Pending <Badge className="ml-2">{filteredBookings.upcoming.length}</Badge></TabsTrigger>
                    <TabsTrigger value="past">History <Badge className="ml-2">{filteredBookings.past.length}</Badge></TabsTrigger>
                </TabsList>

                {loading ? (
                    <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <>
                        <TabsContent value="upcoming" className="space-y-4">
                            {filteredBookings.upcoming.length > 0 ? (
                                filteredBookings.upcoming.map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={() => handleCancel(booking.id, booking.time_slot_id)}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground mb-4">You have no upcoming sessions.</p>
                                    <Button asChild>
                                        <Link to="/student/book-session">Book a New Session</Link>
                                    </Button>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="past" className="space-y-4">
                            {filteredBookings.past.length > 0 ? (
                                filteredBookings.past.map(booking => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        onCancel={() => {}}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-12">No past sessions found.</p>
                            )}
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    </DashboardLayout>
  );
};

export default MyBookings;