"use client"
import { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { LobbySettings, User } from "@/types/quiz";
import LobbyHeader from "@/components/Lobbyheader";
import QuizInfo from "@/components/LobbyQuizInfo";
import LobbySettingsComponent from "@/components/LobbySettings";
import JoinedUsers from "@/components/UserList";
import { useQuizData } from "@/hooks/useQuizData";
import Loader from "@/components/Loader";
import { useLobbySocket } from "@/hooks/useLobbySocket";
import { useSession } from "next-auth/react";

const QuizLobby = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const quizId = searchParams.get('quizId');
  const lobbyCode = params.code as string;
  const locale = params.locale as string;
  const router = useRouter()
  const { data, isLoading, error } = useQuizData(Number(quizId));
  const [settings, setSettings] = useState<LobbySettings>({
    questionTimer: 15,
    resultTimer: 5,
    autoContinue: true,
  });

  const { data: session } = useSession();

  const { users, isConnected, joinLobby, socket, hostId } = useLobbySocket({ lobbyCode, quizId, locale, router });
  const isHost = session?.user.id === hostId;

  const handleQuizStart = () => {
    console.log('Starting quiz with settings:', settings);
    socket?.emit('start-quiz', {
      lobbyCode,
      settings
    });
  }

  useEffect(() => {
    if (isConnected && session && session.user) {
      joinLobby(session.user.id, session.user.name as string);
    }
  }, [isConnected, session, joinLobby]);

  if (isLoading) return <Loader />;
  if (error || !data?.questions?.length) return <div>Error loading quiz</div>;
  if (!data || !quizId) return <div>Missing quiz data</div>;

  return (
    <div className="py-8 px-4 relative overflow-hidden glass rounded-b-2xl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with dynamic Lobby Code */}
        <LobbyHeader lobbyCode={lobbyCode} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Quiz Info & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <QuizInfo quiz={data} />
            {isConnected && users.length > 0 && isHost && (
              <LobbySettingsComponent settings={settings} onSettingsChange={setSettings} />
            )}
          </div>

          {/* Right Column - Players & Actions */}
          <div className="space-y-6">
            <JoinedUsers users={users} /> {/* Dynamic host */}
          </div>
          {isConnected && users.length > 0 && isHost && (
            <button
              onClick={handleQuizStart}
              className="bg-primary px-8 py-3 rounded-2xl text-white font-bold text-lg mt-6 cursor-pointer"
              disabled={!socket?.connected}
            >
              Start Quiz ({users.length} players)
            </button>
          )}
        </div>
        {isConnected && users.length > 0 && !isHost && (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl border border-white/20 glass">
              {/* Spinner */}
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-500 rounded-full animate-spin [animation-duration:1s]"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-gray-200/30 border-t-blue-500 rounded-full animate-spin [animation-duration:1.2s] [animation-delay:-0.6s]"></div>
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-textColor/80 dark:text-white mb-2 animate-pulse">
                  Host will start the game
                </h2>
                <p className="text-sm text-textColor/60">waiting other players...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLobby;