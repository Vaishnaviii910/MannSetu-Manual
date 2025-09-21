import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, School, User, Users } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'counselor' | 'institute',
    // Student fields
    fullName: '',
    instituteId: '',
    dateOfBirth: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    // Institute fields
    instituteName: '',
    address: '',
    website: '',
    description: ''
  });
  const [institutes, setInstitutes] = useState<any[]>([]);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchInstitutes();
  }, []);

  const fetchInstitutes = async () => {
    const { data } = await supabase
      .from('institutes')
      .select('id, institute_name')
      .order('institute_name');
    setInstitutes(data || []);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await signIn(signInData.email, signInData.password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    let additionalData = {};
    
    if (signUpData.role === 'student') {
      additionalData = {
        fullName: signUpData.fullName,
        instituteId: signUpData.instituteId,
        dateOfBirth: signUpData.dateOfBirth,
        phone: signUpData.phone,
        emergencyContact: signUpData.emergencyContact,
        emergencyPhone: signUpData.emergencyPhone,
        studentId: `STU${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };
    } else if (signUpData.role === 'institute') {
      additionalData = {
        instituteName: signUpData.instituteName,
        address: signUpData.address,
        phone: signUpData.phone,
        website: signUpData.website,
        description: signUpData.description
      };
    }

    await signUp(signUpData.email, signUpData.password, signUpData.role, additionalData);
    setLoading(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <User className="h-4 w-4" />;
      case 'counselor': return <Users className="h-4 w-4" />;
      case 'institute': return <School className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Mann Setu</CardTitle>
          <CardDescription>Mental Health Support Platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={signUpData.role} onValueChange={(value: any) => setSignUpData({...signUpData, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('student')}
                          Student
                        </div>
                      </SelectItem>
                      <SelectItem value="institute">
                        <div className="flex items-center gap-2">
                          {getRoleIcon('institute')}
                          Institute
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                {signUpData.role === 'student' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="institute">Select Your Institute</Label>
                      <Select value={signUpData.instituteId} onValueChange={(value) => setSignUpData({...signUpData, instituteId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your institute" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutes.map((institute) => (
                            <SelectItem key={institute.id} value={institute.id}>
                              {institute.institute_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({...signUpData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-contact">Emergency Contact Name</Label>
                      <Input
                        id="emergency-contact"
                        value={signUpData.emergencyContact}
                        onChange={(e) => setSignUpData({...signUpData, emergencyContact: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
                      <Input
                        id="emergency-phone"
                        value={signUpData.emergencyPhone}
                        onChange={(e) => setSignUpData({...signUpData, emergencyPhone: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {signUpData.role === 'institute' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="institute-name">Institute Name</Label>
                      <Input
                        id="institute-name"
                        value={signUpData.instituteName}
                        onChange={(e) => setSignUpData({...signUpData, instituteName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={signUpData.address}
                        onChange={(e) => setSignUpData({...signUpData, address: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="institute-phone">Phone Number</Label>
                      <Input
                        id="institute-phone"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData({...signUpData, phone: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        value={signUpData.website}
                        onChange={(e) => setSignUpData({...signUpData, website: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Input
                        id="description"
                        value={signUpData.description}
                        onChange={(e) => setSignUpData({...signUpData, description: e.target.value})}
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;