import React, { useState, useEffect } from 'react';
import { Enemy } from '../types/GameTypes';

interface MarioEnemyProps {
  enemy: Enemy;
  cameraOffset: { x: number; y: number };
  onDefeat?: (enemy: Enemy) => void;
}

const MarioEnemy: React.FC<MarioEnemyProps> = ({ 
  enemy, 
  cameraOffset, 
  onDefeat 
}) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const getEnemySprite = () => {
    let className = 'mario-enemy';
    let content = null;

    switch (enemy.type) {
      case 'goomba':
        className += ' mario-goomba';
        const goombaFrame = Math.floor(animationFrame / 15) % 2;
        content = (
          <div className="goomba-body">
            <div className="goomba-eyes">
              <div className="eye left-eye"></div>
              <div className="eye right-eye"></div>
            </div>
            <div className="goomba-eyebrows"></div>
            <div className="goomba-mouth"></div>
            <div className={`goomba-feet goomba-walk-${goombaFrame}`}>
              <div className="foot left-foot"></div>
              <div className="foot right-foot"></div>
            </div>
          </div>
        );
        break;

      case 'koopa':
        className += ' mario-koopa';
        if (enemy.state === 'shell') {
          className += ' mario-koopa-shell';
          content = (
            <div className="koopa-shell">
              <div className="shell-pattern">
                <div className="shell-segment"></div>
                <div className="shell-segment"></div>
                <div className="shell-segment"></div>
              </div>
              <div className="shell-rim"></div>
            </div>
          );
        } else {
          const koopaFrame = Math.floor(animationFrame / 20) % 2;
          content = (
            <div className="koopa-body">
              <div className="koopa-shell-back">
                <div className="shell-pattern">
                  <div className="shell-segment"></div>
                  <div className="shell-segment"></div>
                </div>
              </div>
              <div className="koopa-head">
                <div className="koopa-beak"></div>
                <div className="koopa-eyes"></div>
              </div>
              <div className={`koopa-legs koopa-walk-${koopaFrame}`}>
                <div className="leg left-leg"></div>
                <div className="leg right-leg"></div>
              </div>
            </div>
          );
        }
        break;

      case 'piranha':
        className += ' mario-piranha';
        const piranhaFrame = Math.floor(animationFrame / 10) % 4;
        content = (
          <div className="piranha-plant">
            <div className={`piranha-head piranha-chomp-${piranhaFrame}`}>
              <div className="piranha-mouth">
                <div className="piranha-teeth top-teeth"></div>
                <div className="piranha-teeth bottom-teeth"></div>
              </div>
              <div className="piranha-spots">
                <div className="spot spot-1"></div>
                <div className="spot spot-2"></div>
                <div className="spot spot-3"></div>
              </div>
            </div>
            <div className="piranha-stem"></div>
          </div>
        );
        break;

      case 'spiny':
        className += ' mario-spiny';
        const spinyFrame = Math.floor(animationFrame / 12) % 2;
        content = (
          <div className="spiny-body">
            <div className="spiny-shell">
              <div className="spiny-spikes">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className={`spike spike-${i}`}></div>
                ))}
              </div>
            </div>
            <div className="spiny-eyes"></div>
            <div className={`spiny-feet spiny-walk-${spinyFrame}`}>
              <div className="foot left-foot"></div>
              <div className="foot right-foot"></div>
            </div>
          </div>
        );
        break;
    }

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          left: enemy.x - cameraOffset.x,
          top: enemy.y - cameraOffset.y,
          width: 32,
          height: 32,
          transform: enemy.direction > 0 ? 'scaleX(1)' : 'scaleX(-1)',
          imageRendering: 'pixelated',
          opacity: enemy.state === 'defeated' ? 0.5 : 1,
          zIndex: 50
        }}
      >
        {content}
        
        {/* Defeat animation */}
        {enemy.state === 'defeated' && (
          <div className="defeat-animation">
            <div className="defeat-stars">
              <div className="star star-1">⭐</div>
              <div className="star star-2">⭐</div>
              <div className="star star-3">⭐</div>
            </div>
          </div>
        )}
        
        {/* Collision debug outline */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            className="enemy-debug-outline"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '1px solid rgba(255, 255, 0, 0.5)',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    );
  };

  return getEnemySprite();
};

export default MarioEnemy;