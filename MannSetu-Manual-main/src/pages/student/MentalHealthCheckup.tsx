import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Activity, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useStudentData } from "@/hooks/useStudentData";
import { useAuth } from "@/hooks/useAuth";

const MentalHealthCheckup = () => {
  const { user } = useAuth();
  const { studentData, submitPHQTest, loading } = useStudentData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const { toast } = useToast();

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain, isActive: true },
    { title: "AI Chatbot", url: "/student/chatbot", icon: Activity },
    { title: "Book Session", url: "/student/book-session", icon: CheckCircle },
  ];

  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way"
  ];

  const scaleOptions = [
    { value: 0, label: "Not at all", color: "bg-success-soft text-success" },
    { value: 1, label: "Several days", color: "bg-warning-soft text-warning" },
    { value: 2, label: "More than half the days", color: "bg-accent-soft text-accent" },
    { value: 3, label: "Nearly every day", color: "bg-destructive-soft text-destructive" }
  ];

  const handleAnswerSelect = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < phq9Questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    const result = await submitPHQTest(answers);
    if (result.error) {
      toast({
        title: "Error",
        description: "Failed to save your assessment. Please try again.",
        variant: "destructive",
      });
    } else {
      setTestResult(result);
      setIsCompleted(true);
      
      toast({
        title: "Assessment Complete!",
        description: `Your PHQ-9 score has been recorded: ${result.score}/27`,
      });
    }
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) return { level: "Minimal", color: "success", description: "Little or no depression symptoms" };
    if (score <= 9) return { level: "Mild", color: "warning", description: "Mild depression symptoms" };
    if (score <= 14) return { level: "Moderate", color: "accent", description: "Moderate depression symptoms" };
    if (score <= 19) return { level: "Moderately Severe", color: "destructive", description: "Moderately severe depression" };
    return { level: "Severe", color: "destructive", description: "Severe depression symptoms" };
  };

  const totalScore = testResult?.score || Object.values(answers).reduce((sum, score) => sum + score, 0);
  const interpretation = getScoreInterpretation(totalScore);

  if (loading) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (isCompleted) {
    return (
      <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-success to-primary rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Assessment Complete</h1>
            <p className="text-muted-foreground">
              Thank you for completing the mental health screening. Your responses help us provide better support.
            </p>
          </div>

          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                PHQ-9 Depression Screening Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">{totalScore}</div>
                <div className="text-lg text-muted-foreground">out of 27</div>
                <Badge className={`text-${interpretation.color} bg-${interpretation.color}-soft border-${interpretation.color}/20`}>
                  {interpretation.level}
                </Badge>
                <p className="text-muted-foreground">{interpretation.description}</p>
              </div>

              <Progress value={(totalScore / 27) * 100} className="h-3" />

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold">Professional Support</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Based on your score, consider speaking with a counselor
                    </p>
                    <Button className="w-full">Book Session</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Heart className="h-8 w-8 text-success mx-auto mb-2" />
                    <h3 className="font-semibold">Self-Care Resources</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Explore helpful resources and coping strategies
                    </p>
                    <Button variant="outline" className="w-full">View Resources</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Important Note:</h4>
                <p className="text-sm text-muted-foreground">
                  This screening is for informational purposes only and is not a diagnosis. 
                  If you're experiencing distress, please reach out to a mental health professional 
                  or contact our support services.
                </p>
              </div>

              <Button 
                onClick={() => {
                  setIsCompleted(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                variant="outline" 
                className="w-full"
              >
                Take Assessment Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Mental Health Checkup</h1>
          <p className="text-muted-foreground">
            Complete this brief screening to help us understand your mental wellness. 
            All responses are confidential and used to provide appropriate support.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>PHQ-9 Depression Screening</CardTitle>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {phq9Questions.length}
              </Badge>
            </div>
            <Progress value={((currentQuestion + 1) / phq9Questions.length) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Over the last 2 weeks, how often have you been bothered by:
              </h3>
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-base leading-relaxed">
                  {phq9Questions[currentQuestion]}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Select your response:</h4>
              <div className="grid gap-3">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(option.value)}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-soft ${
                      answers[currentQuestion] === option.value
                        ? `${option.color} border-current shadow-soft`
                        : 'border-border hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      {answers[currentQuestion] === option.value && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion === phq9Questions.length - 1 ? 'Complete Assessment' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need immediate help? Contact our 24/7 crisis support line: <strong>1-800-HELP-NOW</strong>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentalHealthCheckup;