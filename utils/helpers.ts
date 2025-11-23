interface Question {
  id: string | number;
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
}

interface QuestionWithAnswer {
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
  user_answer: string;
}

interface QuizResult {
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  topicScores: Record<string, { correct: number; total: number }>;
  questionsWithAnswers?: QuestionWithAnswer[];
}

// Pure function to calculate quiz results locally
export function calculateQuizResult(questions: Question[], answers: string[]): QuizResult {
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
      question_text: question?.question_text || "",
      options: question?.options || [],
      correct_answer: question?.correct_answer || "",
      user_answer: answers[index] || "",
      topic: question?.topic || "",
    })),
  };
}