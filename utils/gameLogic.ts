import { ShapeType, GameCell, GameAttempt, GameConfig } from '@/types/game';

// All available shape types for the game
export const SHAPES: ShapeType[] = ['circle', 'triangle', 'star', 'cross', 'square'];

// Game sections configuration
// Each section has a grid size, number of shapes, number of options, and visible cells count
export const GAME_SECTIONS = [
  { sectionNumber: 1, config: { gridSize: 3, totalShapes: 3, optionsCount: 3, visibleCells: 3 } },
  { sectionNumber: 2, config: { gridSize: 4, totalShapes: 4, optionsCount: 4, visibleCells: 6 } },
  { sectionNumber: 3, config: { gridSize: 5, totalShapes: 5, optionsCount: 5, visibleCells: 8 } },
] as const;

/* 
-------------------------------------------------
  Fisher–Yates Shuffle Algorithm
  - Randomly shuffles an array without bias
  - Returns a new shuffled array
-------------------------------------------------
*/
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy so original is not changed
  for (let i = shuffled.length - 1; i > 0; i--) {
    // Pick a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at i and j
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/*
-------------------------------------------------
  Validation: Check if a shape can be placed 
  at (row, col) without violating row/col uniqueness
-------------------------------------------------
*/
function isValidPlacement(
  grid: (ShapeType | null)[][],
  row: number,
  col: number,
  shape: ShapeType
): boolean {
  // Check the row for duplicates
  for (let c = 0; c < grid[row].length; c++) {
    if (c !== col && grid[row][c] === shape) {
      return false; // Duplicate found in row
    }
  }

  // Check the column for duplicates
  for (let r = 0; r < grid.length; r++) {
    if (r !== row && grid[r][col] === shape) {
      return false; // Duplicate found in column
    }
  }

  return true; // Placement is valid
}

/*
-------------------------------------------------
  Backtracking Algorithm: Generate a solved grid
  - Fills the grid so each row & col has unique shapes
  - Uses recursive DFS with backtracking
-------------------------------------------------
*/
function generateSolvedGrid(
  size: number,
  availableShapes: ShapeType[]
): (ShapeType | null)[][] {
  
  // Initialize empty grid (nulls)
  const grid: (ShapeType | null)[][] =
    Array(size).fill(null).map(() => Array(size).fill(null));
  
  // Recursive function to fill cells
  function backtrack(row: number, col: number): boolean {
    // Base case: If we filled all rows → success
    if (row === size) return true;

    // Move to next cell coordinates
    const nextRow = col === size - 1 ? row + 1 : row;
    const nextCol = col === size - 1 ? 0 : col + 1;

    // Try shapes in a random order
    const shuffledShapes = shuffleArray(availableShapes);

    for (const shape of shuffledShapes) {
      if (isValidPlacement(grid, row, col, shape)) {
        // Place shape
        grid[row][col] = shape;

        // Continue to next cell
        if (backtrack(nextRow, nextCol)) {
          return true; // Solution found
        }

        // Backtrack: Remove shape and try next
        grid[row][col] = null;
      }
    }

    return false; // No valid shape → backtrack
  }

  backtrack(0, 0); // Start from top-left
  return grid;
}

/*
-------------------------------------------------
  Create Game Cells from solved grid
  - Marks some cells as visible based on count
  - Others remain hidden
-------------------------------------------------
*/
function createGameCells(
  solvedGrid: (ShapeType | null)[][],
  visibleCount: number
): GameCell[][] {
  
  const size = solvedGrid.length;
  const cells: GameCell[][] = [];

  // Create cell objects for each position
  for (let row = 0; row < size; row++) {
    cells[row] = [];
    for (let col = 0; col < size; col++) {
      cells[row][col] = {
        row,
        col,
        shape: solvedGrid[row][col],
        isVisible: false,
        isQuestion: false,
      };
    }
  }

  // Create a list of all grid positions
  const allPositions = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      allPositions.push({ row, col });
    }
  }

  // Shuffle positions and mark first N as visible
  const shuffledPositions = shuffleArray(allPositions);
  for (let i = 0; i < Math.min(visibleCount, shuffledPositions.length); i++) {
    const { row, col } = shuffledPositions[i];
    cells[row][col].isVisible = true;
  }

  return cells;
}

/*
-------------------------------------------------
  Main Function: Generate one game attempt
  - Solves grid
  - Marks visible cells
  - Picks one question cell
  - Generates multiple-choice options
-------------------------------------------------
*/
export function generateGameAttempt(config: GameConfig): GameAttempt {
  const { gridSize, totalShapes, optionsCount, visibleCells } = config;

  // Select shapes for this game (slice from SHAPES)
  const availableShapes = SHAPES.slice(0, totalShapes);

  // Step 1: Generate solved grid
  const solvedGrid = generateSolvedGrid(gridSize, availableShapes);

  // Step 2: Convert grid into GameCell objects & mark visible cells
  const gameCells = createGameCells(solvedGrid, visibleCells);

  // Step 3: Collect hidden positions (where isVisible === false)
  const hiddenPositions = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!gameCells[row][col].isVisible) {
        hiddenPositions.push({ row, col });
      }
    }
  }

  // Safety check: Ensure there is at least one hidden cell
  if (hiddenPositions.length === 0) {
    throw new Error('No hidden positions available for question');
  }

  // Step 4: Pick a random question position from hidden cells
  const questionPosition =
    hiddenPositions[Math.floor(Math.random() * hiddenPositions.length)];
  
  const { row: qRow, col: qCol } = questionPosition;

  // Step 5: Mark this cell as the question
  gameCells[qRow][qCol].isQuestion = true;

  // Step 6: Correct answer is the shape in question cell
  const correctAnswer = gameCells[qRow][qCol].shape!;

  // Step 7: Create multiple-choice options
  const wrongAnswers = availableShapes.filter(shape => shape !== correctAnswer);
  const selectedWrongAnswers =
    shuffleArray(wrongAnswers).slice(0, optionsCount - 1);
  const options =
    shuffleArray([correctAnswer, ...selectedWrongAnswers]);

  // Step 8: Return full attempt object
  return {
    grid: gameCells,
    correctAnswer,
    options,
    questionPosition,
  };
}

/*
-------------------------------------------------
  Utility: Map shape type to CSS class
-------------------------------------------------
*/
export function getShapeColor(shape: ShapeType): string {
  const colorMap = {
    circle: 'game-circle',
    triangle: 'game-triangle', 
    star: 'game-star',
    cross: 'game-cross',
    square: 'game-square',
  };
  return colorMap[shape];
}

/*
-------------------------------------------------
  Utility: Map shape type to symbol/icon
-------------------------------------------------
*/
export function getShapeIcon(shape: ShapeType): string {
  const iconMap = {
    circle: '●',
    triangle: '▲',
    star: '★',
    cross: '✚',
    square: '■',
  };
  return iconMap[shape];
}
