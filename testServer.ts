import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import Next from 'next';
import { parse } from 'url';
import type { User } from './types/quiz'; // Adjust path to your types

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Lobbies state management
const lobbies: Map<string, User[]> = new Map();
const socketUserMap = new Map<string, { userId: string, lobbyCode: string }>();
const lobbyHosts = new Map<string, string>();
const lobbyUserAnswers = new Map<string, Map<number, Map<string, string>>>();
const lobbyQuestionIndex = new Map<string, number>();
const lobbyTimers = new Map<string, {
  isRunning: boolean;
  timeLeft: number;
  startTime: number | null;
  duration: number;
  totalPausedTime: number;
  pauseStartTime: number | null;
}>();
const getLobbyUsers = (lobbyCode: string): User[] => {
  return lobbies.get(lobbyCode) || [];
};

const addUserToLobby = (lobbyCode: string, user: User): void => {
  const currentUsers = getLobbyUsers(lobbyCode);
  if (!currentUsers.find(u => u.id === user.id)) {
    const updatedUsers = [...currentUsers, user];
    lobbies.set(lobbyCode, updatedUsers);
    console.log(`👥 Added ${user.name} to ${lobbyCode}. Total: ${updatedUsers.length}`);
  }
};

const removeUserFromLobby = (lobbyCode: string, userId: string): void => {
  const currentUsers = getLobbyUsers(lobbyCode);
  const updatedUsers = currentUsers.filter(u => u.id !== userId);
  lobbies.set(lobbyCode, updatedUsers);
};

function cleanupStaleLobbies() {
  const now = Date.now();

  lobbies.forEach((users, lobbyCode) => {
    // Delete if:
    // 1. Empty lobby (no users)
    // 2. No one connected to room for 5+ minutes
    const roomSockets = io.sockets.adapter.rooms.get(lobbyCode);
    const hasActiveSockets = roomSockets && roomSockets.size > 0;
    const isStale = !hasActiveSockets || users.length === 0;

    if (isStale) {
      console.log(`🧹 Auto-cleaning stale lobby ${lobbyCode}`);
      lobbies.delete(lobbyCode);
      lobbyHosts.delete(lobbyCode);
      lobbyUserAnswers.delete(lobbyCode);
      lobbyQuestionIndex.delete(lobbyCode);
      lobbyTimers.delete(lobbyCode);
    }
  });
}

// Run every 30 seconds
setInterval(cleanupStaleLobbies, 30000);
const app = Next({ dev, hostname, port });
const handle = app.getRequestHandler();

let io: IOServer;

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  io = new IOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: 'http://localhost:3000',
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Server: On 'join-lobby' - FORCE FRESH STATE CHECK
    socket.on('join-lobby', ({ lobbyCode, userId, username }) => {
      socket.join(lobbyCode);
      socketUserMap.set(socket.id, { userId, lobbyCode });

      const newUser = { id: userId, name: username, isHost: false };

      // Auto-reset if lobby stale/empty
      let currentUsers = lobbies.get(lobbyCode) || [];
      if (currentUsers.length === 0) {
        console.log(`🔄 Resetting empty lobby ${lobbyCode}`);
        lobbies.delete(lobbyCode);
        lobbyHosts.delete(lobbyCode);
        currentUsers = [];
      }

      if (currentUsers.length === 0) {
        lobbyHosts.set(lobbyCode, userId);
        newUser.isHost = true;
      }

      addUserToLobby(lobbyCode, newUser);

      const lobbyData = {
        lobbyCode,
        users: getLobbyUsers(lobbyCode),
        hostId: lobbyHosts.get(lobbyCode) || userId
      };

      console.log(`📤 lobby-joined: ${lobbyData.users.length} users, host: ${lobbyData.hostId}`);
      io.to(lobbyCode).emit('lobby-joined', lobbyData);
      socket.to(lobbyCode).emit('user-joined', newUser);
    });


    socket.on('start-quiz', ({ lobbyCode, settings }) => {
      console.log(`🚀 Host starting quiz in ${lobbyCode}`, settings);
      lobbyUserAnswers.delete(lobbyCode);
      const allUsers = getLobbyUsers(lobbyCode);
      const totalUsers = allUsers.length;
      const hostId = lobbyHosts.get(lobbyCode);

      // ✅ Initialize and START timer for first question
      const initialDuration = settings.questionTimer || 15;
      lobbyTimers.set(lobbyCode, {
        isRunning: true,
        timeLeft: initialDuration,
        startTime: Date.now(),
        duration: initialDuration,
        totalPausedTime: 0,
        pauseStartTime: null
      });

      // ✅ Broadcast INITIAL STATE to ALL users
      io.to(lobbyCode).emit('quiz-initialized', {
        lobbyCode,
        totalUsers,
        hostId,
        settings,
        currentQuestionIndex: 0
      });

      // ✅ Also emit timer started event
      io.to(lobbyCode).emit('question-timer-started', {
        timeLeft: initialDuration,
        isRunning: true,
        duration: initialDuration
      });

      // Keep existing broadcast
      io.to(lobbyCode).emit('quiz-started', { lobbyCode, totalUsers });
    });

    socket.on('user-answer-submitted', ({ lobbyCode, questionIndex, answer, userId, username, answerTime }) => {
      if (!lobbyUserAnswers.has(lobbyCode)) {
        lobbyUserAnswers.set(lobbyCode, new Map());
      }
      if (!lobbyUserAnswers.get(lobbyCode)!.has(questionIndex)) {
        lobbyUserAnswers.get(lobbyCode)!.set(questionIndex, new Map());
      }

      const questionAnswers = lobbyUserAnswers.get(lobbyCode)!.get(questionIndex)!;
      questionAnswers.set(userId, answer);

      const answeredUsers = questionAnswers.size;

      const allUsers = getLobbyUsers(lobbyCode);
      const totalUsers = allUsers.length;
      const allAnswered = answeredUsers === totalUsers;

      const timer = lobbyTimers.get(lobbyCode);
      let score = 0;

      // ✅ FIXED: Calculate time elapsed correctly
      if (timer && answerTime !== undefined) {
        const maxTime = timer.duration * 1000; // Convert to milliseconds
        const timeUsed = answerTime; // This should be milliseconds elapsed
        const timeRemaining = Math.max(0, maxTime - timeUsed);

        // Score based on how quickly they answered (more time left = higher score)
        score = Math.floor(1000 * (timeRemaining / maxTime));
      }

      console.log("Score calculated:", score, "answerTime:", answerTime);

      io.to(lobbyCode).emit('user-answered', {
        userId, questionIndex, answer, answeredUsers, allAnswered, username,
        allUsers, totalUsers, score, answerTime
      });
    });

    socket.on('pause-timer', ({ lobbyCode }) => {
      const timer = lobbyTimers.get(lobbyCode);
      if (timer?.isRunning) {
        timer.isRunning = false;
        timer.pauseStartTime = Date.now();
        io.to(lobbyCode).emit('timer-paused', {
          timeLeft: timer.timeLeft,  // 👈 PRESERVE timeLeft!
          totalPausedTime: timer.totalPausedTime
        });
      }
    });

    socket.on('resume-timer', ({ lobbyCode }) => {
      const timer = lobbyTimers.get(lobbyCode);
      if (timer && !timer.isRunning && timer.pauseStartTime) {
        const pauseDuration = Date.now() - timer.pauseStartTime;
        timer.totalPausedTime += pauseDuration;
        timer.pauseStartTime = null;
        timer.isRunning = true;

        io.to(lobbyCode).emit('timer-resumed', {
          timeLeft: timer.timeLeft,  // 👈 SAME timeLeft!
          totalPausedTime: timer.totalPausedTime
        });
      }
    });

    socket.on('start-question-timer', ({ lobbyCode, duration }) => {
      const now = Date.now();
      lobbyTimers.set(lobbyCode, {
        isRunning: true,
        timeLeft: duration,  // ✅ START VALUE
        startTime: now,
        duration,
        totalPausedTime: 0,
        pauseStartTime: null
      });
      io.to(lobbyCode).emit('question-timer-started', {
        timeLeft: duration,
        isRunning: true,
        duration
      });
    });

    socket.on('next-question', ({ lobbyCode }) => {
      const nextIndex = (lobbyQuestionIndex.get(lobbyCode) ?? 0) + 1;
      lobbyQuestionIndex.set(lobbyCode, nextIndex);

      // ✅ RESET TIMER FOR NEW QUESTION (15 seconds)
      const NEW_QUESTION_DURATION = 15; // Match lobbySettings.questionTimer
      const now = Date.now();

      lobbyTimers.set(lobbyCode, {
        isRunning: true,
        timeLeft: NEW_QUESTION_DURATION,
        startTime: now,
        duration: NEW_QUESTION_DURATION,
        totalPausedTime: 0,
        pauseStartTime: null
      });

      // ✅ Emit both question change AND new timer start
      io.to(lobbyCode).emit('question-advanced', { currentQuestionIndex: nextIndex });
      io.to(lobbyCode).emit('question-timer-started', {
        timeLeft: NEW_QUESTION_DURATION,
        isRunning: true,
        duration: NEW_QUESTION_DURATION
      });

      console.log(`➡️ ${lobbyCode}: Advanced to Q${nextIndex}, timer reset to ${NEW_QUESTION_DURATION}s`);
    });

    socket.on('get-lobby-history', ({ lobbyCode }) => {
      const history = {
        currentQuestionIndex: lobbyQuestionIndex.get(lobbyCode),
        allAnswers: Object.fromEntries(lobbyUserAnswers.get(lobbyCode) || new Map()),
        users: getLobbyUsers(lobbyCode)
      };
      socket.emit('lobby-history', history);
    });

    socket.on('finish-quiz', ({ lobbyCode }) => {
      console.log(`🏁 ${lobbyCode}: Quiz finished by host`);

      // Calculate FINAL scores for all users
      const allUsers = getLobbyUsers(lobbyCode);
      const finalScores: Record<string, { name: string, score: number }> = {};

      const allAnswers = lobbyUserAnswers.get(lobbyCode);
      if (allAnswers) {
        allAnswers.forEach((questionAnswers, questionIndex) => {
          questionAnswers.forEach((answer, userId) => {
            // You'd need correct answers from quiz data - for now mock scoring
            const score = Math.floor(Math.random() * 1000); // Replace with real logic
            if (!finalScores[userId]) {
              const user = allUsers.find(u => u.id === userId);
              finalScores[userId] = { name: user?.name || userId, score: 0 };
            }
            finalScores[userId].score += score;
          });
        });
      }

      lobbyUserAnswers.delete(lobbyCode);
      lobbyQuestionIndex.delete(lobbyCode);
      lobbyTimers.delete(lobbyCode);

      // Broadcast final results to ALL users
      io.to(lobbyCode).emit('quiz-finished', {
        lobbyCode,
        finalScores: Object.entries(finalScores)
          .sort(([, a], [, b]) => b.score - a.score)
          .map(([userId, data]) => ({ userId, ...data })),
        totalQuestions: lobbyQuestionIndex.get(lobbyCode) || 0
      });
      io.to(lobbyCode).emit('question-timer-ended', { lobbyCode });

    });

    socket.on('question-timer-ended', ({ lobbyCode }) => {
      console.log(`⏰ ${lobbyCode}: Timer ended`);

      const allUsers = getLobbyUsers(lobbyCode);
      const questionIndex = lobbyQuestionIndex.get(lobbyCode) || 0;
      const timer = lobbyTimers.get(lobbyCode);

      // Record 0 score for ALL users who haven't answered this question
      if (!lobbyUserAnswers.has(lobbyCode)) {
        lobbyUserAnswers.set(lobbyCode, new Map());
      }
      if (!lobbyUserAnswers.get(lobbyCode)!.has(questionIndex)) {
        lobbyUserAnswers.get(lobbyCode)!.set(questionIndex, new Map());
      }

      const questionAnswers = lobbyUserAnswers.get(lobbyCode)!.get(questionIndex)!;

      allUsers.forEach(user => {
        if (!questionAnswers.has(user.id)) {
          // ✅ UNANSWERED = 0 score
          questionAnswers.set(user.id, ''); // empty answer
          console.log(`⏰ ${user.name} didn't answer Q${questionIndex} → 0 score`);

          // Emit the "answered" event for unanswered users too
          io.to(lobbyCode).emit('user-answered', {
            userId: user.id,
            questionIndex,
            answer: '',
            answeredUsers: questionAnswers.size,
            allAnswered: true, // Now everyone has "answered"
            username: user.name,
            allUsers,
            totalUsers: allUsers.length,
            score: 0,
            answerTime: timer?.duration ? timer.duration * 1000 : 0
          });
        }
      });

      // Force show results since everyone now has a score
      io.to(lobbyCode).emit('question-timer-ended', { lobbyCode });
    });

    socket.on('leave-lobby', ({ lobbyCode }: { lobbyCode: string }) => {
      const userData = socketUserMap.get(socket.id);
      if (userData) {
        removeUserFromLobby(lobbyCode, userData.userId);
        socketUserMap.delete(socket.id);
      }
      socket.leave(lobbyCode);
      socket.to(lobbyCode).emit('user-left', { id: userData?.userId });
    });

    // Replace your disconnect handler with:
    socket.on('disconnecting', (reason) => {
      const userData = socketUserMap.get(socket.id);
      if (userData) {
        removeUserFromLobby(userData.lobbyCode, userData.userId);
        socket.to(userData.lobbyCode).emit('user-left', { id: userData.userId });
        socketUserMap.delete(socket.id);
      }
    });

    // Keep existing disconnect for logging
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', socket.id, reason);
    });
  });

  io.engine.on('connection_error', (err) => {
    console.log('Connection error:', err.req, err.code, err.message, err.context);
  });

  setInterval(() => {
    lobbyTimers.forEach((timer, lobbyCode) => {
      if (timer.isRunning && timer.timeLeft > 0) {
        timer.timeLeft -= 1;
        io.to(lobbyCode).emit('timer-tick', {
          timeLeft: timer.timeLeft,
          isRunning: true
        });
      }

      // ✅ AUTO-ADVANCE WHEN TIMER HITS 0
      if (timer.isRunning && timer.timeLeft <= 0) {
        console.log(`⏰ ${lobbyCode}: Timer ended - auto advancing`);

        // 1. Record 0 scores for unanswered users
        const allUsers = getLobbyUsers(lobbyCode);
        const questionIndex = lobbyQuestionIndex.get(lobbyCode) || 0;

        if (!lobbyUserAnswers.has(lobbyCode)) {
          lobbyUserAnswers.set(lobbyCode, new Map());
        }
        if (!lobbyUserAnswers.get(lobbyCode)!.has(questionIndex)) {
          lobbyUserAnswers.get(lobbyCode)!.set(questionIndex, new Map());
        }

        const questionAnswers = lobbyUserAnswers.get(lobbyCode)!.get(questionIndex)!;

        // Auto-submit 0 for unanswered
        allUsers.forEach(user => {
          if (!questionAnswers.has(user.id)) {
            questionAnswers.set(user.id, '');
            io.to(lobbyCode).emit('user-answered', {  // ✅ Use io.to()
              userId: user.id,
              questionIndex,
              answer: '',
              answeredUsers: questionAnswers.size,
              allAnswered: true,
              username: user.name,
              allUsers,
              totalUsers: allUsers.length,
              score: 0,
              answerTime: timer.duration * 1000
            });
          }
        });

        io.to(lobbyCode).emit('question-timer-ended', { lobbyCode });
        // Stop this timer
        timer.isRunning = false;
      }
    });
  }, 1000);

  httpServer.listen(port as number, hostname, () => {
    console.log(`🌐 Next.js + Socket.IO Ready on http://${hostname}:${port}`);
    console.log(`📡 Socket.IO endpoint: http://${hostname}:${port}/api/socket`);
  });
});