import { GameCell } from '@/types/game';
import { Shape } from './Shape';
import { cn } from '../lib/utils';

interface GameGridProps {
  grid: GameCell[][];
  showAnswers?: boolean;
}

export function GameGrid({ grid, showAnswers = false }: GameGridProps) {
  const gridSize = grid.length;
  
  const gridSizeClasses = {
    3: 'grid-cols-3 gap-3 max-w-[420px]',
    4: 'grid-cols-4 gap-3 max-w-[560px]',
    5: 'grid-cols-5 gap-2.5 max-w-[700px]',
  };

  return (
    <div className="flex justify-center">
      <div 
        className={cn(
          'grid bg-game-grid-bg rounded-2xl p-6 shadow-floating border border-game-cell-border',
          gridSizeClasses[gridSize as keyof typeof gridSizeClasses]
        )}
      >
        {grid.flat().map((cell, index) => (
          <div
            key={`${cell.row}-${cell.col}`}
            className={cn(
              'aspect-square rounded-xl border-3 border-game-cell-border bg-background flex items-center justify-center transition-all duration-200 shadow-cell',
              'hover:border-primary/30 hover:bg-game-cell-hover hover:scale-105',
              cell.isQuestion && !showAnswers && 'border-primary bg-primary/5 scale-105 shadow-game',
              showAnswers && cell.isQuestion && 'border-game-correct bg-game-correct/10 scale-105 shadow-floating'
            )}
          >
            {cell.isQuestion && !showAnswers ? (
              <span className="text-4xl font-bold text-primary">?</span>
            ) : (
              cell.shape && (cell.isVisible || showAnswers) && (
                <Shape 
                  type={cell.shape} 
                  size="lg"
                />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}