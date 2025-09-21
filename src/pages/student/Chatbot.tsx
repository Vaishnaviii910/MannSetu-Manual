import { useState, useEffect } from "react";
import { useVapi } from "@/hooks/useVapi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Sparkles,
  History,
  Mic,
  MicOff,
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
      content:
        "Hello! I'm MannMitra, your AI mental health companion. I'm here to provide support, coping strategies, and resources. How are you feeling today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  // --- Vapi Integration ---
  const { start, stop, isCallActive, activeCall } = useVapi({
    publicKey: import.meta.env.VITE_VAPI_PUBLIC_KEY,
    assistant: import.meta.env.VITE_VAPI_ASSISTANT_ID,
  });

  // Listen for messages from Vapi
  useEffect(() => {
    if (activeCall) {
      const handleMessage = (msg: { role: string; content: string }) => {
        if (!msg.content) return;
        setMessages((prev) => [
          ...prev,
          {
            type: msg.role === "user" ? "user" : "bot",
            content: msg.content,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      };
      activeCall.on("message", handleMessage);
      return () => {
        activeCall.off("message", handleMessage);
      };
    }
  }, [activeCall]);

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain },
    {
      title: "AI Chatbot",
      url: "/student/chatbot",
      icon: MessageCircle,
      isActive: true,
    },
    { title: "My Bookings", url: "/student/my-bookings", icon: Calendar },
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
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-ai-response", {
        body: { prompt: newUserMessage.content, user_id: user.id },
      });

      if (error) throw new Error(error.message);

      const botResponse = {
        type: "bot" as const,
        content: data.text.replace(/\*/g, ""),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error(err);
      const fallbackResponse = {
        type: "bot" as const,
        content: "Sorry, I couldn't fetch a response. Try typing something else!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    }
  };

  const handleSuggestionClick = (text: string) => setMessage(text);

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
          <Badge
            variant="secondary"
            className={`flex items-center gap-2 ${isCallActive ? "bg-green-500 text-white hover:bg-green-500" : ""}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isCallActive ? "bg-green-300 animate-pulse" : "bg-success"}`}
            />{" "}
            {isCallActive ? "Active Call" : "Online"}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Chat Interface */}
          <Card className="lg:col-span-3 flex-1 flex flex-col bg-card">
            <CardHeader className="border-b flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" /> Chat with MannMitra
              </CardTitle>
              <CardDescription>Your confidential AI companion for mental health support</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col overflow-scroll">
              <ScrollArea className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 whitespace-pre-wrap break-words ${
                          msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-2">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((s, i) => (
                    <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestionClick(s.text)} className="text-xs">
                      <s.icon className="h-3 w-3 mr-1" /> {s.text}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isCallActive ? "Voice call is active..." : "Type your message here..."}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    disabled={isCallActive}
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim() || isCallActive}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => (isCallActive ? stop() : start())}>
                    {isCallActive ? <MicOff className="h-4 w-4 text-destructive" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Cards */}
          <div className="space-y-6">
            {/* Emergency */}
            <Card className="border-destructive/20 bg-destructive-foreground">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4" /> Need Immediate Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" /> Crisis Helpline
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" /> Emergency Session
                </Button>
              </CardContent>
            </Card>

            {/* Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">MannMitra can help with:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Stress & anxiety management</div>
                  <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-success" /> Emotional support</div>
                  <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-warning" /> Coping strategies</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-accent" /> Social support guidance</div>
                </div>
              </CardContent>
            </Card>

            {/* Session Booking */}
            <Card className="bg-gradient-to-br from-primary-soft to-accent-soft">
              <CardHeader>
                <CardTitle className="text-sm">Need Professional Help?</CardTitle>
                <CardDescription className="text-xs">Connect with our qualified counselors</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="sm">Book Counseling Session</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;