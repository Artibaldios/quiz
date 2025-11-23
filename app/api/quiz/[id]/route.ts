import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
type Lang = 'en' | 'ru';
type JsonValue = Prisma.JsonValue;
interface DbQuizQuestion {
  id: number;
  quizId: number;
  topic: JsonValue | null;           // from DB
  question_text: JsonValue | null;
  options: JsonValue | null;
  correct_answer: JsonValue | null;
}
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = Number(id);

  if (isNaN(quizId)) {
    return NextResponse.json({ error: 'Quiz ID not specified' }, { status: 400 });
  }

  // Get lang from query params, default to 'en'
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') || 'en';

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Map questions to contain only requested language text/options
const localizedQuestions = quiz.questions.map((q: DbQuizQuestion) => {
  // Safely cast or validate JSON fields to expected type before accessing properties
  const topic = (q.topic && typeof q.topic === 'object' && 'en' in q.topic && 'ru' in q.topic) 
    ? q.topic as { en: string; ru: string }
    : { en: 'No topic', ru: 'Нет темы' };

  const question_text = (q.question_text && typeof q.question_text === 'object' && 'en' in q.question_text && 'ru' in q.question_text) 
    ? q.question_text as { en: string; ru: string }
    : { en: 'No question text', ru: 'Нет текста вопроса' };

  const options = Array.isArray(q.options) 
    ? q.options.map((opt: any) => opt[lang] || opt['en']) 
    : [];

  const correct_answer = (q.correct_answer && typeof q.correct_answer === 'object' && 'en' in q.correct_answer && 'ru' in q.correct_answer)
    ? q.correct_answer as { en: string; ru: string }
    : { en: '', ru: '' };

  return {
    id: q.id,
    topic: topic[lang as Lang] || topic.en,
    question_text: question_text[lang as Lang] || question_text.en,
    options,
    correct_answer: correct_answer[lang as Lang] || correct_answer.en,
  };
});

    // Return quiz with localized questions
    return NextResponse.json({
      ...quiz,
      questions: localizedQuestions,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch quiz: ${error}` }, { status: 500 });
  }
}