import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Search, 
  Calendar, 
  Clock, 
  FileText,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  User,
  Phone,
  Mail
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Students = () => {
  const sidebarItems = [
    { title: "Dashboard", url: "/counselor-dashboard", icon: Calendar },
    { title: "Bookings", url: "/counselor/bookings", icon: Clock },
    { title: "Session Records", url: "/counselor/records", icon: FileText },
    { title: "Students", url: "/counselor/students", icon: Users, isActive: true },
  ];

  const studentCaseload = [
    {
      id: "2024001",
      name: "Anonymous Student A",
      year: "2nd Year",
      department: "Computer Science",
      riskLevel: "Low",
      totalSessions: 8,
      lastSession: "2024-01-15",
      nextSession: "2024-01-22",
      primaryConcerns: ["Academic Stress", "Time Management"],
      progressTrend: "improving",
      wellnessScore: 78,
      engagementLevel: "High",
      notes: "Consistent attendance, implementing coping strategies well"
    },
    {
      id: "2024015",
      name: "Anonymous Student B", 
      year: "3rd Year",
      department: "Engineering",
      riskLevel: "High",
      totalSessions: 12,
      lastSession: "2024-01-15",
      nextSession: "2024-01-17",
      primaryConcerns: ["Severe Anxiety", "Panic Attacks"],
      progressTrend: "stable",
      wellnessScore: 45,
      engagementLevel: "Medium",
      notes: "Requires close monitoring, emergency protocols in place"
    },
    {
      id: "2024032",
      name: "Anonymous Student C",
      year: "1st Year", 
      department: "Liberal Arts",
      riskLevel: "Medium",
      totalSessions: 4,
      lastSession: "2024-01-14",
      nextSession: "2024-01-21",
      primaryConcerns: ["Social Anxiety", "Adjustment Issues"],
      progressTrend: "improving",
      wellnessScore: 62,
      engagementLevel: "High",
      notes: "New student adjusting well to counseling process"
    },
    {
      id: "2024008",
      name: "Anonymous Student D",
      year: "4th Year",
      department: "Business",
      riskLevel: "Low",
      totalSessions: 15,
      lastSession: "2024-01-14", 
      nextSession: "2024-01-21",
      primaryConcerns: ["Career Anxiety", "Future Planning"],
      progressTrend: "improving", 
      wellnessScore: 82,
      engagementLevel: "High",
      notes: "Nearing completion of treatment goals"
    },
    {
      id: "2024025",
      name: "Anonymous Student E",
      year: "2nd Year",
      department: "Medicine",
      riskLevel: "Medium",
      totalSessions: 6,
      lastSession: "2024-01-12",
      nextSession: "2024-01-19",
      primaryConcerns: ["Burnout", "Sleep Issues"],
      progressTrend: "declining",
      wellnessScore: 55,
      engagementLevel: "Low",
      notes: "Missed last appointment, follow-up needed"
    }
  ];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "High": return "destructive";
      case "Medium": return "default";
      case "Low": return "secondary";
      default: return "secondary";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-success" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "stable": return <CheckCircle className="h-4 w-4 text-warning" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="counselor" userName="Dr. Sarah Wilson">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              Student Caseload Management
            </h1>
            <p className="text-muted-foreground">
              Monitor progress, track wellness outcomes, and manage your assigned students
            </p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students by ID, department, or concerns..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                Total: {studentCaseload.length} students
              </Badge>
              <Badge variant="destructive" className="px-3 py-1">
                High Risk: {studentCaseload.filter(s => s.riskLevel === "High").length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentCaseload.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {studentCaseload.filter(s => s.riskLevel === "High").length}
              </div>
              <p className="text-xs text-muted-foreground">Require close monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Wellness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(studentCaseload.reduce((acc, s) => acc + s.wellnessScore, 0) / studentCaseload.length)}%
              </div>
              <p className="text-xs text-muted-foreground">+5% improvement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">6 completed, 6 upcoming</p>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {studentCaseload.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {student.id.slice(-2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{student.name}</h3>
                      <p className="text-muted-foreground">
                        Student ID: {student.id} • {student.year} • {student.department}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRiskBadgeVariant(student.riskLevel)}>
                          {student.riskLevel} Risk
                        </Badge>
                        <Badge variant="outline">
                          {student.engagementLevel} Engagement
                        </Badge>
                        {getTrendIcon(student.progressTrend)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-1">{student.wellnessScore}%</div>
                    <div className="text-xs text-muted-foreground">Wellness Score</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Primary Concerns</h4>
                      <div className="flex flex-wrap gap-1">
                        {student.primaryConcerns.map((concern, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {concern}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Progress Indicator</h4>
                      <Progress value={student.wellnessScore} className="h-2" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Sessions:</span>
                        <span className="font-medium ml-2">{student.totalSessions}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Session:</span>
                        <span className="font-medium ml-2">{student.lastSession}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">Notes</h4>
                      <p className="text-sm text-muted-foreground">{student.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Next session: <span className="font-medium">{student.nextSession}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Records
                    </Button>
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Priority Actions */}
        <Card className="border-warning/20 bg-warning-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Priority Actions Required
            </CardTitle>
            <CardDescription>
              Students requiring immediate attention or follow-up
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-destructive/20 bg-destructive-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Student #2024015 - Crisis Follow-up</p>
                  <p className="text-sm text-muted-foreground">High-risk student, next session tomorrow</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
            
            <div className="p-3 rounded-lg border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Student #2024025 - Missed Appointment</p>
                  <p className="text-sm text-muted-foreground">Declining trend, missed last session</p>
                </div>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Students;