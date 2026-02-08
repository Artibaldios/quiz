export function calculateQuizResult(questions, answers, points) {
  let totalCorrect = 0;
  const topicScores = {};

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

  const percentScore = Math.round((totalCorrect / questions.length) * 100);

  return {
    score: points,
    percentScore,
    totalCorrect,
    totalQuestions: questions.length,
    topicScores,
    questionsWithAnswers: questions.map((question, index) => ({
      question_text: question?.question_text || "",
      options: question?.options || [],
      correct_answer: question?.correct_answer || "",
      user_answer: answers[index] || "",
      topic: question?.topic || "",
      questionId: question?.id,
      givenAnswer: answers[index],
      isCorrect: answers[index] == question?.correct_answer
    })),
  };
}
