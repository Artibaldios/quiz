import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Quiz } from '@/prisma/generated/client';

type Lang = 'en' | 'ru';
interface LocalizedText {
  en: string;
  ru: string;
}
type JsonTitle = LocalizedText | null;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const langParam = url.searchParams.get('lang') || 'en';
  const lang: Lang = ['en', 'ru'].includes(langParam) ? langParam as Lang : 'en';

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

    // Map results to return language-specific title
    const getLocalizedTitle = (title: JsonTitle, lang: Lang): string => {
      // Handle null/undefined safely
      if (!title || typeof title !== 'object') {
        return 'No title';
      }
      
      const localized = title as LocalizedText; // Safe after null check
      return lang === 'ru' ? 
        localized.ru ?? localized.en ?? 'No title' : 
        localized.en ?? 'No title';
    };
    const mapTitle = (quiz: Quiz) => ({
      ...quiz,
      title: getLocalizedTitle(quiz.title as JsonTitle, lang)
    });
    const latestWithTitles = latestQuizzes.map(mapTitle);
    const popularWithTitles = popularQuizzes.map(mapTitle);

    return NextResponse.json({ 
      latest: latestWithTitles, 
      popular: popularWithTitles
    });

  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch quizzes: ${error}` }, { status: 500 });
  }
}