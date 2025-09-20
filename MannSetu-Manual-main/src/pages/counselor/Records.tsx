import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Search, 
  Calendar, 
  Clock, 
  Users,
  Plus,
  Eye,
  Edit,
  Save,
  User,
  AlertTriangle,
  TrendingUp,
  Filter
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Records = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");

  const sidebarItems = [
    { title: "Dashboard", url: "/counselor-dashboard", icon: Calendar },
    { title: "Bookings", url: "/counselor/bookings", icon: Clock },
    { title: "Session Records", url: "/counselor/records", icon: FileText, isActive: true },
  ];

  const recentSessions = [
    {
      id: 1,
      studentId: "2024001",
      date: "2024-01-15",
      time: "10:00 AM",
      duration: "50 mins",
      type: "Individual Counseling",
      status: "Completed",
      riskLevel: "Low",
      nextSession: "2024-01-22",
      summary: "Student showed improvement in anxiety management. Discussed coping strategies for exam stress."
    },
    {
      id: 2,
      studentId: "2024015", 
      date: "2024-01-15",
      time: "2:00 PM",
      duration: "45 mins",
      type: "Crisis Support",
      status: "Completed",
      riskLevel: "High",
      nextSession: "2024-01-17",
      summary: "Emergency session for severe anxiety attack. Implemented immediate coping strategies. Follow-up scheduled."
    },
    {
      id: 3,
      studentId: "2024032",
      date: "2024-01-14",
      time: "11:00 AM", 
      duration: "50 mins",
      type: "Initial Assessment",
      status: "Completed",
      riskLevel: "Medium",
      nextSession: "2024-01-21",
      summary: "First session - conducted comprehensive mental health assessment. Identified academic stress as primary concern."
    },
    {
      id: 4,
      studentId: "2024008",
      date: "2024-01-14",
      time: "4:00 PM",
      duration: "40 mins", 
      type: "Follow-up",
      status: "Notes Pending",
      riskLevel: "Low",
      nextSession: "2024-01-21",
      summary: ""
    }
  ];

  const sessionTemplates = [
    {
      name: "Initial Assessment",
      sections: ["Background Information", "Current Concerns", "Mental Health History", "Risk Assessment", "Treatment Plan"]
    },
    {
      name: "Regular Session",
      sections: ["Session Goals", "Progress Review", "Interventions Used", "Homework/Action Items", "Next Steps"]
    },
    {
      name: "Crisis Intervention",
      sections: ["Crisis Details", "Immediate Risk Assessment", "Safety Planning", "Interventions", "Follow-up Plan"]
    }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="counselor" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Session Records & Notes
            </h1>
            <p className="text-muted-foreground">
              Confidential session documentation, progress tracking, and case management
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by student ID, session type, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Record
            </Button>
          </div>
        </div>

        <Tabs defaultValue="records" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="records">Session Records</TabsTrigger>
            <TabsTrigger value="notes">Quick Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Records List */}
              <div className="lg:col-span-2 space-y-4">
                {recentSessions.map((session) => (
                  <Card 
                    key={session.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      session.riskLevel === 'High' ? 'border-l-4 border-l-destructive' :
                      session.riskLevel === 'Medium' ? 'border-l-4 border-l-warning' :
                      'border-l-4 border-l-success'
                    }`}
                    onClick={() => setSelectedRecord(session)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Student #{session.studentId}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              session.riskLevel === 'High' ? 'destructive' :
                              session.riskLevel === 'Medium' ? 'default' : 'secondary'
                            }
                          >
                            {session.riskLevel} Risk
                          </Badge>
                          <Badge variant={session.status === 'Completed' ? 'default' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        {session.date} at {session.time} • {session.duration} • {session.type}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.summary || "Session notes pending..."}
                      </p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>Next session: {session.nextSession}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Session Details Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Session Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded bg-primary-soft">
                        <div className="text-lg font-bold text-primary">24</div>
                        <div className="text-xs text-muted-foreground">Total Sessions</div>
                      </div>
                      <div className="text-center p-3 rounded bg-success-soft">
                        <div className="text-lg font-bold text-success">18</div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 rounded bg-success-soft">
                        <div className="font-medium text-success">15</div>
                        <div className="text-muted-foreground">Low Risk</div>
                      </div>
                      <div className="text-center p-2 rounded bg-warning-soft">
                        <div className="font-medium text-warning">6</div>
                        <div className="text-muted-foreground">Medium</div>
                      </div>
                      <div className="text-center p-2 rounded bg-destructive-soft">
                        <div className="font-medium text-destructive">3</div>
                        <div className="text-muted-foreground">High Risk</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-warning/20 bg-warning-foreground">
                  <CardHeader>
                    <CardTitle className="text-warning text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Pending Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">2 Sessions need notes completion</p>
                      <p className="text-muted-foreground text-xs">Complete within 24 hours</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">1 High-risk follow-up due</p>
                      <p className="text-muted-foreground text-xs">Student #2024015 - Tomorrow</p>
                    </div>
                    <Button size="sm" className="w-full">
                      Review Pending Items
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Progress Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Session completion rate</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average improvement</span>
                        <span className="font-medium text-success">+23%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crisis interventions</span>
                        <span className="font-medium">3 this month</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Session Notes</CardTitle>
                <CardDescription>
                  Write quick notes during or after sessions - will be added to the formal record
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Student ID</label>
                    <Input placeholder="Enter student ID" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Session Type</label>
                    <Input placeholder="e.g., Regular, Crisis, Follow-up" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Session Notes</label>
                  <Textarea 
                    placeholder="Key observations, interventions used, student response, action items..."
                    className="min-h-[200px]"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Risk Level</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Next Session</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Follow-up Required</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>No</option>
                      <option>Within 24 hours</option>
                      <option>Within 1 week</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Session Notes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Records;