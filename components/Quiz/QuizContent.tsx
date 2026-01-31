import { useState } from 'react';
import { useQuizStore } from '@/stores/useQuizStore';
import { FetchedQuizData } from '@/types/quiz';
import { useSession } from 'next-auth/react';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const optionVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring" as const, // ✅ Literal type, not string
      stiffness: 400,
      damping: 20 
    }
  },
};

export function QuizContent({ 
  quiz, 
  currentQuestionIndex, 
}: { 
  quiz: FetchedQuizData; 
  currentQuestionIndex: number;
}) {
  // ✅ LOCAL STATE (per-question UI)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  
  // ✅ ZUSTAND (shared across components)
  const { 
    sendAnswer,
    showCurrentResults,
    currentAnsweredUsersMap,
    timer
  } = useQuizStore();
  
  const { data: session } = useSession();
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const usersArr = [...currentAnsweredUsersMap].map(([id, name]) => ({ id, name }))

  const handleSelect = (answer: string) => {
    if (selectedAnswer || showCurrentResults) return;
    
    setSelectedAnswer(answer);
    sendAnswer(currentQuestionIndex, answer, timer, session?.user?.id, session?.user?.name);
  };

  return (
        <div className="glass glass-border rounded-2xl shadow-xl border p-4 md:w-150 border-gray-200 md:p-8">
      <div className="mb-6 text-center md:mb-8">
        <span className="inline-block px-4 py-2 bg-linear-to-r from-blue-500 to-indigo-600 text-white text-sm font-bold rounded-full mb-6 shadow-lg">
          {currentQuestion.topic}
        </span>
        <h3 className="text-lg md:text-3xl font-bold text-textColor leading-tight">
          {currentQuestion.question_text}
        </h3>
      </div>

      <motion.div
        className="space-y-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {currentQuestion.options.map((option: string, index: number) => (
          <motion.button
            key={`${currentQuestion.id}-option-${index}`}
            variants={optionVariants}
            onClick={() => handleSelect(option)}
            disabled={!!selectedAnswer || showCurrentResults}
            className={`group w-full p-4 text-left text-md rounded-xl border-2 transition-all duration-300 shadow-md md:p-6 ${
              selectedAnswer === option
                ? "border-primary bg-linear-to-r  text-primary shadow-primary-lg"
                : "border-gray-100 hover:border-primary/50 hover:bg-linear-to-r"
            }  disabled:cursor-not-allowed disabled:hover:shadow-md disabled:hover:translate-y-0`}
          >
            <span className="font-bold text-md mr-4 text-primary group-hover:text-primary-dark md:text-xl">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className={`text-sm font-semibold text-textColor md:text-lg ${
              selectedAnswer === option ? "dark:text-primary" : ""
            }  `}>
              {option}
            </span>
          </motion.button>
        ))}
      </motion.div>
      {/* Current answered users avatars */}
      {usersArr && usersArr.length > 0 && (
        <div className="flex flex-wrap gap-3 p-6 glass rounded-xl">
          {usersArr.map((user) => (
            <div
              key={user.name}
              className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-110 transition-all duration-200 group"
              title={`${user.name} answered`}
            >
              <span className="text-base drop-shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-3 border-white group-hover:scale-110">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
