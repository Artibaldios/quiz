import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [rightAnswersLeaders, accuracyLeaders] = await Promise.all([
      prisma.user.findMany({
        take: 3,
        orderBy: { totalRightAnswers: 'desc' },
        select: { id: true, name: true, email: true, totalQuestions: true, totalRightAnswers: true }
      }),
      prisma.user.findMany({
        take: 3,
        orderBy: { accuracy: 'desc' },
        select: { id: true, name: true, email: true, accuracy: true, quizzesPlayed: true }
      })
    ]);

    return NextResponse.json({
      rightAnswersLeaders,
      accuracyLeaders
    });
  } catch (error) {
    console.error('Failed to fetch leaders:', error);
    return NextResponse.json({ error: 'Failed to fetch leaders' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}