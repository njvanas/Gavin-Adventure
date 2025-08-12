import React, { useState, useEffect } from 'react';
import { Platform } from '../types/GameTypes';

interface MarioPlatformProps {
  platform: Platform;
  cameraOffset: { x: number; y: number };
  onActivate?: (platform: Platform) => void;
}

const MarioPlatform: React.FC<MarioPlatformProps> = ({ 
  platform, 
  cameraOffset, 
  onActivate 
}) => {
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    if (platform.type === 'question' || platform.type === 'moving') {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 60);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [platform.type]);

  const getPlatformSprite = () => {
    let className = 'mario-platform';
    let content = null;

    switch (platform.type) {
      case 'solid':
        className += ' mario-platform-solid';
        content = (
          <div className="platform-brick-pattern">
            {Array.from({ length: Math.ceil(platform.width / 32) }, (_, i) => (
              <div key={i} className="brick-segment">🧱</div>
            ))}
          </div>
        );
        break;

      case 'breakable':
        className += ' mario-platform-breakable';
        content = (
          <div className="platform-brick-pattern">
            {Array.from({ length: Math.ceil(platform.width / 32) }, (_, i) => (
              <div key={i} className="brick-segment breakable">
                <div className="brick-texture"></div>
              </div>
            ))}
          </div>
        );
        break;

      case 'question':
        className += ' mario-platform-question';
        const questionFrame = Math.floor(animationFrame / 15) % 4;
        content = (
          <div className="question-block">
            <div className={`question-mark question-frame-${questionFrame}`}>
              {isActivated ? '□' : '?'}
            </div>
            <div className="question-shine"></div>
          </div>
        );
        break;

      case 'pipe':
        className += ' mario-platform-pipe';
        content = (
          <div className="pipe-structure">
            <div className="pipe-top"></div>
            <div className="pipe-body"></div>
            <div className="pipe-highlight"></div>
          </div>
        );
        break;

      case 'moving':
        className += ' mario-platform-moving';
        content = (
          <div className="moving-platform">
            <div className="platform-surface"></div>
            <div className="platform-gears">
              <div className={`gear gear-1 gear-rotation-${animationFrame % 8}`}></div>
              <div className={`gear gear-2 gear-rotation-${(animationFrame + 4) % 8}`}></div>
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
          left: platform.x - cameraOffset.x,
          top: platform.y - cameraOffset.y,
          width: platform.width,
          height: platform.height,
          imageRendering: 'pixelated',
          opacity: platform.isActive ? 1 : 0.5
        }}
        onClick={() => {
          if (platform.type === 'question' && !isActivated && onActivate) {
            setIsActivated(true);
            onActivate(platform);
          }
        }}
      >
        {content}
        
        {/* Collision debug outline (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div 
            className="platform-debug-outline"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '1px solid rgba(255, 0, 0, 0.3)',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    );
  };

  return getPlatformSprite();
};

export default MarioPlatform;