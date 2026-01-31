import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { User, LobbySettings, UserResult, FetchedQuizData } from '@/types/quiz';
import { QuizResultsProps } from '@/utils/helpers';

interface QuizState {
  // Lobby state
  lobbyCode: string | null;
  users: User[];
  hostId: string | null;
  userId: string | null;
  settings: LobbySettings;

  // Quiz state
  quizId: string | null;
  currentQuestionIndex: number;
  quizFinished: boolean;
  showCurrentResults: boolean;

  // Timer state
  timer: number;
  isTimerRunning: boolean;
  totalPausedTime: number;

  // Socket
  socket: Socket | null;
  isConnected: boolean;

  // Results
  currentAnsweredUsersMap: Map<string, string>;
  currentQuestionResults: UserResult[];
  allQuizResults: Record<number, UserResult[]>;
  finalResults?: { userId: string; name: string; score: number }[];
  quizData: FetchedQuizData | null;
  totalQuestions: number;
  quizResult?: QuizResultsProps;
  // Actions
  joinLobby: (userId: string, username: string, lobbyCode: string) => void;
  leaveLobby: (lobbyCode: string) => void;
  startQuiz: (lobbyCode: string, quizData: FetchedQuizData, settings: LobbySettings, quizId: string) => void;
  sendAnswer: (questionIndex: number, answer: string, answerTime?: number, userId?: string, username?: string | null) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  continueQuiz: () => void;
  finishQuiz: () => void;
  setTimer: (time: number, isRunning: boolean) => void;
  setQuizResult: (result: QuizResultsProps) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  // Initial state
  lobbyCode: null,
  users: [],
  hostId: null,
  userId: null,
  settings: { questionTimer: 15, resultTimer: 5, autoContinue: true },
  quizId: null,
  currentQuestionIndex: 0,
  quizFinished: false,
  showCurrentResults: false,
  timer: 15,
  isTimerRunning: false,
  totalPausedTime: 0,
  socket: null,
  isConnected: false,
  currentAnsweredUsersMap: new Map(),
  currentQuestionResults: [],
  allQuizResults: {},
  quizData: null,
  totalQuestions: 0,

  joinLobby: (userId, username, lobbyCode) => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.emit('join-lobby', { lobbyCode, userId, username });
    }
  },

  leaveLobby: (lobbyCode) => {
    const socket = get().socket;
    socket?.emit('leave-lobby', { lobbyCode });
  },

  startQuiz: (lobbyCode: string, quizData: FetchedQuizData, settings: LobbySettings, quizId) => {
    const socket = get().socket;
    if (socket?.connected) {
      set({
        // Quiz progress
        currentQuestionIndex: 0,
        quizFinished: false,
        showCurrentResults: false,
        // Timer
        timer: settings.questionTimer || 15,
        isTimerRunning: false,
        totalPausedTime: 0,
        // Results - FULL CLEANUP
        currentAnsweredUsersMap: new Map(),
        currentQuestionResults: [],
        allQuizResults: {},
        finalResults: undefined,
        // Quiz data
        quizData,
        totalQuestions: quizData.questionCount,
        settings,
        quizId
      });
      socket.emit('start-quiz', { lobbyCode, quizData, settings, quizId });
    }
  },

  sendAnswer: (questionIndex, answer, answerTime, userId, username) => {
    const { socket, lobbyCode } = get();
    if (!socket?.connected || !lobbyCode) return;

    socket.emit('user-answer-submitted', {
      lobbyCode,
      questionIndex,
      answer,
      userId,
      username,
      answerTime
    });
  },

  pauseTimer: () => {
    const { socket, lobbyCode, hostId } = get();
    if (hostId && socket?.connected && lobbyCode) {
      socket.emit('pause-timer', { lobbyCode });
    }
  },

  resumeTimer: () => {
    const { socket, lobbyCode, hostId } = get();
    if (hostId && socket?.connected && lobbyCode) {
      socket.emit('resume-timer', { lobbyCode });
    }
  },

  continueQuiz: () => {
    const { socket, lobbyCode, hostId, currentQuestionIndex, totalQuestions } = get();

    if (currentQuestionIndex >= totalQuestions - 2) {
      get().finishQuiz();
      return;
    }

    if (hostId && socket?.connected && lobbyCode) {
      socket.emit('next-question', { lobbyCode });
    }
  },
  finishQuiz: () => {
    const { socket, lobbyCode, hostId } = get();
    if (hostId && socket?.connected && lobbyCode) {
      socket.emit('finish-quiz', { lobbyCode });
    }
  },
  
  setQuizResult: (result: QuizResultsProps) => set({ quizResult: result }),

  setTimer: (time, isRunning) => set({ timer: time, isTimerRunning: isRunning }),
}));
