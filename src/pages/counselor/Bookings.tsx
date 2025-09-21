import { useState, useMemo } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useCounselorData } from '../../hooks/useCounselorData';
import { useToast } from '../../hooks/use-toast';
import { BarChart3, Calendar, Check, X, Users, BookOpen, Clock, Loader2, Info } from 'lucide-react';
import { format } from 'date-fns';

const RejectBookingDialog = ({ booking, onConfirm }: { booking: any, onConfirm: (reason: string) => void }) => {
  const [reason, setReason] = useState('');
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject Booking Request</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <p>You are about to reject the booking request from <span className="font-semibold">{booking.students.full_name}</span> for <span className="font-semibold">{format(new Date(booking.booking_date), 'PPP')} at {format(new Date(`1970-01-01T${booking.start_time}`), 'p')}</span>.</p>
        <div className="space-y-2">
          <Label htmlFor="rejection-reason">Reason for Rejection (Optional)</Label>
          <Textarea id="rejection-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., I am unavailable at this time due to an emergency." />
        </div>
        <div className="flex justify-end gap-2">
           <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <Button variant="destructive" onClick={() => onConfirm(reason)} disabled={!reason}>Confirm Rejection</Button>
        </div>
      </div>
    </DialogContent>
  );
};

const BookingCard = ({ booking, onApprove, onReject }: { booking: any, onApprove: () => void, onReject: (reason: string) => void }) => {
  const isPending = booking.status === 'pending';

  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{booking.students.full_name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold">{booking.students.full_name}</p>
          <p className="text-sm text-muted-foreground">{booking.students.student_id}</p>
          <div className="flex items-center gap-2 mt-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(booking.booking_date), 'PPP')}</span>
            <Clock className="h-4 w-4" />
            <span>{format(new Date(`1970-01-01T${booking.start_time}`), 'p')}</span>
          </div>
          {booking.student_notes && (
            <div className="mt-2 text-sm p-2 bg-muted rounded-md flex items-start gap-2">
              <Info className="h-4 w-4 mt-1" />
              <span>{booking.student_notes}</span>
            </div>
          )}
        </div>
        {isPending && (
          <div className="flex gap-2 self-start md:self-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm"><X className="h-4 w-4 mr-2" /> Reject</Button>
              </DialogTrigger>
              <RejectBookingDialog booking={booking} onConfirm={onReject} />
            </Dialog>
            <Button size="sm" onClick={onApprove}><Check className="h-4 w-4 mr-2" /> Approve</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Bookings = () => {
  const { bookings, loading, approveBooking, rejectBooking } = useCounselorData();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sidebarItems = [
    { title: "Dashboard", url: "/counselor-dashboard", icon: BarChart3 },
    { title: "Bookings", url: "/counselor/bookings", icon: Calendar, isActive: true },
    { title: "Student Records", url: "/counselor/records", icon: BookOpen },
    { title: "Peer Support", url: "/counselor/peer-support", icon: Users },
  ];

  const handleApprove = async (bookingId: string, timeSlotId: string) => {
    setIsSubmitting(true);
    const { error } = await approveBooking(bookingId, timeSlotId);
    if (error) {
      toast({ title: "Error", description: "Failed to approve booking.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Booking approved successfully." });
    }
    setIsSubmitting(false);
  };

  const handleReject = async (bookingId: string, timeSlotId: string, reason: string) => {
    setIsSubmitting(true);
    const { error } = await rejectBooking(bookingId, timeSlotId, reason);
    if (error) {
      toast({ title: "Error", description: "Failed to reject booking.", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Booking rejected." });
    }
     // Close dialog by finding its trigger
    const trigger = document.querySelector('[data-state="open"]');
    if (trigger instanceof HTMLElement) trigger.click();
    setIsSubmitting(false);
  };
  
  const filteredBookings = useMemo(() => {
    const pending = bookings.filter(b => b.status === 'pending');
    const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(b.booking_date) >= new Date());
    const past = bookings.filter(b => b.status === 'confirmed' && new Date(b.booking_date) < new Date());
    return { pending, upcoming, past };
  }, [bookings]);

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="counselor" userName="Counselor">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Manage Bookings</CardTitle>
            <CardDescription>Review pending requests and manage your upcoming and past sessions.</CardDescription>
          </CardHeader>
        </Card>
        
        {isSubmitting && <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-white"/></div>}

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Requests <Badge className="ml-2">{filteredBookings.pending.length}</Badge></TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sessions <Badge className="ml-2">{filteredBookings.upcoming.length}</Badge></TabsTrigger>
            <TabsTrigger value="past">Past Sessions <Badge className="ml-2">{filteredBookings.past.length}</Badge></TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <>
              <TabsContent value="pending" className="space-y-4">
                {filteredBookings.pending.length > 0 ? (
                  filteredBookings.pending.map(booking => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onApprove={() => handleApprove(booking.id, booking.time_slot_id)}
                      onReject={(reason) => handleReject(booking.id, booking.time_slot_id, reason)}
                    />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-12">No pending booking requests.</p>
                )}
              </TabsContent>
              <TabsContent value="upcoming" className="space-y-4">
                 {filteredBookings.upcoming.length > 0 ? (
                  filteredBookings.upcoming.map(booking => <BookingCard key={booking.id} booking={booking} onApprove={() => {}} onReject={() => {}}/>)
                ) : (
                  <p className="text-center text-muted-foreground py-12">No upcoming sessions scheduled.</p>
                )}
              </TabsContent>
              <TabsContent value="past" className="space-y-4">
                {filteredBookings.past.length > 0 ? (
                    filteredBookings.past.map(booking => <BookingCard key={booking.id} booking={booking} onApprove={() => {}} onReject={() => {}}/>)
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

export default Bookings;