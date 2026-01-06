import { PrismaClient } from './generated/client/index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const accelerateUrl = process.env.ACCELERATE_URL;

if (!accelerateUrl) {
  throw new Error('ACCELERATE_URL is not set');
}

const prisma = new PrismaClient({
  accelerateUrl, // now typed as string
}).$extends(withAccelerate());

async function main() {
  // Technology Quiz
  const technologyQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Technology Quiz", ru: "Технологический квиз" },
      plays: 210,
      questionCount: 10,
      level: "medium",
      questions: {
        create: [
          {
            topic: { en: "Computers", ru: "Компьютеры" },
            question_text: {
              en: "What does CPU stand for in a computer?",
              ru: "За что отвечает аббревиатура CPU в компьютере?",
            },
            options: [
              { en: "Central Processing Unit", ru: "Центральный процессор" },
              { en: "Computer Power Unit", ru: "Компьютерный блок питания" },
              { en: "Central Program Unit", ru: "Центральный программный блок" },
              { en: "Control Processing Unit", ru: "Управляющий процессор" },
            ],
            correct_answer: {
              en: "Central Processing Unit",
              ru: "Центральный процессор",
            },
          },
          {
            topic: { en: "Internet", ru: "Интернет" },
            question_text: {
              en: "What does the abbreviation HTTP stand for?",
              ru: "Что означает аббревиатура HTTP?",
            },
            options: [
              {
                en: "HyperText Transfer Protocol",
                ru: "Протокол передачи гипертекста",
              },
              {
                en: "High Transfer Text Protocol",
                ru: "Протокол высокоскоростной передачи текста",
              },
              {
                en: "Hyperlink Transfer Program",
                ru: "Программа передачи гиперссылок",
              },
              {
                en: "Host Transfer Text Protocol",
                ru: "Протокол передачи текста хоста",
              },
            ],
            correct_answer: {
              en: "HyperText Transfer Protocol",
              ru: "Протокол передачи гипертекста",
            },
          },
          {
            topic: { en: "Programming", ru: "Программирование" },
            question_text: {
              en: "Which language is primarily used to style web pages?",
              ru: "Какой язык в основном используется для стилизации веб-страниц?",
            },
            options: [
              { en: "HTML", ru: "HTML" },
              { en: "CSS", ru: "CSS" },
              { en: "Java", ru: "Java" },
              { en: "Python", ru: "Python" },
            ],
            correct_answer: { en: "CSS", ru: "CSS" },
          },
          {
            topic: { en: "Mobile Devices", ru: "Мобильные устройства" },
            question_text: {
              en: "Which company developed the Android operating system?",
              ru: "Какая компания разработала операционную систему Android?",
            },
            options: [
              { en: "Apple", ru: "Apple" },
              { en: "Microsoft", ru: "Microsoft" },
              { en: "Google", ru: "Google" },
              { en: "IBM", ru: "IBM" },
            ],
            correct_answer: { en: "Google", ru: "Google" },
          },
          {
            topic: { en: "Cybersecurity", ru: "Кибербезопасность" },
            question_text: {
              en: "What is the practice of attempting to gain unauthorized access to a system called?",
              ru: "Как называется практика попыток получить несанкционированный доступ к системе?",
            },
            options: [
              { en: "Hacking", ru: "Хакерство" },
              { en: "Debugging", ru: "Отладка" },
              { en: "Compiling", ru: "Компиляция" },
              { en: "Rendering", ru: "Рендеринг" },
            ],
            correct_answer: { en: "Hacking", ru: "Хакерство" },
          },
          {
            topic: { en: "Storage", ru: "Хранение данных" },
            question_text: {
              en: "Which of these is a solid-state storage device?",
              ru: "Какое из этих устройств является твердотельным накопителем?",
            },
            options: [
              { en: "HDD", ru: "Жесткий диск (HDD)" },
              { en: "SSD", ru: "Твердотельный накопитель (SSD)" },
              { en: "DVD", ru: "DVD" },
              { en: "Floppy disk", ru: "Дискета" },
            ],
            correct_answer: {
              en: "SSD",
              ru: "Твердотельный накопитель (SSD)",
            },
          },
          {
            topic: { en: "Networking", ru: "Сетевые технологии" },
            question_text: {
              en: "What does Wi‑Fi primarily use to transmit data?",
              ru: "Что в основном используется Wi‑Fi для передачи данных?",
            },
            options: [
              { en: "Radio waves", ru: "Радиоволны" },
              { en: "Sound waves", ru: "Звуковые волны" },
              { en: "Light signals", ru: "Световые сигналы" },
              { en: "Electric current", ru: "Электрический ток" },
            ],
            correct_answer: { en: "Radio waves", ru: "Радиоволны" },
          },
          {
            topic: { en: "Operating Systems", ru: "Операционные системы" },
            question_text: {
              en: "Which operating system is open source and based on the Linux kernel?",
              ru: "Какая операционная система является открытой и основана на ядре Linux?",
            },
            options: [
              { en: "Windows 11", ru: "Windows 11" },
              { en: "macOS", ru: "macOS" },
              { en: "Ubuntu", ru: "Ubuntu" },
              { en: "Chrome OS", ru: "Chrome OS" },
            ],
            correct_answer: { en: "Ubuntu", ru: "Ubuntu" },
          },
          {
            topic: { en: "Gadgets", ru: "Гаджеты" },
            question_text: {
              en: "What is the generic name for wearable devices that track steps and heart rate?",
              ru: "Как называется общий класс носимых устройств, отслеживающих шаги и пульс?",
            },
            options: [
              { en: "Fitness trackers", ru: "Фитнес-трекеры" },
              { en: "Smart speakers", ru: "Умные колонки" },
              { en: "Game consoles", ru: "Игровые консоли" },
              { en: "Web cams", ru: "Веб-камеры" },
            ],
            correct_answer: {
              en: "Fitness trackers",
              ru: "Фитнес-трекеры",
            },
          },
          {
            topic: { en: "Artificial Intelligence", ru: "Искусственный интеллект" },
            question_text: {
              en: "What term describes computer systems that can perform tasks that usually require human intelligence?",
              ru: "Какой термин описывает компьютерные системы, способные выполнять задачи, требующие обычно человеческого интеллекта?",
            },
            options: [
              { en: "Artificial Intelligence", ru: "Искусственный интеллект" },
              { en: "Virtual Reality", ru: "Виртуальная реальность" },
              { en: "Cloud Computing", ru: "Облачные вычисления" },
              { en: "Machine Code", ru: "Машинный код" },
            ],
            correct_answer: {
              en: "Artificial Intelligence",
              ru: "Искусственный интеллект",
            },
          },
        ],
      },
    },
  });

  // Sports Quiz
  const sportsQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Sports Quiz", ru: "Спортивный квиз" },
      plays: 185,
      questionCount: 10,
      level: "easy",
      questions: {
        create: [
          {
            topic: { en: "Football", ru: "Футбол" },
            question_text: {
              en: "How many players are there on the field for one football team during play?",
              ru: "Сколько игроков на поле у одной футбольной команды во время игры?",
            },
            options: [
              { en: "9", ru: "9" },
              { en: "10", ru: "10" },
              { en: "11", ru: "11" },
              { en: "12", ru: "12" },
            ],
            correct_answer: { en: "11", ru: "11" },
          },
          {
            topic: { en: "Basketball", ru: "Баскетбол" },
            question_text: {
              en: "How many points is a shot from beyond the three‑point line worth?",
              ru: "Сколько очков приносит бросок из-за трехочковой линии?",
            },
            options: [
              { en: "2", ru: "2" },
              { en: "3", ru: "3" },
              { en: "4", ru: "4" },
              { en: "1", ru: "1" },
            ],
            correct_answer: { en: "3", ru: "3" },
          },
          {
            topic: { en: "Tennis", ru: "Теннис" },
            question_text: {
              en: "What is the term for a score of zero in tennis?",
              ru: "Как называется счет ноль в теннисе?",
            },
            options: [
              { en: "Zero", ru: "Ноль" },
              { en: "Love", ru: "Лав" },
              { en: "Blank", ru: "Пусто" },
              { en: "Nil", ru: "Ниль" },
            ],
            correct_answer: { en: "Love", ru: "Лав" },
          },
          {
            topic: { en: "Olympics", ru: "Олимпийские игры" },
            question_text: {
              en: "How often are the Summer Olympic Games held?",
              ru: "Как часто проводятся летние Олимпийские игры?",
            },
            options: [
              { en: "Every 2 years", ru: "Каждые 2 года" },
              { en: "Every 3 years", ru: "Каждые 3 года" },
              { en: "Every 4 years", ru: "Каждые 4 года" },
              { en: "Every 5 years", ru: "Каждые 5 лет" },
            ],
            correct_answer: {
              en: "Every 4 years",
              ru: "Каждые 4 года",
            },
          },
          {
            topic: { en: "Athletics", ru: "Лёгкая атлетика" },
            question_text: {
              en: "How long is a standard outdoor running track in one lap?",
              ru: "Какова длина одного круга на стандартном открытом беговом треке?",
            },
            options: [
              { en: "200 meters", ru: "200 метров" },
              { en: "300 meters", ru: "300 метров" },
              { en: "400 meters", ru: "400 метров" },
              { en: "800 meters", ru: "800 метров" },
            ],
            correct_answer: { en: "400 meters", ru: "400 метров" },
          },
          {
            topic: { en: "Chess", ru: "Шахматы" },
            question_text: {
              en: "Which chess piece can move any number of squares vertically or horizontally?",
              ru: "Какая шахматная фигура может ходить на любое количество клеток вертикально или горизонтально?",
            },
            options: [
              { en: "Bishop", ru: "Слон" },
              { en: "Rook", ru: "Ладья" },
              { en: "Knight", ru: "Конь" },
              { en: "King", ru: "Король" },
            ],
            correct_answer: { en: "Rook", ru: "Ладья" },
          },
          {
            topic: { en: "Winter Sports", ru: "Зимние виды спорта" },
            question_text: {
              en: "In which sport do athletes race down an ice track on a small sled lying face down?",
              ru: "В каком виде спорта спортсмены мчатся по ледяной трассе на маленьких санях лёжа лицом вниз?",
            },
            options: [
              { en: "Luge", ru: "Санный спорт" },
              { en: "Skeleton", ru: "Скелетон" },
              { en: "Bobsleigh", ru: "Бобслей" },
              { en: "Speed skating", ru: "Конькобежный спорт" },
            ],
            correct_answer: { en: "Skeleton", ru: "Скелетон" },
          },
          {
            topic: { en: "Cricket", ru: "Крикет" },
            question_text: {
              en: "What is the name of the player who delivers the ball in cricket?",
              ru: "Как называется игрок, подающий мяч в крикете?",
            },
            options: [
              { en: "Bowler", ru: "Боулер" },
              { en: "Pitcher", ru: "Питчер" },
              { en: "Striker", ru: "Форвард" },
              { en: "Keeper", ru: "Кипер" },
            ],
            correct_answer: { en: "Bowler", ru: "Боулер" },
          },
          {
            topic: { en: "Table Tennis", ru: "Настольный теннис" },
            question_text: {
              en: "What is the maximum number of points in a standard game of table tennis?",
              ru: "До какого максимального количества очков играют в стандартном матче по настольному теннису?",
            },
            options: [
              { en: "11", ru: "11" },
              { en: "15", ru: "15" },
              { en: "21", ru: "21" },
              { en: "25", ru: "25" },
            ],
            correct_answer: { en: "11", ru: "11" },
          },
          {
            topic: { en: "Swimming", ru: "Плавание" },
            question_text: {
              en: "Which swimming stroke is swum on the back with an alternating arm motion?",
              ru: "Какой стиль плавания выполняется на спине с попеременными движениями рук?",
            },
            options: [
              { en: "Breaststroke", ru: "Брасс" },
              { en: "Backstroke", ru: "На спине" },
              { en: "Butterfly", ru: "Баттерфляй" },
              { en: "Freestyle", ru: "Кроль" },
            ],
            correct_answer: { en: "Backstroke", ru: "На спине" },
          },
        ],
      },
    },
  });

  // Literature Quiz
  const literatureQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Literature Quiz", ru: "Литературный квиз" },
      plays: 160,
      questionCount: 10,
      level: "medium",
      questions: {
        create: [
          {
            topic: { en: "Classic Novels", ru: "Классические романы" },
            question_text: {
              en: "Who wrote the novel 'Pride and Prejudice'?",
              ru: "Кто написал роман 'Гордость и предубеждение'?",
            },
            options: [
              { en: "Jane Austen", ru: "Джейн Остин" },
              { en: "Charlotte Brontë", ru: "Шарлотта Бронте" },
              { en: "Emily Brontë", ru: "Эмили Бронте" },
              { en: "George Eliot", ru: "Джордж Элиот" },
            ],
            correct_answer: { en: "Jane Austen", ru: "Джейн Остин" },
          },
          {
            topic: { en: "Drama", ru: "Драма" },
            question_text: {
              en: "Which playwright wrote 'Romeo and Juliet'?",
              ru: "Какой драматург написал 'Ромео и Джульетту'?",
            },
            options: [
              { en: "William Shakespeare", ru: "Уильям Шекспир" },
              { en: "Oscar Wilde", ru: "Оскар Уайльд" },
              { en: "Anton Chekhov", ru: "Антон Чехов" },
              { en: "Henrik Ibsen", ru: "Генрик Ибсен" },
            ],
            correct_answer: {
              en: "William Shakespeare",
              ru: "Уильям Шекспир",
            },
          },
          {
            topic: { en: "Poetry", ru: "Поэзия" },
            question_text: {
              en: "What is a fourteen‑line poem written in iambic pentameter called?",
              ru: "Как называется четырнадцатистрочное стихотворение в ямбическом пятистопном размере?",
            },
            options: [
              { en: "Ballad", ru: "Баллада" },
              { en: "Haiku", ru: "Хокку (хайку)" },
              { en: "Sonnet", ru: "Сонет" },
              { en: "Ode", ru: "Ода" },
            ],
            correct_answer: { en: "Sonnet", ru: "Сонет" },
          },
          {
            topic: { en: "Fantasy", ru: "Фэнтези" },
            question_text: {
              en: "Who is the author of 'The Hobbit'?",
              ru: "Кто является автором 'Хоббита'?",
            },
            options: [
              { en: "J. R. R. Tolkien", ru: "Дж. Р. Р. Толкин" },
              { en: "C. S. Lewis", ru: "Клайв Стейплз Льюис" },
              { en: "J. K. Rowling", ru: "Дж. К. Роулинг" },
              { en: "Terry Pratchett", ru: "Терри Пратчетт" },
            ],
            correct_answer: {
              en: "J. R. R. Tolkien",
              ru: "Дж. Р. Р. Толкин",
            },
          },
          {
            topic: { en: "Russian Literature", ru: "Русская литература" },
            question_text: {
              en: "Who wrote the novel 'Crime and Punishment'?",
              ru: "Кто написал роман 'Преступление и наказание'?",
            },
            options: [
              { en: "Fyodor Dostoevsky", ru: "Фёдор Достоевский" },
              { en: "Leo Tolstoy", ru: "Лев Толстой" },
              { en: "Nikolai Gogol", ru: "Николай Гоголь" },
              { en: "Ivan Turgenev", ru: "Иван Тургенев" },
            ],
            correct_answer: {
              en: "Fyodor Dostoevsky",
              ru: "Фёдор Достоевский",
            },
          },
          {
            topic: { en: "Children's Books", ru: "Детские книги" },
            question_text: {
              en: "In which book does the character Alice fall down a rabbit hole?",
              ru: "В какой книге героиня Алиса падает в кроличью нору?",
            },
            options: [
              {
                en: "Alice's Adventures in Wonderland",
                ru: "Алиса в Стране чудес",
              },
              { en: "Peter Pan", ru: "Питер Пэн" },
              { en: "The Wizard of Oz", ru: "Волшебник Изумрудного города" },
              { en: "Mary Poppins", ru: "Мэри Поппинс" },
            ],
            correct_answer: {
              en: "Alice's Adventures in Wonderland",
              ru: "Алиса в Стране чудес",
            },
          },
          {
            topic: { en: "Mythology", ru: "Мифология" },
            question_text: {
              en: "In Greek mythology, who is the king of the gods?",
              ru: "Кто в древнегреческой мифологии является царём богов?",
            },
            options: [
              { en: "Zeus", ru: "Зевс" },
              { en: "Poseidon", ru: "Посейдон" },
              { en: "Hades", ru: "Аид" },
              { en: "Apollo", ru: "Аполлон" },
            ],
            correct_answer: { en: "Zeus", ru: "Зевс" },
          },
          {
            topic: { en: "Literary Terms", ru: "Литературные термины" },
            question_text: {
              en: "What do you call a comparison using 'like' or 'as'?",
              ru: "Как называется сравнение с использованием 'как' или 'словно'?",
            },
            options: [
              { en: "Metaphor", ru: "Метафора" },
              { en: "Simile", ru: "Сравнение" },
              { en: "Irony", ru: "Ирония" },
              { en: "Alliteration", ru: "Аллитерация" },
            ],
            correct_answer: { en: "Simile", ru: "Сравнение" },
          },
          {
            topic: { en: "Modern Fiction", ru: "Современная проза" },
            question_text: {
              en: "What is the term for a novel that follows a character's development from youth to adulthood?",
              ru: "Как называется роман, прослеживающий развитие героя от юности до зрелости?",
            },
            options: [
              { en: "Detective novel", ru: "Детектив" },
              { en: "Bildungsroman", ru: "Роман воспитания" },
              { en: "Epic", ru: "Эпос" },
              { en: "Satire", ru: "Сатира" },
            ],
            correct_answer: {
              en: "Bildungsroman",
              ru: "Роман воспитания",
            },
          },
          {
            topic: { en: "Non‑fiction", ru: "Нон-фикшн" },
            question_text: {
              en: "What type of book is written about a person's own life by that person?",
              ru: "Как называется книга, в которой человек сам рассказывает историю своей жизни?",
            },
            options: [
              { en: "Biography", ru: "Биография" },
              { en: "Autobiography", ru: "Автобиография" },
              { en: "Essay", ru: "Эссе" },
              { en: "Manual", ru: "Руководство" },
            ],
            correct_answer: {
              en: "Autobiography",
              ru: "Автобиография",
            },
          },
        ],
      },
    },
  });

  // Food & Cooking Quiz
  const foodQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Food & Cooking Quiz", ru: "Квиз о еде и кулинарии" },
      plays: 175,
      questionCount: 10,
      level: "easy",
      questions: {
        create: [
          {
            topic: { en: "Cuisines", ru: "Кухни мира" },
            question_text: {
              en: "Sushi is a traditional dish from which country?",
              ru: "Суши — традиционное блюдо какой страны?",
            },
            options: [
              { en: "China", ru: "Китай" },
              { en: "Japan", ru: "Япония" },
              { en: "Korea", ru: "Корея" },
              { en: "Thailand", ru: "Таиланд" },
            ],
            correct_answer: { en: "Japan", ru: "Япония" },
          },
          {
            topic: { en: "Ingredients", ru: "Ингредиенты" },
            question_text: {
              en: "What main ingredient is hummus traditionally made from?",
              ru: "Из какого основного ингредиента традиционно готовят хумус?",
            },
            options: [
              { en: "Lentils", ru: "Чечевица" },
              { en: "Chickpeas", ru: "Нут" },
              { en: "Peas", ru: "Горох" },
              { en: "Beans", ru: "Фасоль" },
            ],
            correct_answer: { en: "Chickpeas", ru: "Нут" },
          },
          {
            topic: { en: "Baking", ru: "Выпечка" },
            question_text: {
              en: "What ingredient makes bread dough rise?",
              ru: "Какой ингредиент заставляет тесто для хлеба подниматься?",
            },
            options: [
              { en: "Salt", ru: "Соль" },
              { en: "Sugar", ru: "Сахар" },
              { en: "Yeast", ru: "Дрожжи" },
              { en: "Oil", ru: "Масло" },
            ],
            correct_answer: { en: "Yeast", ru: "Дрожжи" },
          },
          {
            topic: { en: "Spices", ru: "Специи" },
            question_text: {
              en: "Which spice is made from dried flower buds and is often used in mulled wine?",
              ru: "Какая специя производится из высушенных бутонов цветов и часто используется в глинтвейне?",
            },
            options: [
              { en: "Cinnamon", ru: "Корица" },
              { en: "Cloves", ru: "Гвоздика" },
              { en: "Nutmeg", ru: "Мускатный орех" },
              { en: "Cardamom", ru: "Кардамон" },
            ],
            correct_answer: { en: "Cloves", ru: "Гвоздика" },
          },
          {
            topic: { en: "Drinks", ru: "Напитки" },
            question_text: {
              en: "Espresso is a concentrated form of which drink?",
              ru: "Эспрессо — это концентрированная форма какого напитка?",
            },
            options: [
              { en: "Tea", ru: "Чай" },
              { en: "Coffee", ru: "Кофе" },
              { en: "Cocoa", ru: "Какао" },
              { en: "Juice", ru: "Сок" },
            ],
            correct_answer: { en: "Coffee", ru: "Кофе" },
          },
          {
            topic: { en: "Fruits", ru: "Фрукты" },
            question_text: {
              en: "Which fruit is known for having varieties called Granny Smith and Golden Delicious?",
              ru: "Какой фрукт известен сортами Грэнни Смит и Голден Делишес?",
            },
            options: [
              { en: "Apple", ru: "Яблоко" },
              { en: "Pear", ru: "Груша" },
              { en: "Plum", ru: "Слива" },
              { en: "Peach", ru: "Персик" },
            ],
            correct_answer: { en: "Apple", ru: "Яблоко" },
          },
          {
            topic: { en: "Vegetables", ru: "Овощи" },
            question_text: {
              en: "Which vegetable is the main ingredient in traditional borscht?",
              ru: "Какой овощ является основным ингредиентом традиционного борща?",
            },
            options: [
              { en: "Cabbage", ru: "Капуста" },
              { en: "Beetroot", ru: "Свёкла" },
              { en: "Carrot", ru: "Морковь" },
              { en: "Potato", ru: "Картофель" },
            ],
            correct_answer: { en: "Beetroot", ru: "Свёкла" },
          },
          {
            topic: { en: "Cooking Methods", ru: "Способы приготовления" },
            question_text: {
              en: "Which cooking method uses hot steam to cook food?",
              ru: "Какой способ приготовления использует горячий пар для приготовления пищи?",
            },
            options: [
              { en: "Frying", ru: "Жарка" },
              { en: "Boiling", ru: "Варка" },
              { en: "Steaming", ru: "Приготовление на пару" },
              { en: "Grilling", ru: "Гриль" },
            ],
            correct_answer: {
              en: "Steaming",
              ru: "Приготовление на пару",
            },
          },
          {
            topic: { en: "Desserts", ru: "Десерты" },
            question_text: {
              en: "Tiramisu is a popular dessert that usually contains which drink?",
              ru: "Тирамису — популярный десерт, который обычно содержит какой напиток?",
            },
            options: [
              { en: "Tea", ru: "Чай" },
              { en: "Coffee", ru: "Кофе" },
              { en: "Milk", ru: "Молоко" },
              { en: "Lemonade", ru: "Лимонад" },
            ],
            correct_answer: { en: "Coffee", ru: "Кофе" },
          },
          {
            topic: { en: "Nutrition", ru: "Питание" },
            question_text: {
              en: "Which nutrient is mainly responsible for building and repairing body tissues?",
              ru: "Какое питательное вещество главным образом отвечает за построение и восстановление тканей организма?",
            },
            options: [
              { en: "Carbohydrates", ru: "Углеводы" },
              { en: "Proteins", ru: "Белки" },
              { en: "Fats", ru: "Жиры" },
              { en: "Vitamins", ru: "Витамины" },
            ],
            correct_answer: { en: "Proteins", ru: "Белки" },
          },
        ],
      },
    },
  });

  // Travel & World Quiz
  const travelQuiz = await prisma.quiz.create({
    data: {
      title: { en: "Travel & World Quiz", ru: "Квиз о путешествиях и мире" },
      plays: 190,
      questionCount: 10,
      level: "medium",
      questions: {
        create: [
          {
            topic: { en: "Landmarks", ru: "Достопримечательности" },
            question_text: {
              en: "In which city can you visit the Colosseum?",
              ru: "В каком городе можно посетить Колизей?",
            },
            options: [
              { en: "Athens", ru: "Афины" },
              { en: "Rome", ru: "Рим" },
              { en: "Paris", ru: "Париж" },
              { en: "Istanbul", ru: "Стамбул" },
            ],
            correct_answer: { en: "Rome", ru: "Рим" },
          },
          {
            topic: { en: "Countries", ru: "Страны" },
            question_text: {
              en: "Which country is both an island and a continent?",
              ru: "Какая страна одновременно является и островом, и континентом?",
            },
            options: [
              { en: "Iceland", ru: "Исландия" },
              { en: "Japan", ru: "Япония" },
              { en: "Australia", ru: "Австралия" },
              { en: "New Zealand", ru: "Новая Зеландия" },
            ],
            correct_answer: { en: "Australia", ru: "Австралия" },
          },
          {
            topic: { en: "Cities", ru: "Города" },
            question_text: {
              en: "Which city is known as the 'Big Apple'?",
              ru: "Какой город известен как 'Большое яблоко'?",
            },
            options: [
              { en: "Los Angeles", ru: "Лос-Анджелес" },
              { en: "New York City", ru: "Нью-Йорк" },
              { en: "Chicago", ru: "Чикаго" },
              { en: "Boston", ru: "Бостон" },
            ],
            correct_answer: {
              en: "New York City",
              ru: "Нью-Йорк",
            },
          },
          {
            topic: { en: "Flags", ru: "Флаги" },
            question_text: {
              en: "Which country's flag is the only national flag that is not rectangular?",
              ru: "Флаг какой страны — единственный национальный флаг, который не является прямоугольным?",
            },
            options: [
              { en: "Switzerland", ru: "Швейцария" },
              { en: "Nepal", ru: "Непал" },
              { en: "Bhutan", ru: "Бутан" },
              { en: "Vatican City", ru: "Ватикан" },
            ],
            correct_answer: { en: "Nepal", ru: "Непал" },
          },
          {
            topic: { en: "Rivers", ru: "Реки" },
            question_text: {
              en: "The Nile River flows mainly through which continent?",
              ru: "Через какой континент в основном протекает река Нил?",
            },
            options: [
              { en: "Asia", ru: "Азия" },
              { en: "Africa", ru: "Африка" },
              { en: "Europe", ru: "Европа" },
              { en: "South America", ru: "Южная Америка" },
            ],
            correct_answer: { en: "Africa", ru: "Африка" },
          },
          {
            topic: { en: "Mountains", ru: "Горы" },
            question_text: {
              en: "Mount Everest is located in which mountain range?",
              ru: "В какой горной системе находится гора Эверест?",
            },
            options: [
              { en: "Andes", ru: "Анды" },
              { en: "Alps", ru: "Альпы" },
              { en: "Himalayas", ru: "Гималаи" },
              { en: "Caucasus", ru: "Кавказ" },
            ],
            correct_answer: { en: "Himalayas", ru: "Гималаи" },
          },
          {
            topic: { en: "Time Zones", ru: "Часовые пояса" },
            question_text: {
              en: "What is the name of the line where each day officially begins?",
              ru: "Как называется линия, где официально начинается новый день?",
            },
            options: [
              { en: "Equator", ru: "Экватор" },
              { en: "Prime Meridian", ru: "Нулевой меридиан" },
              { en: "International Date Line", ru: "Международная линия перемены дат" },
              { en: "Tropic of Cancer", ru: "Тропик Рака" },
            ],
            correct_answer: {
              en: "International Date Line",
              ru: "Международная линия перемены дат",
            },
          },
          {
            topic: { en: "Transport", ru: "Транспорт" },
            question_text: {
              en: "Which passenger aircraft is known for having two full‑length decks?",
              ru: "Какой пассажирский самолёт известен двумя полными пассажирскими палубами?",
            },
            options: [
              { en: "Boeing 737", ru: "Boeing 737" },
              { en: "Airbus A320", ru: "Airbus A320" },
              { en: "Boeing 747", ru: "Boeing 747" },
              { en: "Airbus A380", ru: "Airbus A380" },
            ],
            correct_answer: { en: "Airbus A380", ru: "Airbus A380" },
          },
          {
            topic: { en: "Islands", ru: "Острова" },
            question_text: {
              en: "Which is the largest island in the world that is not a continent?",
              ru: "Каков самый большой в мире остров, который не является континентом?",
            },
            options: [
              { en: "Greenland", ru: "Гренландия" },
              { en: "Borneo", ru: "Борнео" },
              { en: "Madagascar", ru: "Мадагаскар" },
              { en: "New Guinea", ru: "Новая Гвинея" },
            ],
            correct_answer: { en: "Greenland", ru: "Гренландия" },
          },
          {
            topic: { en: "Currencies", ru: "Валюты" },
            question_text: {
              en: "Which currency is used in the United Kingdom?",
              ru: "Какая валюта используется в Соединённом Королевстве?",
            },
            options: [
              { en: "Euro", ru: "Евро" },
              { en: "US dollar", ru: "Доллар США" },
              { en: "Pound sterling", ru: "Фунт стерлингов" },
              { en: "Swiss franc", ru: "Швейцарский франк" },
            ],
            correct_answer: {
              en: "Pound sterling",
              ru: "Фунт стерлингов",
            },
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
