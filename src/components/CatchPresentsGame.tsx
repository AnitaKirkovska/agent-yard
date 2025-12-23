import { useState, useEffect, useCallback, useRef } from "react";
import { Gift, X, Trophy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Present {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
}

const COLORS = [
  "text-red-500",
  "text-green-500", 
  "text-primary",
  "text-yellow-500",
  "text-pink-500",
];

const GAME_WIDTH = 320;
const GAME_HEIGHT = 400;
const BASKET_WIDTH = 60;
const CATCH_ZONE = 40;

export const CatchPresentsGame = ({ onClose }: { onClose: () => void }) => {
  const [presents, setPresents] = useState<Present[]>([]);
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("catchPresentsHighScore");
    return saved ? parseInt(saved) : 0;
  });
  const gameRef = useRef<HTMLDivElement>(null);
  const presentIdRef = useRef(0);

  // Spawn presents
  useEffect(() => {
    if (gameOver) return;
    
    const spawnInterval = setInterval(() => {
      const newPresent: Present = {
        id: presentIdRef.current++,
        x: Math.random() * (GAME_WIDTH - 30),
        y: -30,
        speed: 2 + Math.random() * 2 + score * 0.05,
        size: 24 + Math.random() * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
      setPresents(prev => [...prev, newPresent]);
    }, 1000 - Math.min(score * 10, 500));

    return () => clearInterval(spawnInterval);
  }, [gameOver, score]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setPresents(prev => {
        const updated: Present[] = [];
        let caught = 0;
        let missed = 0;

        prev.forEach(present => {
          const newY = present.y + present.speed;
          
          // Check if caught
          const presentCenterX = present.x + present.size / 2;
          const basketLeft = basketX;
          const basketRight = basketX + BASKET_WIDTH;
          const inCatchZone = newY >= GAME_HEIGHT - CATCH_ZONE && newY <= GAME_HEIGHT;
          
          if (inCatchZone && presentCenterX >= basketLeft && presentCenterX <= basketRight) {
            caught++;
            return;
          }
          
          // Check if missed
          if (newY > GAME_HEIGHT) {
            missed++;
            return;
          }
          
          updated.push({ ...present, y: newY });
        });

        if (caught > 0) {
          setScore(s => s + caught * 10);
        }
        if (missed > 0) {
          setLives(l => {
            const newLives = l - missed;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return Math.max(0, newLives);
          });
        }

        return updated;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameOver, basketX]);

  // Save high score
  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem("catchPresentsHighScore", score.toString());
    }
  }, [gameOver, score, highScore]);

  // Mouse/touch controls
  const handleMove = useCallback((clientX: number) => {
    if (!gameRef.current || gameOver) return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = clientX - rect.left - BASKET_WIDTH / 2;
    setBasketX(Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, x)));
  }, [gameOver]);

  const handleMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const restartGame = () => {
    setPresents([]);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setBasketX(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-display font-semibold text-foreground">{score}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 transition-colors ${
                    i < lives ? "text-red-500 fill-red-500" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Game Area */}
        <div
          ref={gameRef}
          className="relative bg-gradient-to-b from-primary/5 to-primary/10 cursor-none select-none"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Falling Presents */}
          {presents.map(present => (
            <div
              key={present.id}
              className={`absolute transition-none ${present.color}`}
              style={{
                left: present.x,
                top: present.y,
                fontSize: present.size,
              }}
            >
              <Gift className="w-full h-full" style={{ width: present.size, height: present.size }} />
            </div>
          ))}

          {/* Basket */}
          <div
            className="absolute bottom-2 transition-none"
            style={{ left: basketX, width: BASKET_WIDTH }}
          >
            <div className="h-10 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-xl border-2 border-amber-900 flex items-center justify-center">
              <div className="w-full h-2 bg-amber-700 rounded-full mx-2" />
            </div>
            <div className="h-2 bg-amber-900 rounded-b-lg mx-1" />
          </div>

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-4 animate-fade-in">
              <Gift className="w-16 h-16 text-primary animate-bounce" />
              <h3 className="font-display text-2xl font-bold text-foreground">Game Over!</h3>
              <div className="text-center space-y-1">
                <p className="text-lg text-foreground">Score: <span className="font-bold text-primary">{score}</span></p>
                {score >= highScore && score > 0 && (
                  <p className="text-sm text-yellow-500 font-semibold">🎉 New High Score!</p>
                )}
                <p className="text-sm text-muted-foreground">Best: {highScore}</p>
              </div>
              <Button onClick={restartGame} className="gap-2">
                <Gift className="w-4 h-4" />
                Play Again
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-muted/30 text-center">
          <p className="text-xs text-muted-foreground">
            Move {typeof window !== 'undefined' && 'ontouchstart' in window ? 'finger' : 'mouse'} to catch presents!
          </p>
        </div>
      </div>
    </div>
  );
};
