import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Calendar, 
  Brain,
  Plus,
  ThumbsUp,
  MessageSquare,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const PeerSupport = () => {
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle },
    { title: "Book Session", url: "/student/book-session", icon: Calendar },
    { title: "Peer Support", url: "/student/peer-support", icon: Users, isActive: true },
    { title: "Resources Hub", url: "/student/resources", icon: Brain },
  ];

  const supportGroups = [
    {
      id: 1,
      name: "Exam Anxiety Support",
      members: 234,
      category: "Academic Stress",
      description: "A safe space to share exam-related stress and coping strategies",
      lastActivity: "2 hours ago",
      isJoined: true
    },
    {
      id: 2,
      name: "New Student Circle",
      members: 156,
      category: "Social Support",
      description: "Connect with fellow new students and share your experiences",
      lastActivity: "4 hours ago",
      isJoined: false
    },
    {
      id: 3,
      name: "Mindfulness Together",
      members: 89,
      category: "Wellness",
      description: "Daily mindfulness practice and meditation support",
      lastActivity: "1 day ago",
      isJoined: true
    },
    {
      id: 4,
      name: "Study Buddy Network",
      members: 312,
      category: "Academic Support",
      description: "Find study partners and academic support",
      lastActivity: "30 mins ago",
      isJoined: false
    }
  ];

  const forumPosts = [
    {
      id: 1,
      author: "StudentHelper23",
      title: "Tips for managing pre-exam anxiety?",
      content: "I have my final exams next week and I'm feeling really overwhelmed. Has anyone found effective ways to calm down before big tests?",
      category: "Academic Stress",
      timestamp: "2 hours ago",
      likes: 15,
      replies: 8,
      isAnonymous: true
    },
    {
      id: 2,
      author: "MindfulMike",
      title: "Starting a morning meditation group",
      content: "Would anyone be interested in joining a small group for 15-minute morning meditation sessions? We could meet virtually every weekday.",
      category: "Wellness",
      timestamp: "5 hours ago",
      likes: 23,
      replies: 12,
      isAnonymous: false
    },
    {
      id: 3,
      author: "Anonymous_Student",
      title: "Dealing with homesickness",
      content: "This is my first year away from home and I'm struggling with feeling lonely and missing my family. Any advice would be appreciated.",
      category: "Social Support",
      timestamp: "1 day ago",
      likes: 31,
      replies: 18,
      isAnonymous: true
    }
  ];

  const handleCreatePost = () => {
    if (!newPost.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Post created successfully!",
      description: "Your post has been shared with the community.",
    });

    setNewPost("");
  };

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName="Alex Johnson">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            Peer Support Community
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow students in a safe, moderated environment for mutual support
          </p>
        </div>

        <Tabs defaultValue="forum" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forum">Community Forum</TabsTrigger>
            <TabsTrigger value="groups">Support Groups</TabsTrigger>
            <TabsTrigger value="events">Virtual Events</TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Forum */}
              <div className="lg:col-span-3 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Share with the Community
                    </CardTitle>
                    <CardDescription>
                      Share your thoughts, ask questions, or offer support to others
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="What's on your mind? Remember, this is a supportive space..."
                      className="min-h-[120px]"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Moderated Space
                        </Badge>
                      </div>
                      <Button onClick={handleCreatePost}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Post Anonymously
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Forum Posts */}
                <div className="space-y-4">
                  {forumPosts.map((post) => (
                    <Card key={post.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {post.isAnonymous ? "?" : post.author[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{post.author}</p>
                                <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {post.category}
                            </Badge>
                          </div>

                          <div>
                            <h3 className="font-semibold mb-2">{post.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {post.likes} Helpful
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                {post.replies} Replies
                              </Button>
                            </div>
                            <Button variant="outline" size="sm">
                              Join Discussion
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Community Guidelines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Community Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-3">
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Be respectful and supportive</li>
                      <li>• No personal information sharing</li>
                      <li>• Professional moderation 24/7</li>
                      <li>• Crisis situations → Emergency resources</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Community Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 rounded-lg bg-primary-soft">
                        <div className="text-lg font-bold text-primary">1,247</div>
                        <div className="text-xs text-muted-foreground">Active Members</div>
                      </div>
                      <div className="p-3 rounded-lg bg-success-soft">
                        <div className="text-lg font-bold text-success">89</div>
                        <div className="text-xs text-muted-foreground">Posts Today</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="secondary">{group.category}</Badge>
                    </div>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{group.lastActivity}</span>
                      </div>
                    </div>
                    {group.isJoined ? (
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View Group
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Upcoming Virtual Events
                </CardTitle>
                <CardDescription>
                  Join live events and workshops to connect with peers and learn new coping strategies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Stress Management Workshop</h3>
                      <Badge>Tomorrow</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Learn practical techniques to manage academic stress with Dr. Sarah Wilson
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary">2:00 PM - 3:00 PM</span>
                      <Button size="sm">Register</Button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">Peer Support Circle</h3>
                      <Badge variant="secondary">Weekly</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Weekly peer-led discussion groups in a safe, supportive environment
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary">Fridays 4:00 PM</span>
                      <Button size="sm" variant="outline">Join Circle</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PeerSupport;