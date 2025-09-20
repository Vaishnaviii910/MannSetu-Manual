import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, CheckCircle, XCircle, MessageSquare, BarChart3, Settings, BookOpen, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCounselorData } from "@/hooks/useCounselorData";
import { useToast } from "@/hooks/use-toast";

const Bookings = () => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { bookings, todaySessions, pendingRequests, loading, updateBookingStatus } = useCounselorData();

  const handleApproveRequest = async (bookingId: string) => {
    const { error } = await updateBookingStatus(bookingId, 'confirmed');
    if (!error) {
      toast({
        title: "Booking Approved",
        description: "Session confirmed and student notified.",
      });
    }
  };

  const handleRejectRequest = async (bookingId: string, reason: string) => {
    if (!reason.trim()) {
      toast({
        title: "Rejection Reason Required",
        variant: "destructive",
      });
      return;
    }

    const { error } = await updateBookingStatus(bookingId, 'rejected', reason);
    if (!error) {
      toast({
        title: "Booking Rejected",
        description: "Student has been notified.",
      });
      setRejectionReason("");
      setSelectedBookingId(null);
    }
  };

  const sidebarItems = [
    { title: "Dashboard", url: "/counselor-dashboard", icon: BarChart3 },
    { title: "Bookings", url: "/counselor/bookings", icon: CalendarIcon, isActive: true },
    { title: "Student Records", url: "/counselor/records", icon: BookOpen },
    { title: "Settings", url: "/counselor/settings", icon: Settings },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="counselor" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Requests ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="today">Today's Schedule ({todaySessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                  <p className="text-muted-foreground">All requests have been processed.</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-warning">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {request.students?.full_name?.split(' ').map(n => n[0]).join('') || 'ST'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.students?.full_name || 'Unknown Student'}</h3>
                          <p className="text-sm text-muted-foreground">{request.students?.student_id || 'N/A'}</p>
                          <Badge variant="secondary">{request.status}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{new Date(request.booking_date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">{request.start_time} - {request.end_time}</p>
                      </div>
                    </div>

                    {request.student_notes && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Student's Notes:</p>
                        <p className="text-sm text-muted-foreground">{request.student_notes}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveRequest(request.id)}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setSelectedBookingId(request.id)}
                            className="flex items-center gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reject Booking Request</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="rejection-reason">Reason for rejection</Label>
                              <Textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Please provide a reason..."
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setRejectionReason("");
                                  setSelectedBookingId(null);
                                }}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => selectedBookingId && handleRejectRequest(selectedBookingId, rejectionReason)}
                                className="flex-1"
                              >
                                Reject Booking
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : todaySessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Sessions Today</h3>
                  <p className="text-muted-foreground">You have no scheduled sessions.</p>
                </CardContent>
              </Card>
            ) : (
              todaySessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {session.students?.full_name?.split(' ').map(n => n[0]).join('') || 'ST'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{session.students?.full_name || 'Unknown Student'}</h3>
                          <p className="text-sm text-muted-foreground">{session.students?.student_id || 'N/A'}</p>
                          <Badge variant="default">{session.status}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{session.start_time} - {session.end_time}</p>
                        <p className="text-sm text-muted-foreground">{new Date(session.booking_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button size="sm">Start Session</Button>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Bookings;