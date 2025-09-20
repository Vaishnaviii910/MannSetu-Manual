import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Users, 
  BarChart3,
  UserCheck,
  TrendingUp,
  Save,
  Upload,
  Download,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  AlertTriangle
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();

  const sidebarItems = [
    { title: "Dashboard", url: "/institute-dashboard", icon: BarChart3 },
    { title: "Counselor Management", url: "/institute/counselors", icon: UserCheck },
    { title: "Analytics", url: "/institute/analytics", icon: TrendingUp },
    { title: "Students", url: "/institute/students", icon: Users },
    { title: "Settings", url: "/institute/settings", icon: SettingsIcon, isActive: true },
  ];

  const handleSaveSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Your institute settings have been saved successfully.",
    });
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="institute" userName="IIT Delhi">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            Institute Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your mental health support platform settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Institute Information</CardTitle>
                <CardDescription>
                  Basic information about your institution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instituteName">Institute Name</Label>
                    <Input id="instituteName" defaultValue="Indian Institute of Technology Delhi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ugcCode">UGC Code</Label>
                    <Input id="ugcCode" defaultValue="IITD-2024" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address"
                    defaultValue="Hauz Khas, New Delhi - 110016, India"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Primary Phone</Label>
                    <Input id="phone" defaultValue="+91-11-2659-1244" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Primary Email</Label>
                    <Input id="email" type="email" defaultValue="admin@iitd.ac.in" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="https://home.iitd.ac.in" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Platform Preferences</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="anonymousMode">Anonymous Mode by Default</Label>
                        <Switch id="anonymousMode" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Students will be anonymous in counselor interactions by default
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoScreening">Auto-Schedule Screening</Label>
                        <Switch id="autoScreening" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatically prompt students for monthly mental health screenings
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="crisisAlerts">Crisis Alert System</Label>
                        <Switch id="crisisAlerts" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enable immediate alerts for high-risk students
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="peerSupport">Peer Support Groups</Label>
                        <Switch id="peerSupport" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Allow students to create and join peer support groups
                      </p>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Emergency Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Crisis Alerts</Label>
                        <p className="text-sm text-muted-foreground">Immediate notifications for students at high risk</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Emergency Sessions</Label>
                        <p className="text-sm text-muted-foreground">Alerts when emergency counseling is requested</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">System Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-muted-foreground">Weekly summary of platform usage and metrics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Counselor Updates</Label>
                        <p className="text-sm text-muted-foreground">Notifications about counselor availability and updates</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>System Maintenance</Label>
                        <p className="text-sm text-muted-foreground">Alerts about scheduled maintenance and updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Methods</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Email Notifications</Label>
                      <Input placeholder="admin@institute.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label>SMS Alerts</Label>
                      <Input placeholder="+91-XXXXXXXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slack Webhook</Label>
                      <Input placeholder="https://hooks.slack.com/..." />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data Protection
                </CardTitle>
                <CardDescription>
                  Configure data privacy and protection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Data Anonymization</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Student Identity Protection</Label>
                        <p className="text-sm text-muted-foreground">All student data is anonymized in reports and analytics</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Session Recording</Label>
                        <p className="text-sm text-muted-foreground">Record session metadata for quality assurance</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Data Retention</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Student Records Retention (Years)</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Session Notes Retention (Years)</Label>
                      <Input type="number" defaultValue="7" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Access Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Multi-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Require MFA for all admin accounts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>IP Address Restrictions</Label>
                        <p className="text-sm text-muted-foreground">Limit access to specific IP ranges</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  External Integrations
                </CardTitle>
                <CardDescription>
                  Connect with external systems and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Student Information System</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SIS API Endpoint</Label>
                      <Input placeholder="https://sis.institute.edu/api" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input type="password" placeholder="Enter API key" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Test Connection</Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Students
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Email System</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP Server</Label>
                      <Input defaultValue="smtp.institute.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Input defaultValue="587" />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input defaultValue="noreply@institute.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input type="password" placeholder="Enter password" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Analytics & Reporting</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Google Analytics</Label>
                        <p className="text-sm text-muted-foreground">Track platform usage and engagement</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="space-y-2">
                      <Label>Tracking ID</Label>
                      <Input placeholder="GA-XXXXXXXX-X" />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Integration Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security policies and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Password Policies</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Password Length</Label>
                      <Input type="number" defaultValue="8" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password Expiry (Days)</Label>
                      <Input type="number" defaultValue="90" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Special Characters</Label>
                        <p className="text-sm text-muted-foreground">Passwords must contain special characters</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require Numbers</Label>
                        <p className="text-sm text-muted-foreground">Passwords must contain numbers</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Session Security</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Session Timeout (Minutes)</Label>
                      <Input type="number" defaultValue="30" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Login Attempts</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Audit & Monitoring</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Login Activity Logging</Label>
                        <p className="text-sm text-muted-foreground">Track all login attempts and activities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Access Logging</Label>
                        <p className="text-sm text-muted-foreground">Log all access to sensitive student data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Audit Logs
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Security Report
                    </Button>
                  </div>
                </div>

                <Card className="border-destructive/20 bg-destructive-foreground">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <h4 className="font-medium text-destructive">Security Recommendations</h4>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Enable two-factor authentication for all admin accounts</li>
                          <li>• Review and update access permissions quarterly</li>
                          <li>• Conduct regular security audits and penetration testing</li>
                          <li>• Keep all system components updated to latest versions</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleSaveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;