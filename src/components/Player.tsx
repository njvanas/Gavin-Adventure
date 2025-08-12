import React, { useState, useEffect, useRef } from 'react';
import { GameState } from '../types/GameTypes';
import { GAVIN_SPRITES, AssetLoader } from '../config/Assets';
import SpriteRenderer from './SpriteRenderer';

interface PlayerProps {
  gameState: GameState;
  onUpdatePosition: (x: number, y: number) => void;
}

const Player: React.FC<PlayerProps> = ({ gameState, onUpdatePosition }) => {
  console.log('Player component rendered with gameState:', gameState);
  
  const [position, setPosition] = useState({ x: 100, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [isFlexing, setIsFlexing] = useState(false);
  const [isClimbing, setIsClimbing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSprite, setCurrentSprite] = useState(GAVIN_SPRITES[0]); // Start with idle
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>();

  // Ground level calculation
  const groundLevel = 128;
  const playerSize = getPlayerSize(gameState.strength || 50);
  const moveSpeed = 6;
  const jumpPower = 15;
  const gravity = 0.8;

  // Update sprite based on player state
  useEffect(() => {
    let newSprite = GAVIN_SPRITES[0]; // idle

    if (isFlexing) {
      newSprite = GAVIN_SPRITES.find(s => s.id === 'gavin-flex') || GAVIN_SPRITES[0];
    } else if (isJumping) {
      newSprite = GAVIN_SPRITES.find(s => s.id === 'gavin-jump') || GAVIN_SPRITES[0];
    } else if (isRunning) {
      newSprite = GAVIN_SPRITES.find(s => s.id === 'gavin-run') || GAVIN_SPRITES[0];
    }

    setCurrentSprite(newSprite);
  }, [isJumping, isRunning, isFlexing]);

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
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('q')) {
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

        // Climbing and jumping
        if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w') || keysPressed.current.has(' ') || keysPressed.current.has('z')) {
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

    // Start the game loop immediately
    gameLoop();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [velocity, isJumping, isClimbing, playerSize, moveSpeed, jumpPower, gravity]);

  // Key event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key);
      keysPressed.current.add(e.key);
      
      // Flex battle
      if (e.key === 'f' || e.key === 'F') {
        if (!isFlexing) {
          setIsFlexing(true);
          setTimeout(() => setIsFlexing(false), 1500);
        }
      }

      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'w', 'a', 's', 'd', 'z', 'q'].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('Key released:', e.key);
      keysPressed.current.delete(e.key);
    };

    // Add click/touch support for mobile
    const handleClick = (e: MouseEvent) => {
      console.log('Click detected');
      // Simple click to jump for mobile
      if (!isJumping && !isClimbing) {
        setIsJumping(true);
        setVelocity(prev => ({ ...prev, y: -jumpPower }));
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      console.log('Touch detected');
      // Touch to jump for mobile
      if (!isJumping && !isClimbing) {
        setIsJumping(true);
        setVelocity(prev => ({ ...prev, y: -jumpPower }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isJumping, isClimbing]);

  useEffect(() => {
    onUpdatePosition(position.x, position.y);
  }, [position, onUpdatePosition]);

  function getPlayerSize(strength: number) {
    const baseSize = 60;
    const strengthMultiplier = Math.min(strength / 50, 2);
    return baseSize + (strengthMultiplier * 20);
  }

  function checkNearObstacle(x: number) {
    // Check if player is near climbing obstacles (rocks, walls, etc.)
    const obstacles = [300, 600, 900, 1200]; // Obstacle positions
    return obstacles.some(obstacleX => Math.abs(x - obstacleX) < 50);
  }

  const handleFlexComplete = () => {
    // This will be called when the flex animation completes
    console.log('Flex animation completed');
  };

  return (
    <div 
      className={`absolute z-40 transition-all duration-75 cursor-pointer`}
      style={{ 
        left: position.x, 
        bottom: groundLevel + position.y,
        width: playerSize,
        height: playerSize
      }}
      onClick={(e) => {
        console.log('Player clicked!');
        // Click to jump
        if (!isJumping && !isClimbing) {
          setIsJumping(true);
          setVelocity(prev => ({ ...prev, y: -jumpPower }));
        }
        e.stopPropagation();
      }}
    >
      {/* Gavin's Sprite */}
      <SpriteRenderer
        asset={currentSprite}
        x={0}
        y={0}
        scale={playerSize / 64} // Scale based on strength
        direction={facingRight ? 'right' : 'left'}
        isActive={true}
        onAnimationComplete={isFlexing ? handleFlexComplete : undefined}
        className="w-full h-full"
        style={{ position: 'relative' }}
      />
      
      {/* Flex effects */}
      {isFlexing && (
        <>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 pixel-font text-yellow-400 text-xs animate-bounce">
            💪 {gameState.strength || 50}
          </div>
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
          <div className="absolute -top-4 -left-4 -right-4 -bottom-4 border-4 border-yellow-400 rounded-full animate-ping"></div>
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
      
      {/* Controls hint */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white pixel-font text-xs text-center opacity-75">
        <div>WASD/Arrows: Move</div>
        <div>Space/W: Jump</div>
        <div>F: Flex Battle</div>
        <div>Click/Tap: Jump</div>
        <div className="text-green-400 mt-2">🎮 Game Active</div>
      </div>
    </div>
  );
};

export default Player;