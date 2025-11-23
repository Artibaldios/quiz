import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId, quizId, score, answers } = await req.json();

    const userQuizResult = await prisma.userQuizResult.create({
      data: {
        userId,
        quizId,
        score,
        userAnswers: {
          create: answers.map((a: any) => ({
            questionId: a.questionId,
            givenAnswer: a.givenAnswer,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: {
        userAnswers: true,
      },
    });

    if (!userQuizResult) {
      return NextResponse.json({ error: 'Results were not created' }, { status: 404 });
    }

    return NextResponse.json(userQuizResult, { status: 201 });

  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json({ error: 'Failed to save quiz results' }, { status: 500 });
  }
}