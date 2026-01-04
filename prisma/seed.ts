import { prisma } from '@/lib/prisma';

async function main() {
  const quiz = await prisma.quiz.create({
    data: {
      title: { en: "General Knowledge Quiz", ru: "Квиз по общим знаниям" },
      plays: 230,
      questionCount: 4,
      level: "easy",
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

  // Science Quiz
  const scienceQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Science Quiz", ru: "Научный квиз" },
      plays: 122,
      questionCount: 5,
      level: "easy",
      questions: {
        create: [
          {
            topic: { en: "Biology", ru: "Биология" },
            question_text: { en: "What is the basic unit of life?", ru: "Какова основная единица жизни?" },
            options: [
              { en: "Cell", ru: "Клетка" },
              { en: "Atom", ru: "Атом" },
              { en: "Molecule", ru: "Молекула" },
              { en: "Organ", ru: "Орган" },
            ],
            correct_answer: { en: "Cell", ru: "Клетка" },
          },
          {
            topic: { en: "Chemistry", ru: "Химия" },
            question_text: { en: "What is the chemical symbol for gold?", ru: "Какой химический символ у золота?" },
            options: [
              { en: "Au", ru: "Au" },
              { en: "Ag", ru: "Ag" },
              { en: "Fe", ru: "Fe" },
              { en: "Go", ru: "Go" },
            ],
            correct_answer: { en: "Au", ru: "Au" },
          },
          {
            topic: { en: "Physics", ru: "Физика" },
            question_text: { en: "What is the speed of light in vacuum?", ru: "Какова скорость света в вакууме?" },
            options: [
              { en: "299,792,458 m/s", ru: "299,792,458 м/с" },
              { en: "300,000 km/h", ru: "300,000 км/ч" },
              { en: "150,000 miles/s", ru: "150,000 миль/с" },
              { en: "1,080 million km/h", ru: "1,080 миллионов км/ч" },
            ],
            correct_answer: { en: "299,792,458 m/s", ru: "299,792,458 м/с" },
          },
          {
            topic: { en: "Astronomy", ru: "Астрономия" },
            question_text: { en: "Which planet has the most moons in our solar system?", ru: "У какой планеты больше всего лун в нашей солнечной системе?" },
            options: [
              { en: "Jupiter", ru: "Юпитер" },
              { en: "Saturn", ru: "Сатурн" },
              { en: "Uranus", ru: "Уран" },
              { en: "Neptune", ru: "Нептун" },
            ],
            correct_answer: { en: "Saturn", ru: "Сатурн" },
          },
          {
            topic: { en: "Geology", ru: "Геология" },
            question_text: { en: "What is the hardest natural substance on Earth?", ru: "Какое самое твердое природное вещество на Земле?" },
            options: [
              { en: "Diamond", ru: "Алмаз" },
              { en: "Graphite", ru: "Графит" },
              { en: "Quartz", ru: "Кварц" },
              { en: "Topaz", ru: "Топаз" },
            ],
            correct_answer: { en: "Diamond", ru: "Алмаз" },
          },
        ],
      },
    },
  });

  // Music Quiz
  const musicQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Music Quiz", ru: "Музыкальный квиз" },
      plays: 331,
      questionCount: 5,
      level: "medium",
      questions: {
        create: [
          {
            topic: { en: "Classical Music", ru: "Классическая музыка" },
            question_text: { en: "Who composed the 'Moonlight Sonata'?", ru: "Кто написал 'Лунную сонату'?" },
            options: [
              { en: "Ludwig van Beethoven", ru: "Людвиг ван Бетховен" },
              { en: "Wolfgang Amadeus Mozart", ru: "Вольфганг Амадей Моцарт" },
              { en: "Johann Sebastian Bach", ru: "Иоганн Себастьян Бах" },
              { en: "Frédéric Chopin", ru: "Фредерик Шопен" },
            ],
            correct_answer: { en: "Ludwig van Beethoven", ru: "Людвиг ван Бетховен" },
          },
          {
            topic: { en: "Music Theory", ru: "Музыкальная теория" },
            question_text: { en: "How many beats does a whole note get in 4/4 time?", ru: "Сколько долей получает целая нота в размере 4/4?" },
            options: [
              { en: "4 beats", ru: "4 доли" },
              { en: "1 beat", ru: "1 доля" },
              { en: "2 beats", ru: "2 доли" },
              { en: "8 beats", ru: "8 долей" },
            ],
            correct_answer: { en: "4 beats", ru: "4 доли" },
          },
          {
            topic: { en: "Rock Music", ru: "Рок-музыка" },
            question_text: { en: "Which band released the album 'The Dark Side of the Moon'?", ru: "Какая группа выпустила альбом 'The Dark Side of the Moon'?" },
            options: [
              { en: "The Beatles", ru: "The Beatles" },
              { en: "Led Zeppelin", ru: "Led Zeppelin" },
              { en: "Pink Floyd", ru: "Pink Floyd" },
              { en: "Queen", ru: "Queen" },
            ],
            correct_answer: { en: "Pink Floyd", ru: "Pink Floyd" },
          },
          {
            topic: { en: "Instruments", ru: "Музыкальные инструменты" },
            question_text: { en: "How many strings does a standard violin have?", ru: "Сколько струн у стандартной скрипки?" },
            options: [
              { en: "4", ru: "4" },
              { en: "5", ru: "5" },
              { en: "6", ru: "6" },
              { en: "7", ru: "7" },
            ],
            correct_answer: { en: "4", ru: "4" },
          },
          {
            topic: { en: "Pop Music", ru: "Поп-музыка" },
            question_text: { en: "Which singer is known as the 'Queen of Pop'?", ru: "Какая певица известна как 'Королева поп-музыки'?" },
            options: [
              { en: "Madonna", ru: "Мадонна" },
              { en: "Beyoncé", ru: "Бейонсе" },
              { en: "Lady Gaga", ru: "Леди Гага" },
              { en: "Taylor Swift", ru: "Тейлор Свифт" },
            ],
            correct_answer: { en: "Madonna", ru: "Мадонна" },
          },
        ],
      },
    },
  });

  // Art Quiz
  const artQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Art Quiz", ru: "Квиз по искусству" },
      plays: 111,
      questionCount: 5,
      level: "medium",
      questions: {
        create: [
          {
            topic: { en: "Renaissance Art", ru: "Искусство Ренессанса" },
            question_text: { en: "Who painted the Mona Lisa?", ru: "Кто написал Мона Лизу?" },
            options: [
              { en: "Leonardo da Vinci", ru: "Леонардо да Винчи" },
              { en: "Michelangelo", ru: "Микеланджело" },
              { en: "Raphael", ru: "Рафаэль" },
              { en: "Donatello", ru: "Донателло" },
            ],
            correct_answer: { en: "Leonardo da Vinci", ru: "Леонардо да Винчи" },
          },
          {
            topic: { en: "Color Theory", ru: "Теория цвета" },
            question_text: { en: "What are the three primary colors?", ru: "Какие три основных цвета?" },
            options: [
              { en: "Red, Yellow, Blue", ru: "Красный, Желтый, Синий" },
              { en: "Red, Green, Blue", ru: "Красный, Зеленый, Синий" },
              { en: "Cyan, Magenta, Yellow", ru: "Голубой, Пурпурный, Желтый" },
              { en: "Orange, Green, Purple", ru: "Оранжевый, Зеленый, Фиолетовый" },
            ],
            correct_answer: { en: "Red, Yellow, Blue", ru: "Красный, Желтый, Синий" },
          },
          {
            topic: { en: "Modern Art", ru: "Современное искусство" },
            question_text: { en: "Which artist is famous for Campbell's Soup Cans paintings?", ru: "Какой художник известен картинами с банками супа Кэмпбелл?" },
            options: [
              { en: "Andy Warhol", ru: "Энди Уорхол" },
              { en: "Pablo Picasso", ru: "Пабло Пикассо" },
              { en: "Jackson Pollock", ru: "Джексон Поллок" },
              { en: "Salvador Dalí", ru: "Сальвадор Дали" },
            ],
            correct_answer: { en: "Andy Warhol", ru: "Энди Уорхол" },
          },
          {
            topic: { en: "Sculpture", ru: "Скульптура" },
            question_text: { en: "Who sculpted 'The Thinker'?", ru: "Кто создал скульптуру 'Мыслитель'?" },
            options: [
              { en: "Auguste Rodin", ru: "Огюст Роден" },
              { en: "Michelangelo", ru: "Микеланджело" },
              { en: "Donatello", ru: "Донателло" },
              { en: "Bernini", ru: "Бернини" },
            ],
            correct_answer: { en: "Auguste Rodin", ru: "Огюст Роден" },
          },
          {
            topic: { en: "Art Movements", ru: "Художественные движения" },
            question_text: { en: "Which art movement is characterized by dream-like scenes and unexpected juxtapositions?", ru: "Какое художественное движение характеризуется сюрреалистичными сценами и неожиданными сопоставлениями?" },
            options: [
              { en: "Surrealism", ru: "Сюрреализм" },
              { en: "Impressionism", ru: "Импрессионизм" },
              { en: "Cubism", ru: "Кубизм" },
              { en: "Expressionism", ru: "Экспрессионизм" },
            ],
            correct_answer: { en: "Surrealism", ru: "Сюрреализм" },
          },
        ],
      },
    },
  });

  // Films Quiz
  const filmsQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Films Quiz", ru: "Кино-викторина" },
      plays: 131,
      questionCount: 5,
      level: "easy",
      questions: {
        create: [
          {
            topic: { en: "Cinema History", ru: "История кино" },
            question_text: { en: "Which movie won the first Academy Award for Best Picture?", ru: "Какой фильм получил первую премию Оскар за лучший фильм?" },
            options: [
              { en: "Wings", ru: "Крылья" },
              { en: "The Jazz Singer", ru: "Певчик джаза" },
              { en: "Metropolis", ru: "Метрополис" },
              { en: "Sunrise", ru: "Восход солнца" },
            ],
            correct_answer: { en: "Wings", ru: "Крылья" },
          },
          {
            topic: { en: "Animation", ru: "Анимация" },
            question_text: { en: "What was the first feature-length animated film?", ru: "Какой был первый полнометражный анимационный фильм?" },
            options: [
              { en: "Snow White and the Seven Dwarfs", ru: "Белоснежка и семь гномов" },
              { en: "Steamboat Willie", ru: "Пароходик Вилли" },
              { en: "Fantasia", ru: "Фантазия" },
              { en: "Gertie the Dinosaur", ru: "Динозавр Герти" },
            ],
            correct_answer: { en: "Snow White and the Seven Dwarfs", ru: "Белоснежка и семь гномов" },
          },
          {
            topic: { en: "Film Directors", ru: "Режиссеры" },
            question_text: { en: "Who directed 'Pulp Fiction'?", ru: "Кто снял 'Криминальное чтиво'?" },
            options: [
              { en: "Quentin Tarantino", ru: "Квентин Тарантино" },
              { en: "Martin Scorsese", ru: "Мартин Скорсезе" },
              { en: "Steven Spielberg", ru: "Стивен Спилберг" },
              { en: "Francis Ford Coppola", ru: "Фрэнсис Форд Коппола" },
            ],
            correct_answer: { en: "Quentin Tarantino", ru: "Квентин Тарантино" },
          },
          {
            topic: { en: "Movie Quotes", ru: "Цитаты из фильмов" },
            question_text: { en: "Which movie contains the line: 'Here's looking at you, kid'?", ru: "В каком фильме есть фраза: 'За тебя, малыш'?" },
            options: [
              { en: "Casablanca", ru: "Касабланка" },
              { en: "Gone with the Wind", ru: "Унесенные ветром" },
              { en: "The Godfather", ru: "Крестный отец" },
              { en: "Citizen Kane", ru: "Гражданин Кейн" },
            ],
            correct_answer: { en: "Casablanca", ru: "Касабланка" },
          },
          {
            topic: { en: "Film Genres", ru: "Жанры кино" },
            question_text: { en: "Which of these is considered the first feature-length science fiction film?", ru: "Какой из этих фильмов считается первым полнометражным научно-фантастическим фильмом?" },
            options: [
              { en: "A Trip to the Moon", ru: "Путешествие на Луну" },
              { en: "Metropolis", ru: "Метрополис" },
              { en: "2001: A Space Odyssey", ru: "2001: Космическая одиссея" },
              { en: "The War of the Worlds", ru: "Война миров" },
            ],
            correct_answer: { en: "A Trip to the Moon", ru: "Путешествие на Луну" },
          },
        ],
      },
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });