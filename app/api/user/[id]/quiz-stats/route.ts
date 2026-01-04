import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
type Lang = 'en' | 'ru';

type LocalizedTitle = {
  en?: string;
  ru?: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const url = new URL(request.url);
  const langParam = url.searchParams.get('lang') || 'en';
  const lang: Lang = ['en', 'ru'].includes(langParam) ? langParam as Lang : 'en';
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // Get 3 latest results
    const results = await prisma.userQuizResult.findMany({
      where: { userId: id },
      select: {
        id: true,
        quizId: true,
        score: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    if (results.length === 0) {
      return NextResponse.json({
        threeLatestQuizzes: [],
        allUserQuizzes: [],
        totalRightAnswers: 0,
        totalQuestions: 0,
        perfectScoreCount: 0,
        uniqueQuizzesCount: 0
      });
    }

    // Update user stats (total right answers and total questions)
    const totalRightAnswers = await prisma.userAnswer.groupBy({
      where: {
        userQuizResult: { userId: id },
        isCorrect: true
      },
      by: ['questionId'],
      _count: { id: true }
    }).then(results => results.length);

    const totalQuestions = await prisma.userAnswer.groupBy({
      where: {
        userQuizResult: { userId: id }
      },
      by: ['questionId'],
      _count: { questionId: true }
    }).then(results => results.length);

    await prisma.user.update({
      where: { id },
      data: { totalRightAnswers, totalQuestions }
    });

    const allUserResults = await prisma.userQuizResult.findMany({
      where: { userId: id },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const uniqueQuizIds = [...new Set(allUserResults.map(r => r.quizId))];
    const uniqueQuizzesCount = uniqueQuizIds.length;

    // Fetch quiz titles in one batch
    const quizzes = await prisma.quiz.findMany({
      where: { id: { in: uniqueQuizIds } },
      select: { id: true, title: true }
    });

    // Create lookup map for O(1) access
    const quizTitleMap = new Map(
      quizzes.map(quiz => {
        const title = quiz.title as LocalizedTitle;
        const LocalizedTitle = lang === 'ru' ? title.ru || title.en || 'Unknown' : title.en || 'Unknown';
        return [quiz.id, LocalizedTitle ]
      })
    );

    // Add titles to results
    const resultsWithTitles = allUserResults.map(result => ({
      ...result,
      quizTitle: quizTitleMap.get(result.quizId) || 'Unknown'
    }));

    // Count perfect scores
    const perfectScoreCount = await prisma.userQuizResult.count({
      where: { userId: id, score: 100 }
    });

    return NextResponse.json({
      threeLatestQuizzes: results.map(result => ({
        id: result.id,
        quizId: result.quizId,
        quizTitle: quizTitleMap.get(result.quizId) || 'Unknown',
        score: result.score,
        createdAt: result.createdAt,
      })),
      allUserQuizzes: resultsWithTitles,
      totalRightAnswers,
      totalQuestions,
      perfectScoreCount,
      uniqueQuizzesCount
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
