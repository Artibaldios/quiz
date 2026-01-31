import { useQuizStore } from "@/stores/useQuizStore";
import { FetchedQuizData } from "@/types/quiz";
import { useTranslations } from "next-intl";

interface QuizHeaderProps {
  quiz: FetchedQuizData;
}

export default function QuizHeader({quiz}: QuizHeaderProps) {
  const { 
    currentAnsweredUsersMap,
    users, 
    currentQuestionIndex
  } = useQuizStore();
  
  const currentAnsweredUsers = currentAnsweredUsersMap.size;
  const totalUsers = users.length;
  const t = useTranslations("quizPage");

  if(!quiz) return null;
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="w-full px-2 mb-2 md:mb-6 md:max-w-200">
      <div className="flex justify-between items-center my-2">
        <h2 className="text-lg md:text-2xl font-bold text-primary hidden sm:block">
          {quiz.title}
        </h2>

        {/* Question counter + Current answered */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-textColor">
            {t("question")} {currentQuestionIndex + 1} {t("of")} {quiz.questions.length}
          </div>
          {currentAnsweredUsers !== undefined && (
            <div className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {currentAnsweredUsers}/{totalUsers} {t("answeredUsers")}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white rounded-full h-3 shadow-inner hidden sm:block">
        <div
          className="bg-primary h-3 rounded-full shadow-lg transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
