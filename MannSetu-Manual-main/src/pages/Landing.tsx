import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, Brain, BookOpen, Headphones } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const features = [
    {
      icon: Heart,
      title: "Stigma-Free Support",
      description: "Access confidential psychological support in a safe, judgment-free environment.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your mental health journey remains completely confidential with secure data protection.",
    },
    {
      icon: Users,
      title: "Peer Community",
      description: "Connect with fellow students in moderated support groups and forums.",
    },
    {
      icon: Brain,
      title: "AI-Powered Assistance",
      description: "Get immediate support through our intelligent chatbot for coping strategies and resources.",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Access evidence-based content, guides, and materials in regional languages.",
    },
    {
      icon: Headphones,
      title: "Professional Counseling",
      description: "Book confidential sessions with qualified mental health professionals.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">MannSetu</h1>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Digital Psychological
                  <span className="text-primary block">Intervention System</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Empowering students, counselors, and institutions with comprehensive mental health support in higher education.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg px-8" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button variant="secondary" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Students receiving mental health support in a university setting"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Mental Health Support</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides multi-layered support for students, professionals for counselors, and insights for institutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 bg-primary-soft rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto max-w-4xl text-center text-primary-foreground">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Mental Health Support?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands of students, counselors, and institutions creating a stigma-free environment for mental wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button variant="secondary" size="lg" className="text-lg px-8" asChild>
                <Link to="/signup">Start Your Journey</Link>
              </Button>
              <Button variant="ghost" size="lg" className="text-lg px-8 text-primary-foreground hover:bg-white/10">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-semibold text-primary">MannSetu</span>
            </div>
            <p className="text-muted-foreground text-center">
              © 2024 MannSetu. Empowering mental wellness in higher education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;