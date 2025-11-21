
export interface Answer {
    text: string;
    correct: boolean;
}

export interface Question {
    id: number;
    question: string;
    hint?: string;
    answers: Answer[];
}

export interface UserProfile {
    password?: string;
    role: 'admin' | 'user';
    bestScore: number;
    totalQuizzes: number;
    isVisible: boolean;
    suspended?: boolean;
    theme?: string;
    shuffleAnswers?: boolean;
}

export interface User extends UserProfile {
    username: string;
}

export interface QuizHistoryItem {
    timestamp: string;
    score: number;
    total: number;
    percent: number;
    quizType: string;
}

export interface QuizSession {
    questions: Question[];
    index: number;
    score: number;
    type: string;
}

export interface GlobalData {
    questions: Question[];
}

export interface UserData {
    mistakes: number[]; // array of question IDs
    favorites: number[]; // array of question IDs
    history: QuizHistoryItem[];
    session: QuizSession | null;
}