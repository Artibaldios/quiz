import { FetchedUserData } from "@/types/quiz";

export interface Question {
  id: string | number;
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
}

export interface QuestionWithAnswer {
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
  user_answer: string;
  questionId: string | number;
  givenAnswer: string;
  isCorrect: boolean;
}

export interface QuizResultsProps {
  score: number;
  percentScore: number;
  totalCorrect: number;
  totalQuestions: number;
  topicScores: Record<string, { correct: number; total: number }>;
  questionsWithAnswers: QuestionWithAnswer[];
}

export interface QuizCardProps {
  id: number;
  title: string;
  category: string;
  level?: string | undefined | null;
  questionCount: number;
  plays: number;
  createdAt: Date;
}

// Pure function to calculate quiz results locally
export function calculateQuizResult(questions: Question[], answers: string[], points: number): QuizResultsProps {
  let totalCorrect = 0;
  const topicScores: Record<string, { correct: number; total: number }> = {};

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = answers[i];

    const isCorrect = userAnswer === question.correct_answer;
    if (isCorrect) totalCorrect++;

    if (!topicScores[question.topic]) {
      topicScores[question.topic] = { correct: 0, total: 0 };
    }

    topicScores[question.topic].total++;
    if (isCorrect) {
      topicScores[question.topic].correct++;
    }
  }

  const percentScore = Math.round((totalCorrect / questions.length) * 100);

  return {
    score: points,
    percentScore,
    totalCorrect,
    totalQuestions: questions.length,
    topicScores,
    questionsWithAnswers: questions.map((question, index) => ({
      question_text: question?.question_text || "",
      options: question?.options || [],
      correct_answer: question?.correct_answer || "",
      user_answer: answers[index] || "",
      topic: question?.topic || "",
      questionId: question?.id,
      givenAnswer: answers[index],
      isCorrect: answers[index] == question?.correct_answer
    })),
  };
}

export const formatRelativeDate = (date: Date, locale: string): string => {
  const now = new Date();
  const target = new Date(date);
  
  // Normalize both dates to start of their respective days (00:00:00)
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(now.getTime() - target.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (locale === "ru") {
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays === 2) return 'Позавчера';
    
    if (diffDays < 7) {
      const days = diffDays;
      if (days === 1) return '1 день назад';
      if (days >= 2 && days <= 4) return `${days} дня назад`;
      return `${days} дней назад`;
    }
    
    const weeks = Math.floor(diffDays / 7);
    if (diffDays < 30) {
      if (weeks === 1) return '1 неделю назад';
      if (weeks >= 2 && weeks <= 4) return `${weeks} недели назад`;
      return `${weeks} недель назад`;
    }
    
    const months = Math.floor(diffDays / 30);
    if (months === 1) return '1 месяц назад';
    if (months >= 2 && months <= 4) return `${months} месяца назад`;
    return `${months} месяцев назад`;
  }
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays === 2) return 'Day before yesterday';
  
  if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
  
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  
  const months = Math.floor(diffDays / 30);
  return months === 1 ? '1 month ago' : `${months} months ago`;
};

export interface LevelConfig {
  color: string;
  border: string;
  text: string;
  icon: string;
  level: LevelKey;
};
type LevelKey = string | "medium";

const levelConfigs: Record<string, Record<LevelKey | 'default', LevelConfig>> = {
  ru: {
    easy: { color: 'bg-emerald-400/20', border: 'border-emerald-400/30', text: 'text-emerald-400', icon: '⭐', level: 'легкий' },
    medium: { color: 'bg-amber-400/20', border: 'border-amber-400/30', text: 'text-amber-400', icon: '🔥', level: 'средний' },
    hard: { color: 'bg-rose-400/20', border: 'border-rose-400/30', text: 'text-rose-400', icon: '💀', level: 'сложный' },
    default: { color: 'bg-zinc-400/20', border: 'border-zinc-400/30', text: 'text-zinc-400', icon: '❓', level: 'средний' },
  },
  en: {
    easy: { color: 'bg-emerald-400/20', border: 'border-emerald-400/30', text: 'text-emerald-400', icon: '⭐', level: 'easy' },
    medium: { color: 'bg-amber-400/20', border: 'border-amber-400/30', text: 'text-orange-400', icon: '🔥', level: 'medium' },
    hard: { color: 'bg-rose-400/20', border: 'border-rose-400/30', text: 'text-rose-400', icon: '💀', level: 'hard' },
    default: { color: 'bg-zinc-400/20', border: 'border-zinc-400/30', text: 'text-zinc-400', icon: '❓', level: 'medium' },
  },
};

export const getLevelConfig = (
  level: LevelKey,
  locale: string,
): LevelConfig => {
  const localeKey = locale === 'ru' ? 'ru' : 'en';
  const configs = levelConfigs[localeKey];
  return configs[level] ?? configs.default;
};

export function detectLanguage(q: string): 'en' | 'ru' {
  // Cyrillic range: U+0400 to U+04FF (covers Russian alphabet)
  const hasCyrillic = /[\u0400-\u04FF]/.test(q);
  return hasCyrillic ? 'ru' : 'en';
}

export async function submitQuizResults(userId: string, quizId: number, score: number, answers: Array<{ questionId: number | string; givenAnswer: number | string; isCorrect: boolean }>) {
  const response = await fetch('/api/quiz/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, quizId, score, answers }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit quiz results');
  }
  return response.json();
}

export const fetchUserQuizStats = async (userId: string, locale: string): Promise<FetchedUserData> => {
  const res = await fetch(`/api/user/${userId}/quiz-stats?lang=${locale}`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};