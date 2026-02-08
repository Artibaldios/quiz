'use client';

import { useQuizData } from "@/hooks/useQuizData";
import Loader from "@/components/Loader";
import QuizTimer from "@/components/Quiz/QuizTimer";
import QuizHeader from "@/components/Quiz/QuizHeader";
import { useQuizStore } from "@/stores/useQuizStore";
import { useSearchParams } from "next/navigation";
import { QuizContent } from "./QuizContent";
import QuizResults from "./QuizResults";
import FinalResults from "./QuizFinalResults";
import ErrorUI from "../ErrorUI";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get('quizId');
  const quizIdNumber = quizId ? Number(quizId) : NaN;
  const { data: quiz, isLoading, error } = useQuizData(quizIdNumber);
  const { currentQuestionIndex, quizFinished, showCurrentResults } = useQuizStore();

  if (isLoading) return <Loader />;
  if (error || !quiz) return <ErrorUI message="Quiz not found"/>;

  return (
    <div className="flex flex-col justify-center items-center max-w-full m-2">
      {showCurrentResults || quizFinished ? null : (
        <QuizTimer />
      )} 
      
      {/* <QuizHeader quiz={quiz}/> */}
      {quizFinished ? (
        <FinalResults />
      ) : showCurrentResults ? (
        <QuizResults />
      ) : (
        <QuizContent 
          quiz={quiz} 
          currentQuestionIndex={currentQuestionIndex}
        />
      )} 
    </div>
  );
}
