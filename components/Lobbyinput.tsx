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
    <div className={`p-8`}>
      <div className="relative max-w-md mx-auto">
        {/* Glassmorphism Container */}
        <div className="glass-container p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl bg-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-textColor/60 mb-2">
              Join Lobby
            </h2>
            <p className="text-textColor/60 text-lg">Enter 6-character lobby code</p>
          </div>

          {/* Message Display */}
          {message && (
            <div 
              className={`mb-6 p-4 rounded-xl text-center transition-all duration-300 ${
                message.type === 'success' 
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
            <input
              type="text"
              value={lobbyCode}
              onChange={(e) => {
                setLobbyCode(e.target.value.toUpperCase());
                clearMessage();
              }}
              onKeyPress={handleKeyPress}
              placeholder="A1S4GS"
              maxLength={6}
              disabled={loading}
              className="glass w-full px-6 py-4 text-lg bg-white/5 border border-white/20 rounded-2xl backdrop-blur-md focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 transition-all duration-300 text-textColor/60 uppercase tracking-wider text-center font-mono"
            />
            {lobbyCode.length === 6 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
            )}
          </div>

          {/* Get Lobby Button */}
          <button
            onClick={checkLobby}
            disabled={!lobbyCode.trim() || loading || lobbyCode.length !== 6}
            className="glass-button w-full py-4 px-8 text-xl font-semibold rounded-2xl backdrop-blur-lg bg-gradient-to-r from-cyan-400/20 to-blue-500/20 border border-white/30 hover:from-cyan-500/30 hover:to-blue-600/30 hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none relative overflow-hidden group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              'Get Lobby'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}