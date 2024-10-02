import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{x: 10, y: 10}];
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [heart, setHeart] = useState(getRandomHeart());
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!isGameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      setSnake(s => {
        const newHead = {
          x: (s[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (s[0].y + direction.y + GRID_SIZE) % GRID_SIZE
        };

        if (s.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          clearInterval(gameLoop);
          setGameOver(true);
          return s;
        }

        const newSnake = [newHead, ...s];
        if (newHead.x === heart.x && newHead.y === heart.y) {
          setHeart(getRandomHeart(snake));
          return newSnake;
        } else {
          newSnake.pop();
          return newSnake;
        }
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, isGameRunning, heart, gameOver, snake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key] && isGameRunning) {
        setDirection(DIRECTIONS[e.key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameRunning]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setHeart(getRandomHeart());
    setDirection(DIRECTIONS.ArrowRight);
    setIsGameRunning(true);
    setGameOver(false);
  };

  const getRandomHeart = (existingSnake = []) => {
    let newHeart;
    do {
      newHeart = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (existingSnake.some(s => s.x === newHeart.x && s.y === newHeart.y));
    return newHeart;
  };

  const isWin = snake.length === GRID_SIZE * GRID_SIZE;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Snake Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[repeat(var(--grid-size),1fr)] gap-1" style={{ '--grid-size': GRID_SIZE }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              return (
                <div 
                  key={index} 
                  className={`w-5 h-5 ${snake.some(s => s.x === x && s.y === y) ? 'bg-green-600' : 
                  (heart.x === x && heart.y === y ? 'bg-red-500' : 'bg-gray-200')}`}
                ></div>
              );
            })}
          </div>
          {gameOver && <p className="mt-4 text-center">Game Over!</p>}
          {isWin && <p className="mt-4 text-center">You Win!</p>}
        </CardContent>
        <Button onClick={startGame} disabled={isGameRunning && !gameOver && !isWin} className="mt-4">
          {isGameRunning ? 'Game Running...' : 'Start Game'}
        </Button>
      </Card>
    </div>
  );
}

export default App;