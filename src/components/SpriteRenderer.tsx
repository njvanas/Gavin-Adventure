import React, { useState, useEffect, useRef } from 'react';
import { AssetConfig } from '../config/Assets';

interface SpriteRendererProps {
  asset: AssetConfig;
  x: number;
  y: number;
  scale?: number;
  direction?: 'left' | 'right';
  isActive?: boolean;
  onAnimationComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SpriteRenderer: React.FC<SpriteRendererProps> = ({
  asset,
  x,
  y,
  scale = 1,
  direction = 'right',
  isActive = true,
  onAnimationComplete,
  className = '',
  style
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const animationRef = useRef<number>();
  const frameTimerRef = useRef<number>();

  // Load the sprite image
  useEffect(() => {
    const loadSprite = async () => {
      try {
        const img = new Image();
        img.onload = () => setImage(img);
        img.src = asset.path;
      } catch (error) {
        console.error(`Failed to load sprite: ${asset.path}`, error);
      }
    };

    loadSprite();
  }, [asset.path]);

  // Handle sprite animation
  useEffect(() => {
    if (!isActive || !asset.frames || asset.frames <= 1) return;

    const animate = () => {
      setCurrentFrame(prev => {
        const nextFrame = (prev + 1) % asset.frames!;
        
        // Call completion callback for non-looping animations
        if (!asset.loop && nextFrame === 0 && onAnimationComplete) {
          onAnimationComplete();
        }
        
        return nextFrame;
      });
    };

    if (asset.frameTime && asset.frameTime > 0) {
      frameTimerRef.current = window.setInterval(animate, asset.frameTime);
    } else {
      animationRef.current = requestAnimationFrame(() => {
        animate();
        if (isActive) {
          animationRef.current = requestAnimationFrame(animate);
        }
      });
    }

    return () => {
      if (frameTimerRef.current) {
        clearInterval(frameTimerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, asset.frames, asset.frameTime, asset.loop, onAnimationComplete]);

  // Reset animation when asset changes
  useEffect(() => {
    setCurrentFrame(0);
  }, [asset.id]);

  if (!image) {
    return (
      <div 
        className={`bg-gray-400 border border-gray-600 ${className}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: (asset.width || 32) * scale,
          height: (asset.height || 32) * scale,
          transform: `scaleX(${direction === 'left' ? -1 : 1})`
        }}
      >
        <div className="text-xs text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  const frameWidth = image.width / (asset.frames || 1);
  const frameHeight = image.height;

  return (
    <div
      className={`sprite-renderer ${className}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: (asset.width || 32) * scale,
        height: (asset.height || 32) * scale,
        transform: `scaleX(${direction === 'left' ? -1 : 1})`,
        overflow: 'hidden',
        ...style
      }}
    >
      <img
        src={asset.path}
        alt={asset.name}
        style={{
          width: image.width * scale,
          height: image.height * scale,
          transform: `translateX(-${currentFrame * frameWidth * scale}px)`,
          imageRendering: 'pixelated'
        }}
        draggable={false}
      />
    </div>
  );
};

export default SpriteRenderer;
