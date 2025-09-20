import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  Users, 
  BookOpen, 
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  Plus,
  Trash2,
  Save
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useStudentData } from "@/hooks/useStudentData";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { 
    studentData, 
    phqTests, 
    bookings, 
    moodEntries,
    reminders,
    loading, 
    addMoodEntry,
    updateTodaysFocus,
    addReminder,
    toggleReminder,
    deleteReminder
  } = useStudentData();
  
  const [selectedMood, setSelectedMood] = useState<string>('neutral');
  const [todaysFocus, setTodaysFocus] = useState<string>("");
  const [newReminder, setNewReminder] = useState("");
  const [isReminderDialogOpen, setReminderDialogOpen] = useState(false);

  useEffect(() => {
    if (studentData?.todays_focus) {
      setTodaysFocus(studentData.todays_focus);
    } else {
      setTodaysFocus("Practice mindfulness for 10 minutes");
    }
  }, [studentData]);

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart, isActive: true },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle },
    { title: "Book Session", url: "/student/book-session", icon: Calendar },
    { title: "Peer Support", url: "/student/peer-support", icon: Users },
    { title: "Resources Hub", url: "/student/resources", icon: BookOpen },
  ];

  const moodValueMapping: { [key: string]: number } = {
    'very_sad': 1, 'sad': 2, 'neutral': 3, 'happy': 4, 'very_happy': 5,
  };

  const latestPHQTest = phqTests[0];
  const phqScore = latestPHQTest?.score || 0;
  const phqLevel = latestPHQTest?.severity_level || 'Not Available';
  
  const moodData = moodEntries.slice(0, 7).reverse().map(entry => ({
    day: new Date(entry.entry_date).toLocaleDateString('en', { weekday: 'short' }),
    mood: moodValueMapping[entry.mood]
  }));

  const recentActivities = [
    ...bookings.slice(0, 2).map(booking => ({
      type: "session",
      title: `Session with ${booking.counselors?.full_name}`,
      time: new Date(booking.booking_date).toLocaleDateString(),
      status: booking.status
    })),
    ...(latestPHQTest ? [{
      type: "screening",
      title: "Mental health screening completed",
      time: new Date(latestPHQTest.test_date).toLocaleDateString(),
      status: "completed"
    }] : [])
  ];

  const handleMoodSubmit = async () => {
    await addMoodEntry(selectedMood);
  };
  
  const handleFocusSubmit = () => {
    updateTodaysFocus(todaysFocus);
  };

  const handleAddReminder = () => {
    if (newReminder.trim()) {
      addReminder(newReminder.trim());
      setNewReminder("");
      setReminderDialogOpen(false);
    }
  };

  const moodOptions = [
    { value: 'very_sad', label: "Very Sad", color: "bg-destructive", emoji: "😢" },
    { value: 'sad', label: "Sad", color: "bg-destructive/70", emoji: "😟" },
    { value: 'neutral', label: "Neutral", color: "bg-muted", emoji: "😶" },
    { value: 'happy', label: "Happy", color: "bg-success", emoji: "😊" },
    { value: 'very_happy', label: "Very Happy", color: "bg-primary", emoji: "😁" },
  ];

  if (loading && !studentData) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="student" userName="Student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome back, {studentData?.full_name}!</h1>
          <p className="text-muted-foreground">
            Here's your mental wellness overview. Remember, seeking support is a sign of strength.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary-soft to-primary-soft/30 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">PHQ-9 Score</CardTitle>
              <Brain className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{phqScore}/27</div>
              <Badge variant="secondary" className="mt-2">{phqLevel}</Badge>
              <Progress value={(phqScore / 27) * 100} className="mt-3" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success-soft to-success-soft/30 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</div>
              <Badge variant="secondary" className="mt-2">Upcoming</Badge>
              <Progress value={bookings.length > 0 ? 100 : 0} className="mt-3" />
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-accent-soft to-accent-soft/30 border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wellness Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodEntries.length}</div>
              <Badge variant="secondary" className="mt-2">Days tracked</Badge>
              <Progress value={Math.min((moodEntries.length / 30) * 100, 100)} className="mt-3" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-card to-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" /> Daily Mood Tracker
              </CardTitle>
              <CardDescription>Track your daily mood and see weekly patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">How are you feeling today?</h4>
                <div className="grid grid-cols-5 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-3 rounded-lg border text-center transition-all hover:shadow-soft ${
                        selectedMood === mood.value ? `${mood.color} border-current shadow-soft scale-105` : 'border-border hover:border-border/80'
                      }`}
                    >
                      <div className="text-2xl mb-1">{mood.emoji}</div>
                      <div className="text-xs font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="mood" stroke="#DFA8D8" fill="#DFA8D8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent-soft/50 to-accent-soft/20 border-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent" />
                Today's Focus
              </CardTitle>
              <CardDescription>
                Your wellness goal for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-accent-soft/30 border border-accent/20">
                <p className="font-medium text-accent">{todaysFocus}</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleMoodSubmit}>
                    <Activity className="h-4 w-4 mr-2" />
                    Save today's mood
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full justify-start">
                    <Link to="/student/mental-health-checkup">
                      <Brain className="h-4 w-4 mr-2" />
                      Take mental health checkup
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <Label className="text-sm font-medium">Update today's focus:</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="text"
                    value={todaysFocus}
                    onChange={(e) => setTodaysFocus(e.target.value)}
                    className="w-full text-sm"
                    placeholder="Set your wellness goal..."
                  />
                  <Button size="sm" onClick={handleFocusSubmit}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Upcoming Reminders</CardTitle>
                        <Dialog open={isReminderDialogOpen} onOpenChange={setReminderDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" />Add Reminder</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create a new reminder</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="reminder-title">Title</Label>
                                    <Input id="reminder-title" value={newReminder} onChange={(e) => setNewReminder(e.target.value)} placeholder="e.g., Drink water, take a break..." />
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddReminder}>Save Reminder</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <CardDescription>Important activities for your mental wellness.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {reminders.length > 0 ? reminders.map(reminder => (
                            <div key={reminder.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                    <Checkbox checked={reminder.is_completed} onCheckedChange={() => toggleReminder(reminder.id, reminder.is_completed)} id={`reminder-${reminder.id}`} />
                                    <label htmlFor={`reminder-${reminder.id}`} className={`text-sm font-medium ${reminder.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                                        {reminder.title}
                                    </label>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteReminder(reminder.id)}>
                                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </div>
                        )) : (
                           <p className="text-sm text-muted-foreground text-center py-4">No reminders yet. Add one to get started!</p> 
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Recent Activity</CardTitle>
                    <CardDescription>Your recent interactions and progress on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30">
                        <div className="flex-shrink-0">
                            {activity.status === "completed" || activity.status === "confirmed" ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                            ) : (
                            <Clock className="h-5 w-5 text-warning" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant={activity.status === "completed" || activity.status === "confirmed" ? "default" : "secondary"}>
                            {activity.status}
                        </Badge>
                        </div>
                    )) : (
                        <p className="text-muted-foreground text-center py-4">No recent activities yet</p>
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;









