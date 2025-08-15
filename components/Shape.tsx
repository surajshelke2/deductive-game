import { ShapeType } from '@/types/game';
import { getShapeColor, getShapeIcon } from '@/utils/gameLogic';
import { cn } from '../lib/utils';

interface ShapeProps {
  type: ShapeType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Shape({ type, size = 'md', className }: ShapeProps) {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold transition-all duration-200',
        sizeClasses[size],
        `text-${getShapeColor(type)}`,
        className
      )}
    >
      {getShapeIcon(type)}
    </span>
  );
}