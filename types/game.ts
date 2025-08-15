export type ShapeType = 'circle' | 'triangle' | 'star' | 'cross' | 'square';

export interface GameConfig {
  gridSize: number;
  totalShapes: number;
  optionsCount: number;
  visibleCells: number;
}

export interface GameSection {
  sectionNumber: 1 | 2 | 3;
  config: GameConfig;
}

export interface GameCell {
  row: number;
  col: number;
  shape: ShapeType | null;
  isVisible: boolean;
  isQuestion: boolean;
}

export interface GameAttempt {
  grid: GameCell[][];
  correctAnswer: ShapeType;
  options: ShapeType[];
  questionPosition: { row: number; col: number };
}

export interface GameState {
  currentSection: number;
  currentAttempt: number;
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  showResult: boolean;
  currentGameData: GameAttempt | null;
  gameHistory: {
    attempt: number;
    correct: boolean;
    userAnswer?: ShapeType;
    correctAnswer: ShapeType;
  }[];
}