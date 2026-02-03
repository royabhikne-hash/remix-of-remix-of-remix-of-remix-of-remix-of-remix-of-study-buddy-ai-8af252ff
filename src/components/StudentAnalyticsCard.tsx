import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  BookOpen, 
  Brain, 
  Clock,
  Target,
  Award,
  CheckCircle,
  XCircle
} from "lucide-react";

interface StudentAnalyticsCardProps {
  id: string;
  photo: string;
  name: string;
  studentClass: string;
  todayStudied: boolean;
  topicStudied: string;
  improvementTrend: "up" | "down" | "stable";
  totalSessions: number;
  quizAccuracy?: number;
  studyTimeToday?: number;
  onViewReport: () => void;
  onDelete?: () => void;
}

const StudentAnalyticsCard = ({
  photo,
  name,
  studentClass,
  todayStudied,
  topicStudied,
  improvementTrend,
  totalSessions,
  quizAccuracy = 0,
  studyTimeToday = 0,
  onViewReport,
}: StudentAnalyticsCardProps) => {
  const getTrendIcon = () => {
    switch (improvementTrend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (improvementTrend) {
      case "up":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "down":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-muted-foreground/20";
    }
  };

  const getTrendLabel = () => {
    switch (improvementTrend) {
      case "up":
        return "Improving";
      case "down":
        return "Needs Help";
      default:
        return "Stable";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={onViewReport}>
      {/* Header with gradient */}
      <div className="h-2 bg-gradient-to-r from-primary via-primary/80 to-accent" />
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 border-2 border-background shadow-md">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                Class {studentClass}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs flex items-center gap-1 ${getTrendColor()}`}
              >
                {getTrendIcon()}
                {getTrendLabel()}
              </Badge>
            </div>
          </div>
          
          {/* Today's Status */}
          <div className={`p-1.5 rounded-full ${todayStudied ? 'bg-green-500/10' : 'bg-muted'}`}>
            {todayStudied ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Current Topic */}
        <div className="flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4 text-primary/60" />
          <span className="text-muted-foreground truncate">
            {topicStudied !== "-" ? topicStudied : "No recent activity"}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Sessions */}
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Brain className="w-3.5 h-3.5 text-primary/70" />
            </div>
            <p className="text-lg font-bold">{totalSessions}</p>
            <p className="text-[10px] text-muted-foreground">Sessions</p>
          </div>

          {/* Quiz Accuracy */}
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-3.5 h-3.5 text-accent/70" />
            </div>
            <p className="text-lg font-bold">{quizAccuracy}%</p>
            <p className="text-[10px] text-muted-foreground">Accuracy</p>
          </div>

          {/* Study Time */}
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-500/70" />
            </div>
            <p className="text-lg font-bold">{studyTimeToday}</p>
            <p className="text-[10px] text-muted-foreground">Mins Today</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Quiz Performance</span>
            <span>{quizAccuracy}%</span>
          </div>
          <Progress value={quizAccuracy} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAnalyticsCard;
