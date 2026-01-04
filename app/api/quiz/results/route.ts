import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

interface QuizAnswers {
  questionId: number | string;
  givenAnswer: string;
  isCorrect: boolean;
}
export async function POST(req: Request) {
  try {
    const { userId, quizId, score, answers } = await req.json();

    const userQuizResult = await prisma.$transaction(async (tx) => {
      // 1. Check if user already played this quiz
      const existingResult = await tx.userQuizResult.findFirst({
        where: { userId, quizId }
      });
      
      let newQuizzesPlayed = 0;

      // 2. Create quiz result (allows multiple plays of same quiz)
      const newResult = await tx.userQuizResult.create({
        data: {
          userId,
          quizId,
          score,
          userAnswers: {
            create: answers.map((a: QuizAnswers) => ({
              questionId: a.questionId,
              givenAnswer: a.givenAnswer,
              isCorrect: a.isCorrect,
            })),
          },
        },
        include: { userAnswers: true },
      });

      // 3. Increment quiz plays
      await tx.quiz.update({
        where: { id: quizId },
        data: { plays: { increment: 1 } },
      });

      // 4. Calculate stats from THIS quiz
      const totalQuestionsThisQuiz = newResult.userAnswers.length;
      const totalRightAnswersThisQuiz = newResult.userAnswers.filter(a => a.isCorrect).length;

      // 5. If FIRST time playing this quiz, increment quizzesPlayed
      if (!existingResult) {
        // Count DISTINCT quizzes this user has played (including this one)
        const uniqueQuizzes = await tx.userQuizResult.groupBy({
          by: ['quizId'],
          where: { userId },
        });
        newQuizzesPlayed = uniqueQuizzes.length; // Already includes current quiz
      } else {
        // Already played this quiz, get current count
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { quizzesPlayed: true }
        });
        newQuizzesPlayed = user?.quizzesPlayed || 0;
      }

      // 6. Update user stats
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { totalRightAnswers: true, totalQuestions: true },
      });

      const newTotalRight = (user?.totalRightAnswers || 0) + totalRightAnswersThisQuiz;
      const newTotalQuestions = (user?.totalQuestions || 0) + totalQuestionsThisQuiz;
      const accuracy = Math.round((newTotalRight / newTotalQuestions) * 100) || 0;

      await tx.user.update({
        where: { id: userId },
        data: { 
          totalRightAnswers: newTotalRight,
          totalQuestions: newTotalQuestions,
          accuracy,
          quizzesPlayed: newQuizzesPlayed
        },
      });

      return newResult;
    });

    return NextResponse.json(userQuizResult, { status: 201 });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    return NextResponse.json({ error: 'Failed to save quiz results' }, { status: 500 });
  }
}