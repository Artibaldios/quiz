'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useDispatch } from 'react-redux';
import { addQuizResult } from '@/redux/quizSlice';
import { calculateQuizResult } from '@/utils/helpers';
import type { FetchedQuizData, LobbySettings } from '@/types/quiz';
import { Session } from "next-auth";
import { Socket } from 'socket.io-client';

type ExpectedSession = Session | null;

interface UseQuizLogicProps {
  questions: FetchedQuizData['questions'];
  quizId: number;
  session: ExpectedSession
  locale: string;
  lobbySettings: LobbySettings;
  socket?: Socket | null;
  lobbyCode?: string;
  timer?: number;
}

export function useQuizLogic({
  questions,
  quizId,
  session,
  locale,
  lobbySettings,
  socket,
  lobbyCode,
  timer
}: UseQuizLogicProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // ✅ NEW: Server-driven question navigation
  const goToQuestion = useCallback((index: number) => {
    console.log('🎯 Server → goToQuestion:', index);
    setCurrentQuestionIndex(index);
    setSelectedAnswer(null); // Reset selection for new question
    setAnswers(prev => ({
      ...prev,
      [index]: null // Clear answer for new question
    }));
  }, []);

  // ✅ Save answer locally when selected (still emit to server)
  const updateAnswer = useCallback((questionIndex: number, answer: string) => {
    const now = Date.now();
    const timeElapsedMs = lobbySettings.questionTimer * 1000 - (timer || 0) * 1000;
    
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    setSelectedAnswer(answer);

    if (socket?.connected && lobbyCode) {
      socket.emit('user-answer-submitted', {
        lobbyCode,
        questionIndex,
        answer,
        userId: session?.user.id,
        username: session?.user.name,
        answerTime: timeElapsedMs
      });
    }
  }, [socket, lobbyCode, session, timer, lobbySettings.questionTimer]);

  const submitQuiz = useCallback(async () => {
    if (isSubmitting) return false;

    setIsSubmitting(true);
    try {
      const finalAnswers = questions.map((_, idx) => answers[idx] || '');
      const result = calculateQuizResult(questions, finalAnswers);

      dispatch(addQuizResult(result));

      if (session?.user.id) {
        const answersWithDetails = questions.map((q, idx) => ({
          questionId: q.id,
          givenAnswer: answers[idx] || '',
          isCorrect: q.correct_answer === (answers[idx] || ''),
        }));

        await fetch('/api/quiz/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            quizId,
            score: result.score,
            answers: answersWithDetails,
          }),
        });
      }

      router.push('/results', { locale });
      return true;
    } catch (error) {
      console.error('Quiz submission failed:', error);
      setIsSubmitting(false);
      return false;
    }
  }, [answers, questions, quizId, session, isSubmitting, dispatch, router, locale]);

  // ✅ Only for single-player / end of quiz (multiplayer handled by server)
  const goNext = useCallback(() => {
    if (isLastQuestion) {
      submitQuiz();
    } else {
      setCurrentQuestionIndex(idx => idx + 1);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex, isLastQuestion, submitQuiz]);

  // Reset selection when server changes question
  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestionIndex]);

  // Timer controls (emit to server)
  const pauseTimer = useCallback(() => {
    if (socket?.connected && lobbyCode) {
      socket.emit('pause-timer', { lobbyCode });
    }
  }, [socket, lobbyCode]);

  const resumeTimer = useCallback(() => {
    if (socket?.connected && lobbyCode) {
      socket.emit('resume-timer', { lobbyCode });
    }
  }, [socket, lobbyCode]);

  const resetTimer = useCallback(() => {
    if (socket?.connected && lobbyCode) {
      socket.emit('start-question-timer', { 
        lobbyCode, 
        duration: lobbySettings.questionTimer 
      });
    }
  }, [lobbySettings.questionTimer, socket, lobbyCode]);

  return {
    // Question state (SERVER DRIVES currentQuestionIndex)
    currentQuestionIndex,
    answers,
    selectedAnswer,
    isSubmitting,
    isLastQuestion,
    currentQuestion: questions[currentQuestionIndex],
    progress: ((currentQuestionIndex + 1) / questions.length) * 100,

    // ✅ NEW: Server-driven navigation
    goToQuestion,

    // Timer controls (emitters only)
    pauseTimer,
    resumeTimer,
    resetTimer,

    // Actions (goNext only for single-player/end)
    goNext,
    updateAnswer,
    submitQuiz,

    // Multiplayer results (managed by parent)
    allUsersAnswered: false,
    showResults: false,
    userResults: [],
  };
}
