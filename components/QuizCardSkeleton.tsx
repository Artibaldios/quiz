import React from 'react';

export const QuizCardSkeleton: React.FC = () => {
  return (
    <div className="
      group relative
      animate-pulse
      w-full max-w-md
    ">
      <div className="
        relative glass rounded-2xl p-6 border border-white/20
        bg-gradient-to-br from-blue-500/80 via-purple-500/60 to-blue-600/40
        dark:from-zinc-800/80 dark:via-zinc-700/60 dark:to-zinc-800/40
        backdrop-blur-xl
        transform transition-all duration-500 ease-out
        hover:border-white/40 hover:shadow-md
        space-y-4
      ">
        {/* Title */}
        <div className="h-7 bg-gradient-to-r from-blue-500/70 to-purple-500/70 dark:from-zinc-600/70 dark:to-zinc-500/70 rounded-md w-3/4"></div>
        
        {/* Icons row */}
        <div className="flex items-center gap-3">
          {/* Music icon */}
          <div className="
            w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/80 to-purple-500/80
            dark:from-zinc-600/60 dark:to-zinc-500/60
            shadow-lg
          "></div>
          {/* HelpCircle icon */}
          <div className="
            w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/50 via-purple-500/40 to-blue-600/30
            dark:from-zinc-700/50 dark:via-zinc-600/40 dark:to-zinc-700/30
            backdrop-blur border border-white/10
          "></div>
          {/* Users icon */}
          <div className="
            w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500/50 via-purple-500/40 to-blue-600/30
            dark:from-zinc-700/50 dark:via-zinc-600/40 dark:to-zinc-700/30
            backdrop-blur border border-white/10
          "></div>
        </div>
        
        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm">
          {/* Level badge */}
          <div className="
            rounded-md bg-gradient-to-r from-blue-500/70 to-purple-500/70
            dark:from-zinc-600/70 dark:to-zinc-500/70
            w-20 h-5
          "></div>
          {/* Questions */}
          <div className="flex items-center gap-1 w-24 h-5 bg-gradient-to-r from-blue-500/70 to-purple-500/70 dark:from-zinc-600/70 dark:to-zinc-500/70 rounded"></div>
          {/* Plays */}
          <div className="flex items-center gap-1 w-28 h-5 bg-gradient-to-r from-blue-500/70 to-purple-500/70 dark:from-zinc-600/70 dark:to-zinc-500/70 rounded"></div>
        </div>
        
        {/* Date and Button */}
        <div className="flex items-center justify-between">
          <div className="w-20 h-4 bg-gradient-to-r from-blue-500/80 to-purple-500/80 dark:from-zinc-600/70 dark:to-zinc-500/70 rounded"></div>
          <div className="
            px-4 py-2 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-blue-500/80 to-purple-500/80
            dark:from-blue-600/60 dark:to-purple-600/60
            shadow-md 
            w-20 h-8
          "></div>
        </div>
      </div>
    </div>
  );
};