import { useQuizStore } from '@/stores/useQuizStore';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

const containerVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 1,
      type: "spring",
      stiffness: 100,
      damping: 14,
      delayChildren: 0.3,
      staggerChildren: 0.08
    }
  }
};

const rowVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: (index: number) => ({
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      delay: index * 0.05,
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  })
};

export default function QuizResults() {
  const {
    currentQuestionResults,
    hostId,
    continueQuiz
  } = useQuizStore();

  const { data: session } = useSession();
  const isHost = session?.user?.id === hostId;
  const t = useTranslations("quizPage");

  const sortedResults = currentQuestionResults
    .sort((a, b) => {
      if (Number(a.isCorrect) !== Number(b.isCorrect)) {
        return Number(b.isCorrect) - Number(a.isCorrect);
      }
      return b.score - a.score;
    });

  return (
    <motion.div 
      className="glass glass-border rounded-2xl shadow-xl border p-4 max-w-4xl mx-auto w-full md:max-w-200 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Current Question Results Table */}
      <div className="overflow-x-auto rounded-t-xl mb-8">
        <table className="w-full dark:bg-gray-900 bg-bgContent shadow-lg table-reset border-collapse">
          <thead>
            <motion.tr 
              className="bg-primary"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <th className="px-6 py-4 text-left text-xs font-bold text-white dark:text-textColor uppercase border-primary border-b-0 border-l-0 last:border-r-0">
                {t("player")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-white dark:text-textColor uppercase border-primary border-b-0 border-l-0 last:border-r-0">
                {t("score")}
              </th>
            </motion.tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedResults.map(({ userId, username, score, isCorrect }, index) => (
                <motion.tr 
                  key={`${userId}-${username}-${index}`} // Stable key with index fallback
                  className="transition-colors"
                  variants={rowVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 20, }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-2 py-4 whitespace-nowrap md:px-6">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className={`w-3 h-3 rounded-full shadow-sm ${isCorrect ? 'bg-blue-500' : 'bg-red-500'}`}
                        transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
                      />
                      <span className="font-semibold text-textColor max-w-[200px] truncate">
                        {username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <motion.span 
                      className={`font-extrabold text-xl ${userId
                        ? 'text-blue-600 px-3 py-1 rounded-full'
                        : 'text-gray-500'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    >
                      {userId ? `${score} pts` : `0 pts`}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Continue Button */}
      {isHost && (
        <motion.div 
          className="flex justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <motion.button
            onClick={continueQuiz}
            className="px-10 py-3 bg-primary text-white font-bold text-lg rounded-xl shadow-xl cursor-pointer"
            whileTap={{ scale: 0.98 }}
          >
            {t("nextQuestion")}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}
