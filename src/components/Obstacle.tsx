import React from 'react';

interface ObstacleProps {
  x: number;
  y: number;
  type: 'block' | 'pipe' | 'platform';
  world: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ x, y, type, world }) => {
  const groundLevel = 128;

  const getObstacleData = () => {
    const baseData = {
      block: {
        width: 60,
        height: 60,
        color: 'bg-gray-500',
        border: 'border-gray-700',
        emoji: '🧱'
      },
      pipe: {
        width: 80,
        height: 120,
        color: 'bg-green-600',
        border: 'border-green-800',
        emoji: '🟢'
      },
      platform: {
        width: 120,
        height: 20,
        color: 'bg-brown-600',
        border: 'border-brown-800',
        emoji: '🪵'
      }
    };

    const obstacle = baseData[type];

    // Modify based on world theme
    switch (world) {
      case 1: // Jungle
        if (type === 'block') { obstacle.color = 'bg-green-700'; obstacle.emoji = '🌿'; }
        if (type === 'pipe') { obstacle.color = 'bg-brown-600'; obstacle.emoji = '🌳'; }
        if (type === 'platform') { obstacle.color = 'bg-green-800'; obstacle.emoji = '🍃'; }
        break;
      case 2: // Desert
        if (type === 'block') { obstacle.color = 'bg-yellow-700'; obstacle.emoji = '🏺'; }
        if (type === 'pipe') { obstacle.color = 'bg-orange-600'; obstacle.emoji = '🏛️'; }
        if (type === 'platform') { obstacle.color = 'bg-yellow-800'; obstacle.emoji = '🏜️'; }
        break;
      case 3: // Snow
        if (type === 'block') { obstacle.color = 'bg-blue-300'; obstacle.emoji = '🧊'; }
        if (type === 'pipe') { obstacle.color = 'bg-cyan-600'; obstacle.emoji = '❄️'; }
        if (type === 'platform') { obstacle.color = 'bg-blue-400'; obstacle.emoji = '🏔️'; }
        break;
      case 4: // Cyber
        if (type === 'block') { obstacle.color = 'bg-purple-600'; obstacle.emoji = '🔷'; }
        if (type === 'pipe') { obstacle.color = 'bg-cyan-600'; obstacle.emoji = '🏢'; }
        if (type === 'platform') { obstacle.color = 'bg-indigo-600'; obstacle.emoji = '⚡'; }
        break;
      case 5: // Haunted
        if (type === 'block') { obstacle.color = 'bg-gray-800'; obstacle.emoji = '🪦'; }
        if (type === 'pipe') { obstacle.color = 'bg-purple-800'; obstacle.emoji = '🏰'; }
        if (type === 'platform') { obstacle.color = 'bg-gray-900'; obstacle.emoji = '🌙'; }
        break;
    }

    return obstacle;
  };

  const obstacle = getObstacleData();

  return (
    <div
      className="absolute z-30"
      style={{
        left: x,
        bottom: groundLevel + y,
        width: obstacle.width,
        height: obstacle.height
      }}
    >
      {/* Obstacle Body */}
      <div className={`relative w-full h-full ${obstacle.color} border-2 ${obstacle.border} rounded-sm`}>
        {/* Obstacle Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          {obstacle.emoji}
        </div>
        
        {/* Shadow */}
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
    </div>
  );
};

export default Obstacle;