import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { detectLanguage } from '@/utils/helpers';
import type { Quiz } from '@/prisma/generated/client';

type Lang = 'en' | 'ru';
interface LocalizedText {
  en: string;
  ru: string;
}
type JsonTitle = LocalizedText | null;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const langParam = url.searchParams.get('locale') || 'en';
  const lang: Lang = ['en', 'ru'].includes(langParam) ? langParam as Lang : 'en';
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');

  if (!q || typeof q !== 'string') {
    return NextResponse.json({ error: 'Query parameter "q" is required and must be a string' }, { status: 400 });
  }
  const detectedLang: Lang = detectLanguage(q);
  if (lang !== detectedLang) {
    return NextResponse.json([], { status: 201 });
  }
  // Use your Prisma search with `q` here, for example:
  const results = await prisma.quiz.findMany({
    where: {
      title: {
        path: [detectedLang],
        string_contains: q,
        mode: 'insensitive'
      }
    },
    take: 10,
  });

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

  const localizedQuizzes = results.map(q => mapLocalizedQuiz(q, lang));
  return NextResponse.json(localizedQuizzes, { status: 201 });
}