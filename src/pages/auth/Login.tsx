import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [userType, setUserType] = useState<string>("");
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast({
        title: "Please select user type",
        description: "You must select whether you are a Student, Counselor, or Institute admin.",
        variant: "destructive",
      });
      return;
    }

    // Simulate login - In real app, this would be handled by Supabase
    toast({
      title: "Login successful!",
      description: `Welcome back, ${userType.toLowerCase()}.`,
    });

    // Navigate to appropriate dashboard
    switch (userType) {
      case "student":
        navigate("/student-dashboard");
        break;
      case "counselor":
        navigate("/counselor-dashboard");
        break;
      case "institute":
        navigate("/institute-dashboard");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Heart className="h-8 w-8 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-primary">MannSetu</h1>
        </div>
        
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
              </Button>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
            </div>
            <CardDescription>
              Sign in to access your personalized mental health support dashboard.
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="counselor">Counselor</SelectItem>
                    <SelectItem value="institute">Institute Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {userType === "student" ? "Roll Number or Email" : 
                   userType === "counselor" ? "Counselor ID or Email" : "Admin ID or Email"}
                </Label>
                <Input
                  id="identifier"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  placeholder={
                    userType === "student" ? "Enter roll number or email" :
                    userType === "counselor" ? "Enter counselor ID or email" : "Enter admin ID or email"
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" variant="hero">
                Sign In
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;