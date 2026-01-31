import { UserResult } from "@/types/quiz";
import { useState } from "react";

export function useQuizResults() {
  const [showCurrentResults, setShowCurrentResults] = useState(false);
  const [currentQuestionResults, setCurrentQuestionResults] = useState<UserResult[]>([]);
  const [allQuizResults, setAllQuizResults] = useState<Record<number, UserResult[]>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  return {
    showCurrentResults, setShowCurrentResults,
    currentQuestionResults, setCurrentQuestionResults,
    allQuizResults, setAllQuizResults,
    quizFinished, setQuizFinished
  };
}