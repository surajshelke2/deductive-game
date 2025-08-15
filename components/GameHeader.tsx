import { GAME_SECTIONS } from '@/utils/gameLogic';
import { cn } from '../lib/utils';

interface GameHeaderProps {
  currentSection: number;
  currentAttempt: number;
  score: number;
}

export function GameHeader({ currentSection, currentAttempt, score }: GameHeaderProps) {
  const section = GAME_SECTIONS[currentSection - 1];
  const attemptsInSection = 5; // 15 total / 3 sections
  const attemptInSection = ((currentAttempt - 1) % attemptsInSection) + 1;

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Score</div>
        </div>
        
        <div className="h-8 w-px bg-border" />
        
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{currentAttempt}/15</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Progress</div>
        </div>
      </div>
      
      {/* Section Progress */}
      <div className="flex justify-center gap-2">
        {GAME_SECTIONS.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 w-8 rounded-full transition-colors duration-300',
              index < currentSection - 1 && 'bg-game-correct',
              index === currentSection - 1 && 'bg-primary',
              index > currentSection - 1 && 'bg-muted'
            )}
          />
        ))}
      </div>
    </div>
  );
}