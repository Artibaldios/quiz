import { PrismaClient } from './generated/client/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const accelerateUrl = process.env.ACCELERATE_URL; // add from env.local

if (!accelerateUrl) {
  throw new Error('ACCELERATE_URL is not set');
}

const prisma = new PrismaClient({
  accelerateUrl,
}).$extends(withAccelerate());

async function main() {
  // Flags Quiz - Travel Category
  const flagsQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Flags of the World", ru: "Флаги стран мира" },
      plays: 205,
      questionCount: 10,
      level: "medium",
      questions: {
        create: [
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Sudan", ru: "Судан" },
              { en: "Syria", ru: "Сирия" },
              { en: "Afghanistan", ru: "Афганистан" },
              { en: "Iraq", ru: "Ирак" },
            ],
            correct_answer: {
              en: "Afghanistan",
              ru: "Афганистан",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Russia", ru: "Россия" },
              { en: "Serbia", ru: "Сербия" },
              { en: "Albania", ru: "Албания" },
              { en: "Armenia", ru: "Армения" },
            ],
            correct_answer: {
              en: "Albania",
              ru: "Албания",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Pakistan", ru: "Пакистан" },
              { en: "Tunisia", ru: "Тунис" },
              { en: "Algeria", ru: "Алжир" },
              { en: "Turkey", ru: "Турция" },
            ],
            correct_answer: {
              en: "Algeria",
              ru: "Алжир",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Romania", ru: "Румыния" },
              { en: "Chad", ru: "Чад" },
              { en: "Andorra", ru: "Андорра" },
              { en: "Moldova", ru: "Молдова" },
            ],
            correct_answer: {
              en: "Andorra",
              ru: "Андорра",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Zimbabwe", ru: "Зимбабве" },
              { en: "Mozambique", ru: "Мозамбик" },
              { en: "Angola", ru: "Ангола" },
              { en: "South Africa", ru: "ЮАР" },
            ],
            correct_answer: {
              en: "Angola",
              ru: "Ангола",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Barbados", ru: "Барбадос" },
              { en: "Bahamas", ru: "Багамы" },
              { en: "Antigua and Barbuda", ru: "Антигуа и Барбуда" },
              { en: "Dominica", ru: "Доминика" },
            ],
            correct_answer: {
              en: "Antigua and Barbuda",
              ru: "Антигуа и Барбуда",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Uruguay", ru: "Уругвай" },
              { en: "Paraguay", ru: "Парагвай" },
              { en: "Argentina", ru: "Аргентина" },
              { en: "Chile", ru: "Чили" },
            ],
            correct_answer: {
              en: "Argentina",
              ru: "Аргентина",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Georgia", ru: "Грузия" },
              { en: "Armenia", ru: "Армения" },
              { en: "Turkey", ru: "Турция" },
              { en: "Iran", ru: "Иран" },
            ],
            correct_answer: {
              en: "Armenia",
              ru: "Армения",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Germany", ru: "Германия" },
              { en: "Belgium", ru: "Бельгия" },
              { en: "Austria", ru: "Австрия" },
              { en: "Luxembourg", ru: "Люксембург" },
            ],
            correct_answer: {
              en: "Austria",
              ru: "Австрия",
            },
            image: null,
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is shown in the picture?",
              ru: "Флаг какой страны показан на картинке?",
            },
            options: [
              { en: "Turkey", ru: "Турция" },
              { en: "Kazakhstan", ru: "Казахстан" },
              { en: "Azerbaijan", ru: "Азербайджан" },
              { en: "Uzbekistan", ru: "Узбекистан" },
            ],
            correct_answer: {
              en: "Azerbaijan",
              ru: "Азербайджан",
            },
            image: null,
          },
        ],
      },
    },
  });

  console.log(`Flags quiz created with ID: ${flagsQuiz.id}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
