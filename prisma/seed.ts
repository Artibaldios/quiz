import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  // await prisma.userAnswer.deleteMany();
  // await prisma.userQuizResult.deleteMany();
  // await prisma.question.deleteMany();
  // await prisma.quiz.deleteMany();
  // await prisma.user.deleteMany();

  // Create a user
  // const user = await prisma.user.create({
  //   data: {
  //     email: 'user@example.com',
  //   },
  // });

  // Create a quiz with two questions
const quiz = await prisma.quiz.create({
  data: {
    title: "General Knowledge Quiz",
    questions: {
      create: [
        {
          topic: { en: "Geography", ru: "География" },
          question_text: { en: "What is the capital of France?", ru: "Какова столица Франции?" },
          options: [
            { en: "Paris", ru: "Париж" },
            { en: "London", ru: "Лондон" },
            { en: "Berlin", ru: "Берлин" },
            { en: "Rome", ru: "Рим" },
          ],
          correct_answer: { en: "Paris", ru: "Париж" },
        },
        {
          topic: { en: "Science", ru: "Наука" },
          question_text: { en: "What planet is known as the Red Planet?", ru: "Какая планета известна как Красная планета?" },
          options: [
            { en: "Earth", ru: "Земля" },
            { en: "Mars", ru: "Марс" },
            { en: "Jupiter", ru: "Юпитер" },
            { en: "Venus", ru: "Венера" },
          ],
          correct_answer: { en: "Mars", ru: "Марс" },
        },
        {
          topic: { en: "History", ru: "История" },
          question_text: { en: "Who was the first president of the United States?", ru: "Кто был первым президентом Соединенных Штатов?" },
          options: [
            { en: "George Washington", ru: "Джордж Вашингтон" },
            { en: "Abraham Lincoln", ru: "Авраам Линкольн" },
            { en: "Thomas Jefferson", ru: "Томас Джефферсон" },
            { en: "John Adams", ru: "Джон Адамс" },
          ],
          correct_answer: { en: "George Washington", ru: "Джордж Вашингтон" },
        },
        {
          topic: { en: "Math", ru: "Математика" },
          question_text: { en: "What is the value of π (pi) rounded to 2 decimal places?", ru: "Чему равно значение π (пи), округленное до двух знаков после запятой?" },
          options: [
            { en: "3.12", ru: "3.12" },
            { en: "3.14", ru: "3.14" },
            { en: "3.16", ru: "3.16" },
            { en: "3.18", ru: "3.18" },
          ],
          correct_answer: { en: "3.14", ru: "3.14" },
        },
      ],
    },
  },
  include: {
    questions: true,
  },
});

  // // Create a UserQuizResult for this user and quiz
  // const userQuizResult = await prisma.userQuizResult.create({
  //   data: {
  //     userId: user.id,
  //     quizId: quiz.id,
  //     score: 1,
  //     userAnswers: {
  //       create: [
  //         {
  //           questionId: quiz.questions[0].id,
  //           givenAnswer: 'Paris',
  //           isCorrect: true,
  //         },
  //         {
  //           questionId: quiz.questions[1].id,
  //           givenAnswer: '3',
  //           isCorrect: false,
  //         },
  //       ],
  //     },
  //   },
  // });

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });