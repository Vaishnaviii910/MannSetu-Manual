import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Sparkles,
  History
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useStudentData } from "@/hooks/useStudentData";

const Chatbot = () => {
  const { user } = useAuth();
  const { studentData } = useStudentData();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm MannMitra, your AI mental health companion. I'm here to provide support, coping strategies, and resources. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    const newUserMessage = {
      type: "user" as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-response', {
        body: { prompt: newUserMessage.content, user_id: user.id },
      });

      if (error) {
        throw new Error(error.message);
      }
      
      const botResponse = {
        type: "bot" as const,
        content: data.text.replace(/\*/g, ''), // Clean formatting
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorResponse = {
        type: "bot" as const,
        content: fallbackBotResponse(newUserMessage.content),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const fallbackBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      return "I understand you're feeling anxious. Try the 4-7-8 breathing technique or the 5-4-3-2-1 grounding method. Would you like me to guide you?";
    } else if (lowerMessage.includes("stress")) {
      return "Stress is common. Try Pomodoro technique, mindfulness, or light exercise. What aspect of stress would you like to work on?";
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      return "Good sleep is vital. Try a bedtime routine, no screens before bed, and a calm environment. Want me to help you make a schedule?";
    } else {
      return "Thank you for sharing. Would you like to try a mindfulness exercise, learn stress management, or connect with a counselor?";
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
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
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              Online
            </Badge>

            {/* View History Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <History className="h-4 w-4" /> View History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[500px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Chat History</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <p className="text-xs font-semibold">{msg.type === "user" ? "You" : "MannMitra"}</p>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className="text-[10px] text-muted-foreground">{msg.timestamp}</p>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <Card className="lg:col-span-3 flex-1 flex flex-col bg-card">
            <CardHeader className="border-b flex-row justify-between items-center">
              <div className="space-y-1.5">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with MannMitra
                </CardTitle>
                <CardDescription>
                  Your confidential AI companion for mental health support
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col overflow-scroll">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 
                          whitespace-pre-wrap break-words
                          ${msg.type === "user"
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
