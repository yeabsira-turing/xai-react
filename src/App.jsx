import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GRID_SIZE = 13;
const INITIAL_SNAKE = [{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }];
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const getRandomHeart = (existingSnake = []) => {
  let newHeart;
  do {
    newHeart = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (existingSnake.some(s => s.x === newHeart.x && s.y === newHeart.y));
  return newHeart;
};

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [heart, setHeart] = useState(getRandomHeart());
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gameLoopRef = useRef();

  useEffect(() => {
    if (isGameRunning && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        setSnake(prevSnake => {
          const newHead = {
            x: prevSnake[0].x + direction.x,
            y: prevSnake[0].y + direction.y,
          };

          if (
            newHead.x < 0 ||
            newHead.x >= GRID_SIZE ||
            newHead.y < 0 ||
            newHead.y >= GRID_SIZE ||
            prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
          ) {
            setGameOver(true);
            setIsGameRunning(false);
            return prevSnake;
          }

          const newSnake = [newHead, ...prevSnake];

          if (newHead.x === heart.x && newHead.y === heart.y) {
            setHeart(getRandomHeart(newSnake));
            setScore(prevScore => prevScore + 1);
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }, 250);

      return () => clearInterval(gameLoopRef.current);
    }
    return () => {};
  }, [isGameRunning, gameOver, direction, heart]);

  useEffect(() => {
    if (gameOver && gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  }, [gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (DIRECTIONS[e.key] && isGameRunning) {
        setDirection(prevDirection => {
          const newDirection = DIRECTIONS[e.key];
          if (
            newDirection.x + prevDirection.x === 0 &&
            newDirection.y + prevDirection.y === 0
          ) {
            return prevDirection;
          }
          return newDirection;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameRunning]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setHeart(getRandomHeart(INITIAL_SNAKE));
    setDirection(DIRECTIONS.ArrowRight);
    setIsGameRunning(true);
    setGameOver(false);
    setScore(0);
  };

  const isWin = snake.length === GRID_SIZE * GRID_SIZE;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-indigo-800 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-2xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-gray-800">Snake Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center mb-4">
            <p className="text-gray-800 font-bold text-xl">
              Score: <span className="text-blue-600">{score}</span>
            </p>
          </div>
          <div
            className="grid gap-1 w-full max-w-xs mx-auto"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isSnake = snake.some(s => s.x === x && s.y === y);
              const isHeart = heart.x === x && heart.y === y;

              return (
                <div
                  key={index}
                  className={`w-4 h-4 sm:w-5 sm:h-5 border border-gray-200 ${
                    isSnake ? 'bg-green-500' : 'bg-gray-100'
                  } flex items-center justify-center`}
                >
                  {isHeart && (
                    <span className="text-red-500 text-sm sm:text-base">❤️</span>
                  )}
                </div>
              );
            })}
          </div>
          {gameOver && (
            <p className="mt-6 text-center text-red-600 font-bold text-xl">
              Game Over! Your score is: <span className="text-blue-600">{score}</span>
            </p>
          )}
          {isWin && (
            <p className="mt-6 text-center text-green-600 font-bold text-xl">
              You Win! Your score is: <span className="text-blue-600">{score}</span>
            </p>
          )}
        </CardContent>
        <div className="flex justify-center mb-6">
          <Button
            onClick={startGame}
            disabled={isGameRunning && !gameOver && !isWin}
            className={`mt-4 w-36 ${
              isGameRunning && !gameOver
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isGameRunning && !gameOver ? 'Running...' : 'Start Game'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default App;