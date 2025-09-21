import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Users, 
  Calendar,
  TrendingUp,
  Settings,
  BarChart3,
  Star,
  Clock,
  Phone,
  Mail,
  Edit,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInstituteData } from "@/hooks/useInstituteData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const CounselorManagement = () => {
  const { counselors, loading, createCounselor, updateCounselorStatus, refreshData } = useInstituteData();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCounselorData, setNewCounselorData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    speciality: '',
    qualifications: '',
    experience_years: 0,
    bio: ''
  });

  const sidebarItems = [
    { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3 },
    { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck, isActive: true },
    { title: "Analytics", url: "/institute/analytics", icon: TrendingUp },
    { title: "Students", url: "/institute/students", icon: Users },
    { title: "Settings", url: "/institute/settings", icon: Settings },
  ];

  const handleAddCounselor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCounselorData.full_name || !newCounselorData.email || !newCounselorData.password) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await createCounselor(newCounselorData);
    
    if (!error) {
      toast({
        title: "Counselor Added",
        description: `${newCounselorData.full_name} has been successfully added to your institute`,
      });
      setIsAddDialogOpen(false);
      setNewCounselorData({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        speciality: '',
        qualifications: '',
        experience_years: 0,
        bio: ''
      });
    }
    else{
      toast({
        title: "Something went wrong.",
        description: `${newCounselorData.full_name} has not been added`,
      });
      console.log(error);
    }
  };

  const handleUpdateStatus = async (counselorId: string, isActive: boolean) => {
    const { error } = await updateCounselorStatus(counselorId, isActive);
    
    if (!error) {
      toast({
        title: "Status Updated",
        description: `Counselor status has been updated`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default";
      case "On Leave": return "secondary";
      case "Inactive": return "destructive";
      default: return "secondary";
    }
  };

  const getCaseloadColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "text-destructive";
    if (percentage >= 75) return "text-warning";
    return "text-success";
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="IIT Delhi">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-lg flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                Counselor Management
              </h1>
              <p className="text-muted-foreground">
                Manage your counseling team, track performance, and oversee workload distribution
              </p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Counselor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Counselor</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCounselor} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={newCounselorData.full_name}
                      onChange={(e) => setNewCounselorData({...newCounselorData, full_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCounselorData.email}
                      onChange={(e) => setNewCounselorData({...newCounselorData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newCounselorData.password}
                      onChange={(e) => setNewCounselorData({...newCounselorData, password: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newCounselorData.phone}
                      onChange={(e) => setNewCounselorData({...newCounselorData, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="speciality">Specialization</Label>
                    <Input
                      id="speciality"
                      value={newCounselorData.speciality}
                      onChange={(e) => setNewCounselorData({...newCounselorData, speciality: e.target.value})}
                      placeholder="e.g., Anxiety & Depression"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Input
                      id="qualifications"
                      value={newCounselorData.qualifications}
                      onChange={(e) => setNewCounselorData({...newCounselorData, qualifications: e.target.value})}
                      placeholder="e.g., PhD Clinical Psychology"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      value={newCounselorData.experience_years}
                      onChange={(e) => setNewCounselorData({...newCounselorData, experience_years: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={newCounselorData.bio}
                      onChange={(e) => setNewCounselorData({...newCounselorData, bio: e.target.value})}
                      placeholder="Brief professional bio..."
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Add Counselor
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search counselors by name, specialization, or status..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Team Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="recruitment">Recruitment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {/* Overview Stats */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Counselors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{counselors.length}</div>
                      <p className="text-xs text-muted-foreground">Total in your institute</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Counselors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{counselors.filter(c => c.is_active).length}</div>
                      <p className="text-xs text-muted-foreground">Currently available</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {counselors.length > 0 ? Math.round(counselors.reduce((acc, c) => acc + (c.experience_years || 0), 0) / counselors.length) : 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Years average</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Specializations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Set(counselors.map(c => c.speciality).filter(Boolean)).size}
                      </div>
                      <p className="text-xs text-muted-foreground">Different areas</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Counselors List */}
                <div className="space-y-4">
                  {counselors.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Counselors Yet</h3>
                        <p className="text-muted-foreground mb-4">Start by adding your first counselor to begin providing mental health support.</p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Counselor
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    counselors.map((counselor) => (
                      <Card key={counselor.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                  {counselor.full_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-xl">{counselor.full_name}</h3>
                                <p className="text-muted-foreground">{counselor.speciality || 'General Counseling'}</p>
                                <p className="text-sm text-muted-foreground">{counselor.qualifications || 'Professional Counselor'}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant={counselor.is_active ? "default" : "secondary"}>
                                    {counselor.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                  {counselor.experience_years && (
                                    <Badge variant="outline">{counselor.experience_years} years exp.</Badge>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm">ID: {counselor.counselor_id}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateStatus(counselor.id, !counselor.is_active)}
                              >
                                {counselor.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6 mb-4">
                            <div>
                              <h4 className="font-medium text-sm mb-3">Contact Information</h4>
                              <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {counselor.phone || 'Not provided'}
                                </p>
                                <p className="text-muted-foreground">
                                  Joined: {new Date(counselor.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-sm mb-3">Professional Details</h4>
                              <div className="space-y-1 text-sm">
                                <p>Experience: <span className="font-medium">{counselor.experience_years || 0} years</span></p>
                                <p>Status: <span className="font-medium">{counselor.is_active ? 'Available' : 'Unavailable'}</span></p>
                                {counselor.bio && (
                                  <p className="text-muted-foreground mt-2">{counselor.bio}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="text-sm text-muted-foreground">
                              Last updated: {new Date(counselor.updated_at).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                              <Button size="sm">
                                Manage Schedule
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Track counselor effectiveness and student satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Performance analytics dashboard would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Management</CardTitle>
                <CardDescription>
                  Manage counselor availability and shift assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Schedule management interface would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recruitment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Pipeline</CardTitle>
                <CardDescription>
                  Manage hiring process and onboard new counselors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Recruitment management system would be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Counselor Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {counselors.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  You have {counselors.filter(c => c.is_active).length} active counselors out of {counselors.length} total.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {counselors.slice(0, 4).map((counselor) => (
                    <div key={counselor.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {counselor.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{counselor.full_name}</p>
                        <p className="text-xs text-muted-foreground">{counselor.speciality || 'General Counseling'}</p>
                      </div>
                      <Badge variant={counselor.is_active ? "default" : "secondary"} className="text-xs">
                        {counselor.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
                {counselors.length > 4 && (
                  <p className="text-xs text-muted-foreground text-center">
                    And {counselors.length - 4} more counselors...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p>No counselors added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CounselorManagement;