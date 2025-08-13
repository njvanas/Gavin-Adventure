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
  const velocityRef = useRef({ x: 0, y: 0 }); // Use ref to avoid infinite loop
  const lastPositionRef = useRef({ x: 100, y: 0 }); // Track last position for updates

  // Ground level calculation
  const groundLevel = 128;
  const playerSize = getPlayerSize(gameState.strength || 50);
  const moveSpeed = 6;
  const jumpPower = 15;
  const gravity = 0.8;

  // Simple platform collision detection
  const checkPlatformCollision = (x: number, y: number) => {
    // This would be improved with actual platform data from the game state
    // For now, just check if we're near any platforms
    const platforms = [
      { x: 400, y: -80, width: 200, height: 20 },
      { x: 800, y: -60, width: 150, height: 20 },
      { x: 1200, y: -100, width: 180, height: 20 }
    ];
    
    for (const platform of platforms) {
      if (x + playerSize > platform.x && 
          x < platform.x + platform.width &&
          Math.abs((groundLevel + y) - (groundLevel + platform.y + platform.height)) < 10) {
        return platform;
      }
    }
    return null;
  };

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

  // Sync velocity ref with state for UI updates
  useEffect(() => {
    setVelocity(velocityRef.current);
  }, [velocityRef.current.x, velocityRef.current.y]);

  // Smooth movement system
  useEffect(() => {
    // Only run the game loop when the game has started
    if (!gameState.gameStarted) {
      return;
    }

    let lastTime = 0;
    const gameLoop = (currentTime: number) => {
      // Only update at 60 FPS to prevent excessive updates
      if (currentTime - lastTime < 16) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = currentTime;

      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newVelX = 0;
        let newVelY = velocityRef.current.y;
        let running = false;
        let onGround = false;
        let positionChanged = false;

        // Horizontal movement - only if keys are pressed
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || keysPressed.current.has('q')) {
          newVelX = -moveSpeed;
          setFacingRight(false);
          running = true;
          positionChanged = true;
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
          newVelX = moveSpeed;
          setFacingRight(true);
          running = true;
          positionChanged = true;
        }

        setIsRunning(running);

        // Climbing and jumping - only if keys are pressed
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
            positionChanged = true;
          } else if (isClimbing) {
            newVelY = -moveSpeed * 0.8; // Continue climbing
            positionChanged = true;
          }
        }

        // Apply horizontal movement only if there's input
        if (positionChanged) {
          newX += newVelX;
          newX = Math.max(0, Math.min(window.innerWidth - playerSize, newX));
        }

        // Apply gravity and vertical movement only if needed
        if (isJumping || isClimbing || newVelY !== 0) {
          newY += newVelY;
          newVelY += gravity;
          positionChanged = true;

          // Check platform collision while falling
          const platform = checkPlatformCollision(newX, newY);
          if (platform && newVelY > 0) {
            newY = platform.y + platform.height;
            newVelY = 0;
            setIsJumping(false);
            setIsClimbing(false);
            onGround = true;
          }

          // Land on ground
          if (newY >= 0) {
            newY = 0;
            newVelY = 0;
            setIsJumping(false);
            setIsClimbing(false);
            onGround = true;
          }
        } else {
          // Check if player is on ground or platform
          const platform = checkPlatformCollision(newX, newY);
          if (platform) {
            newY = platform.y + platform.height;
            onGround = true;
          } else if (newY >= 0) {
            newY = 0;
            onGround = true;
          } else {
            // Player is falling
            newVelY += gravity;
            newY += newVelY;
            onGround = false;
            positionChanged = true;
          }
        }

        velocityRef.current = { x: newVelX, y: newVelY };
        
        // Only return new position if something actually changed
        if (positionChanged || newX !== prev.x || newY !== prev.y) {
          return { x: newX, y: newY };
        }
        return prev; // No change
      });

      // Only continue the loop if the game is still active
      if (gameState.gameStarted) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start the game loop only when game is active
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.gameStarted, playerSize, moveSpeed, jumpPower, gravity]);

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
        velocityRef.current = { ...velocityRef.current, y: -jumpPower };
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      console.log('Touch detected');
      // Touch to jump for mobile
      if (!isJumping && !isClimbing) {
        setIsJumping(true);
        velocityRef.current = { ...velocityRef.current, y: -jumpPower };
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
  }, [isJumping, isClimbing, jumpPower]);

  useEffect(() => {
    // Only call onUpdatePosition when the game is active and position has changed significantly
    if (gameState.gameStarted) {
      // Only update if position has changed by more than 1 pixel to prevent excessive updates
      if (Math.abs(position.x - lastPositionRef.current.x) > 1 || Math.abs(position.y - lastPositionRef.current.y) > 1) {
        lastPositionRef.current = { x: position.x, y: position.y };
        onUpdatePosition(position.x, position.y);
      }
    }
  }, [position.x, position.y, onUpdatePosition, gameState.gameStarted]);

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
          velocityRef.current = { ...velocityRef.current, y: -jumpPower };
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