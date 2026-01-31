"use client"
import { FetchedQuizData } from "@/types/quiz";
import { useEffect, useState } from "react";

export function useQuizState(questions: FetchedQuizData['questions']) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const goToQuestion = (index: number) => setCurrentQuestionIndex(index);
  const goNext = () => setCurrentQuestionIndex(idx => Math.min(idx + 1, questions.length - 1));

  const updateAnswer = (index: number, answer: string) => {
    if (index !== currentQuestionIndex) return;
    setSelectedAnswer(answer);
  };

  useEffect(() => {
    setProgress((currentQuestionIndex + 1) / questions.length * 100);
  }, [currentQuestionIndex, questions.length]);

  return {
    currentQuestionIndex,
    currentQuestion,
    selectedAnswer,
    progress,
    goToQuestion,
    goNext,
    updateAnswer,
    totalQuestions: questions.length
  };
}