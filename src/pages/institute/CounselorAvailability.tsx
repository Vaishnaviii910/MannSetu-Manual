import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { useInstituteData } from "../../hooks/useInstituteData";
import { useToast } from "../../hooks/use-toast";
import { Loader2, Save, ArrowLeft, BarChart3, UserCheck, TrendingUp, Users, Settings } from "lucide-react";

type Availability = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
};

const CounselorAvailability = () => {
  const { counselorId } = useParams<{ counselorId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { counselors, getCounselorAvailability, updateCounselorAvailability, loading: instituteLoading } = useInstituteData();
  
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [counselor, setCounselor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const counselorData = counselors.find(c => c.id === counselorId);
    setCounselor(counselorData);
  }, [counselorId, counselors]);

  const fetchAvailability = useCallback(async () => {
    if (!counselorId) return;
    setLoading(true);
    const data = await getCounselorAvailability(counselorId);
    
    const fullWeekAvailability: Availability[] = daysOfWeek.map((_, index) => {
        const existing = data.find(a => a.day_of_week === index);
        return existing || { day_of_week: index, start_time: "09:00", end_time: "17:00", is_active: index > 0 && index < 6 };
    });

    setAvailability(fullWeekAvailability);
    setLoading(false);
  }, [counselorId, getCounselorAvailability]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleAvailabilityChange = (dayIndex: number, field: keyof Availability, value: any) => {
    setAvailability(prev => 
        prev.map(day => 
            day.day_of_week === dayIndex ? { ...day, [field]: value } : day
        )
    );
  };

  const handleSaveChanges = async () => {
    if (!counselorId) return;
    setLoading(true);
    const { error } = await updateCounselorAvailability(counselorId, availability);
    if (!error) {
      toast({ title: "Success", description: "Availability updated successfully." });
    } else {
      toast({ title: "Error", description: "Failed to update availability. Make sure to define a unique availability schedule for each day.", variant: "destructive" });
    }
    setLoading(false);
  };

  const sidebarItems = [
    { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3 },
    { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck, isActive: true },
    { title: "Analytics", url: "/institute/analytics", icon: TrendingUp },
    { title: "Students", url: "/institute/students", icon: Users },
    { title: "Settings", url: "/institute/settings", icon: Settings },
  ];

  if (loading || instituteLoading) {
    return (
        <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="Admin">
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName={counselor?.full_name || "Admin"}>
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Counselor Management
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Manage Work Hours for {counselor?.full_name}</CardTitle>
            <CardDescription>Set the weekly working hours. The system will auto-generate 1-hour slots based on these hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {availability.sort((a,b) => a.day_of_week - b.day_of_week).map((day) => (
              <div key={day.day_of_week} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 p-4 border rounded-lg">
                <Label className="font-semibold">{daysOfWeek[day.day_of_week]}</Label>
                <div className="flex items-center gap-2">
                    <Label htmlFor={`start-${day.day_of_week}`} className="text-sm">From</Label>
                    <Input id={`start-${day.day_of_week}`} type="time" value={day.start_time} onChange={(e) => handleAvailabilityChange(day.day_of_week, 'start_time', e.target.value)} disabled={!day.is_active} />
                </div>
                 <div className="flex items-center gap-2">
                    <Label htmlFor={`end-${day.day_of_week}`} className="text-sm">To</Label>
                    <Input id={`end-${day.day_of_week}`} type="time" value={day.end_time} onChange={(e) => handleAvailabilityChange(day.day_of_week, 'end_time', e.target.value)} disabled={!day.is_active} />
                </div>
                <div className="flex items-center space-x-2 justify-self-end">
                    <Switch id={`active-${day.day_of_week}`} checked={day.is_active} onCheckedChange={(checked) => handleAvailabilityChange(day.day_of_week, 'is_active', checked)} />
                    <Label htmlFor={`active-${day.day_of_week}`}>{day.is_active ? "Active" : "Inactive"}</Label>
                </div>
              </div>
            ))}
             <Button onClick={handleSaveChanges} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4 mr-2"/>
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CounselorAvailability;