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
import { Loader2, School, User } from 'lucide-react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';

// --- Zod Schemas for Validation ---
const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  instituteId: z.string().min(1, "Please select an institute"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const instituteSchema = z.object({
  instituteName: z.string().min(2, "Institute name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "A valid phone number is required"),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
  verificationDocument: z.any()
    .refine((files) => files?.length == 1, 'Official document is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<'student' | 'institute'>('student');
  const [institutes, setInstitutes] = useState<any[]>([]);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const signInForm = useForm<z.infer<typeof signInSchema>>({ resolver: zodResolver(signInSchema), defaultValues: { email: '', password: '' } });
  const studentForm = useForm<z.infer<typeof studentSchema>>({ resolver: zodResolver(studentSchema), defaultValues: { fullName: '', instituteId: '', email: '', password: '', confirmPassword: '' } });
  const instituteForm = useForm<z.infer<typeof instituteSchema>>({ resolver: zodResolver(instituteSchema), defaultValues: { instituteName: '', email: '', password: '', confirmPassword: '', address: '', phone: '', website: '', description: '' } });

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    const fetchInstitutes = async () => {
      const { data } = await supabase.from('institutes').select('id, institute_name').order('institute_name');
      setInstitutes(data || []);
    };
    fetchInstitutes();
  }, []);

  const onSignInSubmit = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    await signIn(values.email, values.password);
    setLoading(false);
  };

  const onStudentSignUpSubmit = async (values: z.infer<typeof studentSchema>) => {
    setLoading(true);
    const { email, password, confirmPassword, ...additionalData } = values;
    await signUp(email, password, 'student', { ...additionalData, studentId: `STU${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` });
    setLoading(false);
  };

  const onInstituteSignUpSubmit = async (values: z.infer<typeof instituteSchema>) => {
    setLoading(true);
    const { email, password, confirmPassword, verificationDocument, ...additionalData } = values;
  
    const file = verificationDocument[0];
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  
    const { data: uploadData, error: fileError } = await supabase.storage
      .from('institute-verification-documents')
      .upload(fileName, file);
  
    if (fileError || !uploadData) {
      toast({
        title: "File Upload Error",
        description: `Failed to upload document: ${fileError?.message || 'Unknown error.'}`,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
  
    // --- THIS IS THE CORRECTED LINE ---
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (!supabaseUrl) {
      toast({
        title: "Configuration Error",
        description: "Supabase URL is not configured in your environment variables.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
  
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/institute-verification-documents/${uploadData.path}`;
  
    const { error: signUpError } = await signUp(email, password, 'institute', {
      ...additionalData,
      verification_document_url: publicUrl,
    });
  
    if (signUpError) {
      toast({
        title: "Sign Up Error",
        description: signUpError.message,
        variant: "destructive",
      });
    }
  
    setLoading(false);
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
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                  <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>I am a...</Label>
                  <Select value={activeRole} onValueChange={(value: 'student' | 'institute') => setActiveRole(value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student"><div className="flex items-center gap-2"><User className="h-4 w-4" />Student</div></SelectItem>
                      <SelectItem value="institute"><div className="flex items-center gap-2"><School className="h-4 w-4" />Institute</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {activeRole === 'student' ? (
                  <Form {...studentForm} key="student-form">
                    <form onSubmit={studentForm.handleSubmit(onStudentSignUpSubmit)} className="space-y-4">
                       <FormField control={studentForm.control} name="fullName" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={studentForm.control} name="instituteId" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Your Institute</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Choose your institute" /></SelectTrigger></FormControl>
                              <SelectContent>{institutes.map(inst => (<SelectItem key={inst.id} value={inst.id}>{inst.institute_name}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                       )} />
                       <FormField control={studentForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={studentForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <FormField control={studentForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                       <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Account</Button>
                    </form>
                  </Form>
                ) : (
                  <Form {...instituteForm} key="institute-form">
                    <form onSubmit={instituteForm.handleSubmit(onInstituteSignUpSubmit)} className="space-y-4">
                      <FormField control={instituteForm.control} name="instituteName" render={({ field }) => (<FormItem><FormLabel>Institute Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="confirmPassword" render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="address" render={({ field }) => (<FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={instituteForm.control} name="verificationDocument" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Official Document for Verification</FormLabel>
                          <FormControl><Input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => field.onChange(e.target.files)} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Account</Button>
                    </form>
                  </Form>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;