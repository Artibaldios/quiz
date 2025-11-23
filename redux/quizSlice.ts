import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuestionWithAnswer {
  question_text: string;
  options: string[];
  correct_answer: string;
  topic: string;
  user_answer: string;
}

export interface QuizResult {
  score: number;
  totalCorrect: number;
  totalQuestions: number;
  topicScores: Record<string, { correct: number; total: number }>;
  questionsWithAnswers?: QuestionWithAnswer[];
}

interface QuizState {
  quizResult: QuizResult | null;
}

const initialState: QuizState = {
  quizResult: null,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    addQuizResult(state, action: PayloadAction<QuizResult>) {
      state.quizResult = (action.payload);
    },
    resetQuiz(state) {
      state.quizResult = null;
    },
  },
});

export const { addQuizResult, resetQuiz } = quizSlice.actions;

export default quizSlice.reducer;