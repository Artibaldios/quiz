// lib/socket-client.ts
import { io, Socket } from 'socket.io-client';
import { User } from '@/types/quiz';

export interface LobbyData {
  lobbyCode: string;
  users: User[];
  hostId: string | null;
}

let globalSocket: Socket | null = null;
const lobbyHandlers = new Map<string, {
  lobbyJoined?: (data: LobbyData) => void;
  userJoined?: (user: User) => void;
  userLeft?: (data: { id: string }) => void;
  quizStarted?: (data: { lobbyCode: string }) => void;
}>();

// ✅ LAZY INITIALIZATION - Safe getSocket()
export const getSocket = (): Socket => {
  if (!globalSocket) {
    console.log('🔌 Auto-initializing socket...');
    initSocket();
  }
  return globalSocket!;
};

// ✅ Main init (called by getSocket if needed)
export const initSocket = () => {
  if (!globalSocket) {
    console.log('🔌 Initializing global socket...');
    globalSocket = io(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000', {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });

    // Global listeners - only once
    globalSocket.on('connect', () => {
      console.log('✅ Global socket connected:', globalSocket!.id);
    });

    globalSocket.on('disconnect', () => {
      console.log('❌ Global socket disconnected');
    });

    globalSocket.on('lobby-joined', (data: LobbyData) => {
      console.log('📤 Global: lobby-joined →', data.lobbyCode);
      const handlers = lobbyHandlers.get(data.lobbyCode);
      handlers?.lobbyJoined?.(data);
    });

    globalSocket.on('user-joined', (userData: User) => {
      console.log('📤 Global: user-joined →', userData.name);
      Array.from(lobbyHandlers.values()).forEach(h => h.userJoined?.(userData));
    });

    globalSocket.on('user-left', (data: { id: string }) => {
      console.log('📤 Global: user-left →', data.id);
      Array.from(lobbyHandlers.values()).forEach(h => h.userLeft?.(data));
    });

    globalSocket.on('quiz-started', (data: { lobbyCode: string }) => {
      console.log('📤 Global: quiz-started →', data.lobbyCode);
      const handlers = lobbyHandlers.get(data.lobbyCode);
      handlers?.quizStarted?.(data);
    });
  }
  return globalSocket!;
};

export const registerLobbyHandlers = (
  lobbyCode: string, 
  handlers: {
    lobbyJoined?: (data: LobbyData) => void;
    userJoined?: (user: User) => void;
    userLeft?: (data: { id: string }) => void;
    quizStarted?: (data: { lobbyCode: string }) => void;
  }
) => {
  lobbyHandlers.set(lobbyCode, handlers);
};

export const unregisterLobbyHandlers = (lobbyCode: string) => {
  lobbyHandlers.delete(lobbyCode);
};

export const emitLobbyEvent = <T = any>(
  event: string, 
  data: T, 
  lobbyCode: string
) => {
  const socket = getSocket(); // ✅ Auto-inits if needed
  if (socket.connected) {
    socket.emit(event, { lobbyCode, ...data });
  } else {
    console.warn('⚠️ Socket not connected, cannot emit:', event);
  }
};
