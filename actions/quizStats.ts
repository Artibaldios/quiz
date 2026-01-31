import { prisma } from '@/lib/prisma';
import { FetchedUserData } from '@/types/quiz';

export interface GetQuizStatsParams {
  userId: string
  lang: string
}

type LocalizedTitle = { en?: string; ru?: string }

export async function getQuizStats({ userId, lang }: GetQuizStatsParams): Promise<FetchedUserData> {
  // Get 3 latest results
  const results = await prisma.userQuizResult.findMany({
    where: { userId },
    select: { id: true, quizId: true, score: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  if (results.length === 0) {
    return {
      threeLatestQuizzes: [],
      allUserQuizzes: [],
      totalRightAnswers: 0,
      totalQuestions: 0,
      perfectScoreCount: 0,
      uniqueQuizzesCount: 0,
    }
  }

  // Update user stats (same logic)
  const totalRightAnswers = await prisma.userAnswer.groupBy({
    where: { userQuizResult: { userId }, isCorrect: true },
    by: ['questionId'],
    _count: { id: true },
  }).then(results => results.length)

  const totalQuestions = await prisma.userAnswer.groupBy({
    where: { userQuizResult: { userId } },
    by: ['questionId'],
    _count: { questionId: true },
  }).then(results => results.length)

  await prisma.user.update({
    where: { id: userId },
    data: { totalRightAnswers, totalQuestions },
  })

  // Rest of your logic exactly the same...
  const allUserResults = await prisma.userQuizResult.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  const uniqueQuizIds = [...new Set(allUserResults.map(r => r.quizId))]
  const quizzes = await prisma.quiz.findMany({
    where: { id: { in: uniqueQuizIds } },
    select: { id: true, title: true },
  })

  const quizTitleMap = new Map(
    quizzes.map(quiz => {
      const title = quiz.title as LocalizedTitle
      const localizedTitle = lang === 'ru' ? title.ru || title.en || 'Unknown' : title.en || 'Unknown'
      return [quiz.id, localizedTitle]
    })
  )

  const resultsWithTitles = allUserResults.map(result => ({
    ...result,
    quizTitle: quizTitleMap.get(result.quizId) || 'Unknown',
  }))

  const perfectScoreCount = await prisma.userQuizResult.count({
    where: { userId, score: 100 },
  })

  return {
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
    uniqueQuizzesCount: uniqueQuizIds.length,
  }
}