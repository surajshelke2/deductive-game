import { useState, useEffect, useCallback } from 'react';
import { GameState, ShapeType } from '@/types/game';
import { generateGameAttempt, GAME_SECTIONS } from '@/utils/gameLogic';

const TIMER_DURATION = 20;

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentSection: 1,
    currentAttempt: 1,
    score: 0,
    timeLeft: TIMER_DURATION,
    isPlaying: false,
    showResult: false,
    currentGameData: null,
    gameHistory: [],
  });

  // Timer effect
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0 && !gameState.showResult) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, gameState.timeLeft, gameState.showResult]);

  const startNewAttempt = useCallback(() => {
    const currentSectionIndex = Math.ceil(gameState.currentAttempt / 5) - 1;
    const section = GAME_SECTIONS[currentSectionIndex];
    
    if (!section) {
      // Game completed
      setGameState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    const gameData = generateGameAttempt(section.config);
    
    setGameState(prev => ({
      ...prev,
      currentSection: section.sectionNumber,
      timeLeft: TIMER_DURATION,
      isPlaying: true,
      showResult: false,
      currentGameData: gameData,
    }));
  }, [gameState.currentAttempt]);

  const submitAnswer = useCallback((selectedShape: ShapeType) => {
    if (!gameState.currentGameData || gameState.showResult) return;

    const isCorrect = selectedShape === gameState.currentGameData.correctAnswer;
    const scoreChange = isCorrect ? 1 : -1;

    setGameState(prev => ({
      ...prev,
      score: prev.score + scoreChange,
      isPlaying: false,
      showResult: true,
      gameHistory: [...prev.gameHistory, {
        attempt: prev.currentAttempt,
        correct: isCorrect,
        userAnswer: selectedShape,
        correctAnswer: prev.currentGameData?.correctAnswer!,
      }],
    }));

    // Auto-advance after showing result
    setTimeout(() => {
      if (gameState.currentAttempt < 15) {
        setGameState(prev => ({
          ...prev,
          currentAttempt: prev.currentAttempt + 1,
        }));
      } else {
        // Game completed
        setGameState(prev => ({ ...prev, isPlaying: false }));
      }
    }, 2000);
  }, [gameState.currentGameData, gameState.showResult, gameState.currentAttempt]);

  const handleTimeUp = useCallback(() => {
    if (!gameState.currentGameData || gameState.showResult) return;

    setGameState(prev => ({
      ...prev,
      score: prev.score - 1,
      isPlaying: false,
      showResult: true,
      gameHistory: [...prev.gameHistory, {
        attempt: prev.currentAttempt,
        correct: false,
        correctAnswer: prev.currentGameData?.correctAnswer!,
      }],
    }));

    // Auto-advance after showing result
    setTimeout(() => {
      if (gameState.currentAttempt < 15) {
        setGameState(prev => ({
          ...prev,
          currentAttempt: prev.currentAttempt + 1,
        }));
      } else {
        // Game completed
        setGameState(prev => ({ ...prev, isPlaying: false }));
      }
    }, 2000);
  }, [gameState.currentGameData, gameState.showResult, gameState.currentAttempt]);

  const startGame = useCallback(() => {
    setGameState({
      currentSection: 1,
      currentAttempt: 1,
      score: 0,
      timeLeft: TIMER_DURATION,
      isPlaying: false,
      showResult: false,
      currentGameData: null,
      gameHistory: [],
    });
  }, []);

  // Start new attempt when currentAttempt changes
  useEffect(() => {
    if (gameState.currentAttempt <= 15) {
      startNewAttempt();
    }
  }, [gameState.currentAttempt, startNewAttempt]);

  return {
    gameState,
    submitAnswer,
    handleTimeUp,
    startGame,
  };
}