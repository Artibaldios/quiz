'use client';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { useQuizStore } from '@/stores/useQuizStore';
import type { User, UserAnsweredData, UserResult } from '@/types/quiz';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { QuizResultsProps } from '@/utils/helpers';

// Singleton socket instance
let globalSocket: Socket | null = null;

export default function SocketManager() {
  const mountedRef = useRef(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Use existing global socket if available
    if (globalSocket && globalSocket.connected) {
      useQuizStore.setState({ socket: globalSocket, isConnected: true });
      setupSocketListeners(globalSocket, router, locale);
      return;
    }

    // Create new socket
    const socket = io(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    globalSocket = socket;
    useQuizStore.setState({ socket, isConnected: false });

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      useQuizStore.setState({ isConnected: true });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      useQuizStore.setState({ isConnected: false });
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      useQuizStore.setState({ isConnected: false });
    });

    // Setup all event listeners
    setupSocketListeners(socket, router, locale);

    return () => {
      // Only cleanup if this was the last reference to globalSocket
      const currentSocket = globalSocket;
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      
      // Don't disconnect global socket - let it persist
      if (!currentSocket?.connected) {
        globalSocket = null;
      }
    };
  }, [router, locale]);

  return null;
}

function setupSocketListeners(socket: Socket, router: ReturnType<typeof useRouter>, locale: string) {
  // Lobby events
  socket.on('lobby-joined', (data: { lobbyCode: string; users: User[]; hostId: string | null }) => {
    useQuizStore.setState({ 
      lobbyCode: data.lobbyCode, 
      users: data.users, 
      hostId: data.hostId 
    });
  });

  socket.on('user-joined', (user: User) => {
    useQuizStore.setState((state) => ({
      users: state.users.find(u => u.id === user.id) 
        ? state.users 
        : [...state.users, user]
    }));
  });

  socket.on('user-left', ({ id }: { id: string }) => {
    useQuizStore.setState((state) => ({
      users: state.users.filter(u => u.id !== id)
    }));
  });

  // Quiz events
  socket.on('quiz-started', ({ lobbyCode, quizId }: { lobbyCode: string; quizId?: string }) => {
    const quizIdToUse = quizId || useQuizStore.getState().quizId;
    
    if (quizIdToUse) {
      router.push(`/${locale}/quiz/${lobbyCode}?quizId=${quizIdToUse}`);
    } else {
      console.error('❌ No quizId found for redirect');
    }
  });

  socket.on('quiz-state-reset', () => {
    useQuizStore.setState({ 
      quizFinished: false,
      showCurrentResults: false,
      finalResults: undefined,
      quizResult: undefined,
      currentQuestionResults: [],
      currentAnsweredUsersMap: new Map(),
      currentQuestionIndex: 0
    });
  });

  // Answer events
  socket.on('user-answered', (data: UserAnsweredData) => {
    useQuizStore.setState((state) => {
      const newMap = new Map(state.currentAnsweredUsersMap);
      newMap.set(data.userId, data.username);
      return { currentAnsweredUsersMap: newMap };
    });

    const userResult: UserResult = {
      userId: data.userId,
      username: data.username,
      answer: data.answer || 'No answer',
      isCorrect: data.isCorrect,
      score: data.score || 0
    };

    useQuizStore.setState((state) => ({
      currentQuestionResults: state.currentQuestionResults.find(r => r.userId === data.userId)
        ? state.currentQuestionResults.map(r => r.userId === data.userId ? userResult : r)
        : [...state.currentQuestionResults, userResult]
    }));

    if (data.allAnswered) {
      useQuizStore.setState({ showCurrentResults: true });
    }
  });

  // Timer events
  socket.on('timer-tick', ({ timeLeft, isRunning }: { timeLeft: number; isRunning: boolean }) => {
    useQuizStore.getState().setTimer(timeLeft, isRunning);
  });

  socket.on('question-timer-started', ({ timeLeft, isRunning, duration }: { timeLeft: number; isRunning: boolean; duration: number }) => {
    useQuizStore.getState().setTimer(timeLeft, isRunning);
  });

  socket.on('timer-paused', ({ timeLeft, totalPausedTime }: { timeLeft: number; totalPausedTime: number }) => {
    useQuizStore.getState().setTimer(timeLeft, false);
  });

  socket.on('timer-resumed', ({ timeLeft, totalPausedTime }: { timeLeft: number; totalPausedTime: number }) => {
    useQuizStore.getState().setTimer(timeLeft, true);
  });

  socket.on('question-timer-ended', ({ lobbyCode }: { lobbyCode: string }) => {
    useQuizStore.setState({ showCurrentResults: true });
  });

  socket.on('question-advanced', ({ currentQuestionIndex }: { currentQuestionIndex: number }) => {
    useQuizStore.setState({ 
      currentQuestionIndex,
      showCurrentResults: false,
      currentQuestionResults: [],
      currentAnsweredUsersMap: new Map()
    });
  });

  // Quiz results
  socket.on('quiz-finished', (data: { 
    lobbyCode: string; 
    finalScores: { userId: string; name: string; score: number }[];
    totalQuestions: number 
  }) => {
    if (useQuizStore.getState().quizFinished) {
      return;
    }
    useQuizStore.setState({ 
      quizFinished: true, 
      showCurrentResults: false,
      finalResults: data.finalScores
    });
  });

  socket.on('personal-quiz-result', (data: { 
    lobbyCode: string; 
    quizResult: QuizResultsProps;
    finalScores: { userId: string; name: string; score: number }[];
  }) => {
    if (useQuizStore.getState().quizFinished) {
      return;
    }
    useQuizStore.setState({ 
      quizFinished: true,
      finalResults: data.finalScores,
      quizResult: data.quizResult
    });
  });
}
