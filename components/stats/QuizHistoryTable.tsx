import { useState } from 'react';
import { Trophy, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface QuizResult {
  id: number;
  quizId: number;
  score: number;
  createdAt: string;
  quizTitle: string;
}

interface QuizHistoryTableProps {
  quizzes: QuizResult[];
}

const QuizHistoryTable = ({ quizzes }: QuizHistoryTableProps) => {
  const t = useTranslations("Profile");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(quizzes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentQuizzes = quizzes.slice(startIndex, startIndex + itemsPerPage);

  const getScoreColor = (score: number) => {
    if (score === 100) return "text-emerald-900 dark:text-emerald-300";
    if (score >= 70) return "text-amber-900 dark:text-amber-300";
    return "text-red-900 dark:text-red-300";
  };

  const getScoreBadge = (score: number) => {
    if (score === 100) return { bg: "bg-emerald-500/10 border-emerald-500/30", icon: Trophy };
    if (score >= 70) return { bg: "bg-amber-500/10 border-amber-500/30", icon: TrendingUp };
    return { bg: "bg-red-500/10 border-red-500/30", icon: Clock };
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginateDots = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i + 1}
        onClick={() => goToPage(i + 1)}
        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
          currentPage === i + 1
            ? "w-3 h-3 bg-primary scale-110 shadow-sm"
            : "bg-primary/40 hover:bg-primary/60"
        }`}
      />
    ));
  };

  return (
    <div className="
      bg-bgColor dark:bg-zinc-900/80 backdrop-blur-xl
      rounded-3xl p-6 md:p-8
    ">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold font-display text-textColor tracking-tight">
          {t("quizHistory")}
        </h3>
        <p className="text-sm text-textColor mt-1">
          {quizzes.length} {t("total")}
        </p>
      </div>

      <div className="space-y-2 mb-8">
        {currentQuizzes.map((quiz) => {
          const badge = getScoreBadge(quiz.score);
          const Icon = badge.icon;

          return (
            <div
              key={quiz.id}
              className="
                flex items-center p-5
                bg-white/50 dark:bg-bgContent backdrop-blur-sm
                rounded-2xl border border-transparent
                hover:bg-white/80 dark:hover:bg-bgContent/60
                hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/20
                transition-all duration-200 ease-out
                group
              "
            >
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-textColor truncate group-hover:truncate-none">
                  {quiz.quizTitle}
                </p>
                <p className="text-base text-textColor mt-1">
                  {new Date(quiz.createdAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border ${badge.bg}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${getScoreColor(quiz.score)}`} />
                  <span className={`text-base font-bold ${getScoreColor(quiz.score)}`}>
                    {quiz.score}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pt-6">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="
                flex items-center justify-center w-10 h-10 p-0
                rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-sm
                border border-gray-200/50 dark:border-gray-800/50
                hover:bg-white/80 dark:hover:bg-white/20 hover:shadow-lg
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              "
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
              <span className="sr-only">Previous page</span>
            </button>

            <div className="flex items-center gap-2">
              {paginateDots()}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="
                flex items-center justify-center w-10 h-10 p-0
                rounded-2xl bg-white/50 dark:bg-white/10 backdrop-blur-sm
                border border-gray-200/50 dark:border-gray-800/50
                hover:bg-white/80 dark:hover:bg-white/20 hover:shadow-lg
                transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              "
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
              <span className="sr-only">Next page</span>
            </button>
          </div>
        </div>
      )}

      {quizzes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Clock className="w-16 h-16 text-textColor mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-textColor mb-2">No quiz history yet</h3>
          <p className="text-textColor max-w-md">
            Complete your first quiz to see your progress here.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizHistoryTable;
