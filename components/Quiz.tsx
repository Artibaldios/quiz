'use client';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Loader from '@/components/Loader';
import { useQuizData } from '@/hooks/useQuizData';
import { useQuizLogic } from '@/hooks/useQuizLogic';
import type { FetchedQuizData, LobbySettings, User } from '@/types/quiz';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useLobbySocket } from '@/hooks/useLobbySocket';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { Session } from 'next-auth';

type QuizPageTranslations = Awaited<ReturnType<typeof useTranslations<'quizPage'>>>;


const lobbySettings = {
  questionTimer: 15,
  resultTimer: 5,
  autoContinue: true,
} as const;


interface UserResult {
  userId: string;
  username: string;
  answer: string;
  isCorrect: boolean;
  score: number;
}


interface TotalScore {
  userId: string;
  name: string;
  score: number;
}

interface UserAnsweredData {
  userId: string;
  questionIndex: number;
  answer: string;
  answeredUsers: number;
  allAnswered: boolean;
  username: string;
  allUsers: User[];
  totalUsers: number;
  score: number;
  answerTime: number;
}

interface QuizUIProps {
  quiz: FetchedQuizData;
  quizLogic: ReturnType<typeof useQuizLogic>;
  t: QuizPageTranslations;
  isHost: boolean;
  session: Session | null;
  socket: Socket | null;
  lobbyCode: string;
  totalUsers: number;
  currentAnsweredUsers: number;
  currentAnsweredUsersArr: Pick<User, "name">[];
  showCurrentResults: boolean;
  currentQuestionResults: UserResult[];
  allQuizResults: Record<number, UserResult[]>;
  totalScores: TotalScore[];
  lobbyUsers: User[];
  currentQuestion: FetchedQuizData['questions'][number];
  onContinue: () => void;
  timer: number;
  isTimerRunning: boolean;
  pauseTimer: () => void;
  resumeTimer: () => void;
  quizFinished: boolean;
}


export default function QuizPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const quizId = searchParams.get('quizId');
  const lobbyCode = params.code as string;
  const locale = params.locale as string;
  const router = useRouter();

  const {
    socket,
    hostId,
    users: lobbyUsers,
    lobbyUserCount: lobbyTotalUsers,
    isConnected,
    joinLobby
  } = useLobbySocket({
    lobbyCode,
    quizId,
    locale,
    router
  });


  const t = useTranslations('quizPage');
  const { data, isLoading, error } = useQuizData(Number(quizId));
  const searchHostId = searchParams.get('hostId');
  const { data: session, status } = useSession();
  const isHost = session?.user.id === hostId || session?.user.id === searchHostId;

  const questions = data?.questions;

  // ✅ STATES
  const [timer, setTimer] = useState<number>(lobbySettings.questionTimer);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalPausedTime, setTotalPausedTime] = useState(0);


  // Current question tracking
  const [currentAnsweredUsersMap, setCurrentAnsweredUsersMap] = useState<Map<string, string>>(new Map());
  const currentAnsweredUsers = currentAnsweredUsersMap.size;
  const currentAnsweredUsersArr = useMemo(() =>
    Array.from(currentAnsweredUsersMap.entries()).map(([_, username]) => ({ name: username })),
    [currentAnsweredUsersMap]
  );


  // Results: Current question vs ALL questions
  const [showCurrentResults, setShowCurrentResults] = useState(false);
  const [currentQuestionResults, setCurrentQuestionResults] = useState<UserResult[]>([]);
  const [allQuizResults, setAllQuizResults] = useState<Record<number, UserResult[]>>({});


  // ✅ NEW: Final quiz results
  const [quizFinished, setQuizFinished] = useState(false);


  // Total scores across all questions
  const totalScores = useMemo<TotalScore[]>(() =>
    Object.values(
      Object.values(allQuizResults)
        .flat()
        .reduce<Record<string, TotalScore>>((acc, { userId, score, username }) => {
          acc[userId] ??= { userId, score: 0, name: username };
          acc[userId].score += score;
          return acc;
        }, {})
    ),
    [allQuizResults]
  );

  const quizLogic = useQuizLogic({
    questions: data?.questions || [],
    quizId: data?.id || 0,
    session,
    locale,
    lobbySettings,
    socket,
    lobbyCode,
    timer
  });


  // ALWAYS JOIN LOBBY ON MOUNT
  useEffect(() => {
    if (status === 'loading') return;


    if (session?.user?.id && socket) {
      socket.emit('join-lobby', {
        lobbyCode,
        userId: session.user.id,
        username: session.user.name!
      });
    }
  }, [socket, status, session, lobbyCode]);


  useEffect(() => {
    if (lobbyUsers.length === 0 && isConnected && session && socket) {
      console.log('🔄 Re-joining EMPTY lobby:', lobbyCode);
      joinLobby(session.user.id!, session.user.name!);
    }
  }, [lobbyUsers.length, isConnected, session, socket, lobbyCode, joinLobby]);


  // ✅ UPDATED: Smart continue handler (next vs finish)
  const handleContinue = useCallback(() => {
    if (socket?.connected && isHost) {
      const isLastQuestion = quizLogic.currentQuestionIndex === (questions?.length || 0) - 1;

      if (isLastQuestion) {
        console.log('🏁 Host → finishing quiz');
        socket.emit('finish-quiz', { lobbyCode });
      } else {
        console.log('🎯 Host → next question');
        socket.emit('next-question', { lobbyCode });
      }
    }
  }, [socket, isHost, lobbyCode, quizLogic.currentQuestionIndex, questions?.length]);


  // ✅ SINGLE SOURCE OF TRUTH - ALL SOCKET LISTENERS
  useEffect(() => {
    if (!socket) return;


    const handleQuizInitialized = ({
      totalUsers, hostId, settings, currentQuestionIndex
    }: {
      totalUsers: number;
      hostId: string;
      settings: LobbySettings;
      currentQuestionIndex: number;
    }) => {
      console.log('🎯 Quiz initialized:', { totalUsers, hostId });
    };


    const handleUserAnswered = ({
      userId, questionIndex, answer, allAnswered, username, score
    }: UserAnsweredData) => {
      // ✅ Handle both answered AND unanswered (empty answer)
      setCurrentAnsweredUsersMap(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, username);
        return newMap;
      });

      // ✅ Calculate isCorrect even for empty answers
      const isCorrect = answer === '' ? false : answer === quizLogic.currentQuestion?.correct_answer;
      const userResult: UserResult = {
        userId,
        username,
        answer: answer || 'No answer', // Show "No answer" in UI
        isCorrect,
        score: score || 0 // Server sends 0 for unanswered
      };

      // Rest of your existing logic...
      setCurrentQuestionResults(prev => {
        const existingIndex = prev.findIndex(r => r.userId === userId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = userResult;
          return updated;
        }
        return [...prev, userResult];
      });

      // 👇 ACCUMULATE ALL QUESTIONS' RESULTS (PERSISTENT)
      setAllQuizResults(prev => {
        const newResults = { ...prev };
        if (!newResults[questionIndex]) newResults[questionIndex] = [];

        const existingIndex = newResults[questionIndex].findIndex(r => r.userId === userId);
        if (existingIndex >= 0) {
          const updated = [...newResults[questionIndex]];
          updated[existingIndex] = userResult;
          newResults[questionIndex] = updated;
        } else {
          newResults[questionIndex].push(userResult);
        }
        console.log("newResults", newResults)
        return newResults;
      });

      if (allAnswered) {
        setShowCurrentResults(true);
      }
    };


    // ✅ NEW: Final quiz handler
    const handleQuizFinished = () => {
      setQuizFinished(true);
      setShowCurrentResults(false);
    };


    // SERVER TIMER HANDLERS
    const handleTimerTick = (data: { timeLeft: number; isRunning: boolean }) => {
      setTimer(data.timeLeft);
      setIsTimerRunning(data.isRunning);
    };


    const handleTimerPaused = (data: { timeLeft: number; totalPausedTime?: number }) => {
      setTimer(data.timeLeft);
      setIsTimerRunning(false);
      if (data.totalPausedTime !== undefined) {
        setTotalPausedTime(data.totalPausedTime);
      }
    };


    const handleTimerResumed = (data: { timeLeft: number; totalPausedTime?: number }) => {
      setTimer(data.timeLeft);
      setIsTimerRunning(true);
      if (data.totalPausedTime !== undefined) {
        setTotalPausedTime(data.totalPausedTime);
      }
    };


    const handleQuestionTimerStarted = (data: { timeLeft: number; isRunning: boolean; duration: number }) => {
      setTimer(data.timeLeft);
      setIsTimerRunning(data.isRunning);
    };


    const handleQuestionTimerEnded = () => {
      setIsTimerRunning(false);
      setTimer(0);
    };


    const handleQuestionAdvanced = ({ currentQuestionIndex }: { currentQuestionIndex: number }) => {
      console.log('📱 ALL clients → question', currentQuestionIndex);

      // Server drives question progression
      quizLogic.goToQuestion(currentQuestionIndex);

      // Reset ONLY current question UI state
      setShowCurrentResults(false);
      setCurrentQuestionResults([]);
      setCurrentAnsweredUsersMap(new Map());
      setTimer(lobbySettings.questionTimer);

      // ✅ allQuizResults persists automatically!
    };


    // REGISTER ALL LISTENERS
    socket.on('quiz-initialized', handleQuizInitialized);
    socket.on('user-answered', handleUserAnswered);
    socket.on('timer-tick', handleTimerTick);
    socket.on('timer-paused', handleTimerPaused);
    socket.on('timer-resumed', handleTimerResumed);
    socket.on('question-timer-started', handleQuestionTimerStarted);
    socket.on('question-timer-ended', handleQuestionTimerEnded);
    socket.on('question-advanced', handleQuestionAdvanced);
    socket.on('quiz-finished', handleQuizFinished); // ✅ NEW


    return () => {
      socket.off('quiz-initialized', handleQuizInitialized);
      socket.off('user-answered', handleUserAnswered);
      socket.off('timer-tick', handleTimerTick);
      socket.off('timer-paused', handleTimerPaused);
      socket.off('timer-resumed', handleTimerResumed);
      socket.off('question-timer-started', handleQuestionTimerStarted);
      socket.off('question-timer-ended', handleQuestionTimerEnded);
      socket.off('question-advanced', handleQuestionAdvanced);
      socket.off('quiz-finished', handleQuizFinished); // ✅ NEW
    };
  }, [socket, lobbyCode, quizLogic, lobbySettings.questionTimer]);


  // Early returns
  if (isLoading) return <LoaderUI />;
  if (error || !questions?.length) return <ErrorUI t={t} />;
  if (!quizLogic) return null;


  return (
    <QuizUI
      quiz={data!}
      quizLogic={quizLogic}
      t={t}
      session={session}
      socket={socket}
      lobbyCode={lobbyCode}
      isHost={isHost}
      totalUsers={lobbyTotalUsers}
      currentAnsweredUsers={currentAnsweredUsers}
      currentAnsweredUsersArr={currentAnsweredUsersArr}
      showCurrentResults={showCurrentResults}
      currentQuestionResults={currentQuestionResults}
      allQuizResults={allQuizResults}
      totalScores={totalScores}
      lobbyUsers={lobbyUsers}
      currentQuestion={quizLogic.currentQuestion}
      onContinue={handleContinue}
      timer={timer}
      isTimerRunning={isTimerRunning}
      pauseTimer={quizLogic.pauseTimer}
      resumeTimer={quizLogic.resumeTimer}
      quizFinished={quizFinished}
    />
  );
}


function QuizUI({
  quiz,
  quizLogic,
  t,
  socket,
  lobbyCode,
  isHost,
  totalUsers,
  currentAnsweredUsers,
  currentAnsweredUsersArr,
  showCurrentResults,
  currentQuestionResults,
  totalScores,
  lobbyUsers,
  currentQuestion,
  onContinue,
  timer,
  isTimerRunning,
  pauseTimer,
  resumeTimer,
  quizFinished,
}: QuizUIProps) {
  return (
    <div className="flex flex-col justify-center items-center max-w-full m-2">
      {showCurrentResults || quizFinished ? null : (
        <Timer
          t={t}
          timer={timer}
          isTimerRunning={isTimerRunning}
          isHost={isHost}
          pauseTimer={pauseTimer}
          resumeTimer={resumeTimer}
          totalScores={totalScores}
        />
      )}
      <QuizHeader
        quiz={quiz}
        progress={quizLogic.progress}
        currentIdx={quizLogic.currentQuestionIndex}
        isHost={isHost}
        socket={socket}
        lobbyCode={lobbyCode}
        quizLogic={quizLogic}
        currentAnsweredUsersArr={currentAnsweredUsersArr}
        currentAnsweredUsers={currentAnsweredUsers}
        totalUsers={totalUsers}
        timer={timer}
        isTimerRunning={isTimerRunning}
        t={t}
        lobbyUsers={lobbyUsers}
        totalScores={totalScores}
        pauseTimer={pauseTimer}
        resumeTimer={resumeTimer}
      />

      {quizFinished ? (
        // ✅ FINAL RESULTS SCREEN
        <FinalResults
          totalScores={totalScores}
          lobbyUsers={lobbyUsers}
          quizLogic={quizLogic}
          t={t}
        />
      ) : showCurrentResults ? (
        <QuizResults
          currentQuestion={currentQuestion}
          currentQuestionResults={currentQuestionResults}
          totalUsers={totalUsers}
          lobbyUsers={lobbyUsers}
          isHost={isHost}
          onContinue={onContinue}
          t={t}
        />
      ) : (
        <QuizContent
          currentQuestion={quizLogic.currentQuestion}
          selectedAnswer={quizLogic.selectedAnswer}
          currentQuestionIndex={quizLogic.currentQuestionIndex}
          updateAnswer={quizLogic.updateAnswer}
          quizLogic={quizLogic}
          currentAnsweredUsersArr={currentAnsweredUsersArr}
          t={t}
          lobbyUsers={lobbyUsers}
        />
      )}
    </div>
  );
}

interface TimerProps {
  timer: number;
  isTimerRunning: boolean;
  t: QuizPageTranslations;
  isHost: boolean;
  totalScores: TotalScore[];
  pauseTimer: () => void;
  resumeTimer: () => void;
}

function Timer({ timer, isTimerRunning, t, isHost, pauseTimer, resumeTimer, totalScores }: TimerProps) {
  const maxTimer = 15; // Adjust to your actual max timer duration (e.g., 30s quiz round)
  const percentage = (timer / maxTimer) * 100;

  return (
    <div className="flex justify-between items-center m-4 gap-4 md:gap-12">
      {/* Timer Progress Bar */}
      <div className={`w-64 h-6 bg-white rounded-full shadow-lg border-4 border-gray-100 overflow-hidden ${timer < 4 ? 'animate-pulse' : ''}`}>
        <div
          className={`h-full rounded-full transition-all duration-100 ease-linear shadow-md ${timer < 4
              ? 'bg-red-400 border-r-4 border-red-500'
              : timer < 7
                ? 'bg-yellow-400 border-r-4 border-yellow-500'
                : 'bg-primary border-r-4 border-blue-800'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Host Controls */}
      {isHost && (
        <div className="flex gap-2">
          <button
            onClick={pauseTimer}
            disabled={!isTimerRunning}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ⏸️ Pause
          </button>
          <button
            onClick={resumeTimer}
            disabled={isTimerRunning}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ▶️ Resume
          </button>
        </div>
      )}
    </div>
  );
}

interface FinalResultsProps {
  totalScores: TotalScore[];
  lobbyUsers: User[];
  quizLogic: ReturnType<typeof useQuizLogic>;
  t: QuizPageTranslations;
}


function FinalResults({ totalScores, lobbyUsers, t, quizLogic }: FinalResultsProps) {
  const router = useRouter();

  return (
    <div className="glass rounded-2xl shadow-xl p-3 sm:p-6 lg:p-10 border max-w-4xl mx-auto w-full">
      {/* Final Leaderboard */}
      <div className="mb-6 sm:mb-10">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-textColor text-center mb-4 sm:mb-6">
          {t('finalResults')}
        </h3>

        {/* Mobile: Card Layout */}
        <div className="block sm:hidden space-y-3 max-w-md mx-auto">
          {totalScores.map((result, index) => (
            <div key={result.userId} className="glass backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className='flex items-center gap-2'>
                  <div className="text-xl font-bold text-indigo-600 flex-shrink-0">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-md flex-shrink-0">
                      {result.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-base font-semibold text-textColor flex-1">{result.name}</span>
                  </div>
                </div>
                <span className="text-xl font-black text-primary">
                  {result.score.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>


        {/* Desktop: Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr className="bg-primary text-white">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-base sm:text-lg font-bold">#</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-base sm:text-lg font-bold">{t("player")}</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-base sm:text-lg font-bold">{t("score")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {totalScores.map((result, index) => (
                <tr key={result.userId} className="bg-gray-100">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-lg sm:text-xl text-indigo-600 w-14">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-lg flex-shrink-0">
                        {result.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-base sm:text-lg font-bold text-gray-900">{result.name}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                      {result.score.toLocaleString()} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 pt-2 md:flex-row">
        <button
          onClick={() => router.push('/')}
          className="glass w-full px-4 sm:px-8 py-2.5 sm:py-3 dark:bg-gradient-to-r dark:from-gray-400 dark:to-gray-500 dark:hover:from-gray-500 dark:hover:to-gray-600 text-textColor dark:text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-xl min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          {t("homeButton")}
        </button>
        <button
          onClick={() => quizLogic.goNext()}
          className="w-full px-4 sm:px-8 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-xl min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          {t("resultsButton")}
        </button>
      </div>
    </div>
  );
}


// Updated QuizHeader with total scores
interface QuizHeaderProps {
  quiz: FetchedQuizData;
  progress: number;
  currentIdx: number;
  isHost: boolean;
  socket: Socket | null;
  lobbyCode: string;
  quizLogic: ReturnType<typeof useQuizLogic>;
  t: QuizPageTranslations;
  currentAnsweredUsers: number;
  currentAnsweredUsersArr?: Pick<User, 'name'>[];
  totalUsers: number;
  timer: number;
  isTimerRunning: boolean;
  lobbyUsers: User[];
  totalScores: TotalScore[];
  pauseTimer: () => void;
  resumeTimer: () => void;
}


function QuizHeader({
  quiz,
  progress,
  currentIdx,
  currentAnsweredUsers,
  t,
  totalUsers,
}: QuizHeaderProps) {
  return (
    <div className="w-full mb-6 px-2 md:max-w-200">
      <div className="flex justify-between items-center my-2">
        <h2 className="text-lg md:text-2xl font-bold text-primary hidden sm:block">
          {quiz.title}
        </h2>

        {/* Question counter + Current answered */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-textColor">
            {t("question")} {currentIdx + 1} {t("of")} {quiz.questions.length}
          </div>
          {currentAnsweredUsers !== undefined && (
            <div className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 text-sm rounded-full font-semibold">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {currentAnsweredUsers}/{totalUsers} {t("answeredUsers")}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white rounded-full h-3 shadow-inner">
        <div
          className="bg-primary h-3 rounded-full shadow-lg transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function QuizContent({
  currentQuestion,
  selectedAnswer,
  currentQuestionIndex,
  updateAnswer,
  quizLogic,
  currentAnsweredUsersArr,
}: {
  currentQuestion: FetchedQuizData['questions'][number];
  selectedAnswer: string | null;
  currentQuestionIndex: number;
  updateAnswer: (questionIndex: number, answer: string) => void;
  quizLogic: ReturnType<typeof useQuizLogic>;
  t: QuizPageTranslations;
  currentAnsweredUsersArr: Pick<User, 'name'>[];
  lobbyUsers: User[];
}) {

  return (
    <div className="bg-bgContent rounded-2xl shadow-xl border p-8 md:w-150 border-gray-200">
      <div className="mb-8 text-center">
        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full mb-6 shadow-lg">
          {currentQuestion.topic}
        </span>
        <h3 className="text-2xl md:text-3xl font-bold text-textColor mb-2 leading-tight">
          {currentQuestion.question_text}
        </h3>
      </div>


      <div className="space-y-4 mb-8">
        {currentQuestion.options.map((option: string, index: number) => (
          <button
            key={`${currentQuestion.id}-option-${index}`}
            onClick={() => updateAnswer(currentQuestionIndex, option)}
            disabled={quizLogic.isSubmitting || selectedAnswer !== null}
            className={`group w-full p-6 text-left rounded-xl border-2 transition-all duration-300 shadow-md ${selectedAnswer === option
                ? "border-primary bg-gradient-to-r from-blue-50 to-indigo-50 text-primary shadow-primary-lg"
                : "border-gray-200 hover:border-primary/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0`}
          >
            <span className="font-bold text-xl mr-4 text-primary group-hover:text-primary-dark">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="text-lg font-semibold text-textColor">{option}</span>
          </button>
        ))}
      </div>

      {/* Current answered users avatars */}
      {currentAnsweredUsersArr && currentAnsweredUsersArr.length > 0 && (
        <div className="flex flex-wrap gap-3 p-6 glass rounded-xl">
          {currentAnsweredUsersArr.map((user) => (
            <div
              key={user.name}
              className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-110 transition-all duration-200 group"
              title={`${user.name} answered`}
            >
              <span className="text-base drop-shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white group-hover:scale-110">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface QuizResultsProps {
  currentQuestion: FetchedQuizData['questions'][number];
  currentQuestionResults: UserResult[];
  totalUsers: number;
  lobbyUsers: User[];
  onContinue: () => void;
  isHost: boolean;
  t: QuizPageTranslations;
}


function QuizResults({
  currentQuestionResults,
  onContinue,
  isHost,
  t
}: QuizResultsProps) {
  return (
    <div className="glass rounded-2xl shadow-xl border p-4 border-gray-200 max-w-4xl mx-auto w-full md:max-w-200 md:p-8">
      {/* Current Question Results Table */}
      <div className="overflow-x-auto rounded-2xl mb-8">
        <table className="w-full bg-white shadow-lg border border-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t("player")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t("score")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentQuestionResults.map(({ userId, username, score, isCorrect }) => (
              <tr key={userId} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 py-4 whitespace-nowrap md:px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full shadow-sm ${isCorrect ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                    <span className="font-semibold text-gray-900 max-w-[200px] truncate">
                      {username}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={`font-bold text-lg ${isCorrect
                      ? 'text-blue-600 bg-gray-100 px-3 py-1 rounded-full'
                      : 'text-gray-500'
                    }`}>
                    {isCorrect ? `${score} pts` : `0 pts`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Continue Button */}
      {isHost && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onContinue}
            className="px-10 py-3 bg-primary text-white font-bold text-lg rounded-xl shadow-xl cursor-pointer"
          >
            {t("nextQuestion")}
          </button>
        </div>
      )}
    </div>
  );
}


function LoaderUI() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loader variant="spinner" color="blue" size="xl" />
    </div>
  );
}


function ErrorUI({ t }: { t: QuizPageTranslations }) {
  return (
    <div className="mt-10 text-center">
      <p className="text-lg text-gray-600">{t("notFound")}</p>
    </div>
  );
}
