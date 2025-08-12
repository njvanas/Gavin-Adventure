import React, { useState, useEffect } from 'react';

interface LevelGoalProps {
  x: number;
  y: number;
  playerPosition: { x: number; y: number };
  isBossLevel?: boolean;
}

const LevelGoal: React.FC<LevelGoalProps> = ({ x, y, playerPosition, isBossLevel = false }) => {
  const [isNear, setIsNear] = useState(false);
  const [flagAnimation, setFlagAnimation] = useState(0);
  
  const groundLevel = 128;

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setFlagAnimation(prev => (prev + 1) % 120);
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  useEffect(() => {
    const distance = Math.sqrt(
      Math.pow(playerPosition.x - x, 2) + Math.pow((groundLevel + playerPosition.y) - (groundLevel + y), 2)
    );

    setIsNear(distance < 100);
  }, [playerPosition, x, y]);

  const flagWave = Math.sin(flagAnimation * 0.1) * 5;

  return (
    <div
      className="absolute z-30"
      style={{
        left: x,
        bottom: groundLevel + y,
        width: 80,
        height: 200
      }}
    >
      {/* Flagpole */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-full bg-yellow-600 border-2 border-yellow-800 rounded-sm">
        {/* Pole segments */}
        <div className="absolute top-0 left-0 w-full h-4 bg-yellow-700 border-b border-yellow-800"></div>
        <div className="absolute top-8 left-0 w-full h-4 bg-yellow-700 border-b border-yellow-800"></div>
        <div className="absolute top-16 left-0 w-full h-4 bg-yellow-700 border-b border-yellow-800"></div>
      </div>
      
      {/* Flag */}
      <div 
        className={`absolute top-4 left-1/2 w-12 h-8 border-2 rounded-r-sm ${
          isBossLevel 
            ? 'bg-red-500 border-red-700' 
            : 'bg-green-500 border-green-700'
        }`}
        style={{
          transform: `translateX(-2px) rotateY(${flagWave}deg)`
        }}
      >
        {/* Flag design */}
        <div className="absolute inset-1 flex items-center justify-center text-white pixel-font text-xs">
          {isBossLevel ? '👹' : '🏁'}
        </div>
      </div>
      
      {/* Goal indicator */}
      <div className={`absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 border-2 rounded px-3 py-1 ${
        isBossLevel ? 'border-red-400' : 'border-green-400'
      }`}>
        <div className={`pixel-font text-xs text-center ${
          isBossLevel ? 'text-red-400' : 'text-green-400'
        }`}>
          {isBossLevel ? '👹 BOSS FIGHT' : '🏁 GOAL'}
        </div>
        <div className="pixel-font text-xs text-white text-center">
          {isBossLevel ? 'Prepare for battle!' : 'Reach to complete level!'}
        </div>
      </div>
      
      {/* Proximity effects */}
      {isNear && (
        <>
          <div className={`absolute inset-0 rounded-full animate-ping ${
            isBossLevel ? 'bg-red-400/20' : 'bg-green-400/20'
          }`}></div>
          <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 pixel-font text-sm animate-bounce ${
            isBossLevel ? 'text-red-400' : 'text-green-400'
          }`}>
            {isBossLevel ? '⚔️ BOSS AWAITS!' : '🎯 ALMOST THERE!'}
          </div>
        </>
      )}
      
      {/* Base */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-stone-600 border-2 border-stone-800 rounded-sm"></div>
      
      {/* Celebration particles */}
      {isNear && !isBossLevel && (
        <>
          <div className="absolute top-2 left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute top-6 right-2 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-10 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute top-14 right-4 w-1 h-1 bg-red-400 rounded-full animate-ping"></div>
        </>
      )}
      
      {/* Boss warning particles */}
      {isNear && isBossLevel && (
        <>
          <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute top-6 right-2 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
          <div className="absolute top-10 left-4 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          <div className="absolute top-14 right-4 w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
        </>
      )}
    </div>
  );
};

export default LevelGoal;