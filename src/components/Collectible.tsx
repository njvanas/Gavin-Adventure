import React, { useEffect, useState } from 'react';

interface CollectibleProps {
  id: number;
  x: number;
  y: number;
  type: 'coin' | 'gem';
  playerPosition: { x: number; y: number };
  onCollect: (id: number, type: 'coin' | 'gem') => void;
}

const Collectible: React.FC<CollectibleProps> = ({ 
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

  const bounceOffset = Math.sin(bounce * 0.2) * 8;

  return (
    <div
      className="absolute z-30 transition-all duration-200 hover:scale-110"
      style={{
        left: x,
        bottom: groundLevel + y + bounceOffset,
        width: 32,
        height: 32
      }}
    >
      {type === 'coin' ? (
        <div className="w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center pixel-font text-lg animate-spin">
          💰
        </div>
      ) : (
        <div className="w-8 h-8 bg-purple-400 border-2 border-purple-600 rounded-sm flex items-center justify-center pixel-font text-lg animate-pulse">
          💎
        </div>
      )}
      
      {/* Collection hint */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-white pixel-font text-xs opacity-75">
        {type === 'coin' ? '+10' : '+50'}
      </div>
      
      {/* Glow effect */}
      <div className={`absolute inset-0 ${type === 'coin' ? 'bg-yellow-400' : 'bg-purple-400'} rounded-full opacity-30 animate-ping`}></div>
    </div>
  );
};

export default Collectible;