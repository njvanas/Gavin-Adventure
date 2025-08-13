import React, { useEffect, useState } from 'react';

interface EnemyProps {
  id: number;
  x: number;
  y: number;
  type: 'goomba' | 'koopa' | 'spiker';
  playerPosition: { x: number; y: number };
  onCollision: (id: number, damage: number) => void;
  world: number;
}

const Enemy: React.FC<EnemyProps> = ({ 
  id, 
  x, 
  y, 
  type, 
  playerPosition, 
  onCollision,
  world
}) => {
  const [defeated, setDefeated] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [direction, setDirection] = useState(1);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  const groundLevel = 128;

  // Enemy properties based on world and type
  const getEnemyData = () => {
    const baseData = {
      goomba: { 
        emoji: '🍄', 
        damage: 15, 
        size: 40, 
        color: 'bg-brown-600',
        name: 'Goomba',
        speed: 1
      },
      koopa: { 
        emoji: '🐢', 
        damage: 20, 
        size: 45, 
        color: 'bg-green-600',
        name: 'Koopa',
        speed: 1.5
      },
      spiker: { 
        emoji: '🦔', 
        damage: 25, 
        size: 35, 
        color: 'bg-gray-600',
        name: 'Spiker',
        speed: 0.8
      }
    };

    // Modify based on world theme
    const enemy = baseData[type];
    switch (world) {
      case 1: // Jungle
        if (type === 'goomba') enemy.emoji = '🐸';
        if (type === 'koopa') enemy.emoji = '🦎';
        if (type === 'spiker') enemy.emoji = '🕷️';
        break;
      case 2: // Desert
        if (type === 'goomba') enemy.emoji = '🦂';
        if (type === 'koopa') enemy.emoji = '🐍';
        if (type === 'spiker') enemy.emoji = '🦎';
        break;
      case 3: // Snow
        if (type === 'goomba') enemy.emoji = '🐧';
        if (type === 'koopa') enemy.emoji = '🐻‍❄️';
        if (type === 'spiker') enemy.emoji = '❄️';
        break;
      case 4: // Cyber
        if (type === 'goomba') enemy.emoji = '🤖';
        if (type === 'koopa') enemy.emoji = '👾';
        if (type === 'spiker') enemy.emoji = '⚡';
        break;
      case 5: // Haunted
        if (type === 'goomba') enemy.emoji = '👻';
        if (type === 'koopa') enemy.emoji = '🦇';
        if (type === 'spiker') enemy.emoji = '💀';
        break;
    }

    return enemy;
  };

  const enemy = getEnemyData();

  // Enemy AI movement
  useEffect(() => {
    if (defeated) return;

    const moveInterval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + (direction * enemy.speed);
        
        // Bounce off screen edges or obstacles
        if (newX <= 0 || newX >= window.innerWidth - enemy.size) {
          setDirection(prev => -prev);
          newX = prev.x;
        }
        
        // Add some randomness to movement
        if (Math.random() < 0.01) { // 1% chance to change direction
          setDirection(prev => -prev);
        }
        
        return { ...prev, x: newX };
      });
      
      setAnimationFrame(prev => (prev + 1) % 60);
    }, 50);

    return () => clearInterval(moveInterval);
  }, [defeated, direction, enemy.speed, enemy.size]);

  // Collision detection
  useEffect(() => {
    if (defeated) return;

    const distance = Math.sqrt(
      Math.pow(playerPosition.x - position.x, 2) + 
      Math.pow((groundLevel + playerPosition.y) - (groundLevel + position.y), 2)
    );

    if (distance < 50) {
      setDefeated(true);
      onCollision(id, enemy.damage);
    }
  }, [playerPosition, position, id, enemy.damage, onCollision, defeated]);

  // Check if player jumped on enemy
  useEffect(() => {
    if (defeated) return;

    const horizontalDistance = Math.abs(playerPosition.x - position.x);
    const verticalDistance = (groundLevel + playerPosition.y) - (groundLevel + position.y);

    // Player is above enemy and close horizontally
    if (horizontalDistance < 40 && verticalDistance > 20 && verticalDistance < 60) {
      setDefeated(true);
      // Don't call onCollision - player successfully jumped on enemy
    }
  }, [playerPosition, position, defeated]);

  if (defeated) return null;

  const bounce = Math.sin(animationFrame * 0.2) * 3;

  return (
    <div
      className="absolute z-35 transition-all duration-100"
      style={{
        left: position.x,
        bottom: groundLevel + position.y + bounce,
        width: enemy.size,
        height: enemy.size,
        transform: direction > 0 ? 'scaleX(1)' : 'scaleX(-1)'
      }}
    >
      {/* Enemy Body */}
      <div className={`relative w-full h-full ${enemy.color} border-2 border-black rounded-sm animate-pulse`}>
        {/* Enemy Face */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {enemy.emoji}
        </div>
        
        {/* Enemy Shadow */}
        <div 
          className="absolute bg-black/30 rounded-full"
          style={{
            bottom: -8,
            left: '10%',
            width: '80%',
            height: 8
          }}
        ></div>
      </div>
      
      {/* Enemy Info (on hover) */}
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 border-2 border-red-400 rounded px-2 py-1 min-w-max opacity-0 hover:opacity-100 transition-opacity">
        <div className="pixel-font text-xs text-red-400 text-center">
          {enemy.name}
        </div>
        <div className="pixel-font text-xs text-white text-center">
          DMG: {enemy.damage}
        </div>
      </div>
      
      {/* Danger indicator */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-red-400 animate-bounce">
        ⚠️
      </div>
    </div>
  );
};

export default Enemy;