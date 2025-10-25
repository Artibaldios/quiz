interface Question {
  _id: string;
  question: string;
  options: string[];
  correct_answer: number;
  topic: string;
}

interface QuizResult {
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  topicScores: Record<string, { correct: number; total: number }>;
  questionsWithAnswers: any;
}

// Pure function to calculate quiz results locally
export function calculateQuizResult(questions: Question[], answers: number[]): QuizResult {
  let totalCorrect = 0;
  const topicScores: Record<string, { correct: number; total: number }> = {};

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const userAnswer = answers[i];

    const isCorrect = userAnswer === question.correct_answer;
    if (isCorrect) totalCorrect++;

    if (!topicScores[question.topic]) {
      topicScores[question.topic] = { correct: 0, total: 0 };
    }

    topicScores[question.topic].total++;
    if (isCorrect) {
      topicScores[question.topic].correct++;
    }
  }

  const score = Math.round((totalCorrect / questions.length) * 100);

  return {
    score,
    totalCorrect,
    totalQuestions: questions.length,
    topicScores,
    questionsWithAnswers: questions.map((question, index) => ({
      question: question?.question || "",
      options: question?.options || [],
      correctAnswer: question?.correct_answer || 0,
      userAnswer: answers[index],
      topic: question?.topic || "",
    })),
  };
}