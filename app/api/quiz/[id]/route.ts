import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const localizedQuestions = quiz.questions.map((q) => ({
      id: q.id,
      topic: q.topic[lang] || q.topic['en'],
      question_text: q.question_text[lang] || q.question_text['en'],
      options: q.options.map((opt) => opt[lang] || opt['en']),
      correct_answer: q.correct_answer[lang] || q.correct_answer['en'],
    }));

    // Return quiz with localized questions
    return NextResponse.json({
      ...quiz,
      questions: localizedQuestions,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch quiz: ${error}` }, { status: 500 });
  }
}