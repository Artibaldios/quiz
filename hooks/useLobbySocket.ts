"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User } from '@/types/quiz';
import { useRouter } from 'next/navigation';

// ✅ SINGLETON - Create outside React lifecycle
let globalSocket: Socket | null = null;

const initGlobalSocket = () => {
  if (!globalSocket) {
    globalSocket = io(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });
  }
  return globalSocket!;
};

interface Props {
  lobbyCode: string;
  quizId: string | null;
  locale: string | null | undefined;
  router: ReturnType<typeof useRouter>;
}

interface LobbyData {
  lobbyCode: string;
  users: User[];
  hostId: string | null;
}

export const useLobbySocket = ({ lobbyCode, quizId, locale, router }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hostId, setHostId] = useState<string | null>(null);
  
  // ✅ Refs for latest values
  const hostIdRef = useRef<string | null>(null);
  const routerRef = useRef(router);
  const quizIdRef = useRef(quizId);
  const localeRef = useRef(locale);

  // ✅ Update refs
  useEffect(() => { hostIdRef.current = hostId; }, [hostId]);
  useEffect(() => { routerRef.current = router; }, [router]);
  useEffect(() => { quizIdRef.current = quizId; }, [quizId]);
  useEffect(() => { localeRef.current = locale; }, [locale]);

  // ✅ Stable quiz-started handler
  const handleQuizStarted = useCallback((startedCode: string) => {
    console.log('🎮 Quiz started! Navigating to quiz...');
    routerRef.current.push(
      `/${localeRef.current}/quiz/${startedCode}?quizId=${quizIdRef.current}&hostId=${hostIdRef.current || 'unknown'}`
    );
  }, []);

  // ✅ Main effect - Handle all socket listeners
  useEffect(() => {
    const socket = initGlobalSocket();
    
    // Connect handler
    const onConnect = () => {
      setIsConnected(true);
      console.log('✅ Persistent socket connected:', socket.id);
    };

    // Lobby joined handler
    const onLobbyJoined = (data: LobbyData) => {
      console.log('🔄 Lobby sync:', data.users.length, 'Host:', data.hostId);
      setUsers(data.users);
      setHostId(data.hostId);
    };

    // User joined handler
    const onUserJoined = (userData: User) => {
      console.log('➕ New user:', userData.name);
      setUsers(prev => 
        prev.find(u => u.id === userData.id) ? prev : [...prev, userData]
      );
    };

    // User left handler
    const onUserLeft = (data: { id: string }) => {
      console.log('➖ User left:', data.id);
      setUsers(prev => prev.filter(user => user.id !== data.id));
    };

    // Quiz started handler
    const onQuizStarted = (data: { lobbyCode: string }) => {
      handleQuizStarted(data.lobbyCode);
    };

    // Add all listeners
    socket.on('connect', onConnect);
    socket.on('lobby-joined', onLobbyJoined);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);
    socket.on('quiz-started', onQuizStarted);

    // Cleanup all listeners
    return () => {
      console.log('🧹 Cleaning socket listeners for lobby:', lobbyCode);
      socket.off('connect', onConnect);
      socket.off('lobby-joined', onLobbyJoined);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('quiz-started', onQuizStarted);
    };
  }, [lobbyCode, handleQuizStarted]);

  const joinLobby = useCallback((userId: string, username: string) => {
    const socket = globalSocket;
    if (socket?.connected) {
      console.log(`🤝 Joining lobby ${lobbyCode} as ${username}`);
      socket.emit('join-lobby', { lobbyCode, userId, username });
    } else {
      console.log('❌ Socket not ready - retrying...');
      setTimeout(() => joinLobby(userId, username), 500);
    }
  }, [lobbyCode]);

  const leaveLobby = useCallback(() => {
    const socket = globalSocket;
    if (socket) {
      socket.emit('leave-lobby', { lobbyCode });
    }
  }, [lobbyCode]);

  const startQuiz = useCallback(() => {
    const socket = globalSocket;
    if (socket) {
      socket.emit('start-quiz', { lobbyCode });
    }
  }, [lobbyCode]);

  return { 
    hostId,
    users, 
    isConnected, 
    joinLobby, 
    leaveLobby,
    startQuiz,
    socket: globalSocket,
    lobbyUserCount: users.length 
  };
};