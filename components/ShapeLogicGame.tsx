"use client";
import { useState } from "react";
import { ShapeType } from "@/types/game";
import { GameHeader } from "./GameHeader";
import { GameGrid } from "./GameGrid";
import { ShapeOption } from "./ShapeOption";
import { GameTimer } from "./GameTimer";
import { GameResult } from "./GameResult";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGame } from "@/hooks/useGames";

export function ShapeLogicGame() {
  const { gameState, submitAnswer, handleTimeUp, startGame } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<ShapeType | null>(null);

  const handleOptionClick = (shape: ShapeType) => {
    if (gameState.showResult || !gameState.isPlaying) return;
    setSelectedAnswer(shape);
    submitAnswer(shape);
  };

  const handleStartGame = () => {
    setSelectedAnswer(null);
    startGame();
  };

  const isGameComplete = gameState.currentAttempt > 15;
  const lastResult = gameState.gameHistory[gameState.gameHistory.length - 1];

  if (!gameState.currentGameData && !isGameComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-game bg-clip-text text-transparent">
              Shape Logic Puzzle
            </h1>
            <p className="text-muted-foreground">
              Complete the grid patterns using unique shapes per row and column
            </p>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-semibold text-foreground">Section 1</div>
                <div>3×3 Grid</div>
                <div>3 Shapes</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Section 2</div>
                <div>4×4 Grid</div>
                <div>4 Shapes</div>
              </div>
              <div>
                <div className="font-semibold text-foreground">Section 3</div>
                <div>5×5 Grid</div>
                <div>5 Shapes</div>
              </div>
            </div>
            <div className="text-center space-y-1">
              <div>• 20 seconds per attempt</div>
              <div>• +1 point for correct, -1 for wrong/timeout</div>
              <div>• Each row and column has unique shapes</div>
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            size="lg"
            className="w-full bg-gradient-game hover:opacity-90 text-white font-semibold"
          >
            Start Game
          </Button>
        </Card>
      </div>
    );
  }

  if (isGameComplete) {
    const finalScore = gameState.score;
    const correctAnswers = gameState.gameHistory.filter(
      (h) => h.correct
    ).length;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-game bg-clip-text text-transparent">
              Game Complete!
            </h1>
            <p className="text-muted-foreground">
              You've completed all 15 attempts
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {finalScore}
                </div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-game-correct">
                  {correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-game-incorrect">
                  {15 - correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Incorrect</div>
              </div>
            </div>

            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="text-2xl font-bold text-foreground">
                {Math.round((correctAnswers / 15) * 100)}%
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartGame}
            size="lg"
            className="w-full bg-gradient-game hover:opacity-90 text-white font-semibold"
          >
            Play Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <GameHeader
          currentSection={gameState.currentSection}
          currentAttempt={gameState.currentAttempt}
          score={gameState.score}
        />

        <div className="flex flex-col items-center space-y-8">
          {!gameState.showResult && (
            <GameTimer
              timeLeft={gameState.timeLeft}
              onTimeUp={handleTimeUp}
              isRunning={gameState.isPlaying}
              maxTime={20}
            />
          )}

          <div className="my-8">
            <GameGrid
              grid={gameState.currentGameData?.grid ?? []}
              showAnswers={gameState.showResult}
            />
          </div>

          {gameState.showResult && lastResult ? (
            <GameResult
              isCorrect={lastResult.correct}
              correctAnswer={lastResult.correctAnswer}
              userAnswer={lastResult.userAnswer}
              timeUp={!lastResult.userAnswer}
            />
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              <h3 className="text-xl font-semibold text-center">
                What shape belongs in the highlighted cell?
              </h3>

              <div
                className={`grid gap-4 justify-center grid-cols-${gameState.currentGameData?.options.length}`}
              >
                {gameState.currentGameData?.options?.map((shape) => (
                  <ShapeOption
                    key={shape}
                    shape={shape}
                    onClick={() => handleOptionClick(shape)}
                    isSelected={selectedAnswer === shape}
                    disabled={gameState.showResult || !gameState.isPlaying}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
