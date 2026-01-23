import { BookOpen, Trophy, Clock, HelpCircle } from "lucide-react";
import { FetchedQuizData } from "@/types/quiz";

interface QuizInfoProps {
  quiz: FetchedQuizData;
}

const QuizInfo = ({ quiz }: QuizInfoProps) => {
  const getLevelColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="glass-solid p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary mb-3">
            {quiz.category}
          </span>
          <h1 className="text-2xl font-bold text-foreground mb-2">{quiz.title}</h1>
        </div>
        {quiz.level && (
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getLevelColor(
              quiz.level
            )}`}
          >
            {quiz.level}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass p-4 rounded-xl text-center">
          <HelpCircle className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{quiz.questionCount}</p>
          <p className="text-xs text-muted-foreground">Questions</p>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <Trophy className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{quiz.plays.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Total Plays</p>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-2xl font-bold text-foreground">
            {new Date(quiz.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <p className="text-xs text-muted-foreground">Created</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>
            Topics: {[...new Set(quiz.questions.map((q) => q.topic))].slice(0, 3).join(", ")}
            {quiz.questions.length > 3 && " ..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizInfo;
