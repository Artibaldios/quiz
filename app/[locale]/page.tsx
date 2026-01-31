"use client"
import QuizLeaderboard from '@/components/Home/QuizLeaderBoard';
import QuizSearch from '@/components/Home/QuizSearch';
import LobbyInput from '@/components/Home/Lobbyinput';

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations("homePage");

  return (
    <div className="h-full flex flex-col rounded-md mx-2">
      <div className="relative rounded-3xl p-10 overflow-hidden group">
        {/* Geometric Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-12 right-8 md:right-16 w-10 h-10  md:w-20 md:h-20 border-2 border-primary rotate-45 animate-float-slow" />
        <div className="absolute bottom-10 left-8 md:left-16 w-12 h-12 bg-primary/50 rotate-12 animate-float-delayed" />
        <div className="absolute bottom-4 right-8 md:right-16 w-6 h-6 bg-primary/30 rounded-full animate-float-soft" />
        <div className="absolute top-1/4 left-8 md:left-16 w-6 h-6 bg-primary/30 rounded-full animate-float-soft" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-10 md:leading-18 font-bold text-center mb-4 gradient-text bg-clip-text text-transparent tracking-tight">
            {t("title")}
          </h1>
          <p className="text-center text-muted-foreground mb-0 text-lg max-w-md mx-auto dark:text-textColor">
            {t("description")}
          </p>
        </div>
      </div>
      <QuizSearch />
      <QuizLeaderboard />
      <LobbyInput />
    </div>
  );
}