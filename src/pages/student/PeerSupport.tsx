// PeerSupport.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
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
  Zap,
  BookOpen,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePeerSupport } from "@/hooks/usePeerSupport";
import { useToast } from "@/hooks/use-toast";
import { useStudentData } from "@/hooks/useStudentData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Post {
  post_id: string;
  title: string;
  content: string;
  created_at: string;
  student_id: string;
  forum_id: string;
  profiles: {
    full_name: string;
    avatar_url?: string;
  };
  like_count?: number;
  reply_count?: number;
  liked_by_me?: boolean;
  replies?: {
    reply_id: string;
    content: string;
    created_at: string;
    student_id: string;
    profiles: { full_name: string };
  }[];
  is_anonymous?: boolean | null;
}

const PeerSupport = () => {
  const { toast } = useToast();
  const { posts, forums, loading, createPost, toggleReaction, fetchReplies, createReply } = usePeerSupport();
  const { studentData } = useStudentData();

  const { register, handleSubmit, reset } = useForm<{
    title: string;
    content: string;
    isAnonymous?: boolean;
  }>();
  const [selectedForumId, setSelectedForumId] = useState("");
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});

  // changed here: ensure newest posts appear first (sorted by created_at desc)
  const postsArr = posts
    ? posts
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle },
    { title: "Book Session", url: "/student/book-session", icon: Calendar },
    { title: "My Bookings", url: "/student/my-bookings", icon: Calendar },
    { title: "Peer Support", url: "/student/peer-support", icon: Users, isActive: true },
    { title: "Resources Hub", url: "/student/resources", icon: BookOpen },
  ];

  const supportGroups = [
    {
      id: 1,
      name: "Exam Anxiety Support",
      members: 234,
      category: "Academic Stress",
      description:
        "A safe space to share exam-related stress and coping strategies",
      lastActivity: "2 hours ago",
      isJoined: true,
    },
    {
      id: 2,
      name: "New Student Circle",
      members: 156,
      category: "Social Support",
      description: "Connect with fellow new students and share your experiences",
      lastActivity: "4 hours ago",
      isJoined: false,
    },
    {
      id: 3,
      name: "Mindfulness Together",
      members: 89,
      category: "Wellness",
      description: "Daily mindfulness practice and meditation support",
      lastActivity: "1 day ago",
      isJoined: true,
    },
    {
      id: 4,
      name: "Study Buddy Network",
      members: 312,
      category: "Academic Support",
      description: "Find study partners and academic support",
      lastActivity: "30 mins ago",
      isJoined: false,
    },
  ];

  const handleCreatePost = (data: { title: string; content: string; isAnonymous?: boolean }) => {
    if (!selectedForumId) {
      toast({
        title: "Validation Error",
        description: "Please select a forum before posting.",
        variant: "destructive",
      });
      return;
    }
    createPost(data.title, data.content, selectedForumId, !!data.isAnonymous);
    reset();
    setSelectedForumId("");
  };

  const handleToggleReplies = async (postId: string) => {
    const isOpen = !!openReplies[postId];
    if (!isOpen) {
      const p = posts.find((x) => x.post_id === postId);
      if (!p || !p.replies || p.replies.length === 0) {
        setLoadingReplies((s) => ({ ...s, [postId]: true }));
        await fetchReplies(postId);
        setLoadingReplies((s) => ({ ...s, [postId]: false }));
      }
    }
    setOpenReplies((s) => ({ ...s, [postId]: !isOpen }));
  };

  const submitReply = async (postId: string) => {
    const content = (replyInputs[postId] || "").trim();
    if (!content) {
      toast({
        title: "Validation",
        description: "Reply cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    await createReply(postId, content, false);
    setReplyInputs((s) => ({ ...s, [postId]: "" }));
  };

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      userType="student"
      userName={studentData?.full_name || "Student"}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            Peer Support Community
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow students in a safe, moderated environment for
            mutual support
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
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Share with the Community
                    </CardTitle>
                    <CardDescription>
                      Share your thoughts, ask questions, or offer support to
                      others
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(handleCreatePost)} className="space-y-4">
                      <Select onValueChange={setSelectedForumId} value={selectedForumId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a forum to post in" />
                        </SelectTrigger>
                        <SelectContent>
                          {forums.map((forum) => (
                            <SelectItem key={forum.id} value={forum.id}>
                              {forum.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="Title of your post" {...register("title", { required: true })} />
                      <Textarea
                        placeholder="What's on your mind? Remember, this is a supportive space..."
                        className="min-h-[120px]"
                        {...register("content", { required: true })}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Moderated Space
                          </Badge>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" {...register("isAnonymous")} />
                            <span>Post anonymously</span>
                          </label>
                        </div>
                        <Button type="submit">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {loading ? (
                    <p>Loading posts...</p>
                  ) : (
                    postsArr.map((post) => (
                      <Card key={post.post_id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {post.profiles?.full_name ? post.profiles.full_name[0] : "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{post.is_anonymous ? "Anonymous" : post.profiles?.full_name || "Anonymous"}</p>
                                  <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {forums.find((f) => f.id === post.forum_id)?.title || "General"}
                              </Badge>
                            </div>

                            <div>
                              <h3 className="font-semibold mb-2">{post.title}</h3>
                              <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => toggleReaction(post.post_id)}
                                >
                                  <ThumbsUp className={`h-3 w-3 mr-1 ${post.liked_by_me ? "text-primary" : ""}`} />
                                  {post.like_count || 0} Helpful
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs"
                                  onClick={() => handleToggleReplies(post.post_id)}
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  {post.reply_count || 0} Replies
                                </Button>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => handleToggleReplies(post.post_id)}>
                                Join Discussion
                              </Button>
                            </div>

                            {openReplies[post.post_id] && (
                              <div className="mt-3 space-y-3">
                                {loadingReplies[post.post_id] ? (
                                  <p>Loading replies...</p>
                                ) : (
                                  <>
                                    {post.replies && post.replies.length > 0 ? (
                                      post.replies.map((r) => (
                                        <div key={r.reply_id} className="p-3 border rounded">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <p className="text-sm font-medium">{r.profiles?.full_name || "Anonymous"}</p>
                                              <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                                            </div>
                                          </div>
                                          <div className="mt-2 text-sm text-muted-foreground">{r.content}</div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No replies yet. Be the first to reply.</p>
                                    )}

                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        submitReply(post.post_id);
                                      }}
                                      className="flex gap-2 mt-2"
                                    >
                                      <Textarea
                                        value={replyInputs[post.post_id] || ""}
                                        onChange={(e) => setReplyInputs((s) => ({ ...s, [post.post_id]: e.target.value }))}
                                        placeholder="Write a supportive reply..."
                                        className="flex-1 min-h-[60px]"
                                      />
                                      <Button type="submit" size="sm">
                                        Reply
                                      </Button>
                                    </form>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
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
                        <div className="text-lg font-bold text-success">{posts.length}</div>
                        <div className="text-xs text-muted-foreground">Posts</div>
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
                  Join live events and workshops to connect with peers and learn
                  new coping strategies
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
                      Learn practical techniques to manage academic stress with
                      Dr. Sarah Wilson
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
                      Weekly peer-led discussion groups in a safe, supportive
                      environment
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary">Fridays 4:00 PM</span>
                      <Button size="sm" variant="outline">
                        Join Circle
                      </Button>
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