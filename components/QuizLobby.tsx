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
  const [hasJoined, setHasJoined] = useState(false); // Track join state
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

  const { users, isConnected, joinLobby, socket, hostId } = useLobbySocket({lobbyCode, quizId, locale, router} );
  const isHost = session?.user.id === hostId;

  const handleQuizStart = () => {
    console.log('Starting quiz with settings:', settings);
    socket?.emit('start-quiz', { 
      lobbyCode, 
      settings
    });
  }

  useEffect(() => {
    if (isConnected && session && !hasJoined) {
      joinLobby(session.user.id, session.user.name as string);
      setHasJoined(true);
    }
  }, [isConnected, session, hasJoined, joinLobby]);

  if (isLoading) return <Loader />;
  if (error || !data?.questions?.length) return <div>Error loading quiz</div>;
  if (!data || !quizId) return <div>Missing quiz data</div>;

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-hidden glass">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with dynamic Lobby Code */}
        <LobbyHeader lobbyCode={lobbyCode} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Quiz Info & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <QuizInfo quiz={data} />
            <LobbySettingsComponent settings={settings} onSettingsChange={setSettings} />
          </div>

          {/* Right Column - Players & Actions */}
          <div className="space-y-6">
            <JoinedUsers users={users} /> {/* Dynamic host */}
          </div>
            {isConnected && hasJoined && users.length > 0 && isHost && (
              <button
                onClick={handleQuizStart}
                className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-lg text-white font-bold text-lg mt-6"
                disabled={!socket?.connected}
              >
                🚀 Start Quiz ({users.length} players)
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizLobby;