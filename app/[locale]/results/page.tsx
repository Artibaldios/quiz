"use client"
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from "react";
import { useRouter } from 'next/navigation';
import { useQuizStore } from '@/stores/useQuizStore';

export default function QuizResults() {
  const { quizResult } = useQuizStore();
  const t = useTranslations("quizResultsPage");

  const { topicScores, totalCorrect, totalQuestions } = useMemo(() => {
    const topics = Object.entries(quizResult?.topicScores || {}).map(([topic, scores]) => ({
      topic,
      percentage: scores.total === 0 ? 0 : Math.round((scores.correct / scores.total) * 100),
      correct: scores.correct,
      total: scores.total,
    }));

    const totals = topics.reduce(
      (acc, topic) => ({
        totalCorrect: acc.totalCorrect + topic.correct,
        totalQuestions: acc.totalQuestions + topic.total,
      }),
      { totalCorrect: 0, totalQuestions: 0 }
    );

    return { topicScores: topics, totalCorrect: totals.totalCorrect, totalQuestions: totals.totalQuestions };
  }, [quizResult]);

  if (!quizResult) return (
    <div className='min-h-[400px] flex flex-col justify-center items-center'>
      <p className='text-center text-4xl text-textColor'>{t("notFound")}</p>
      <div className="text-center flex gap-4 justify-center items-center m-4 md:w-48">
        <BackToHomeButton className="md:w-48"/>
      </div>
    </div>
  )

  return (
    <div className=" flex flex-col items-center justify-center mx-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4 md:pt-4">{t("quizResults")}</h2>
        <p className="text-lg text-textColor">
          {t("youGot")} {totalCorrect} {t("outOf")} {" "} {totalQuestions} {t("correctQuestions")}
        </p>
      </div>

      {/* Topic Performance */}
      <div className="glass rounded-lg shadow-sm border p-6 mb-8 border-gray-200 min-w-full sm:min-w-2/3">
        <h3 className="text-xl font-semibold mb-6 text-textColor">{t("PerformanceByTopic")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topicScores.map((topic) => (
            <div key={topic.topic} className="glass rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-textColor">{topic.topic}</h4>
                <span className="text-lg font-bold text-primary">{topic.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${topic.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-textColor">
                {topic.correct} {t("outOf")} {topic.total} {t("correct")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Results */}
      <div className="glass rounded-lg shadow-sm border p-6 mb-8 border-gray-200 md:min-w-2/3">
        <h3 className="text-xl font-semibold mb-6 text-textColor">{t("questionReview")}</h3>
        <div className="space-y-4">
          {quizResult.questionsWithAnswers && quizResult.questionsWithAnswers.map((qa, index) => (
            <div
              key={`${qa.questionId}-${index}`}
              className={`border rounded-lg p-4 ${qa.user_answer === qa.correct_answer
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                    {qa.topic}
                  </span>
                  <p className="font-medium text-gray-900">{qa.question_text}</p>
                </div>
                <div className="ml-4">
                  {qa.user_answer === qa.correct_answer ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{t("yourAnswer")}</span>
                  <span className={qa.user_answer === qa.correct_answer ? "text-green-700" : "text-red-700"}>
                    {qa.user_answer}
                  </span>
                </div>
                {qa.user_answer !== qa.correct_answer && (
                  <div>
                    <span className="font-medium text-gray-700">{t("correctAnswer")}</span>
                    <span className="text-green-700">
                      {qa.correct_answer}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center flex gap-4 justify-center items-center m-4 md:w-54 md:m-auto">
        <BackToHomeButton className="md:w-54 md:m-auto"/>
      </div>
    </div>
  );
}

function BackToHomeButton({ className = "" }: { className?: string }) {
  const t = useTranslations("quizResultsPage");
  const router = useRouter();
  const locale = useLocale();
  return (
    <div className={`text-center flex gap-4 justify-center items-center ${className}`}>
        <button
          onClick={() => router.push(`/${locale}`)}
          className="glass w-full px-4 sm:px-8 py-2.5 sm:py-3 dark:bg-linear-to-r dark:from-gray-400 dark:to-gray-500 dark:hover:from-gray-500 dark:hover:to-gray-600 text-textColor dark:text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-xl min-h-11 flex items-center justify-center cursor-pointer"
        >
          {t("BackToHome")}
        </button>
    </div>
  );
}