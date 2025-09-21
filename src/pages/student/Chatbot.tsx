import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Heart, 
  Brain, 
  Lightbulb, 
  AlertTriangle,
  Users,
  Phone,
  Calendar,
  Sparkles
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm MannMitra, your AI mental health companion. I'm here to provide support, coping strategies, and resources. How are you feeling today?",
      timestamp: "10:30 AM"
    }
  ]);

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle, isActive: true },
    { title: "Book Session", url: "/student/book-session", icon: Calendar },
    { title: "Peer Support", url: "/student/peer-support", icon: Users },
    { title: "Resources Hub", url: "/student/resources", icon: Brain },
  ];

  const quickSuggestions = [
    { text: "I'm feeling anxious about exams", icon: AlertTriangle, category: "anxiety" },
    { text: "I need stress management tips", icon: Brain, category: "stress" },
    { text: "I'm having trouble sleeping", icon: Heart, category: "sleep" },
    { text: "I feel overwhelmed with coursework", icon: Lightbulb, category: "academic" },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      type: "user" as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        type: "bot" as const,
        content: generateBotResponse(message),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setMessage("");
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      return "I understand you're feeling anxious. Here are some techniques that can help: 1) Try the 4-7-8 breathing technique (inhale for 4, hold for 7, exhale for 8). 2) Ground yourself using the 5-4-3-2-1 method (name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste). Would you like me to guide you through a breathing exercise, or would you prefer to book a session with a counselor?";
    } else if (lowerMessage.includes("stress")) {
      return "Stress is very common among students. Some effective strategies include: taking regular breaks using the Pomodoro technique, engaging in physical activity, practicing mindfulness, and maintaining a consistent sleep schedule. What specific aspect of stress would you like to work on together?";
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      return "Sleep issues can significantly impact your mental health and academic performance. Try establishing a bedtime routine, avoiding screens 1 hour before bed, and creating a comfortable sleep environment. If this persists, I'd recommend speaking with a counselor. Would you like me to help you create a sleep schedule?";
    } else {
      return "Thank you for sharing that with me. I'm here to support you. Based on what you've told me, I think it might be helpful to explore some coping strategies together. Would you like to try a quick mindfulness exercise, learn about stress management techniques, or would you prefer to connect with one of our counselors for more personalized support?";
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName="Alex Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              MannMitra - AI Support
            </h1>
            <p className="text-muted-foreground">
              Get instant mental health support, coping strategies, and guidance 24/7
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Online
          </Badge>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <Card className="lg:col-span-3 h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat with MannMitra
              </CardTitle>
              <CardDescription>
                Your confidential AI companion for mental health support
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-2">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 space-y-3">
                {/* Quick Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="text-xs"
                    >
                      <suggestion.icon className="h-3 w-3 mr-1" />
                      {suggestion.text}
                    </Button>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Options */}
          <div className="space-y-6">
            {/* Emergency Support */}
            <Card className="border-destructive/20 bg-destructive-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  Need Immediate Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Crisis Helpline
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Emergency Session
                </Button>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">MannMitra can help with:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <span>Stress & anxiety management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-success" />
                    <span>Emotional support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    <span>Coping strategies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span>Social support guidance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Booking */}
            <Card className="bg-gradient-to-br from-primary-soft to-accent-soft">
              <CardHeader>
                <CardTitle className="text-sm">Need Professional Help?</CardTitle>
                <CardDescription className="text-xs">
                  Connect with our qualified counselors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">
                  Book Counseling Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;