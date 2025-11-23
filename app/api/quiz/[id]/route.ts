import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
type Lang = 'en' | 'ru';
type JsonValue = Prisma.JsonValue;
interface DbQuizQuestion {
  id: number;
  quizId: number;
  topic: JsonValue | null;
  question_text: JsonValue | null;
  options: JsonValue | null;
  correct_answer: JsonValue | null;
}
interface LocalizedText {
  en: string;
  ru: string;
}
interface Option {
  en: string;
  ru: string;
}
function isLocalizedText(value: unknown): value is LocalizedText {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en' in value &&
    typeof (value as any).en === 'string' &&
    'ru' in value &&
    typeof (value as any).ru === 'string'
  );
}

function isOptionsArray(value: unknown): value is Option[] {
  return Array.isArray(value) && value.every(isLocalizedText);
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
      const topic = isLocalizedText(q.topic) ? q.topic : { en: 'No topic', ru: 'Нет темы' };
      const question_text = isLocalizedText(q.question_text) ? q.question_text : { en: 'No question text', ru: 'Нет текста вопроса' };
      const options = isOptionsArray(q.options) ? q.options.map(opt => opt[lang as Lang] || opt.en) : [];
      const correct_answer = isLocalizedText(q.correct_answer) ? q.correct_answer : { en: '', ru: '' };

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