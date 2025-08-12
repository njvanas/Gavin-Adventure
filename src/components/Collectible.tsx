import React, { useState, useEffect } from 'react';
import { COINS, CHICKEN, DUMBBELLS, SUPER_SERUM } from '../config/Assets';
import SpriteRenderer from './SpriteRenderer';

interface CollectibleProps {
  id: number;
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'chicken' | 'dumbbell' | 'serum';
  playerPosition: { x: number; y: number };
  onCollect: (id: number, type: string, value: number, strength?: number) => void;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
}

const Collectible: React.FC<CollectibleProps> = ({ 
  id, 
  x, 
  y, 
  type, 
  playerPosition, 
  onCollect,
  rarity = 'common'
}) => {
  const [isCollected, setIsCollected] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);

  // Get the appropriate asset based on type
  const getCollectibleAsset = () => {
    switch (type) {
      case 'coin':
        return COINS[0]; // Gold coin
      case 'gem':
        return COINS[1]; // Silver coin (gem)
      case 'chicken':
        return CHICKEN;
      case 'dumbbell':
        // Randomly select a dumbbell based on rarity
        if (rarity === 'legendary') return DUMBBELLS[2]; // Large
        if (rarity === 'epic') return DUMBBELLS[1]; // Medium
        return DUMBBELLS[0]; // Small
      case 'serum':
        return SUPER_SERUM;
      default:
        return COINS[0];
    }
  };

  const asset = getCollectibleAsset();

  // Floating animation
  useEffect(() => {
    if (isCollected) return;

    const floatInterval = setInterval(() => {
      setFloatOffset(prev => (prev + 0.5) % (Math.PI * 2));
    }, 50);

    return () => clearInterval(floatInterval);
  }, [isCollected]);

  // Check collision with player
  useEffect(() => {
    if (isCollected) return;

    const playerSize = 64;
    const collectibleSize = (asset.width || 32);
    
    const distance = Math.sqrt(
      Math.pow(x - playerPosition.x, 2) + 
      Math.pow(y - playerPosition.y, 2)
    );

    if (distance < (playerSize + collectibleSize) / 2) {
      collectItem();
    }
  }, [x, y, playerPosition, isCollected, asset.width]);

  const collectItem = () => {
    if (isCollected) return;

    setIsCollected(true);
    
    // Call the collect callback with appropriate values
    const value = asset.properties.value || 0;
    const strength = asset.properties.strength || 0;
    
    onCollect(id, type, value, strength);
    
    // Add collection effect
    setIsFloating(true);
    setTimeout(() => setIsFloating(false), 1000);
  };

  if (isCollected) {
    return null;
  }

  const rarityColors = {
    common: 'border-gray-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400'
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-blue-400',
    epic: 'shadow-purple-400',
    legendary: 'shadow-yellow-400'
  };

  return (
    <div
      className={`absolute z-30 ${rarityGlow[rarity]}`}
      style={{
        left: x,
        bottom: 128 + y + Math.sin(floatOffset) * 5, // Ground level + offset + floating effect
        transform: `scale(${isFloating ? 1.5 : 1})`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      {/* Rarity border */}
      <div className={`absolute inset-0 border-2 ${rarityColors[rarity]} rounded-full opacity-50`}></div>
      
      {/* Main sprite */}
      <SpriteRenderer
        asset={asset}
        x={0}
        y={0}
        scale={1}
        isActive={true}
        className="relative z-10"
      />
      
      {/* Collection effect */}
      {isFloating && (
        <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
      )}
      
      {/* Rarity indicator */}
      {rarity !== 'common' && (
        <div className={`absolute -top-2 -right-2 w-3 h-3 rounded-full border-2 ${rarityColors[rarity]} bg-white text-xs flex items-center justify-center`}>
          {rarity === 'rare' && 'R'}
          {rarity === 'epic' && 'E'}
          {rarity === 'legendary' && 'L'}
        </div>
      )}
      
      {/* Value display */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white pixel-font text-xs text-center opacity-75">
        {asset.properties.value && `+${asset.properties.value}`}
        {asset.properties.strength && `💪+${asset.properties.strength}`}
      </div>
    </div>
  );
};

export default Collectible;