// src/pages/auth/Signup.tsx

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Zod Schemas for Validation ---
const studentSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  studentId: z.string().min(1, { message: "Student ID is required" }),
  instituteId: z.string().uuid({ message: "Please select your institute" }),
});

const instituteSchema = z.object({
  instituteName: z.string().min(2, { message: "Institute name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  phone: z.string().min(10, { message: "A valid phone number is required" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  // Ensures a file is uploaded for verification
  verificationDocument: z.any()
    .refine((files) => files?.length == 1, 'Official document is required.')
    .refine((files) => files?.[0]?.size <= 5000000, `Max file size is 5MB.`), // 5MB max size
});

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [institutes, setInstitutes] = useState<{ id: string; institute_name: string }[]>([]);

  // --- RHF Forms ---
  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      studentId: "",
      instituteId: "",
    },
  });

  const instituteForm = useForm<z.infer<typeof instituteSchema>>({
    resolver: zodResolver(instituteSchema),
    defaultValues: {
      instituteName: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      website: "",
    },
  });

  // --- Fetch Institutes for Student Signup ---
  useEffect(() => {
    const fetchInstitutes = async () => {
      const { data, error } = await supabase
        .from('institutes')
        .select('id, institute_name');

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch institutes. Please try again later.",
          variant: "destructive",
        });
      } else if (data) {
        setInstitutes(data);
      }
    };
    fetchInstitutes();
  }, [toast]);


  // --- Submit Handlers ---
  const onStudentSubmit = async (values: z.infer<typeof studentSchema>) => {
    setLoading(true);
    const { email, password, ...additionalData } = values;
    const { error } = await signUp(email, password, 'student', additionalData);
    if (!error) {
        toast({ title: "Success", description: "Student account created successfully!" });
        navigate('/login');
    }
    setLoading(false);
  };

  const onInstituteSubmit = async (values: z.infer<typeof instituteSchema>) => {
    setLoading(true);
    const { email, password, verificationDocument, ...additionalData } = values;

    const file = verificationDocument[0];
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`; // Sanitize file name

    // Upload the file to Supabase Storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('institute-verification-documents')
      .upload(fileName, file);

    if (fileError) {
      toast({
        title: "Error uploading file",
        description: fileError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('institute-verification-documents')
      .getPublicUrl(fileName);

    // Call the signUp function with the document URL
    const { error } = await signUp(email, password, 'institute', {
      ...additionalData,
      verification_document_url: urlData.publicUrl, // Add the URL to the user metadata
    });

     if (!error) {
        toast({ title: "Success", description: "Institute account created! Your verification is pending." });
        navigate('/login');
    }
    setLoading(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Choose your role to create an account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="institute">Institute</TabsTrigger>
            </TabsList>
            
            {/* --- Student Signup Form --- */}
            <TabsContent value="student">
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                  <FormField control={studentForm.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={studentForm.control} name="studentId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID</FormLabel>
                      <FormControl><Input placeholder="Your ID" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={studentForm.control} name="instituteId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your institute" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {institutes.map(inst => (
                            <SelectItem key={inst.id} value={inst.id}>
                              {inst.institute_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={studentForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="student@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={studentForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up as Student"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* --- Institute Signup Form --- */}
            <TabsContent value="institute">
              <Form {...instituteForm}>
                <form onSubmit={instituteForm.handleSubmit(onInstituteSubmit)} className="space-y-4">
                   <FormField control={instituteForm.control} name="instituteName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institute Name</FormLabel>
                      <FormControl><Input placeholder="Global Tech University" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={instituteForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Official Email</FormLabel>
                      <FormControl><Input placeholder="contact@gtu.edu" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={instituteForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={instituteForm.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input placeholder="123 University Ave" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={instituteForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={instituteForm.control} name="website" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl><Input placeholder="https://www.gtu.edu" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Verification Document Upload Field */}
                  <FormField
                    control={instituteForm.control}
                    name="verificationDocument"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Document for Verification</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => field.onChange(e.target.files)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? "Signing Up..." : "Sign Up as Institute"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
// // src/pages/auth/Signup.tsx

// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useAuth } from '@/hooks/useAuth';
// import { Link, useNavigate } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // --- Zod Schemas for Validation ---
// const studentSchema = z.object({
//   fullName: z.string().min(2, { message: "Full name is required" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(8, { message: "Password must be at least 8 characters" }),
//   studentId: z.string().min(1, { message: "Student ID is required" }),
//   instituteId: z.string().uuid({ message: "Please select your institute" }),
// });

// const instituteSchema = z.object({
//   instituteName: z.string().min(2, { message: "Institute name is required" }),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(8, { message: "Password must be at least 8 characters" }),
//   address: z.string().min(5, { message: "Address is required" }),
//   phone: z.string().min(10, { message: "A valid phone number is required" }),
//   website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
// });

// const Signup = () => {
//   const { signUp } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [institutes, setInstitutes] = useState<{ id: string; institute_name: string }[]>([]);

//   // --- RHF Forms ---
//   const studentForm = useForm<z.infer<typeof studentSchema>>({
//     resolver: zodResolver(studentSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       studentId: "",
//       instituteId: "",
//     },
//   });

//   const instituteForm = useForm<z.infer<typeof instituteSchema>>({
//     resolver: zodResolver(instituteSchema),
//     defaultValues: {
//       instituteName: "",
//       email: "",
//       password: "",
//       address: "",
//       phone: "",
//       website: "",
//     },
//   });

//   // --- Fetch Institutes for Student Signup ---
//   useEffect(() => {
//     const fetchInstitutes = async () => {
//       const { data, error } = await supabase
//         .from('institutes')
//         .select('id, institute_name');

//       if (error) {
//         toast({
//           title: "Error",
//           description: "Could not fetch institutes. Please try again later.",
//           variant: "destructive",
//         });
//       } else if (data) {
//         setInstitutes(data);
//       }
//     };
//     fetchInstitutes();
//   }, [toast]);


//   // --- Submit Handlers ---
//   const onStudentSubmit = async (values: z.infer<typeof studentSchema>) => {
//     setLoading(true);
//     const { email, password, ...additionalData } = values;
//     const { error } = await signUp(email, password, 'student', additionalData);
//     if (!error) {
//         navigate('/login');
//     }
//     setLoading(false);
//   };

//   const onInstituteSubmit = async (values: z.infer<typeof instituteSchema>) => {
//     setLoading(true);
//     const { email, password, ...additionalData } = values;
//     const { error } = await signUp(email, password, 'institute', additionalData);
//      if (!error) {
//         navigate('/login');
//     }
//     setLoading(false);
//   };


//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <Card className="w-full max-w-md mx-4">
//         <CardHeader>
//           <CardTitle className="text-2xl">Sign Up</CardTitle>
//           <CardDescription>
//             Choose your role to create an account.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="student" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="student">Student</TabsTrigger>
//               <TabsTrigger value="institute">Institute</TabsTrigger>
//             </TabsList>
            
//             {/* --- Student Signup Form --- */}
//             <TabsContent value="student">
//               <Form {...studentForm}>
//                 <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
//                   <FormField control={studentForm.control} name="fullName" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Name</FormLabel>
//                       <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                    <FormField control={studentForm.control} name="studentId" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Student ID</FormLabel>
//                       <FormControl><Input placeholder="Your ID" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={studentForm.control} name="instituteId" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Institute</FormLabel>
//                        <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select your institute" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {institutes.map(inst => (
//                             <SelectItem key={inst.id} value={inst.id}>
//                               {inst.institute_name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={studentForm.control} name="email" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email</FormLabel>
//                       <FormControl><Input placeholder="student@example.com" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={studentForm.control} name="password" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <Button type="submit" className="w-full" disabled={loading}>
//                     {loading ? "Signing Up..." : "Sign Up as Student"}
//                   </Button>
//                 </form>
//               </Form>
//             </TabsContent>

//             {/* --- Institute Signup Form --- */}
//             <TabsContent value="institute">
//               <Form {...instituteForm}>
//                 <form onSubmit={instituteForm.handleSubmit(onInstituteSubmit)} className="space-y-4">
//                    <FormField control={instituteForm.control} name="instituteName" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Institute Name</FormLabel>
//                       <FormControl><Input placeholder="Global Tech University" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={instituteForm.control} name="email" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Official Email</FormLabel>
//                       <FormControl><Input placeholder="contact@gtu.edu" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                    <FormField control={instituteForm.control} name="password" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Password</FormLabel>
//                       <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={instituteForm.control} name="address" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Address</FormLabel>
//                       <FormControl><Input placeholder="123 University Ave" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <FormField control={instituteForm.control} name="phone" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number</FormLabel>
//                       <FormControl><Input placeholder="+1234567890" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                    <FormField control={instituteForm.control} name="website" render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Website (Optional)</FormLabel>
//                       <FormControl><Input placeholder="https://www.gtu.edu" {...field} /></FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )} />
//                   <Button type="submit" className="w-full" disabled={loading}>
//                      {loading ? "Signing Up..." : "Sign Up as Institute"}
//                   </Button>
//                 </form>
//               </Form>
//             </TabsContent>
//           </Tabs>
//           <div className="mt-4 text-center text-sm">
//             Already have an account?{" "}
//             <Link to="/login" className="underline">
//               Log in
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Signup;