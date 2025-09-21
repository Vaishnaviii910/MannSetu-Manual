import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { 
  UserCheck, 
  Plus, 
  Search, 
  Users, 
  TrendingUp,
  Settings,
  BarChart3,
  Clock,
  MoreHorizontal,
  Loader2
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useInstituteData } from "../../hooks/useInstituteData";
import { useState } from "react";
import { useToast } from "../../hooks/use-toast";
import { Link } from "react-router-dom";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const CounselorManagement = () => {
  const { counselors, loading, createCounselor, updateCounselorStatus } = useInstituteData();
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
        variant: "destructive"
      });
      console.error(error);
    }
  };

  const handleUpdateStatus = async (counselorId: string, isActive: boolean) => {
    const { error } = await updateCounselorStatus(counselorId, isActive);
    
    if (!error) {
      toast({
        title: "Status Updated",
        description: `Counselor status has been updated`,
      });
    } else {
       toast({
        title: "Update Failed",
        description: "Could not update counselor status.",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-focus rounded-lg flex items-center justify-center">
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
                    <Input id="full_name" value={newCounselorData.full_name} onChange={(e) => setNewCounselorData({...newCounselorData, full_name: e.target.value})} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={newCounselorData.email} onChange={(e) => setNewCounselorData({...newCounselorData, email: e.target.value})} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" value={newCounselorData.password} onChange={(e) => setNewCounselorData({...newCounselorData, password: e.target.value})} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={newCounselorData.phone} onChange={(e) => setNewCounselorData({...newCounselorData, phone: e.target.value})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="speciality">Specialization</Label>
                    <Input id="speciality" value={newCounselorData.speciality} onChange={(e) => setNewCounselorData({...newCounselorData, speciality: e.target.value})} placeholder="e.g., Anxiety & Depression" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Input id="qualifications" value={newCounselorData.qualifications} onChange={(e) => setNewCounselorData({...newCounselorData, qualifications: e.target.value})} placeholder="e.g., PhD Clinical Psychology" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input id="experience_years" type="number" value={newCounselorData.experience_years} onChange={(e) => setNewCounselorData({...newCounselorData, experience_years: parseInt(e.target.value) || 0})} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" value={newCounselorData.bio} onChange={(e) => setNewCounselorData({...newCounselorData, bio: e.target.value})} placeholder="Brief professional bio..." />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} className="flex-1"> Cancel </Button>
                    <Button type="submit" className="flex-1"> Add Counselor </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search counselors by name or specialization..." className="pl-10" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {counselors.length === 0 ? (
              <Card className="col-span-full">
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
                            {counselor.full_name.split(' ').map((n:string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-xl">{counselor.full_name}</h3>
                          <p className="text-muted-foreground">{counselor.speciality || 'General Counseling'}</p>
                          <Badge variant={counselor.is_active ? "default" : "secondary"} className="mt-2">
                            {counselor.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateStatus(counselor.id, !counselor.is_active)}>
                                {counselor.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                             <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>{counselor.qualifications || 'Professional Counselor'}</p>
                        <p>Experience: {counselor.experience_years || 0} years</p>
                        <p>Joined: {new Date(counselor.created_at).toLocaleDateString()}</p>
                    </div>

                    <div className="flex gap-2 pt-4 mt-4 border-t">
                      <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                      <Button size="sm" asChild className="flex-1">
                        <Link to={`/institute/counselor-availability/${counselor.id}`}>Manage Availability</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CounselorManagement;