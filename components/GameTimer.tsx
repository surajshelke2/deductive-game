import { useEffect } from 'react';
import { cn } from '../lib/utils';

interface GameTimerProps {
  timeLeft: number;
  onTimeUp: () => void;
  isRunning: boolean;
  maxTime: number;
}

export function GameTimer({ timeLeft, onTimeUp, isRunning, maxTime }: GameTimerProps) {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const percentage = (timeLeft / maxTime) * 100;
  const isWarning = percentage <= 50;
  const isDanger = percentage <= 25;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">Time</span>
        <span 
          className={cn(
            'text-lg font-bold tabular-nums transition-colors duration-200',
            isDanger && 'text-timer-danger animate-pulse',
            isWarning && !isDanger && 'text-timer-warning',
            !isWarning && 'text-foreground'
          )}
        >
          {timeLeft}s
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000 ease-linear rounded-full',
            isDanger && 'bg-timer-danger',
            isWarning && !isDanger && 'bg-timer-warning',
            !isWarning && 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}