import { useQuizStore } from '@/stores/useQuizStore';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function FinalResults() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("quizPage");
  const { 
    finalResults, 
    quizFinished, 
  } = useQuizStore();
  
  // Guard clause - no results yet
  if (!quizFinished || !finalResults?.length) {
    return null;
  }

  const sortedResults = finalResults.sort((a, b) => b.score - a.score);

  return (
    <div className="glass glass-border rounded-2xl shadow-xl p-3 sm:p-6 lg:p-10 border max-w-4xl mx-auto w-full">
      {/* Final Leaderboard */}
      <div className="mb-6 sm:mb-10">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-textColor text-center mb-4 sm:mb-6">
          {t('finalResults')}
        </h3>

        {/* Mobile: Card Layout */}
        <div className="block sm:hidden space-y-3 max-w-md mx-auto">
          {sortedResults.map((result, index) => (
            <div key={result.userId} className="glass  glass-border backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className='flex items-center gap-2'>
                  <div className="text-xl font-bold text-indigo-600 shrink-0">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-md shrink-0">
                      {result.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-base font-semibold text-textColor flex-1">{result.name}</span>
                  </div>
                </div>
                <span className="text-xl font-black text-primary">
                  {result.score.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[300px]">
            <thead>
              <tr className="bg-primary text-white dark:text-textColor dark:border dark:border-primary">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-base sm:text-lg font-bold">#</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-base sm:text-lg font-bold">{t("player")}</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-base sm:text-lg font-bold">{t("score")}</th>
              </tr>
            </thead>
            <tbody className="">
              {sortedResults.map((result, index) => (
                <tr key={result.userId} className="bg-white/50 dark:bg-gradient-background dark:border dark:border-primary">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-lg sm:text-xl text-indigo-600 w-14">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-lg shrink-0">
                        {result.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-base sm:text-lg font-bold text-gray-900">{result.name}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                      {result.score.toLocaleString()} pts
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons - SIMPLIFIED */}
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 pt-2 md:flex-row">
        <button
          onClick={() => router.push(`/${locale}`)}
          className="glass glass-border w-full px-4 sm:px-8 py-2.5 sm:py-3 dark:bg-linear-to-r dark:from-gray-400 dark:to-gray-500 dark:hover:from-gray-500 dark:hover:to-gray-600 text-textColor dark:text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-xl min-h-11 flex items-center justify-center cursor-pointer"
        >
          {t("homeButton")}
        </button>
        <button
          onClick={() => router.push(`/${locale}/results`)}
          className="w-full px-4 sm:px-8 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl shadow-xl min-h-11 flex items-center justify-center cursor-pointer"
        >
          {t("resultsButton")}
        </button>
      </div>
    </div>
  );
}
