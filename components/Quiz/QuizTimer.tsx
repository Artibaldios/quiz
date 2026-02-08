import { useQuizStore } from "@/stores/useQuizStore";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function Timer() {
  const { 
    pauseTimer, 
    resumeTimer, 
    timer,
    isTimerRunning = false,
    hostId 
  } = useQuizStore();
  
  const { data: session } = useSession();
  const isHost = session?.user?.id === hostId; 
  
  const t = useTranslations("quizPage");
  const maxTimer = 15;
  const percentage = Math.max(0, (timer / maxTimer) * 100);


  return (
    <div className="flex justify-between items-center m-2 gap-4 md:gap-12">
      {/* Timer Progress Bar */}
      <div className={`w-48 h-6 bg-white rounded-full shadow-lg border-4 border-gray-100 overflow-hidden md:w-64 ${
        timer < 4 ? 'animate-pulse' : ''
      } ${isHost ? "w-48" : "w-64"}`}>
        <div
          className={`h-full rounded-full transition-all duration-100 ease-linear shadow-md ${
            timer < 4 ? 'bg-red-400 border-r-4 border-red-500' :
            timer < 7 ? 'bg-yellow-400 border-r-4 border-yellow-500' :
            'bg-primary border-r-4 border-blue-800'
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
            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={t("pause")}
          >
            ⏸️
          </button>
          <button
            onClick={resumeTimer}
            disabled={isTimerRunning}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title={t("resume")}
          >
            ▶️
          </button>
        </div>
      )}
    </div>
  );
}
