import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Video,
  Headphones,
  Download,
  Search,
  Play,
  Heart,
  MessageCircle,
  Calendar,
  Users,
  Brain,
  Star,
  Clock,
  FileText,
  Music,
  Bookmark
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStudentData } from "@/hooks/useStudentData";

const ResourcesHub = () => {
  const { studentData } = useStudentData();

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle },
    { title: "Book Session", url: "/student/book-session", icon: Calendar },
    { title: "My Bookings", url: "/student/my-bookings", icon: Calendar },
    { title: "Peer Support", url: "/student/peer-support", icon: Users },
    { title: "Resources Hub", url: "/student/resources", icon: BookOpen, isActive: true },
  ];

  const categories = [
    { name: "All Resources", count: 156, active: true },
    { name: "Stress Management", count: 23 },
    { name: "Anxiety Support", count: 31 },
    { name: "Study Skills", count: 19 },
    { name: "Sleep & Wellness", count: 15 },
    { name: "Mindfulness", count: 28 },
    { name: "Crisis Support", count: 8 }
  ];

  const articles = [
    {
      id: 1,
      title: "Understanding and Managing Test Anxiety",
      description: "Evidence-based strategies to reduce anxiety before and during exams",
      category: "Anxiety Support",
      readTime: "8 min read",
      rating: 4.8,
      language: "English",
      isBookmarked: false
    },
    {
      id: 2,
      title: "भावनात्मक संतुलन के लिए मानसिक स्वास्थ्य तकनीकें",
      description: "मानसिक स्वास्थ्य में सुधार के लिए प्रभावी तकनीकें और रणनीतियां",
      category: "Wellness",
      readTime: "12 min read",
      rating: 4.9,
      language: "Hindi",
      isBookmarked: true
    },
    {
      id: 3,
      title: "Building Healthy Sleep Habits for Students",
      description: "How to establish a consistent sleep schedule that supports your mental health",
      category: "Sleep & Wellness",
      readTime: "6 min read",
      rating: 4.7,
      language: "English",
      isBookmarked: false
    }
  ];

  const videos = [
    {
      id: 1,
      title: "5-Minute Breathing Exercise for Instant Calm",
      description: "Quick breathing technique to reduce stress and anxiety",
      duration: "5:32",
      category: "Mindfulness",
      thumbnail: "🧘‍♀️",
      views: "12.3k"
    },
    {
      id: 2,
      title: "Study Effectively Without Burnout",
      description: "Proven methods to maintain productivity while protecting your mental health",
      duration: "15:24",
      category: "Study Skills",
      thumbnail: "📚",
      views: "8.7k"
    },
    {
      id: 3,
      title: "Progressive Muscle Relaxation Guide",
      description: "Full-body relaxation technique for better sleep and stress relief",
      duration: "12:45",
      category: "Sleep & Wellness",
      thumbnail: "😌",
      views: "15.1k"
    }
  ];

  const audioContent = [
    {
      id: 1,
      title: "Morning Meditation for Students",
      description: "Start your day with clarity and focus",
      duration: "10:00",
      category: "Mindfulness",
      type: "Guided Meditation"
    },
    {
      id: 2,
      title: "Sleep Stories: Campus Dreams",
      description: "Relaxing bedtime stories set in peaceful university environments",
      duration: "25:30",
      category: "Sleep & Wellness",
      type: "Sleep Story"
    },
    {
      id: 3,
      title: "Focus Music for Studying",
      description: "Instrumental music designed to enhance concentration",
      duration: "60:00",
      category: "Study Skills",
      type: "Background Music"
    }
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-warning to-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                Resources Hub
              </h1>
              <p className="text-muted-foreground">
                Access evidence-based mental health resources, guides, and content in multiple languages
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Star className="h-3 w-3" />
              156 Resources Available
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for resources, topics, or keywords..."
                className="pl-10"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="articles">Articles & Guides</TabsTrigger>
            <TabsTrigger value="videos">Video Content</TabsTrigger>
            <TabsTrigger value="audio">Audio Resources</TabsTrigger>
            <TabsTrigger value="tools">Interactive Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Categories Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.map((category, index) => (
                      <Button
                        key={index}
                        variant={category.active ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-between"
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {category.count}
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmarked (3)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Downloads (5)
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Articles Grid */}
              <div className="lg:col-span-3 space-y-4">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {article.language}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{article.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              {article.rating}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Read
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative bg-gradient-to-br from-primary-soft to-accent-soft h-40 flex items-center justify-center">
                    <div className="text-4xl">{video.thumbnail}</div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button size="lg" className="rounded-full">
                        <Play className="h-6 w-6" />
                      </Button>
                    </div>
                    <Badge className="absolute top-2 right-2">
                      {video.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{video.description}</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="secondary" className="text-xs">
                        {video.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{video.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio" className="space-y-6">
            <div className="space-y-4">
              {audioContent.map((audio) => (
                <Card key={audio.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-success to-primary rounded-lg flex items-center justify-center">
                          <Headphones className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{audio.title}</h3>
                          <p className="text-sm text-muted-foreground">{audio.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {audio.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{audio.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Mood Tracker
                  </CardTitle>
                  <CardDescription>
                    Track your daily mood and identify patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Start Tracking</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-success" />
                    Breathing Exercise
                  </CardTitle>
                  <CardDescription>
                    Interactive guided breathing for stress relief
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Begin Exercise</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    Study Planner
                  </CardTitle>
                  <CardDescription>
                    Plan your study schedule with mental health breaks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Create Plan</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ResourcesHub;