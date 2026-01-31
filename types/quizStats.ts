export interface QuizStats {
  threeLatestQuizzes: Array<{
    id: number;
    quizId: number;
    quizTitle: string;
    score: number;
    createdAt: Date;
  }>
  allUserQuizzes: Array<{
    id: number;
    quizId: number;
    score: number;
    createdAt: Date;
    quizTitle: string;
  }>
  totalRightAnswers: number;
  totalQuestions: number;
  perfectScoreCount: number;
  uniqueQuizzesCount: number;
}