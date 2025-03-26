
import React, { useState, useRef, useEffect } from "react";
import { Sword } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwipeGameProps {
  onComplete: (success: boolean) => void;
  difficulty: "rare" | "epic" | "legendary";
  bossName: string;
}

interface SwipeTarget {
  id: number;
  x: number;
  y: number;
  hit: boolean;
  size: number;
  rotation: number;
  speed: number;
}

const SwipeGame: React.FC<SwipeGameProps> = ({ onComplete, difficulty, bossName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds game
  const [bossHealth, setBossHealth] = useState(100);
  const [swipes, setSwipes] = useState<{ x1: number, y1: number, x2: number, y2: number, active: boolean }[]>([]);
  const [targets, setTargets] = useState<SwipeTarget[]>([]);
  const [gameWon, setGameWon] = useState(false);
  
  // Game settings based on difficulty
  const difficultySettings = {
    rare: { 
      targetFrequency: 1000, // ms
      targetSpeed: 2,
      healthReduction: 10,
      bossHealthTotal: 100
    },
    epic: { 
      targetFrequency: 800,
      targetSpeed: 3,
      healthReduction: 7,
      bossHealthTotal: 150
    },
    legendary: { 
      targetFrequency: 600,
      targetSpeed: 4,
      healthReduction: 5,
      bossHealthTotal: 200
    }
  };
  
  const settings = difficultySettings[difficulty];
  
  // Start game
  const handleStart = () => {
    setGameStarted(true);
    setBossHealth(settings.bossHealthTotal);
    setTimeLeft(30);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };
  
  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        setGameOver(true);
        // Check if player won
        if (bossHealth <= 0) {
          setGameWon(true);
          onComplete(true);
        } else {
          onComplete(false);
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameOver, bossHealth, onComplete]);
  
  // Generate targets periodically
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const generateTarget = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Create a new target
      const newTarget: SwipeTarget = {
        id: Date.now(),
        x: Math.random() * (containerWidth - 100) + 50,
        y: Math.random() * (containerHeight - 100) + 50,
        hit: false,
        size: Math.random() * 30 + 30, // Random size between 30 and 60
        rotation: Math.random() * 360,
        speed: (Math.random() * 2 + 1) * settings.targetSpeed
      };
      
      setTargets(prev => [...prev, newTarget]);
    };
    
    const interval = setInterval(generateTarget, settings.targetFrequency);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, settings.targetFrequency, settings.targetSpeed]);
  
  // Move targets
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const animateTargets = () => {
      if (!containerRef.current) return;
      
      const containerHeight = containerRef.current.clientHeight;
      
      setTargets(prev => prev
        // Move targets downward
        .map(target => ({
          ...target,
          y: target.y + target.speed,
        }))
        // Remove targets that went off screen
        .filter(target => target.y < containerHeight + 50)
      );
    };
    
    // Fixed: Using requestAnimationFrame correctly
    let animationFrameId: number;
    
    const animate = () => {
      animateTargets();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targets, gameStarted, gameOver]);
  
  // Handle swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    
    const touch = e.touches[0];
    const newSwipe = {
      x1: touch.clientX,
      y1: touch.clientY,
      x2: touch.clientX,
      y2: touch.clientY,
      active: true
    };
    
    setSwipes(prev => [...prev, newSwipe]);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    
    const touch = e.touches[0];
    
    setSwipes(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].active) {
          updated[lastIndex].x2 = touch.clientX;
          updated[lastIndex].y2 = touch.clientY;
        }
      }
      return updated;
    });
    
    // Check for target hits
    checkHits(touch.clientX, touch.clientY);
  };
  
  const handleTouchEnd = () => {
    if (!gameStarted || gameOver) return;
    
    setSwipes(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastIndex = updated.length - 1;
        updated[lastIndex].active = false;
      }
      return updated;
    });
    
    // Clear old swipes
    setTimeout(() => {
      setSwipes(prev => prev.filter(swipe => swipe.active));
    }, 500);
  };
  
  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver) return;
    
    const newSwipe = {
      x1: e.clientX,
      y1: e.clientY,
      x2: e.clientX,
      y2: e.clientY,
      active: true
    };
    
    setSwipes(prev => [...prev, newSwipe]);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameStarted || gameOver) return;
    
    if (swipes.some(swipe => swipe.active)) {
      setSwipes(prev => {
        const updated = [...prev];
        if (updated.length > 0) {
          const lastIndex = updated.length - 1;
          if (updated[lastIndex].active) {
            updated[lastIndex].x2 = e.clientX;
            updated[lastIndex].y2 = e.clientY;
          }
        }
        return updated;
      });
      
      // Check for target hits
      checkHits(e.clientX, e.clientY);
    }
  };
  
  const handleMouseUp = () => {
    if (!gameStarted || gameOver) return;
    
    setSwipes(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        const lastIndex = updated.length - 1;
        updated[lastIndex].active = false;
      }
      return updated;
    });
    
    // Clear old swipes
    setTimeout(() => {
      setSwipes(prev => prev.filter(swipe => swipe.active));
    }, 500);
  };
  
  // Check if swipe hit any targets
  const checkHits = (x: number, y: number) => {
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const relativeX = x - containerRect.left;
    const relativeY = y - containerRect.top;
    
    let hitAny = false;
    
    setTargets(prev => prev.map(target => {
      // Skip if already hit
      if (target.hit) return target;
      
      // Check if swipe point is within target
      const dx = relativeX - target.x;
      const dy = relativeY - target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < target.size / 2) {
        hitAny = true;
        return { ...target, hit: true };
      }
      
      return target;
    }));
    
    if (hitAny) {
      // Reduce boss health
      setBossHealth(prev => {
        const newHealth = Math.max(0, prev - settings.healthReduction);
        
        // If boss defeated
        if (newHealth <= 0 && !gameOver) {
          setGameOver(true);
          setGameWon(true);
          onComplete(true);
        }
        
        return newHealth;
      });
      
      // Increase score
      setScore(prev => prev + 10);
    }
  };
  
  // Render game canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth;
      canvas.height = containerRef.current.clientHeight;
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw boss (circular shape in the center)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const bossSize = 120;
    
    // Boss health indicator (circle fill)
    const healthPercentage = bossHealth / settings.bossHealthTotal;
    
    // Draw boss health background
    ctx.beginPath();
    ctx.arc(centerX, centerY, bossSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.fill();
    
    // Draw boss health remaining
    ctx.beginPath();
    ctx.arc(centerX, centerY, bossSize, -Math.PI/2, -Math.PI/2 + (Math.PI * 2 * healthPercentage));
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    
    // Color based on health
    if (healthPercentage > 0.6) {
      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    } else if (healthPercentage > 0.3) {
      ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
    } else {
      ctx.fillStyle = 'rgba(200, 0, 0, 0.8)';
    }
    ctx.fill();
    
    // Boss outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, bossSize, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw boss face
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    
    // Eyes
    const eyeOffset = 25;
    const eyeSize = 15;
    
    // Left eye
    ctx.beginPath();
    ctx.arc(centerX - eyeOffset, centerY - eyeOffset/2, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(centerX + eyeOffset, centerY - eyeOffset/2, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (angry)
    ctx.beginPath();
    ctx.arc(centerX, centerY + eyeOffset, eyeOffset, 0, Math.PI);
    ctx.stroke();
    
    // Draw targets
    targets.forEach(target => {
      if (target.hit) return; // Skip drawing hit targets
      
      // Draw target
      ctx.save();
      ctx.translate(target.x, target.y);
      ctx.rotate(target.rotation * Math.PI / 180);
      
      // Target shape (star-like)
      const spikes = 5;
      const innerRadius = target.size / 4;
      const outerRadius = target.size / 2;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      
      // Fill target
      if (difficulty === 'rare') {
        ctx.fillStyle = 'rgba(100, 180, 255, 0.9)';
      } else if (difficulty === 'epic') {
        ctx.fillStyle = 'rgba(180, 100, 255, 0.9)';
      } else {
        ctx.fillStyle = 'rgba(255, 180, 0, 0.9)';
      }
      ctx.fill();
      
      // Target outline
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();
    });
    
    // Draw swipes
    swipes.forEach(swipe => {
      ctx.beginPath();
      ctx.moveTo(swipe.x1, swipe.y1);
      ctx.lineTo(swipe.x2, swipe.y2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
      
      // Glow effect
      ctx.beginPath();
      ctx.moveTo(swipe.x1, swipe.y1);
      ctx.lineTo(swipe.x2, swipe.y2);
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
    
    // Show game over message if needed
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = gameWon ? '#4CAF50' : '#F44336';
      ctx.fillText(
        gameWon ? 'Victory!' : 'Defeat!', 
        canvas.width / 2, 
        canvas.height / 2 - 40
      );
      
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(
        `Score: ${score}`, 
        canvas.width / 2, 
        canvas.height / 2 + 10
      );
    }
  }, [targets, swipes, bossHealth, gameStarted, gameOver, gameWon, score, settings.bossHealthTotal, difficulty]);
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Defeat {bossName}</h2>
        
        <div className="flex items-center gap-2">
          {gameStarted && (
            <>
              <div className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium">
                Score: {score}
              </div>
              <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                {timeLeft}s
              </div>
            </>
          )}
        </div>
      </div>
      
      <div 
        className="w-full rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 border border-gray-700 overflow-hidden relative"
        style={{ height: '400px' }}
        ref={containerRef}
      >
        {!gameStarted ? (
          <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
            <Sword size={64} className="text-primary animate-pulse mb-6" />
            <h3 className="text-xl font-bold mb-2">Swipe Attack Challenge</h3>
            <p className="text-muted-foreground mb-6">
              Swipe the targets that appear to defeat the boss. Hit as many as you can before time runs out!
            </p>
            <Button
              size="lg"
              onClick={handleStart}
              className="px-8"
            >
              Start Challenge
            </Button>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        )}
      </div>
      
      {gameStarted && !gameOver && (
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="text-sm font-medium mb-1">Boss Health</div>
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300"
                style={{ width: `${(bossHealth / settings.bossHealthTotal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
      
      {gameOver && (
        <Button 
          onClick={() => onComplete(gameWon)}
          className="w-full"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default SwipeGame;
