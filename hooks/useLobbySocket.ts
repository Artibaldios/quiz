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
  const lobbyCodeRef = useRef(lobbyCode);

  // ✅ Update refs
  useEffect(() => { hostIdRef.current = hostId; }, [hostId]);
  useEffect(() => { routerRef.current = router; }, [router]);
  useEffect(() => { quizIdRef.current = quizId; }, [quizId]);
  useEffect(() => { localeRef.current = locale; }, [locale]);
  useEffect(() => { lobbyCodeRef.current = lobbyCode; }, [lobbyCode]);

  // ✅ Stable quiz-started handler
  const handleQuizStarted = useCallback((startedCode: string) => {
    console.log('🎮 Quiz started! Navigating to quiz...');
    routerRef.current.push(
      `/${localeRef.current}/quiz/${startedCode}?quizId=${quizIdRef.current}&hostId=${hostIdRef.current || 'unknown'}`
    );
  }, []);

  // ✅ 1. PERSISTENT CONNECTION EFFECT - NEVER cleans up
  useEffect(() => {
    const socket = initGlobalSocket();

    const onConnect = () => {
      setIsConnected(true);
      console.log('✅ Persistent socket connected:', socket.id);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
    };

    const onConnectError = (error: Error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // Initial connection check
    if (socket.connected) {
      onConnect();
    }

    return () => {
      console.log('🧹 Cleaning GLOBAL connection listeners');
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []); // ❌ NEVER DEPENDS ON ANYTHING

  // ✅ 2. LOBBY-SPECIFIC EFFECT - Cleans per lobby change
  useEffect(() => {
    const socket = initGlobalSocket();

    // Lobby joined handler
    const onLobbyJoined = (data: LobbyData) => {
      console.log('🔄 Lobby sync:', data.users.length, 'Host:', data.hostId);
      setUsers(data.users);
      setHostId(data.hostId);
      hostIdRef.current = data.hostId;
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

    // Add lobby-specific listeners
    socket.on('lobby-joined', onLobbyJoined);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);
    socket.on('quiz-started', onQuizStarted);

    // Auto-join lobby when lobby changes AND socket ready
    if (socket.connected) {
      // You'll call this manually with userId/username from props/context
      console.log(`🔄 Auto-joining lobby on mount: ${lobbyCode}`);
    }

    return () => {
      console.log('🧹 Cleaning LOBBY listeners for:', lobbyCode);
      socket.off('lobby-joined', onLobbyJoined);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
      socket.off('quiz-started', onQuizStarted);

      // Leave current lobby
      socket.emit('leave-lobby', { lobbyCode: lobbyCodeRef.current });
    };
  }, [lobbyCode, handleQuizStarted]); // ✅ Cleans when lobby changes

  const joinLobby = useCallback((userId: string, username: string) => {
    const socket = globalSocket;
    if (socket?.connected) {
      console.log(`🤝 Joining lobby ${lobbyCode} as ${username}`);
      socket.emit('join-lobby', { lobbyCode, userId, username });
    } else {
      console.log('⏳ Socket not ready, waiting...', { isConnected, lobbyCode });
      // Retry once connection is back
      const retry = () => {
        if (socket?.connected) {
          console.log(`🔄 Retrying join lobby ${lobbyCode}`);
          socket.emit('join-lobby', { lobbyCode, userId, username });
        } else {
          setTimeout(retry, 500);
        }
      };
      setTimeout(retry, 500);
    }
  }, [lobbyCode, isConnected]);

  const leaveLobby = useCallback(() => {
    const socket = globalSocket;
    if (socket) {
      console.log(`👋 Leaving lobby ${lobbyCode}`);
      socket.emit('leave-lobby', { lobbyCode });
    }
  }, [lobbyCode]);

  const startQuiz = useCallback(() => {
    const socket = globalSocket;
    if (socket?.connected) {
      console.log(`🚀 Starting quiz in lobby ${lobbyCode}`);
      socket.emit('start-quiz', { lobbyCode });
    } else {
      console.log('❌ Cannot start quiz - not connected');
    }
  }, [lobbyCode]);

  // ✅ Debug logging
  useEffect(() => {
    console.log('🎯 LobbySocket State:', {
      isConnected,
      hostId,
      lobbyCode,
      userCount: users.length,
      socketConnected: globalSocket?.connected
    });
  }, [isConnected, hostId, lobbyCode, users.length]);

  return {
    hostId,
    users,
    isConnected,
    joinLobby,  // Call this with userId/username from your auth context
    leaveLobby,
    startQuiz,
    socket: globalSocket,
    lobbyUserCount: users.length
  };
};
