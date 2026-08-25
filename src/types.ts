export type Language = 'vi' | 'en';

export interface QuestionItem {
  q: string;
  a: string;
}

export type GradeQuestionData = Record<string, Record<string, QuestionItem[]>>;

export type GameState = 'start' | 'countdown' | 'playing' | 'won';
export type GameMode = 'multiplayer' | 'ai' | 'time-trial';
export type Team = 'A' | 'B';
