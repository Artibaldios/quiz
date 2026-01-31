'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface LobbyResponse {
  message: string;
  status: 'ok' | 'not_found';
  lobby?: {
    code: string;
    quizId: number;
    quizTitle: string;
  };
}

export default function LobbyInput() {
  const [lobbyCode, setLobbyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("homePage");
  const checkLobby = async () => {
    if (!lobbyCode.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/lobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: lobbyCode.trim() })
      });

      const data: LobbyResponse = await response.json();

      if (data.status === 'ok' && data.lobby) {
        // Redirect to lobby with quizId
        const lobbyUrl = `${locale}/lobby/${data.lobby.code}?quizId=${data.lobby.quizId}`;
        router.push(lobbyUrl);
      } else {
        setMessage({
          type: 'error',
          text: data.message || 'Lobby does not exist'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to check lobby. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkLobby();
    }
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <div className={`m-1 mb-4 md:p-8`}>
      <div className="relative max-w-md mx-auto">
        {/* Glassmorphism Container */}
        <div className="glass p-8 rounded-3xl shadow-lg border border-white/20 backdrop-blur-xl bg-white/10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-textColor mb-2">
              {t("joinLobby")}
            </h2>
            <p className="text-textColor/60 text-lg">{t("enterCode")}</p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-center transition-all duration-300 ${message.type === 'success'
                  ? 'bg-green-500/20 border border-green-400/50 text-green-100'
                  : 'bg-red-500/20 border border-red-400/50 text-red-100'
                }`}
              onClick={clearMessage}
            >
              {message.text}
            </div>
          )}

          {/* Input Field */}
          <div className="relative mb-8">
            <svg
              className="absolute left-1/3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none fill-blue-950 dark:fill-textColor"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                className="fill-blue-950 dark:fill-textColor"
                d="M11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C12.8487 19 14.551 18.3729 15.9056 17.3199L19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L17.3199 15.9056C18.3729 14.551 19 12.8487 19 11C19 6.58172 15.4183 3 11 3ZM5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11Z"
              />
            </svg>
            <input
              type="text"
              value={lobbyCode}
              onChange={(e) => {
                setLobbyCode(e.target.value.toUpperCase());
                clearMessage();
              }}
              onKeyPress={handleKeyPress}
              placeholder="A1S4"
              maxLength={4}
              disabled={loading}
              className="glass w-full px-6 py-4 text-lg bg-white/5 border border-white/20 rounded-2xl backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 transition-all duration-300 text-textColor uppercase tracking-wider text-center placeholder:text-textColor"
            />
          </div>

          {/* Get Lobby Button */}
          <button
            onClick={checkLobby}
            disabled={!lobbyCode.trim() || loading || lobbyCode.length !== 4}
            className=" w-full py-4 px-8 text-xl  text-white font-semibold rounded-2xl bg-linear-to-r from-blue-600 to-blue-500  active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none relative overflow-hidden group cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              t("searchLobbyButton")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}