export interface FetchedQuizData {
  title: string;
  category: string;
  id: number;
  level: string | null;
  plays: number;
  questionCount: number;
  createdAt: Date;
  questions: {
    id: number;
    topic: string;
    question_text: string;
    options: string[];
    correct_answer: string;
  }[]
}

export interface FetchedUserData {
  threeLatestQuizzes: QuizResult[];
  totalRightAnswers: number;
  totalQuestions: number;
  allUserQuizzes: QuizResult[];
  perfectScoreCount: number;
  uniqueQuizzesCount: number;
}

export interface QuizResult {
  id: number;
  quizId: number;
  score: number;
  createdAt: Date;
  quizTitle: string;
}

export interface LobbySettings {
  questionTimer: number;
  resultTimer: number;
  autoContinue: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isHost: boolean;
}

export interface LobbyData {
  lobbyCode: string;
  hostId: string;
  users: User[];
  settings: LobbySettings;
}

export interface UserResult {
  userId: string;
  username: string;
  answer: string;
  isCorrect: boolean;
  score: number;
}


export interface TotalScore {
  userId: string;
  name: string;
  score: number;
}

export interface UserAnsweredData {
  userId: string;
  username: string;
  questionIndex: number;
  answer: string;
  answeredUsers: number;
  allAnswered: boolean;
  allUsers: User[];
  totalUsers: number;
  score: number;
  answerTime?: number;
  isCorrect: boolean;
  correctAnswer?: string;
}