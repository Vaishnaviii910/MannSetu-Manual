import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Heart, 
  Activity, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Users,
  BookOpen,
  Calendar
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useStudentData } from "@/hooks/useStudentData";

const MentalHealthCheckup = () => {
  const { studentData, submitPHQTest, submitGAD7Test, loading } = useStudentData();
  const { toast } = useToast();

  // State for PHQ-9
  const [phqCurrentQuestion, setPhqCurrentQuestion] = useState(0);
  const [phqAnswers, setPhqAnswers] = useState<Record<number, number>>({});
  const [isPhqCompleted, setIsPhqCompleted] = useState(false);
  const [phqTestResult, setPhqTestResult] = useState<any>(null);

  // State for GAD-7
  const [gad7CurrentQuestion, setGad7CurrentQuestion] = useState(0);
  const [gad7Answers, setGad7Answers] = useState<Record<number, number>>({});
  const [isGad7Completed, setIsGad7Completed] = useState(false);
  const [gad7TestResult, setGad7TestResult] = useState<any>(null);

  const sidebarItems = [
    { title: "Dashboard", url: "/student-dashboard", icon: Heart },
    { title: "Mental Health Checkup", url: "/student/mental-health-checkup", icon: Brain, isActive: true },
    { title: "AI Chatbot", url: "/student/chatbot", icon: MessageCircle },
    { title: "Book Session", url: "/student/book-session", icon: Calendar },
    { title: "Peer Support", url: "/student/peer-support", icon: Users },
    { title: "Resources Hub", url: "/student/resources", icon: BookOpen },
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
  
  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it is hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen"
  ];

  const scaleOptions = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
  ];

  // PHQ-9 Handlers
  const handlePhqAnswer = (value: number) => setPhqAnswers(prev => ({ ...prev, [phqCurrentQuestion]: value }));
  const handlePhqNext = () => phqCurrentQuestion < phq9Questions.length - 1 && setPhqCurrentQuestion(prev => prev + 1);
  const handlePhqPrevious = () => phqCurrentQuestion > 0 && setPhqCurrentQuestion(prev => prev - 1);
  const handlePhqComplete = async () => {
    const { data, error, score } = await submitPHQTest(phqAnswers);
    if (error) {
      toast({ title: "Error", description: "Failed to save your assessment.", variant: "destructive" });
    } else {
      setPhqTestResult(data);
      setIsPhqCompleted(true);
      toast({ title: "Assessment Complete!", description: `Your PHQ-9 score is ${score}/27.` });
    }
  };

  // GAD-7 Handlers
  const handleGad7Answer = (value: number) => setGad7Answers(prev => ({ ...prev, [gad7CurrentQuestion]: value }));
  const handleGad7Next = () => gad7CurrentQuestion < gad7Questions.length - 1 && setGad7CurrentQuestion(prev => prev + 1);
  const handleGad7Previous = () => gad7CurrentQuestion > 0 && setGad7CurrentQuestion(prev => prev - 1);
  const handleGad7Complete = async () => {
    const { data, error, score } = await submitGAD7Test(gad7Answers);
    if (error) {
      toast({ title: "Error", description: "Failed to save your assessment.", variant: "destructive" });
    } else {
      setGad7TestResult(data);
      setIsGad7Completed(true);
      toast({ title: "Assessment Complete!", description: `Your GAD-7 score is ${score}/21.` });
    }
  };

  const renderTest = (
    type: 'phq' | 'gad',
    questions: string[],
    currentQuestion: number,
    answers: Record<number, number>,
    handleAnswer: (val: number) => void,
    handleNext: () => void,
    handlePrevious: () => void,
    handleComplete: () => void,
    isCompleted: boolean,
    testResult: any,
    maxScore: number,
    getInterpretation: (score: number) => any
  ) => {
    if (isCompleted && testResult) {
      const interpretation = getInterpretation(testResult.score);
      return (
        <div className="space-y-6 animate-in fade-in-50">
           <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Assessment Complete</h2>
            <p className="text-muted-foreground">Thank you for completing the screening.</p>
          </div>
          <Card className={`border-l-4 border-l-${interpretation.color}`}>
            <CardHeader>
              <CardTitle>{type.toUpperCase()} Screening Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold">{testResult.score}</div>
              <div className="text-lg text-muted-foreground">out of {maxScore}</div>
              <Badge variant="secondary">{interpretation.level}</Badge>
              <p>{interpretation.description}</p>
              <Progress value={(testResult.score / maxScore) * 100} className="mt-4" />
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                <CardTitle>{type.toUpperCase()} Screening</CardTitle>
                <Badge variant="outline">Question {currentQuestion + 1} of {questions.length}</Badge>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                <h3 className="text-lg font-semibold">Over the last 2 weeks, how often have you been bothered by:</h3>
                <div className="p-4 rounded-lg bg-muted/30">
                    <p className="text-base leading-relaxed">{questions[currentQuestion]}</p>
                </div>
                </div>
                <div className="grid gap-3">
                {scaleOptions.map((option) => (
                    <button key={option.value} onClick={() => handleAnswer(option.value)}
                    className={`p-4 rounded-lg border text-left transition-all hover:shadow-soft ${
                        answers[currentQuestion] === option.value ? `bg-primary text-primary-foreground border-primary shadow-soft` : 'border-border hover:border-border/80'
                    }`}>
                    {option.label}
                    </button>
                ))}
                </div>
                <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button onClick={currentQuestion === questions.length - 1 ? handleComplete : handleNext} disabled={answers[currentQuestion] === undefined}>
                    {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                </div>
            </CardContent>
        </Card>
    );
  };
  
  const getPhqInterpretation = (score: number) => {
    if (score <= 4) return { level: "Minimal Depression", color: "success", description: "Your score suggests you may have minimal or no symptoms of depression." };
    if (score <= 9) return { level: "Mild Depression", color: "warning", description: "Your score suggests you may have mild symptoms of depression." };
    if (score <= 14) return { level: "Moderate Depression", color: "orange", description: "Your score suggests you may have moderate symptoms of depression. Consider talking to a professional." };
    if (score <= 19) return { level: "Moderately Severe Depression", color: "destructive", description: "Your score suggests moderately severe symptoms of depression. It is recommended to seek professional help." };
    return { level: "Severe Depression", color: "destructive", description: "Your score suggests severe symptoms of depression. Please seek professional help immediately." };
  };

  const getGadInterpretation = (score: number) => {
    if (score <= 4) return { level: "Minimal Anxiety", color: "success", description: "Your score suggests you may have minimal or no symptoms of anxiety." };
    if (score <= 9) return { level: "Mild Anxiety", color: "warning", description: "Your score suggests you may have mild symptoms of anxiety." };
    if (score <= 14) return { level: "Moderate Anxiety", color: "orange", description: "Your score suggests you may have moderate symptoms of anxiety. Consider talking to a professional." };
    return { level: "Severe Anxiety", color: "destructive", description: "Your score suggests severe symptoms of anxiety. Please seek professional help." };
  };


  return (
    <DashboardLayout sidebarItems={sidebarItems} userType="student" userName={studentData?.full_name || "Student"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Mental Health Checkup</h1>
          <p className="text-muted-foreground">
            Complete these brief, confidential screenings to help us understand your mental wellness.
          </p>
        </div>

        <Tabs defaultValue="phq9" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="phq9">Depression (PHQ-9)</TabsTrigger>
            <TabsTrigger value="gad7">Anxiety (GAD-7)</TabsTrigger>
          </TabsList>
          <TabsContent value="phq9" className="mt-6">
            {renderTest('phq', phq9Questions, phqCurrentQuestion, phqAnswers, handlePhqAnswer, handlePhqNext, handlePhqPrevious, handlePhqComplete, isPhqCompleted, phqTestResult, 27, getPhqInterpretation)}
          </TabsContent>
          <TabsContent value="gad7" className="mt-6">
            {renderTest('gad', gad7Questions, gad7CurrentQuestion, gad7Answers, handleGad7Answer, handleGad7Next, handleGad7Previous, handleGad7Complete, isGad7Completed, gad7TestResult, 21, getGadInterpretation)}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MentalHealthCheckup;

