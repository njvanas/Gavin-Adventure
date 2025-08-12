import React, { useEffect, useState, useRef } from 'react';
import { PlayerState } from '../types/GameTypes';
import { InputSystem } from '../systems/InputSystem';
import { PhysicsSystem } from '../systems/PhysicsSystem';

interface MarioPlayerProps {
  playerState: PlayerState;
  onStateChange: (newState: PlayerState) => void;
  platforms: any[];
  cameraOffset: { x: number; y: number };
}

const MarioPlayer: React.FC<MarioPlayerProps> = ({ 
  playerState, 
  onStateChange, 
  platforms,
  cameraOffset 
}) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const inputSystem = useRef(new InputSystem());
  const physicsSystem = useRef(new PhysicsSystem());
  const lastUpdateTime = useRef(Date.now());
  const jumpKeyPressed = useRef(false);

  useEffect(() => {
    const gameLoop = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;
      lastUpdateTime.current = currentTime;

      const input = inputSystem.current.getInputState();
      let newPlayerState = { ...playerState };

      // Handle horizontal movement with acceleration
      if (input.left) {
        newPlayerState.facingRight = false;
        newPlayerState.isRunning = true;
        
        if (input.run) {
          newPlayerState.runAcceleration = Math.min(newPlayerState.runAcceleration + 0.5, newPlayerState.maxRunSpeed);
        } else {
          newPlayerState.runAcceleration = Math.min(newPlayerState.runAcceleration + 0.3, newPlayerState.maxRunSpeed * 0.7);
        }
        
        newPlayerState.velocity.x = -newPlayerState.runAcceleration;
      } else if (input.right) {
        newPlayerState.facingRight = true;
        newPlayerState.isRunning = true;
        
        if (input.run) {
          newPlayerState.runAcceleration = Math.min(newPlayerState.runAcceleration + 0.5, newPlayerState.maxRunSpeed);
        } else {
          newPlayerState.runAcceleration = Math.min(newPlayerState.runAcceleration + 0.3, newPlayerState.maxRunSpeed * 0.7);
        }
        
        newPlayerState.velocity.x = newPlayerState.runAcceleration;
      } else {
        newPlayerState.isRunning = false;
        newPlayerState.runAcceleration = Math.max(newPlayerState.runAcceleration - 1, 0);
      }

      // Handle jumping with variable height
      if (input.jump && !jumpKeyPressed.current) {
        newPlayerState = physicsSystem.current.initiateJump(newPlayerState);
        jumpKeyPressed.current = true;
      } else if (input.jump && jumpKeyPressed.current && newPlayerState.isJumping) {
        newPlayerState = physicsSystem.current.continueJump(newPlayerState, deltaTime);
      } else if (!input.jump && jumpKeyPressed.current) {
        newPlayerState = physicsSystem.current.releaseJump(newPlayerState);
        jumpKeyPressed.current = false;
      }

      // Update physics
      newPlayerState = physicsSystem.current.updatePlayer(newPlayerState, platforms, deltaTime);

      // Update animation frame
      if (newPlayerState.isRunning) {
        setAnimationFrame(prev => (prev + 1) % 60);
      }

      onStateChange(newPlayerState);
    };

    const intervalId = setInterval(gameLoop, 16.67); // 60fps
    return () => clearInterval(intervalId);
  }, [playerState, platforms, onStateChange]);

  const getPlayerSprite = () => {
    const baseSize = playerState.size === 'small' ? 32 : 64;
    const isFlashing = playerState.invulnerable && Math.floor(Date.now() / 100) % 2;
    
    let spriteClass = 'mario-sprite';
    
    if (playerState.size === 'small') {
      spriteClass += ' mario-small';
    } else if (playerState.size === 'super') {
      spriteClass += ' mario-super';
    } else if (playerState.size === 'fire') {
      spriteClass += ' mario-fire';
    }

    if (playerState.isRunning) {
      spriteClass += ` mario-running-${Math.floor(animationFrame / 10) % 3}`;
    } else {
      spriteClass += ' mario-idle';
    }

    if (!playerState.isGrounded) {
      spriteClass += ' mario-jumping';
    }

    return (
      <div
        className={`${spriteClass} ${isFlashing ? 'mario-invulnerable' : ''}`}
        style={{
          width: baseSize,
          height: baseSize,
          transform: playerState.facingRight ? 'scaleX(1)' : 'scaleX(-1)',
          position: 'absolute',
          left: playerState.position.x - cameraOffset.x,
          top: playerState.position.y - cameraOffset.y,
          zIndex: 100,
          transition: 'none',
          imageRendering: 'pixelated'
        }}
      >
        {/* Mario sprite representation */}
        <div className="mario-body">
          {/* Hat */}
          <div className={`mario-hat ${playerState.size !== 'small' ? 'mario-hat-big' : ''}`}></div>
          
          {/* Face */}
          <div className="mario-face">
            <div className="mario-eyes"></div>
            <div className="mario-mustache"></div>
            <div className="mario-nose"></div>
          </div>
          
          {/* Shirt */}
          <div className={`mario-shirt ${
            playerState.size === 'fire' ? 'mario-shirt-fire' : 
            playerState.size === 'super' ? 'mario-shirt-super' : 'mario-shirt-small'
          }`}>
            {playerState.size !== 'small' && <div className="mario-buttons"></div>}
          </div>
          
          {/* Overalls */}
          <div className="mario-overalls"></div>
          
          {/* Arms */}
          <div className={`mario-arms ${playerState.isRunning ? 'mario-arms-running' : ''}`}></div>
          
          {/* Legs */}
          <div className={`mario-legs ${
            playerState.isRunning ? `mario-legs-running-${Math.floor(animationFrame / 8) % 4}` : ''
          }`}></div>
        </div>
      </div>
    );
  };

  return getPlayerSprite();
};

export default MarioPlayer;