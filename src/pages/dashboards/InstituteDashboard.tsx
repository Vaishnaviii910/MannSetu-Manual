import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowUpRight, BarChart3, UserCheck, TrendingUp, Users, Settings, Calendar, BookOpen, MessageSquare, Shield, LifeBuoy } from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Link } from "react-router-dom";
import { useInstituteData } from "../../hooks/useInstituteData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const sessionData = [
    { name: 'Jan', sessions: 65 },
    { name: 'Feb', sessions: 59 },
    { name: 'Mar', sessions: 80 },
    { name: 'Apr', sessions: 81 },
    { name: 'May', sessions: 56 },
    { name: 'Jun', sessions: 55 },
    { name: 'Jul', sessions: 40 },
];

const InstituteDashboard = () => {
    const { counselors, students, loading } = useInstituteData();

    const sidebarItems = [
        { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3, isActive: true },
        { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck },
        { title: "Analytics", url: "/institute/analytics", icon: TrendingUp },
        { title: "Students", url: "/institute/students", icon: Users },
        { title: "Settings", url: "/institute/settings", icon: Settings },
    ];

    const quickAccessItems = [
        { title: "Resource Hub", description: "Access articles, videos, and tools.", icon: BookOpen, url: "/student/resources" },
        { title: "Peer Support", description: "Connect with peers in forums.", icon: MessageSquare, url: "/student/peer-support" },
        { title: "Crisis Support", description: "Get immediate help now.", icon: Shield, url: "/student/crisis-support" },
        { title: "Help & FAQ", description: "Find answers to your questions.", icon: LifeBuoy, url: "/student/faq" },
    ];

    return (
        <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="Admin">
            <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : students.length}</div>
                            <p className="text-xs text-muted-foreground">+5% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Counselors</CardTitle>
                            <UserCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loading ? '...' : counselors.filter(c => c.is_active).length}</div>
                            <p className="text-xs text-muted-foreground">out of {counselors.length} total</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">142</div>
                            <p className="text-xs text-muted-foreground">+15% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Student Wellness Score</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8.2/10</div>
                            <p className="text-xs text-muted-foreground">Avg. based on recent check-ups</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Session Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={sessionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Counselor Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {counselors.slice(0, 4).map(counselor => (
                                <div key={counselor.id} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback>{counselor.full_name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{counselor.full_name}</p>
                                        <p className="text-sm text-muted-foreground">{counselor.speciality}</p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        <Badge variant={counselor.is_active ? "default" : "secondary"}>
                                            {counselor.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            <Button asChild variant="outline" className="w-full">
                                <Link to="/institute/counselors">View All Counselors</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {quickAccessItems.map((item) => (
                            <Link to={item.url} key={item.title}>
                                <div className="p-4 border rounded-lg hover:bg-muted transition-colors h-full flex flex-col">
                                    <item.icon className="h-6 w-6 mb-2 text-primary" />
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground flex-grow">{item.description}</p>
                                    <div className="text-sm font-medium text-primary flex items-center mt-2">
                                        Go to section <ArrowUpRight className="h-4 w-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default InstituteDashboard;