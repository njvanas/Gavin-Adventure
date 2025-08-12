import React, { useEffect, useState } from 'react';

interface PowerUpProps {
  id: number;
  x: number;
  y: number;
  type: 'attack' | 'shield' | 'speed';
  playerPosition: { x: number; y: number };
  onCollect: (id: number, type: 'attack' | 'shield' | 'speed') => void;
}

const PowerUp: React.FC<PowerUpProps> = ({ 
  id, 
  x, 
  y, 
  type, 
  playerPosition, 
  onCollect 
}) => {
  const [collected, setCollected] = useState(false);
  const [bounce, setBounce] = useState(0);
  
  const groundLevel = 128;

  const powerUpData = {
    attack: {
      emoji: '⚔️',
      color: 'bg-red-500',
      border: 'border-red-700',
      name: 'Attack Boost',
      effect: 'Double Attack (10s)',
      glow: 'shadow-red-400'
    },
    shield: {
      emoji: '🛡️',
      color: 'bg-blue-500',
      border: 'border-blue-700',
      name: 'Shield',
      effect: 'Absorb 1 Hit (15s)',
      glow: 'shadow-blue-400'
    },
    speed: {
      emoji: '👟',
      color: 'bg-green-500',
      border: 'border-green-700',
      name: 'Speed Boost',
      effect: 'Faster Movement (12s)',
      glow: 'shadow-green-400'
    }
  };

  const powerUp = powerUpData[type];

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce(prev => (prev + 1) % 60);
    }, 50);

    return () => clearInterval(bounceInterval);
  }, []);

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(playerPosition.x - x, 2) + Math.pow((groundLevel + playerPosition.y) - (groundLevel + y), 2)
    );

    if (distance < 50 && !collected) {
      setCollected(true);
      onCollect(id, type);
    }
  }, [playerPosition, x, y, id, type, onCollect, collected]);

  if (collected) return null;

  const bounceOffset = Math.sin(bounce * 0.2) * 10;

  return (
    <div
      className="absolute z-30 transition-all duration-200 hover:scale-110"
      style={{
        left: x,
        bottom: groundLevel + y + bounceOffset,
        width: 40,
        height: 40
      }}
    >
      {/* Power-up container */}
      <div className={`relative w-full h-full ${powerUp.color} border-2 ${powerUp.border} rounded-lg flex items-center justify-center animate-pulse shadow-lg ${powerUp.glow}`}>
        {/* Power-up icon */}
        <div className="text-2xl">
          {powerUp.emoji}
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 ${powerUp.color} rounded-lg opacity-50 animate-ping`}></div>
        
        {/* Sparkle effects */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
      </div>
      
      {/* Power-up info popup */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 border-2 border-yellow-400 rounded px-2 py-1 min-w-max">
        <div className="pixel-font text-xs text-yellow-400 text-center">
          {powerUp.name}
        </div>
        <div className="pixel-font text-xs text-white text-center">
          {powerUp.effect}
        </div>
      </div>
      
      {/* Collection hint */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 pixel-font text-xs opacity-75 animate-bounce">
        ⚡ POWER-UP
      </div>
    </div>
  );
};

export default PowerUp;