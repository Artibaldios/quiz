"use client"
import { useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useQuizData } from "@/hooks/useQuizData";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useQuizStore } from "@/stores/useQuizStore";

import LobbyHeader from "@/components/Lobby/Lobbyheader";
import QuizInfo from "@/components/Lobby/LobbyQuizInfo";
import LobbySettingsComponent from "@/components/Lobby/LobbySettings";
import JoinedUsers from "@/components/Lobby/UserList";
import Loader from "@/components/Loader";
import ErrorUI from "@/components/ErrorUI";

const QuizLobby = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const t = useTranslations("lobby");
  const lobbyCode = params.code as string;
  const quizId = searchParams.get('quizId');
  const quizIdNumber = quizId ? Number(quizId) : NaN;
  const { data, isLoading, error } = useQuizData(quizIdNumber);
  const { data: session, status } = useSession();

  const { users, hostId, startQuiz, settings, joinLobby } = useQuizStore();
  const isHost = session?.user?.id === hostId;
  const hostStart = users.length > 0 && isHost;
  const isWaitingPlayer = users.length > 0 && !isHost;

  const handleStartQuiz = () => {
    if (!data) return;
    startQuiz(lobbyCode as string, data, settings, quizId as string);
  };

  useEffect(() => {
    if (session?.user?.id && lobbyCode) {
      joinLobby(session.user.id!, session.user.name!, lobbyCode);
    }
  }, [session, lobbyCode, joinLobby]);

  if (!quizId) return <ErrorUI message="Missing quiz data" />;
  if (isLoading) return <Loader variant="spinner" color="blue" size="xl"/>;
  if (!data?.questions?.length) return <ErrorUI message="No questions available" />;
  if (error) {
    return <ErrorUI message={`Failed to load quiz: ${error.message}`} />;
  }

  return (
    <div className="py-8 px-4 relative overflow-hidden glass-border rounded-b-2xl">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with dynamic Lobby Code */}
        <LobbyHeader lobbyCode={lobbyCode} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Quiz Info & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <QuizInfo quiz={data} />
            {hostStart && (
              <LobbySettingsComponent settings={settings} />
            )}
          </div>

          {/* Right Column - Players & Actions */}
          <div className="space-y-6">
            <JoinedUsers users={users} /> {/* Dynamic host */}
            {status === "unauthenticated" && (
              <div className="glass glass-border flex flex-col justify-center p-4 rounded-2xl md:p-6">
                <div className="p-6 text-textColor text-center text-xl">{t("needSignIn")}</div>
                <button
                  onClick={() => signIn()}
                  className="px-5 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                >
                  {t("signIn")}
                </button>
              </div>
            )}
          </div>
        </div>
        {hostStart && (
            <div className="flex items-center justify-center">
              <button
                onClick={handleStartQuiz}
                className="bg-primary px-8 py-3 rounded-2xl text-white font-bold text-lg mt-6 cursor-pointer"
              >
                {t("startButton")} ({users.length} {t("players")})
              </button>
            </div>
        )}
        {isWaitingPlayer && (
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl border border-white/20 glass-border">
              {/* Spinner */}
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-400/30 border-t-blue-500 rounded-full animate-spin [animation-duration:1s]"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-gray-200/30 border-t-blue-500 rounded-full animate-spin [animation-duration:1.2s] [animation-delay:-0.6s]"></div>
              </div>

              {/* Text */}
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-textColor/80 dark:text-white mb-2 animate-pulse">
                  {t("hostWillStart")}
                </h2>
                <p className="text-sm text-textColor/60">{t("waiting")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLobby;