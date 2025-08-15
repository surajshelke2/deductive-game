import { useState, useEffect, useCallback } from 'react';
import { GameState, ShapeType } from '@/types/game';
import { generateGameAttempt, GAME_SECTIONS } from '@/utils/gameLogic';

// Each attempt gives the player 20 seconds
const TIMER_DURATION = 20;

export function useGame() {
  // Main game state: stores progress, timer, score, history, etc.
  const [gameState, setGameState] = useState<GameState>({
    currentSection: 1,      // Current section number (changes every 5 attempts)
    currentAttempt: 1,      // Attempt count from 1 to 15
    score: 0,               // Player's score
    timeLeft: TIMER_DURATION, // Countdown timer for the attempt
    isPlaying: false,       // Whether the attempt is active
    showResult: false,      // Whether to show correct/incorrect result screen
    currentGameData: null,  // The shapes & correct answer for the current attempt
    gameHistory: [],        // History of all attempts (answers, correctness, etc.)
  });

   /**
   * TIMER HANDLER
   * Runs every second when the game is active and time is left.
   * Reduces `timeLeft` by 1 until it reaches 0.
   */
  useEffect(() => {
    if (gameState.isPlaying && gameState.timeLeft > 0 && !gameState.showResult) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);

      // Cleanup to avoid multiple timers stacking up
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlaying, gameState.timeLeft, gameState.showResult]);

    /**
   * START NEW ATTEMPT
   * Chooses the correct section based on attempt number.
   * Generates shapes grid & correct answer for that attempt.
   */

  const startNewAttempt = useCallback(() => {
    // Determine which section to use (5 attempts per section)
    const currentSectionIndex = Math.ceil(gameState.currentAttempt / 5) - 1;
    const section = GAME_SECTIONS[currentSectionIndex];
    
    if (!section) {
       // No section found → all 15 attempts completed → stop game
      setGameState(prev => ({ ...prev, isPlaying: false }));
      return;
    }

    // Create new shapes + correct answer for this attempt
    const gameData = generateGameAttempt(section.config);
    
    // Update state to start playing this attempt
    setGameState(prev => ({
      ...prev,
      currentSection: section.sectionNumber,
      timeLeft: TIMER_DURATION,
      isPlaying: true,
      showResult: false,
      currentGameData: gameData,
    }));
  }, [gameState.currentAttempt]);

    /**
   * SUBMIT ANSWER
   * Checks if the selected shape is correct and updates score.
   * Then shows the result screen for 2 seconds before moving to next attempt.
   */
  const submitAnswer = useCallback((selectedShape: ShapeType) => {
    // Ignore if game data missing or result already shown
    if (!gameState.currentGameData || gameState.showResult) return;

    // Compare selected shape with the correct answer
    const isCorrect = selectedShape === gameState.currentGameData.correctAnswer;
    const scoreChange = isCorrect ? 1 : -1;

    // Update score, mark attempt as complete, and store attempt result
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
    // After 2s, move to next attempt (or finish game)
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

    /**
   * HANDLE TIME-UP
   * Called when the timer reaches 0 before an answer is given.
   * Automatically marks the attempt as incorrect and advances after 2s.
   */

  const handleTimeUp = useCallback(() => {
    // Ignore if no active game or result already shown
    if (!gameState.currentGameData || gameState.showResult) return;

     // Deduct point for time-out and store attempt result
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
   // After 2s, move to next attempt (or finish game
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


    /**
   * START GAME
   * Resets all game state back to initial values.
   */
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
  /**
   * LISTEN FOR ATTEMPT CHANGE
   * When `currentAttempt` changes, automatically start a new attempt
   * until 15 attempts are completed.
   */

  useEffect(() => {
    if (gameState.currentAttempt <= 15) {
      startNewAttempt();
    }
  }, [gameState.currentAttempt, startNewAttempt]);
 // Return methods & state so components can use them
  return {
    gameState,
    submitAnswer,
    handleTimeUp,
    startGame,
  };
}