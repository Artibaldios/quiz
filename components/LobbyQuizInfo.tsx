import { BookOpen, Trophy, Clock, HelpCircle } from "lucide-react";
import { FetchedQuizData } from "@/types/quiz";
import { useTranslations } from "next-intl";

interface QuizInfoProps {
  quiz: FetchedQuizData;
}

const QuizInfo = ({ quiz }: QuizInfoProps) => {
  const t = useTranslations("lobby");
  const getLevelColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-600 dark:text-green-200 border-green-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-600 border-red-500/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="glass p-4 animate-fade-in rounded-2xl sm:p-4 md:p-6" style={{ animationDelay: "0.1s" }} >
      <div className="flex flex-col items-start justify-start">
        <div className="flex">
          <span className=" px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary m-1">
            {quiz.category}
          </span>
          {quiz.level && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border m-1 ${getLevelColor(
                quiz.level
              )}`}
            >
              {quiz.level}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2 mx-1">{quiz.title}</h1>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="glass p-4 rounded-xl text-center">
          <HelpCircle className="w-5 h-5 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold text-foreground">{quiz.questionCount}</p>
          <p className="text-xs text-muted-foreground">{t("questions")}</p>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <Trophy className="w-5 h-5 mx-auto mb-2 text-accent" />
          <p className="text-2xl font-bold text-foreground">{quiz.plays.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{t("total")}</p>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
          <p className="text-2xl font-bold text-foreground">
            {new Date(quiz.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
          <p className="text-xs text-muted-foreground">{t("created")}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>
            {t("topic")}: {[...new Set(quiz.questions.map((q) => q.topic))].slice(0, 4).join(", ")}
            {quiz.questions.length > 4 && " ..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuizInfo;
