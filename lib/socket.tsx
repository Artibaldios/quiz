'use client';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { useQuizStore } from '@/stores/useQuizStore';
import type { User, UserAnsweredData, UserResult } from '@/types/quiz';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { QuizResultsProps } from '@/utils/helpers';


export default function SocketManager() {
  const socketRef = useRef<Socket | null>(null);
  const mountedRef = useRef(false);
  const router = useRouter();
  const locale = useLocale();
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    // Singleton socket
    const socket = io(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
    });

    socketRef.current = socket;
    useQuizStore.setState({ socket, isConnected: true });

    socket.on('connect', () => {
      useQuizStore.setState({ isConnected: true });
    });

    socket.on('lobby-joined', (data: { lobbyCode: string; users: User[]; hostId: string | null }) => {
      console.log("lobby-joined",data )
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

    socket.on('quiz-started', ({ lobbyCode , quizId}) => {
      if (quizId) {
        router.push(`/${locale}/quiz/${lobbyCode}?quizId=${quizId}`);
      } else {
        console.error('❌ No quizId found for redirect');
      }
    });

    socket.on('user-answered', (data: UserAnsweredData) => {

      useQuizStore.setState((state) => {
        const newMap = new Map(state.currentAnsweredUsersMap);
        newMap.set(data.userId, data.username);
        return { currentAnsweredUsersMap: newMap };
      });

      // Create result
      const userResult: UserResult = {
        userId: data.userId,
        username: data.username,
        answer: data.answer || 'No answer',
        isCorrect: data.isCorrect,
        score: data.score || 0
      };

      // Update current results
      useQuizStore.setState((state) => ({
        currentQuestionResults: state.currentQuestionResults.find(r => r.userId === data.userId)
          ? state.currentQuestionResults.map(r => r.userId === data.userId ? userResult : r)
          : [...state.currentQuestionResults, userResult]
      }));

      if (data.allAnswered) {
        useQuizStore.setState({ showCurrentResults: true });
      }
    });

    socket.on('timer-tick', ({ timeLeft, isRunning }: { timeLeft: number; isRunning: boolean }) => {
      useQuizStore.getState().setTimer(timeLeft, isRunning);
    });

    socket.on('question-timer-started', ({ timeLeft, isRunning }: { timeLeft: number; isRunning: boolean }) => {
      useQuizStore.getState().setTimer(timeLeft, isRunning);
    });

    socket.on('timer-paused', ({ timeLeft }: { timeLeft: number }) => {
      useQuizStore.getState().setTimer(timeLeft, false);
    });

    socket.on('timer-resumed', ({ timeLeft }: { timeLeft: number }) => {
      useQuizStore.getState().setTimer(timeLeft, true);
    });

    socket.on('question-timer-ended', () => {
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

    socket.on('quiz-finished', (data: { 
      lobbyCode: string; 
      finalScores: { userId: string; name: string; score: number }[];
      totalQuestions: number 
    }) => {
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
      useQuizStore.setState({ 
        quizFinished: true,
        finalResults: data.finalScores,
        quizResult: data.quizResult
      });
    });

    socket.on('finish-quiz', () => {
      useQuizStore.setState({ quizFinished: true });
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}