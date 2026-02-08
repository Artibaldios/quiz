import { prisma } from '@/lib/prisma';
import { QuizCardProps } from '@/utils/helpers';
import type { Quiz } from '@/prisma/generated/client';
import 'server-only'; // Prevents accidental client bundling

type Lang = 'en' | 'ru';
type JsonTitle = { en: string; ru: string } | null;

export async function getHomeQuizzes(lang: string): Promise<{ latest: QuizCardProps[]; popular: QuizCardProps[] }> {
  try {
    const [latestQuizzes, popularQuizzes] = await Promise.all([
      prisma.quiz.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.quiz.findMany({
        take: 5,
        orderBy: { plays: 'desc' },
      })
    ]);

    const getLocalizedText = (json: JsonTitle, lang: Lang): string => {
      if (!json?.[lang]) return json?.en ?? 'Untitled';
      return json[lang];
    };

    const mapLocalizedQuiz = (quiz: Quiz, lang: Lang) => ({
      ...quiz,
      title: getLocalizedText(quiz.title as JsonTitle, lang),
      category: getLocalizedText(quiz.category as JsonTitle, lang)
    });
    // Apply to both arrays
    const latestWithTitles = latestQuizzes.map(q => mapLocalizedQuiz(q, lang as Lang));
    const popularWithTitles = popularQuizzes.map(q => mapLocalizedQuiz(q, lang as Lang));
    return {
      latest: latestWithTitles,
      popular: popularWithTitles
    };
  } catch (error) {
    console.error('Failed to fetch home quizzes:', error);
    return { latest: [], popular: [] };
  }
}