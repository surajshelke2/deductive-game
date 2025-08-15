import { ShapeType } from '@/types/game';
import { Shape } from './Shape';
import { cn } from '@/lib/utils';

interface ShapeOptionProps {
  shape: ShapeType;
  onClick: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  disabled?: boolean;
}

export function ShapeOption({ 
  shape, 
  onClick, 
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  disabled = false
}: ShapeOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center p-6 rounded-2xl border-3 transition-all duration-200',
        'hover:scale-110 hover:shadow-floating active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        !disabled && 'hover:border-primary/50 hover:bg-game-cell-hover',
        isSelected && !isCorrect && !isIncorrect && 'border-primary bg-primary/10 scale-110 shadow-game',
        isCorrect && 'border-game-correct bg-game-correct/10 scale-110 shadow-floating',
        isIncorrect && 'border-game-incorrect bg-game-incorrect/10 scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        !isSelected && !isCorrect && !isIncorrect && 'border-game-cell-border bg-background shadow-cell'
      )}
    >
      <Shape type={shape} size="lg" />
    </button>
  );
}