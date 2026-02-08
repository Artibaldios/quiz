import { prisma } from '@/lib/prisma';
import { Lang } from '@/types/common';

const localize = (value: any, lang: Lang, fallback: string) =>
  (value?.[lang] || value?.en || fallback) as string;

// Category mapping: en -> ru
const categoryMap: Record<string, string> = {
  food: 'еда',
  travel: 'путешествия',
  science: 'наука',
  general: 'общее',
  music: 'музыка',
  films: 'фильмы',
  sport: 'спорт',
  literature: 'литература',
  art: 'искусство',
};

export async function getQuizzesByCategory(category: string, lang: Lang) {
  try {
    const searchCategory = lang === 'ru' && categoryMap[category]
      ? categoryMap[category]
      : category;
    const quizzes = await prisma.quiz.findMany({
      where: {
        category: { path: [lang], string_contains: searchCategory }
      },
      include: { questions: true }
    });

    const localizedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      title: localize(quiz.title, lang, 'No title'),
      category: localize(quiz.category, lang, 'No category'),
    }));
    return localizedQuizzes;
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
    return [];
  }
}