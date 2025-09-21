import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, School, Shield, Loader2 } from 'lucide-react';

const Index = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && userRole) {
      // Redirect authenticated users to their appropriate dashboard
      switch (userRole) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'counselor':
          navigate('/counselor-dashboard');
          break;
        case 'institute':
          navigate('/institute-dashboard');
          break;
        default:
          break;
      }
    }
  }, [user, userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (user) {
    // If user is logged in but userRole is not yet loaded, show loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Mann Setu
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bridging minds, nurturing wellness. A comprehensive mental health platform connecting students, counselors, and institutions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg" 
              className="px-8"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/auth')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Who We Serve</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Mann Setu provides tailored solutions for different stakeholders in the mental health ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Access mental health resources, book counseling sessions, and connect with peer support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• PHQ-9 Mental Health Assessments</li>
                <li>• Professional Counseling Sessions</li>
                <li>• Peer Support Communities</li>
                <li>• Mood Tracking & Wellness Tools</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>For Counselors</CardTitle>
              <CardDescription>
                Manage your practice, track student progress, and provide effective mental health support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Student Management Dashboard</li>
                <li>• Session Scheduling & Records</li>
                <li>• Progress Tracking Tools</li>
                <li>• Assessment Result Analytics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <School className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>For Institutions</CardTitle>
              <CardDescription>
                Comprehensive oversight of mental health programs and student wellbeing initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Campus-wide Analytics</li>
                <li>• Counselor Management</li>
                <li>• Student Wellbeing Insights</li>
                <li>• Program Effectiveness Metrics</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-lg mx-4">
        <div className="text-center max-w-4xl mx-auto">
          <Shield className="h-16 w-16 mx-auto text-primary mb-6" />
          <h2 className="text-3xl font-bold mb-4">Secure & Confidential</h2>
          <p className="text-muted-foreground mb-8">
            Your mental health data is protected with enterprise-grade security. All communications 
            are encrypted and confidential, ensuring a safe space for healing and growth.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
              <p className="text-muted-foreground">Full compliance with healthcare privacy regulations</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-muted-foreground">All data is encrypted in transit and at rest</p>
            </div>
            <div className="bg-background p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Role-Based Access</h3>
              <p className="text-muted-foreground">Strict access controls ensure data privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of students, counselors, and institutions already using Mann Setu 
            to improve mental health outcomes.
          </p>
          <Button 
            onClick={() => navigate('/auth')} 
            size="lg" 
            className="px-8"
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Mann Setu. Building bridges to better mental health.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
