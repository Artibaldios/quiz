import { QuizResult } from "@/types/quiz";
import { Trophy, Calendar } from "lucide-react";

interface RecentQuizCardProps {
  quiz: QuizResult;
  index: number;
}

const RecentQuizCard = ({ quiz }: RecentQuizCardProps) => {

  const getScoreColor = (score: number) => {
    if (score === 100) return "text-emerald-900 dark:text-emerald-300";
    if (score >= 70) return "text-amber-900 dark:text-amber-300";
    return "text-red-900 dark:text-red-300";
  };

  const getScoreBg = (score: number) => {
    if (score === 100) return "bg-emerald-500/10 border-emerald-500/30";
    if (score > 50) return "bg-amber-500/10 border-amber-500/30";
    if (score <= 50) return "bg-red-500/10 border-red-500/30";
    return "bg-destructive/10 border-destructive/20";
  };

  if(!quiz){
    return null;
  }
  return (
    <div 
      className={`         
        relative glass backdrop-blur-xl
        border border-white/20 dark:border-zinc-700/50
        rounded-3xl p-4 md:p-6
        shadow-lg dark:shadow-2xl
        transition-all duration-300 ease-out
        overflow-hidden`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-textColor group-hover:text-primary transition-colors">
              {quiz.quizTitle}
            </h4>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-textColor">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getScoreBg(quiz.score)}`}>
          {quiz.score === 100 && <Trophy className="w-4 h-4 text-success" />}
          <span className={`text-2xl font-bold font-display ${getScoreColor(quiz.score)}`}>
            {quiz.score}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecentQuizCard;
