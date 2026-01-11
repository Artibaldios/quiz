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

    // Reusable localized text extractor (works for title, category, etc.)
    const getLocalizedText = (json: JsonTitle, lang: Lang): string => {
      if (!json || typeof json !== 'object') {
        return 'No text';
      }
      
      const localized = json as LocalizedText;
      return lang === 'ru' ? 
        localized.ru ?? localized.en ?? 'No text' : 
        localized.en ?? 'No text';
    };
    const mapLocalizedQuiz = (quiz: Quiz, lang: Lang) => ({
      ...quiz,
      title: getLocalizedText(quiz.title as JsonTitle, lang),
      category: getLocalizedText(quiz.category as JsonTitle, lang)
    });

    // Apply to both arrays
    const latestWithTitles = latestQuizzes.map(q => mapLocalizedQuiz(q, lang));
    const popularWithTitles = popularQuizzes.map(q => mapLocalizedQuiz(q, lang));

    return NextResponse.json({ 
      latest: latestWithTitles, 
      popular: popularWithTitles
    });

  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch quizzes: ${error}` }, { status: 500 });
  }
}