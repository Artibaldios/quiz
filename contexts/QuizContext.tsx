'use client';
import { createContext, useContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { Session } from 'next-auth';
import type { FetchedQuizData, TotalScore, User, UserResult } from '@/types/quiz';

interface QuizState {
  currentQuestionIndex: number;
  currentQuestion: FetchedQuizData['questions'][number] | null;
  selectedAnswer: string | null;
  progress: number;
  totalQuestions: number;
  goToQuestion: (index: number) => void;
  goNext: () => void;
  updateAnswer: (index: number, answer: string) => void;
}

interface QuizContextValue {
  // Existing properties...
  quiz: FetchedQuizData | null;
  socket: Socket | null;
  session: Session | null;
  lobbyCode: string;
  lobbyUsers: User[];
  totalUsers: number;
  isHost: boolean;
  isConnected: boolean;
  quizState: QuizState;
  
  // ✅ TIMER STATE (from your QuizPage)
  timer: number;
  isTimerRunning: boolean;
  totalPausedTime: number;
  
  // ✅ RESULTS STATE (from your hooks)
  showCurrentResults: boolean;
  quizFinished: boolean;
  currentQuestionResults: UserResult[];
  allQuizResults: Record<number, UserResult[]>;
  totalScores: TotalScore[];
  currentAnsweredUsersArr: Array<{name: string}>;
  
  // ✅ ACTIONS
  sendAnswer: (questionIndex: number, answer: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  continueQuiz: () => void;
}

interface QuizContextValue {
  quiz: FetchedQuizData | null;
  socket: Socket | null;
  session: Session | null;
  lobbyCode: string;
  lobbyUsers: User[];
  totalUsers: number;
  isHost: boolean;
  isConnected: boolean;
  quizState: QuizState;
  isSocketReady: boolean;
  // ✅ TIMER STATE (from your QuizPage)
  timer: number;
  isTimerRunning: boolean;
  totalPausedTime: number;
  
  // ✅ RESULTS STATE (from your hooks)
  showCurrentResults: boolean;
  quizFinished: boolean;
  currentQuestionResults: UserResult[];
  allQuizResults: Record<number, UserResult[]>;
  totalScores: TotalScore[];
  currentAnsweredUsersArr: Array<{name: string}>;
  
  // ✅ ACTIONS
  sendAnswer: (questionIndex: number, answer: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  continueQuiz: () => void;
}

// ✅ Create context with null default
const QuizContext = createContext<QuizContextValue | null>(null);

interface QuizProviderProps {
  children: ReactNode;
  value: QuizContextValue;
}

// ✅ JSX works perfectly in .tsx file
export function QuizProvider({ children, value }: QuizProviderProps) {
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}

export function useQuizStateFromContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizStateFromContext must be used within QuizProvider');
  }
  return context.quizState;
}