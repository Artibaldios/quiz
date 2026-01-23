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