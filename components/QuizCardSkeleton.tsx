import React from 'react';

export const QuizCardSkeleton: React.FC = () => {
  return (
    <div className="
      relative
      bg-gray-100 dark:bg-zinc-900/80 backdrop-blur-xl
      border border-white/20 dark:border-zinc-700/50
      rounded-3xl p-4 md:p-6
      shadow-lg dark:shadow-2xl
      transition-all duration-300 ease-out
      overflow-hidden
      w-full max-w-md
      animate-pulse
    ">
      {/* Subtle iOS-style background vibrancy */}
      <div className="absolute inset-0 bg-linear-to-br from-white/50 dark:from-zinc-800/30 to-transparent rounded-[inherit] -z-10" />
      
      {/* Content Container - matches space-y-4 from QuizCard */}
      <div className="relative space-y-4">
        {/* Header - Title + Level on same baseline */}
        <div className="flex items-baseline justify-between gap-3 pt-2">
          <div className="w-50 bg-zinc-300 dark:bg-zinc-700 rounded-md h-7 line-clamp-1"></div>
        </div>

        {/* Stats Grid - 3 equal columns matching QuizCard */}
        <div className="flex justify-between gap-2 md:gap-4">
          {/* Level Stat */}
          <div className="w-1/3 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50">
            <div className="flex items-center justify-center rounded-2xl bg-zinc-300 dark:bg-zinc-600 shrink-0 w-14 h-14"></div>
            <div className="min-w-0 flex justify-center items-center gap-1">
              <div className="w-12 h-3.5 bg-zinc-400 dark:bg-zinc-500 rounded"></div>
            </div>
          </div>

          {/* Questions Stat */}
          <div className="w-1/3 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50">
            <div className="p-2 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-xl">
              <div className="w-10 h-10 bg-zinc-400 dark:bg-zinc-600 rounded-lg"></div>
            </div>
            <div className="min-w-0 flex flex-col items-center gap-1">
              <div className="w-16 h-3.5 bg-zinc-400 dark:bg-zinc-600 rounded"></div>
            </div>
          </div>

          {/* Plays Stat */}
          <div className="w-1/3 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/80 dark:bg-zinc-800/50 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50">
            <div className="p-2 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-xl">
              <div className="w-10 h-10 bg-zinc-400 dark:bg-zinc-600 rounded-lg"></div>
            </div>
            <div className="min-w-0 flex flex-col items-center gap-1">
              <div className="w-14 h-3.5 bg-zinc-400 dark:bg-zinc-600 rounded"></div>
            </div>
          </div>
        </div>

        {/* Date and Button - exact match */}
        <div className='flex justify-between items-center'>
          <div className="w-20 h-4 bg-zinc-400 dark:bg-zinc-600 rounded"></div>
          <div className="
            w-24 h-10 
            bg-primary/70 hover:bg-blue-500/70
            rounded-2xl
            shadow-lg hover:shadow-xl
          "></div>
        </div>
      </div>
    </div>
  );
};