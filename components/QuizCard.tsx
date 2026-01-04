import { Link } from '@/i18n/navigation';
import React from 'react';
import { formatRelativeDate, getLevelConfig, type LevelConfig, type QuizCardProps } from '@/utils/helpers';
import { useLocale, useTranslations } from 'next-intl';

const QuizCard: React.FC<QuizCardProps> = ({
  title,
  level = 'medium',
  questionCount,
  plays,
  createdAt,
  id
}) => {
  const t = useTranslations("quizCard");
  const locale = useLocale();
  const levelConfig: LevelConfig = getLevelConfig(level, locale);
  return (
      <div className="
        relative
        bg-gray-100 dark:bg-zinc-900/80 backdrop-blur-xl
        border border-white/20 dark:border-zinc-700/50
        rounded-3xl p-4 md:p-6
        shadow-lg dark:shadow-2xl
        hover:shadow-2xl dark:hover:shadow-[0_20px_40px_-10px_rgb(0_0_0/0.4)]
        transition-all duration-300 ease-out
        overflow-hidden
      ">
        <div className="absolute inset-0 bg-linear-to-br from-white/50 dark:from-zinc-800/30 to-transparent rounded-[inherit] -z-10" />
        {/* Content */}
        <div className="relative space-y-4">
          {/* Header - Title + Level on same baseline */}
          <div className="flex items-baseline justify-between gap-3 pt-2">
            <h3 className="flex-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 leading-tight">
              {title}
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="flex justify-between gap-2 md:gap-4">
            <div className="w-1/3 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50">
              <div className={`
                flex items-center justify-center rounded-2xl text-lg font-medium tracking-wide
                ${levelConfig.color} ${levelConfig.border} backdrop-blur-sm
                ${levelConfig.text}
                shrink-0 w-14 h-14
              `}>
                {levelConfig.icon}
              </div>
              <div className="min-w-0 flex justify-center items-center gap-1">
                <p className="text-[12px] font-medium text-zinc-400 dark:text-zinc-400">{levelConfig.level.toUpperCase()}</p>
              </div>
            </div>

            <div className="w-1/3 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50">
              <div className="p-2 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-xl">
                <img src="./question.png" className='w-10 h-10'></img>
              </div>
              <div className="min-w-0 flex justify-center items-center gap-1">
                <p className="text-[12px] font-medium text-zinc-400 dark:text-zinc-400">{t("questions")}</p>
                <p className="block text-[12px] font-bold text-zinc-900 dark:text-zinc-100">
                  {questionCount}
                </p>
              </div>
            </div>

            <div className="w-1/3 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-zinc-800/50 backdrop-blur-sm border border-white/30 dark:border-zinc-700/50">
              <div className="p-2 bg-zinc-200/50 dark:bg-zinc-700/50 rounded-xl">
                <img src="./users.svg" className='w-10 h-10'></img>
              </div>
              <div className="min-w-0 flex justify-center items-center gap-1">
                <span className="text-[12px] text-zinc-400 dark:text-zinc-400">{t("played")}</span>
                <span className="block text-[12px] font-bold text-zinc-900 dark:text-zinc-100">
                  {plays.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className='flex justify-between items-center'>
            <span className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
              {formatRelativeDate(createdAt, locale)}
            </span>
            <Link href={`/quiz/${id}`}  className="
              w-24 h-10 
              bg-primary hover:bg-blue-500
              text-white rounded-2xl flex items-center justify-center
              shadow-lg hover:shadow-xl
              z-10
            ">
              <p className='text-center'>{t("playButton")}</p>
            </Link>
          </div>
        </div>
      </div>
  );
};

export default QuizCard;
