import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

// Constants
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const DIRECTIONS = {
  38: { x: 0, y: -1 }, // up
  40: { x: 0, y: 1 },  // down
  37: { x: -1, y: 0 }, // left
  39: { x: 1, y: 0 }   // right
};

// Custom hook for game logic
function useGameState() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(DIRECTIONS[39]);
  const [gameOver, setGameOver] = useState(true);
  const [speed, setSpeed] = useState(200);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(prevSnake => {
      const newHead = { 
        x: (prevSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE, 
        y: (prevSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
      };
      
      // Check collision with self
      if (prevSnake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
        setSpeed(s => s > 50 ? s - 10 : s); // Increase speed
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, gameOver, food]);

  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(moveSnake, speed);
      return () => clearInterval(gameLoop);
    }
  }, [moveSnake, gameOver, speed]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 5, y: 5 });
    setDirection(DIRECTIONS[39]);
    setGameOver(false);
    setSpeed(200);
  };

  return { snake, food, gameOver, setDirection, startGame };
}

function Grid() {
  const { snake, food, gameOver, setDirection, startGame } = useGameState();

  useEffect(() => {
    const handleKeyPress = (e) => {
      const newDir = DIRECTIONS[e.keyCode];
      if (newDir && Math.abs(newDir.x + snake[0].x) !== 1 && Math.abs(newDir.y + snake[0].y) !== 1) {
        setDirection(newDir);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [snake, setDirection]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className={`grid grid-cols-${GRID_SIZE} gap-1`} style={{ width: 'min(90vw, 90vh)', height: 'min(90vw, 90vh)' }}>
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;
          return <div key={i} className={`w-full h-full ${isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-gray-200'} rounded`}></div>;
        })}
      </div>
      {gameOver && <Button onClick={startGame}>Start Game</Button>}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Grid />
    </div>
  );
}