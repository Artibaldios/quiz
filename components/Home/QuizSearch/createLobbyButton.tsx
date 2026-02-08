'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateLobbyButton({ quizId }: { quizId: number }) {
  const router = useRouter();
  const t = useTranslations("quizCard");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const handleCreateLobby = async () => {
    setLoading(true);

    const response = await fetch('/api/lobbies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quizId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create lobby');
    }

    const lobby = await response.json();
    router.replace(`/${locale}/lobby/${lobby.code}?quizId=${quizId}`);
    setLoading(false);
  };

  return (
    <button
      onClick={handleCreateLobby}
      disabled={loading}
      className={`
        px-6 py-2 rounded-xl font-semibold text-sm
        bg-linear-to-r from-blue-600 to-blue-500 
        shadow-md shadow-blue-500/20 text-white
        transform transition-all duration-300
        hover:shadow-blue-500/50 hover:scale-105
        active:scale-95 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {loading ? t("loading") : t("playButton")}
    </button>
  );
}
