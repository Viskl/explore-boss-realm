
import { useState, useEffect } from "react";
import { Circle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TicTacToeGameProps {
  onComplete: (success: boolean) => void;
  difficulty: "rare" | "epic" | "legendary";
}

type Player = "X" | "O" | null;
type Board = (Player)[][];

const TicTacToeGame = ({ onComplete, difficulty }: TicTacToeGameProps) => {
  const [board, setBoard] = useState<Board>(Array(3).fill(null).map(() => Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  
  // Number of games needed to win based on difficulty
  const gamesToWin = {
    rare: 1,
    epic: 2,
    legendary: 3
  };

  // Handle player move
  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || winner) return;
    
    // Player's move
    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    // Check if player won
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      handleGameEnd(gameWinner);
      return;
    }
    
    // AI's turn
    setCurrentPlayer("O");
    setTimeout(makeAiMove, 500, newBoard);
  };

  // AI move
  const makeAiMove = (currentBoard: Board) => {
    if (winner) return;
    
    // Find empty cells
    const emptyCells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!currentBoard[i][j]) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    
    if (emptyCells.length === 0) {
      handleGameEnd("draw");
      return;
    }
    
    // Make a move (simple AI)
    const aiMove = findBestMove(currentBoard);
    const newBoard = [...currentBoard];
    newBoard[aiMove.row][aiMove.col] = "O";
    setBoard(newBoard);
    
    // Check if AI won
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      handleGameEnd(gameWinner);
      return;
    }
    
    setCurrentPlayer("X");
  };
  
  // AI logic to find best move
  const findBestMove = (currentBoard: Board) => {
    // Check if AI can win in one move
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!currentBoard[i][j]) {
          const boardCopy = JSON.parse(JSON.stringify(currentBoard));
          boardCopy[i][j] = "O";
          if (checkWinner(boardCopy) === "O") {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // Check if player can win in one move and block
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!currentBoard[i][j]) {
          const boardCopy = JSON.parse(JSON.stringify(currentBoard));
          boardCopy[i][j] = "X";
          if (checkWinner(boardCopy) === "X") {
            return { row: i, col: j };
          }
        }
      }
    }
    
    // Try to take center
    if (!currentBoard[1][1]) {
      return { row: 1, col: 1 };
    }
    
    // Try to take corners
    const corners = [
      { row: 0, col: 0 },
      { row: 0, col: 2 },
      { row: 2, col: 0 },
      { row: 2, col: 2 }
    ];
    
    const availableCorners = corners.filter(
      ({ row, col }) => !currentBoard[row][col]
    );
    
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // Take any available side
    const sides = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 1 }
    ];
    
    const availableSides = sides.filter(
      ({ row, col }) => !currentBoard[row][col]
    );
    
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }
    
    // Shouldn't reach here if the board validation is correct
    return { row: 0, col: 0 };
  };

  // Check for winner
  const checkWinner = (currentBoard: Board): Player | "draw" | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[i][0] &&
        currentBoard[i][0] === currentBoard[i][1] &&
        currentBoard[i][1] === currentBoard[i][2]
      ) {
        return currentBoard[i][0];
      }
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        currentBoard[0][i] &&
        currentBoard[0][i] === currentBoard[1][i] &&
        currentBoard[1][i] === currentBoard[2][i]
      ) {
        return currentBoard[0][i];
      }
    }
    
    // Check diagonals
    if (
      currentBoard[0][0] &&
      currentBoard[0][0] === currentBoard[1][1] &&
      currentBoard[1][1] === currentBoard[2][2]
    ) {
      return currentBoard[0][0];
    }
    
    if (
      currentBoard[0][2] &&
      currentBoard[0][2] === currentBoard[1][1] &&
      currentBoard[1][1] === currentBoard[2][0]
    ) {
      return currentBoard[0][2];
    }
    
    // Check for draw
    let isDraw = true;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (!currentBoard[i][j]) {
          isDraw = false;
          break;
        }
      }
      if (!isDraw) break;
    }
    
    return isDraw ? "draw" : null;
  };
  
  // Handle game end
  const handleGameEnd = (result: Player | "draw") => {
    setWinner(result);
    setGameCount(prev => prev + 1);
    
    if (result === "X") {
      setPlayerScore(prev => prev + 1);
    } else if (result === "O") {
      setAiScore(prev => prev + 1);
    }
    
    setTimeout(resetBoard, 1500);
  };
  
  // Reset board for next game
  const resetBoard = () => {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setCurrentPlayer("X");
    setWinner(null);
    
    // Check if challenge is complete
    if (playerScore >= gamesToWin[difficulty]) {
      onComplete(true);
    } else if (aiScore >= gamesToWin[difficulty]) {
      onComplete(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center mb-2">Tic-Tac-Toe Challenge</h2>
        <p className="text-sm text-center text-muted-foreground mb-4">
          {winner 
            ? winner === "X" 
              ? "You won!" 
              : winner === "O" 
                ? "AI won!" 
                : "It's a draw!"
            : `Your turn (X)`}
        </p>
        
        <div className="flex justify-center items-center gap-8 mb-4">
          <div className="text-center">
            <span className="block text-sm font-medium">You</span>
            <span className="block text-2xl font-bold">{playerScore}</span>
          </div>
          
          <div className="px-4 py-1 bg-gray-100 rounded-full text-sm font-medium">
            {gameCount} of {playerScore + aiScore + (winner ? 0 : 1)} games
          </div>
          
          <div className="text-center">
            <span className="block text-sm font-medium">AI</span>
            <span className="block text-2xl font-bold">{aiScore}</span>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mb-4">
          Win {gamesToWin[difficulty]} game{gamesToWin[difficulty] > 1 ? 's' : ''} to complete the challenge
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4 max-w-[300px] mx-auto">
        {board.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                h-24 w-full flex items-center justify-center 
                bg-gray-100 hover:bg-gray-200 rounded-lg
                border-2 transition-colors
                ${cell ? 'cursor-default' : 'cursor-pointer'}
                ${winner ? 'pointer-events-none' : ''}
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={!!cell || !!winner || currentPlayer === "O"}
            >
              {cell === "X" ? (
                <X className="h-10 w-10 text-blue-500" />
              ) : cell === "O" ? (
                <Circle className="h-10 w-10 text-red-500" />
              ) : null}
            </button>
          ))
        )}
      </div>
      
      {(playerScore >= gamesToWin[difficulty] || aiScore >= gamesToWin[difficulty]) && (
        <div className="text-center">
          <div className={`text-lg font-bold mb-3 ${playerScore > aiScore ? 'text-green-600' : 'text-red-600'}`}>
            {playerScore > aiScore 
              ? "Congratulations! Challenge complete!" 
              : "Challenge failed. Try again!"}
          </div>
          <Button onClick={() => onComplete(playerScore >= gamesToWin[difficulty])}>
            {playerScore >= gamesToWin[difficulty] ? "Claim Reward" : "Try Again"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;
