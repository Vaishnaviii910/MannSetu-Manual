import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Calendar,
  Settings,
  UserCheck,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Brain,
  Heart,
  Target,
  Activity
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const Analytics = () => {
  const sidebarItems = [
    { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3 },
    { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck },
    { title: "Analytics", url: "/institute/analytics", icon: TrendingUp, isActive: true },
    { title: "Students", url: "/institute/students", icon: Users },
    { title: "Settings", url: "/institute/settings", icon: Settings },
  ];

  const wellnessMetrics = {
    averageScore: 72,
    screeningCompletion: 85,
    highRiskStudents: 24,
    supportEngagement: 91,
    treatmentSuccess: 78
  };

  const monthlyTrends = [
    { month: "Jan", sessions: 342, students: 156, satisfaction: 4.2 },
    { month: "Feb", sessions: 398, students: 178, satisfaction: 4.4 },
    { month: "Mar", sessions: 445, students: 192, satisfaction: 4.3 },
    { month: "Apr", sessions: 521, students: 203, satisfaction: 4.6 },
    { month: "May", sessions: 487, students: 198, satisfaction: 4.5 }
  ];

  const riskDistribution = [
    { level: "Low Risk", count: 1456, percentage: 68, color: "bg-success" },
    { level: "Moderate Risk", count: 578, percentage: 27, color: "bg-warning" },
    { level: "High Risk", count: 112, percentage: 5, color: "bg-destructive" }
  ];

  const interventionEffectiveness = [
    { type: "Individual Counseling", success: 82, total: 156 },
    { type: "Group Therapy", success: 74, total: 89 },
    { type: "Crisis Intervention", success: 91, total: 23 },
    { type: "Peer Support", success: 68, total: 234 }
  ];

  const departmentAnalytics = [
    { department: "Engineering", students: 534, utilization: 23, avgScore: 68 },
    { department: "Medical Sciences", students: 423, utilization: 31, avgScore: 65 },
    { department: "Liberal Arts", students: 298, utilization: 18, avgScore: 75 },
    { department: "Business", students: 267, utilization: 16, avgScore: 72 },
    { department: "Sciences", students: 345, utilization: 21, avgScore: 70 }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="IIT Delhi">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Mental Health Analytics
              </h1>
              <p className="text-muted-foreground">
                Comprehensive insights into student mental health trends and intervention effectiveness
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wellness">Wellness Trends</TabsTrigger>
            <TabsTrigger value="interventions">Interventions</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    Avg Wellness Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wellnessMetrics.averageScore}%</div>
                  <p className="text-xs text-success">+5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Screening Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wellnessMetrics.screeningCompletion}%</div>
                  <p className="text-xs text-muted-foreground">Students screened</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    High Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wellnessMetrics.highRiskStudents}</div>
                  <p className="text-xs text-muted-foreground">Students requiring attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wellnessMetrics.supportEngagement}%</div>
                  <p className="text-xs text-success">High utilization</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-warning" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wellnessMetrics.treatmentSuccess}%</div>
                  <p className="text-xs text-success">Treatment effectiveness</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Monthly Trends
                </CardTitle>
                <CardDescription>
                  Session volume, student engagement, and satisfaction trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-5 gap-4">
                    {monthlyTrends.map((month) => (
                      <div key={month.month} className="text-center">
                        <div className="bg-muted rounded-lg p-4 mb-2">
                          <div className="text-2xl font-bold text-primary">{month.sessions}</div>
                          <div className="text-xs text-muted-foreground">Sessions</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{month.month}</div>
                          <div className="text-xs text-muted-foreground">{month.students} students</div>
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-3 w-3 text-success" />
                            <span className="text-xs">{month.satisfaction}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Level Distribution
                </CardTitle>
                <CardDescription>
                  Current distribution of students across risk categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskDistribution.map((risk) => (
                    <div key={risk.level} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{risk.level}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{risk.count} students</span>
                          <Badge variant="secondary">{risk.percentage}%</Badge>
                        </div>
                      </div>
                      <Progress value={risk.percentage} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle>Wellness Score Trends</CardTitle>
                  <CardDescription>
                    Average mental health scores over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyTrends}>
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
                      <Area type="monotone" dataKey="satisfaction" stroke="#A8C5A5" fill="#A8C5A5" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted/30">
                <CardHeader>
                  <CardTitle>Risk Level Distribution</CardTitle>
                  <CardDescription>
                    Current student risk assessment breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="percentage"
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.level === "Low Risk" ? "#A8C5A5" :
                            entry.level === "Moderate Risk" ? "#F0C987" : "#DFA8D8"
                          } />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-1 gap-2 mt-4">
                    {riskDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            item.level === "Low Risk" ? "bg-success" :
                            item.level === "Moderate Risk" ? "bg-warning" : "bg-destructive"
                          }`} />
                          <span className="text-sm">{item.level}</span>
                        </div>
                        <span className="text-sm font-medium">{item.count} students</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Intervention Effectiveness
                </CardTitle>
                <CardDescription>
                  Success rates and outcomes for different intervention types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interventionEffectiveness.map((intervention) => (
                    <div key={intervention.type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{intervention.type}</h4>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {intervention.success}/{intervention.total} successful
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((intervention.success / intervention.total) * 100)}% success rate
                          </div>
                        </div>
                      </div>
                      <Progress value={(intervention.success / intervention.total) * 100} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Department-wise Analytics
                </CardTitle>
                <CardDescription>
                  Mental health metrics across different academic departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentAnalytics.map((dept) => (
                    <Card key={dept.department} className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold">{dept.department}</h4>
                        <Badge variant="outline">{dept.students} students</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Support Utilization</div>
                          <div className="font-medium">{dept.utilization}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Wellness Score</div>
                          <div className="font-medium">{dept.avgScore}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Trend</div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-success" />
                            <span className="text-success">Improving</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outcomes" className="space-y-6">
            <Card className="bg-gradient-to-br from-card to-muted/30">
              <CardHeader>
                <CardTitle>Treatment Outcomes & Success Metrics</CardTitle>
                <CardDescription>
                  Long-term outcomes and success metrics for mental health interventions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyTrends}>
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
                    <Bar dataKey="sessions" fill="#8B9FE8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="students" fill="#A8C5A5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alert Summary */}
        <Card className="border-warning/20 bg-warning-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Key Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Engineering Department Alert</p>
              <p className="text-sm text-muted-foreground">
                Higher than average stress levels detected. Consider targeted intervention programs.
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Counselor Capacity</p>
              <p className="text-sm text-muted-foreground">
                Current capacity at 85%. Consider hiring additional counselors for optimal support.
              </p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Peer Support Success</p>
              <p className="text-sm text-muted-foreground">
                68% effectiveness in peer support programs. Opportunity for improvement through enhanced moderation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;