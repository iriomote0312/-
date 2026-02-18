export interface Question {
  id: string;
  text: string;
  isCorrect: boolean; // true for O, false for X
  explanation: string;
}

export type QuizState = 'START' | 'LOADING' | 'QUIZ' | 'RESULT';

export interface QuizResult {
  score: number;
  total: number;
  history: {
    question: Question;
    userAnswer: boolean;
    isCorrect: boolean;
  }[];
}