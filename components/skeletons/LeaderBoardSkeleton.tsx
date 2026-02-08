'use client';

import React from 'react';

const QuizLeaderboardSkeleton: React.FC = () => {
  return (
    <div className="w-full m-2 mx-auto glass rounded-3xl shadow-sm border border-white/20 dark:border-zinc-700/50 overflow-hidden md:min-w-3/4 md:w-3/4 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-2 sm:px-6 sm:py-8 border-b border-gray-300 dark:border-white/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500/20 to-indigo-600/20 rounded-2xl flex items-center justify-center shadow-sm"></div>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
              <div className="h-4 w-32 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-xl dark:bg-gray-700"></div>
        </div>

        {/* Tab Skeleton */}
        <div className="glass rounded-2xl p-1 flex max-w-md">
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-white/50 dark:bg-gray-200/50"></div>
          <div className="flex-1 px-4 py-2.5 rounded-xl bg-white/30 dark:bg-gray-200/30 ml-1"></div>
        </div>
      </div>

      {/* Podium Skeleton */}
      <div className="p-2 sm:px-6 sm:py-8">
        <div className="flex items-end justify-center space-x-4 mb-6">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-b from-gray-300/50 to-gray-200/50 rounded-full border-4 border-white/50 shadow-lg mb-3">
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400/50 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto dark:bg-gray-700"></div>
            </div>
            <div className="h-5 w-24 bg-gray-200 rounded-full mb-1 dark:bg-gray-700"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="h-4 w-28 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-b from-yellow-400/50 to-yellow-300/50 rounded-full border-4 border-white/50 shadow-lg mb-3">
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500/50 rounded-full"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto dark:bg-gray-700"></div>
            </div>
            <div className="h-5 w-28 bg-gray-200 rounded-full mb-1 dark:bg-gray-700"></div>
            <div className="h-8 w-24 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="h-4 w-32 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-b from-amber-600/50 to-amber-500/50 rounded-full border-4 border-white/50 shadow-lg mb-3">
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600/50 rounded-full"></div>
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto dark:bg-gray-700"></div>
            </div>
            <div className="h-5 w-20 bg-gray-200 rounded-full mb-1 dark:bg-gray-700"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="h-4 w-28 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
      </div>

      {/* List Skeleton - Fallback for more items */}
      <div className="px-6 py-8 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-3 rounded-xl bg-white/30 dark:bg-gray-200/30">
            <div className="w-8 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 w-32 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-3 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="px-6 py-4 border-t border-gray-300 dark:border-white/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="h-4 w-24 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLeaderboardSkeleton;