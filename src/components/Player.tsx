import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../App';

interface PlayerProps {
  gameState: GameState;
  onUpdatePosition: (x: number, y: number) => void;
  onFlexBattle: (playerStrength: number) => void;
}

const Player: React.FC<PlayerProps> = ({ gameState, onUpdatePosition, onFlexBattle }) => {
  const [position, setPosition] = useState({ x: 100, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();

  // Ground level calculation
  const groundLevel = 128;
  const playerSize = getPlayerSize();
  const moveSpeed = 6;
  const jumpPower = 15;
  const gravity = 0.8;

  // Smooth movement system
  useEffect(() => {
    const gameLoop = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelX = 0;
        let newVelY = velocity.y;
        let running = false;

        // Horizontal movement
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
          newVelX = -moveSpeed;
          setFacingRight(false);
          running = true;
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
          newVelX = moveSpeed;
          setFacingRight(true);
          running = true;
        }

        setIsRunning(running);

        // Climbing
        if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w') || keysPressed.current.has(' ')) {
          if (!isJumping && !isClimbing) {
            // Check if near climbable obstacle
            const nearObstacle = checkNearObstacle(prev.x);
            if (nearObstacle) {
              setIsClimbing(true);
              newVelY = -jumpPower * 0.6; // Slower climb speed
            } else {
              // Regular jump
              setIsJumping(true);
              newVelY = -jumpPower;
            }
          } else if (isClimbing) {
            newVelY = -moveSpeed * 0.8; // Continue climbing
          }
        }

        // Apply horizontal movement
        newX += newVelX;
        newX = Math.max(0, Math.min(window.innerWidth - playerSize, newX));

        // Apply gravity and vertical movement
        if (isJumping || isClimbing) {
          newY += newVelY;
          newVelY += gravity;

          // Land on ground
          if (newY <= 0) {
            newY = 0;
            newVelY = 0;
            setIsJumping(false);
            setIsClimbing(false);
          }
        }

        setVelocity({ x: newVelX, y: newVelY });
        return { x: newX, y: newY };
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [velocity, isJumping, isClimbing, playerSize, moveSpeed, jumpPower, gravity]);

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);
      
      // Flex battle
      if (e.key === 'f' || e.key === 'F') {
        if (!isFlexing) {
          setIsFlexing(true);
          onFlexBattle(gameState.strength);
          setTimeout(() => setIsFlexing(false), 1500);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isFlexing, gameState.strength, onFlexBattle]);

  useEffect(() => {
    onUpdatePosition(position.x, position.y);
  }, [position, onUpdatePosition]);

  function getPlayerSize() {
    const baseSize = 60;
    const strengthMultiplier = Math.min(gameState.strength / 50, 2);
    return baseSize + (strengthMultiplier * 20);
  }

  function checkNearObstacle(x: number) {
    // Check if player is near climbing obstacles (rocks, walls, etc.)
    const obstacles = [300, 600, 900, 1200]; // Obstacle positions
    return obstacles.some(obstacleX => Math.abs(x - obstacleX) < 50);
  }

  return (
    <div 
      className={`absolute z-40 transition-all duration-75 ${
        isJumping ? 'animate-bounce' : ''
      } ${isClimbing ? 'animate-pulse' : ''} ${
        isRunning ? 'animate-pulse' : ''
      }`}
      style={{ 
        left: position.x, 
        bottom: groundLevel + position.y,
        width: playerSize,
        height: playerSize,
        transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)'
      }}
    >
      {/* Gavin's Body */}
      <div className="relative w-full h-full">
        {/* Head */}
        <div 
          className="absolute bg-yellow-300 border-2 border-yellow-600 rounded-sm"
          style={{
            width: playerSize * 0.4,
            height: playerSize * 0.3,
            top: 0,
            left: '30%'
          }}
        >
          {/* Eyes */}
          <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: '30%', left: '25%' }}></div>
          <div className="absolute w-1 h-1 bg-black rounded-full" style={{ top: '30%', right: '25%' }}></div>
          {/* Mustache */}
          <div className="absolute w-3 h-1 bg-black rounded-sm" style={{ top: '60%', left: '35%' }}></div>
        </div>
        
        {/* Body */}
        <div 
          className={`absolute bg-red-600 border-2 border-red-800 rounded-sm ${
            isFlexing ? 'animate-pulse bg-red-500 scale-110' : ''
          } ${isRunning ? 'animate-pulse' : ''}`}
          style={{
            width: playerSize * 0.6,
            height: playerSize * 0.5,
            top: playerSize * 0.25,
            left: '20%'
          }}
        >
          {/* Muscles (get bigger with strength) */}
          <div 
            className={`absolute bg-red-700 rounded-full ${isFlexing ? 'animate-ping' : ''}`}
            style={{
              width: Math.min(playerSize * 0.15, 12),
              height: Math.min(playerSize * 0.15, 12),
              top: '20%',
              left: '10%'
            }}
          ></div>
          <div 
            className={`absolute bg-red-700 rounded-full ${isFlexing ? 'animate-ping' : ''}`}
            style={{
              width: Math.min(playerSize * 0.15, 12),
              height: Math.min(playerSize * 0.15, 12),
              top: '20%',
              right: '10%'
            }}
          ></div>
        </div>
        
        {/* Arms */}
        <div 
          className={`absolute bg-yellow-300 border-2 border-yellow-600 rounded-sm ${
            isFlexing ? 'animate-pulse scale-125' : ''
          } ${isRunning ? 'animate-bounce' : ''}`}
          style={{
            width: playerSize * 0.15,
            height: playerSize * 0.4,
            top: playerSize * 0.3,
            left: '5%'
          }}
        ></div>
        <div 
          className={`absolute bg-yellow-300 border-2 border-yellow-600 rounded-sm ${
            isFlexing ? 'animate-pulse scale-125' : ''
          } ${isRunning ? 'animate-bounce' : ''}`}
          style={{
            width: playerSize * 0.15,
            height: playerSize * 0.4,
            top: playerSize * 0.3,
            right: '5%'
          }}
        ></div>
        
        {/* Legs */}
        <div 
          className={`absolute bg-blue-600 border-2 border-blue-800 rounded-sm ${
            isRunning ? 'animate-bounce' : ''
          }`}
          style={{
            width: playerSize * 0.2,
            height: playerSize * 0.3,
            bottom: 0,
            left: '25%'
          }}
        ></div>
        <div 
          className={`absolute bg-blue-600 border-2 border-blue-800 rounded-sm ${
            isRunning ? 'animate-bounce' : ''
          }`}
          style={{
            width: playerSize * 0.2,
            height: playerSize * 0.3,
            bottom: 0,
            right: '25%'
          }}
        ></div>
        
        {/* Flex effects */}
        {isFlexing && (
          <>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pixel-font text-yellow-400 text-xs animate-bounce">
              💪 {gameState.strength}
            </div>
            <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
            <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-4 border-yellow-400 rounded-full animate-pulse"></div>
          </>
        )}
        
        {/* Climbing indicator */}
        {isClimbing && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 pixel-font text-green-400 text-xs">
            🧗 CLIMBING
          </div>
        )}
        
        {/* Running effects */}
        {isRunning && !isJumping && (
          <>
            <div className="absolute -bottom-4 left-2 w-2 h-1 bg-gray-400 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute -bottom-4 right-2 w-2 h-1 bg-gray-400 rounded-full opacity-50 animate-pulse"></div>
          </>
        )}
      </div>
      
      {/* Controls hint */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white pixel-font text-xs text-center opacity-75">
        <div>WASD/Arrows: Move</div>
        <div>Space/W: Jump</div>
        <div>F: Flex Battle</div>
      </div>
    </div>
  );
};

export default Player;