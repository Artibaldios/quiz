"use client"
import { useState } from "react";
import { useQuery } from '@tanstack/react-query'
import { calculateQuizResult } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import { addQuizResult } from "@/redux/quizSlice";
import { useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import Loader from "@/components/Loader";

type QuizParams = { id: string, locale: string };

async function fetchQuestions({ queryKey }: { queryKey: [string, string, number] }) {
  const [, locale, id] = queryKey;
  const response = await fetch(`/api/quiz/${id}?lang=${locale}`);
  if (!response.ok) {
    throw new Error('Failed to get quiz');
  }
  
  return response.json();
}

async function submitQuizResults(userId: string, quizId: number, score: number, answers: Array<{ questionId: number | string; givenAnswer: number | string; isCorrect: boolean }>) {
  const response = await fetch('/api/quiz/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, quizId, score, answers }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit quiz results');
  }
  return response.json();
}

export default function QuizPage() {
  const dispatch = useDispatch();
  const locale = useLocale();
  const router = useRouter();
  const params = useParams<QuizParams>();
  const t = useTranslations("quizPage");
  const quizId = params.id ? parseInt(params.id, 10) : NaN;
  const hasValidId = !isNaN(quizId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["questions", locale, quizId],
    queryFn: fetchQuestions,
    enabled: hasValidId,
  });

  const questions = data?.questions;
  const { data: session, status } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader variant="spinner" color="blue" size="xl" />
    </div>
  )

  if (questions?.length === 0) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-600">{t("notAvailbale")}</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNext = async () => {
    if (selectedAnswer === null) {
      // toast.error("Please select an answer");
      return;
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setIsSubmitting(true);
      try {
        // toast.success(`Quiz completed! You scored ${result.score}%`);
        const result = calculateQuizResult(questions, newAnswers);
        const answers = newAnswers.map((answer, index) => ({
          questionId: questions[index].id,
          givenAnswer: answer,
          isCorrect: questions[index].correct_answer === answer,
        }))
        if (session && session.user) {
          const userId = session.user.id
          const quizId = data.id;
          const results = await submitQuizResults(userId, quizId, result.score, answers);
        }
        dispatch(addQuizResult(result));
        router.push('/results', { locale: locale });
      } catch (error) {
        //toast.error("Failed to submit quiz");
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col justify-center items-center max-w-full m-2">
      <div className="w-full mb-8 px-2 md:max-w-104">
        <div className="flex justify-between items-center my-2">
          <h2 className="text-lg md:text-2xl font-bold text-primary">{data.title}</h2>
          <span className="text-sm text-textColor text-nowrap">
            {t("question")} {currentQuestionIndex + 1} {t("of")} {questions.length}
          </span>
        </div>
        <div className="w-full bg-white rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-bgContent rounded-lg shadow-sm border p-8 md:w-150 border-gray-200">
        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
            {currentQuestion.topic}
          </span>
          <h3 className="text-xl font-semibold text-textColor mb-6">
            {currentQuestion.question_text}
          </h3>
        </div>

        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswer === option
                  ? "border-primary bg-blue-50 text-primary dark:bg-blue-900"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-blue-800"
                }`}
            >
              <span className="font-medium mr-3 text-textColor">
                {String.fromCharCode(65 + index)}.
              </span>
              <span className="text-textColor">{option}</span>
              
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null || isSubmitting}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {t("submitting")}
              </div>
            ) : isLastQuestion ? (
              t("submitQuiz")
            ) : (
              t("nextQuestion")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}