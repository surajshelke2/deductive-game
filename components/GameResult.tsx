import { ShapeType } from '@/types/game';
import { Shape } from './Shape';

interface GameResultProps {
  isCorrect: boolean;
  correctAnswer: ShapeType;
  userAnswer?: ShapeType;
  timeUp?: boolean;
}

export function GameResult({ isCorrect, correctAnswer, userAnswer, timeUp }: GameResultProps) {
  return (
    <div className="text-center space-y-4 p-6 rounded-xl bg-card border shadow-lg">
      <div className="space-y-2">
        <div 
          className={`text-2xl font-bold ${
            isCorrect ? 'text-game-correct' : 'text-game-incorrect'
          }`}
        >
          {isCorrect ? '✓ Correct!' : timeUp ? '⏰ Time Up!' : '✗ Incorrect'}
        </div>
        
        <div className="text-sm text-muted-foreground">
          {isCorrect ? '+1 point' : '-1 point'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-medium text-muted-foreground">
          Correct Answer:
        </div>
        <div className="flex justify-center">
          <Shape type={correctAnswer} size="lg" />
        </div>
        
        {userAnswer && !isCorrect && (
          <>
            <div className="text-sm font-medium text-muted-foreground">
              Your Answer:
            </div>
            <div className="flex justify-center opacity-60">
              <Shape type={userAnswer} size="lg" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}