'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Target, CheckCircle, Award, User, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface UserStats {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  totalQuestions?: number;
  accuracy?: number;
  totalRightAnswers?: number;
  quizzesPlayed?: number;
  rank?: number;
}

interface ApiResponse {
  accuracyLeaders: UserStats[];
  rightAnswersLeaders: UserStats[];
}

const QuizLeaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'completors' | 'successful'>('completors');
  const t = useTranslations("homePage");

  const {
    data: leadersData,
    isLoading,
    error,
    refetch
  } = useQuery<ApiResponse>({
    queryKey: ['quiz-leaders'],
    queryFn: async () => {
      const response = await fetch('/api/quiz/leaders');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      return response.json();
    },
  });

  const dataToShow = activeTab === 'completors'
    ? leadersData?.accuracyLeaders || []
    : leadersData?.rightAnswersLeaders || [];

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-bgContent dark:bg-zinc-900/80 rounded-2xl shadow-sm border border-white/30 overflow-hidden m-2">
        <div className="p-8 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-white/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-white/30 overflow-hidden p-8 m-2">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <Trophy className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">{t("notFound")}</h3>
          </div>
          <div className="flex items-center justify-center space-x-3 pt-4">
            <button
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="m-2 mx-auto bg-bgContent dark:bg-zinc-900/80 rounded-3xl shadow-sm border border-white/20 dark:border-zinc-700/50 overflow-hidden md:min-w-3/4">
      {/* Header with Gradient */}
      <div className="p-2 sm:px-6 sm:py-8 border-b border-gray-300 dark:border-white/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-textColor">{t("leaderBoard")}</h1>
              <p className="text-sm text-textColor/50">{t("top")}</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-blue-900 rounded-2xl p-1 flex max-w-md ">
          <button
            onClick={() => setActiveTab('completors')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${activeTab === 'completors'
                ? 'bg-white dark:bg-gray-200 shadow-sm text-blue-600'
                : 'text-gray-600 dark:text-gray-300'
              }`}
          >
            <Target className={`w-4 h-4 ${activeTab === 'completors' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-200'}`} />
            <span>{t("accuracy")}</span>
          </button>
          <button
            onClick={() => setActiveTab('successful')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer ${activeTab === 'successful'
                ? 'bg-white dark:bg-gray-200 shadow-sm text-blue-600'
                : 'text-gray-600 dark:text-gray-300'
              }`}
          >
            <Award className={`w-4 h-4 ${activeTab === 'successful' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-200'}`} />
            <span>{t("rightAnswers")}</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      {dataToShow.length > 0 && (
        <div className="p-2 sm:px-6 sm:py-8">
          <div className="flex items-end justify-center space-x-4 mb-6">
            {/* Second Place */}
            {dataToShow[1] && (
              <div className="flex flex-col items-center flex-1 max-w-[120px]">
                <div className="w-15 h-15 sm:w-20 sm:h-20 bg-linear-to-b from-gray-300 to-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3 relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  {dataToShow[1].avatar ? (
                    <img src={dataToShow[1].avatar} alt={dataToShow[1].name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-textColor truncate max-w-full">{dataToShow[1].name}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {activeTab === 'completors' ? `${dataToShow[1].accuracy}%` : `${dataToShow[1].totalRightAnswers}`}
                  </p>
                  <p className="text-xs text-textColor/50 mt-1">
                    {activeTab === 'completors' ? `${dataToShow[1].quizzesPlayed} ${t("quizzesPlayed")}` : `${t("from")} ${dataToShow[1].totalQuestions} ${t("questions")}`}
                  </p>
                </div>
              </div>
            )}

            {/* First Place */}
            {dataToShow[0] && (
              <div className="flex flex-col items-center flex-1 max-w-[140px]">
                <div className="w-18 h-18 sm:w-24 sm:h-24 bg-linear-to-b from-yellow-400 to-yellow-300 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3 relative">
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    <Trophy className="w-4 h-4" />
                  </div>
                  {dataToShow[0].avatar ? (
                    <img src={dataToShow[0].avatar} alt={dataToShow[0].name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-10 h-10 text-gray-700" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-textColor truncate max-w-full">{dataToShow[0].name}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {activeTab === 'completors' ? `${dataToShow[0].accuracy}%` : `${dataToShow[0].totalRightAnswers}`}
                  </p>
                  <p className="text-xs text-textColor/50 mt-1">
                    {activeTab === 'completors' ? `${dataToShow[0].quizzesPlayed} ${t("quizzesPlayed")}` : `${t("from")} ${dataToShow[0].totalQuestions} ${t("questions")}`}
                  </p>
                </div>
              </div>
            )}

            {/* Third Place */}
            {dataToShow[2] && (
              <div className="flex flex-col items-center flex-1 max-w-[120px]">
                <div className="w-15 h-15 sm:w-20 sm:h-20 bg-linear-to-b from-amber-600 to-amber-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-3 relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  {dataToShow[2].avatar ? (
                    <img src={dataToShow[2].avatar} alt={dataToShow[2].name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-textColor truncate max-w-full">{dataToShow[2].name}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {activeTab === 'completors' ? `${dataToShow[2].accuracy}%` : `${dataToShow[2].totalRightAnswers}`}
                  </p>
                  <p className="text-xs text-textColor/50 mt-1">
                    {activeTab === 'completors' ? `${dataToShow[2].quizzesPlayed} ${t("quizzesPlayed")}` : `${t("from")} ${dataToShow[2].totalQuestions} ${t("questions")}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {dataToShow.length === 0 && (
        <div className="px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("notFound")}</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {activeTab === 'completors'
              ? 'No accuracy data available yet. Be the first to complete quizzes!'
              : 'No answer data available yet. Start answering questions to appear here!'
            }
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-300 dark:border-white/30">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-textColor">
            <CheckCircle className="w-4 h-4" />
            <span>{t("upd")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizLeaderboard;