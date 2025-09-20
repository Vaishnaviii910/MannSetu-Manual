import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Shield,
  Settings,
  Plus,
  Activity
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

const InstituteDashboard = () => {
  const sidebarItems = [
    { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3, isActive: true },
    { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck },
    { title: "Analytics", url: "/institute/analytics", icon: TrendingUp },
    { title: "Students", url: "/institute/students", icon: Users },
    { title: "Settings", url: "/institute/settings", icon: Settings },
  ];

  const overviewStats = [
    { 
      title: "Total Students", 
      value: "2,847", 
      change: "+12% this semester",
      icon: Users,
      color: "text-primary"
    },
    { 
      title: "Active Counselors", 
      value: "18", 
      change: "+2 hired this month",
      icon: UserCheck,
      color: "text-success"
    },
    { 
      title: "Sessions This Month", 
      value: "432", 
      change: "+25% from last month",
      icon: Calendar,
      color: "text-accent"
    },
    { 
      title: "Support Utilization", 
      value: "68%", 
      change: "+8% increase",
      icon: TrendingUp,
      color: "text-warning"
    },
  ];

  const mentalHealthMetrics = {
    screeningParticipation: 85,
    averageWellnessScore: 72,
    highRiskStudents: 24,
    supportEngagement: 91
  };

  const recentAlerts = [
    { type: "high-risk", message: "5 students flagged for immediate attention", time: "2 hours ago" },
    { type: "capacity", message: "Counseling capacity at 90%", time: "4 hours ago" },
    { type: "screening", message: "Monthly screening completion: 85%", time: "1 day ago" },
  ];

  const counselorWorkload = [
    { name: "Dr. Sarah Wilson", students: 24, sessions: 18, availability: 85 },
    { name: "Dr. Michael Chen", students: 28, sessions: 22, availability: 70 },
    { name: "Dr. Priya Sharma", students: 22, sessions: 16, availability: 95 },
    { name: "Dr. James Rodriguez", students: 26, sessions: 20, availability: 80 },
  ];

  const instituteTrends = [
    { month: "Jan", students: 2456, sessions: 342, utilization: 45 },
    { month: "Feb", students: 2532, sessions: 398, utilization: 52 },
    { month: "Mar", students: 2678, sessions: 445, utilization: 58 },
    { month: "Apr", students: 2743, sessions: 521, utilization: 62 },
    { month: "May", students: 2847, sessions: 587, utilization: 68 },
  ];

  const departmentData = [
    { department: "Engineering", count: 534, utilization: 23 },
    { department: "Medical", count: 423, utilization: 31 },
    { department: "Liberal Arts", count: 298, utilization: 18 },
    { department: "Business", count: 267, utilization: 16 },
    { department: "Sciences", count: 345, utilization: 21 },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="IIT Delhi">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Institute Overview</h1>
            <p className="text-muted-foreground">
              Mental health support analytics and management for your institution
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Counselor
          </Button>
        </div>

        {/* Overview Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat, index) => (
            <Card key={index} className="bg-gradient-to-br from-card to-muted/30 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Institute Growth Trends */}
        <Card className="bg-gradient-to-br from-card to-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Institute Growth & Utilization Trends
            </CardTitle>
            <CardDescription>
              Student enrollment, session volume, and support utilization over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={instituteTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Area type="monotone" dataKey="sessions" stackId="1" stroke="#8B9FE8" fill="#8B9FE8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="utilization" stackId="2" stroke="#A8C5A5" fill="#A8C5A5" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mental Health Metrics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Mental Wellness Metrics
              </CardTitle>
              <CardDescription>
                Anonymized insights into student mental health trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Screening Participation</span>
                    <span className="text-sm font-bold">{mentalHealthMetrics.screeningParticipation}%</span>
                  </div>
                  <Progress value={mentalHealthMetrics.screeningParticipation} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Average Wellness Score</span>
                    <span className="text-sm font-bold">{mentalHealthMetrics.averageWellnessScore}%</span>
                  </div>
                  <Progress value={mentalHealthMetrics.averageWellnessScore} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Support Engagement</span>
                    <span className="text-sm font-bold">{mentalHealthMetrics.supportEngagement}%</span>
                  </div>
                  <Progress value={mentalHealthMetrics.supportEngagement} className="h-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-warning-soft border border-warning/20">
                  <div className="text-2xl font-bold text-warning">{mentalHealthMetrics.highRiskStudents}</div>
                  <p className="text-sm text-warning-foreground">Students requiring attention</p>
                </div>
                <div className="p-4 rounded-lg bg-success-soft border border-success/20">
                  <div className="text-2xl font-bold text-success">91%</div>
                  <p className="text-sm text-success-foreground">Successfully supported</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Important notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="p-3 rounded-lg border space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "high-risk" ? "bg-destructive" :
                        alert.type === "capacity" ? "bg-warning" : "bg-primary"
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstituteDashboard;