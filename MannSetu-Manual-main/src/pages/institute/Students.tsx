import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Filter,
  Download,
  BarChart3,
  UserCheck,
  TrendingUp,
  Settings,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Brain,
  Heart,
  GraduationCap,
  MapPin
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Students = () => {
  const sidebarItems = [
    { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3 },
    { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck },
    { title: "Analytics", url: "/institute/analytics", icon: TrendingUp },
    { title: "Students", url: "/institute/students", icon: Users, isActive: true },
    { title: "Settings", url: "/institute/settings", icon: Settings },
  ];

  const studentOverview = {
    totalStudents: 2847,
    activeInSupport: 734,
    screeningCompleted: 2421,
    highRiskStudents: 45,
    moderateRisk: 189,
    lowRisk: 2613
  };

  const departmentStats = [
    {
      name: "Engineering",
      totalStudents: 1234,
      inSupport: 287,
      avgWellness: 68,
      riskDistribution: { high: 18, medium: 89, low: 1127 }
    },
    {
      name: "Medical Sciences", 
      totalStudents: 567,
      inSupport: 176,
      avgWellness: 65,
      riskDistribution: { high: 12, medium: 45, low: 510 }
    },
    {
      name: "Liberal Arts",
      totalStudents: 423,
      inSupport: 98,
      avgWellness: 75,
      riskDistribution: { high: 6, medium: 28, low: 389 }
    },
    {
      name: "Business",
      totalStudents: 389,
      inSupport: 89,
      avgWellness: 72,
      riskDistribution: { high: 5, medium: 18, low: 366 }
    },
    {
      name: "Sciences",
      totalStudents: 234,
      inSupport: 84,
      avgWellness: 70,
      riskDistribution: { high: 4, medium: 9, low: 221 }
    }
  ];

  const yearWiseData = [
    { year: "1st Year", students: 756, support: 198, wellness: 69 },
    { year: "2nd Year", students: 698, support: 167, wellness: 72 },
    { year: "3rd Year", students: 734, support: 189, wellness: 68 },
    { year: "4th Year", students: 659, support: 180, wellness: 74 }
  ];

  const studentList = [
    { 
      id: "2024001", 
      name: "Arjun Sharma", 
      email: "arjun.sharma@student.iitd.ac.in", 
      department: "Computer Science", 
      year: "3rd Year",
      riskLevel: "Low",
      lastActive: "2 days ago"
    },
    { 
      id: "2024002", 
      name: "Priya Patel", 
      email: "priya.patel@student.iitd.ac.in", 
      department: "Mechanical", 
      year: "2nd Year",
      riskLevel: "Medium",
      lastActive: "1 week ago"
    },
    { 
      id: "2024003", 
      name: "Rahul Kumar", 
      email: "rahul.kumar@student.iitd.ac.in", 
      department: "Electrical", 
      year: "4th Year",
      riskLevel: "Low",
      lastActive: "3 days ago"
    },
    { 
      id: "2024004", 
      name: "Sneha Gupta", 
      email: "sneha.gupta@student.iitd.ac.in", 
      department: "Chemical", 
      year: "1st Year",
      riskLevel: "High",
      lastActive: "1 day ago"
    },
    { 
      id: "2024005", 
      name: "Vikram Singh", 
      email: "vikram.singh@student.iitd.ac.in", 
      department: "Civil", 
      year: "3rd Year",
      riskLevel: "Medium",
      lastActive: "5 days ago"
    },
    { 
      id: "2024006", 
      name: "Anita Sharma", 
      email: "anita.sharma@student.iitd.ac.in", 
      department: "Electronics", 
      year: "2nd Year",
      riskLevel: "Low",
      lastActive: "4 days ago"
    },
    { 
      id: "2024007", 
      name: "Ravi Mehta", 
      email: "ravi.mehta@student.iitd.ac.in", 
      department: "Biotechnology", 
      year: "4th Year",
      riskLevel: "Low",
      lastActive: "1 week ago"
    },
    { 
      id: "2024008", 
      name: "Kavya Iyer", 
      email: "kavya.iyer@student.iitd.ac.in", 
      department: "Physics", 
      year: "1st Year",
      riskLevel: "Medium",
      lastActive: "2 days ago"
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "down": return <TrendingUp className="h-4 w-4 text-success rotate-180" />;
      case "stable": return <CheckCircle className="h-4 w-4 text-warning" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="IIT Delhi">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                Student Mental Health Overview
              </h1>
              <p className="text-muted-foreground">
                Comprehensive view of student mental health status and support utilization
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by department, year, or support status..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentOverview.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Enrolled this semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-success" />
                In Support Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentOverview.activeInSupport}</div>
              <p className="text-xs text-success">
                {Math.round((studentOverview.activeInSupport / studentOverview.totalStudents) * 100)}% utilization
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent" />
                Screening Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentOverview.screeningCompleted}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((studentOverview.screeningCompleted / studentOverview.totalStudents) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{studentOverview.highRiskStudents}</div>
              <p className="text-xs text-destructive">Immediate attention required</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="studentlist">Student Directory</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Action Items moved inside the overview tab */}
            <Card className="border-warning/20 bg-warning-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border">
                  <p className="font-medium">Engineering Department - High Stress Levels</p>
                  <p className="text-sm text-muted-foreground">
                    Consider implementing targeted stress management workshops during exam periods.
                  </p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="font-medium">1st Year Students - Support Outreach</p>
                  <p className="text-sm text-muted-foreground">
                    Lower utilization rate suggests need for better awareness programs for new students.
                  </p>
                </div>
                <div className="p-3 rounded-lg border">
                  <p className="font-medium">Financial Stress - Rising Concern</p>
                  <p className="text-sm text-muted-foreground">
                    Coordinate with financial aid office to address economic pressures affecting mental health.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="studentlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registered Students</CardTitle>
                <CardDescription>
                  Complete directory of students registered in the mental health support program
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentList.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">{student.department}</Badge>
                            <Badge variant="outline" className="text-xs">{student.year}</Badge>
                            <Badge 
                              variant={
                                student.riskLevel === "High" ? "destructive" :
                                student.riskLevel === "Medium" ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {student.riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Active {student.lastActive}</span>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline">
                    Load More Students
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Items */}
      </div>
    </DashboardLayout>
  );
};

export default Students;