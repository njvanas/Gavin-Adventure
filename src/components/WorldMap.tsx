import React from 'react';
import { GameState } from '../App';

interface WorldMapProps {
  gameState: GameState;
  worlds: Array<{ name: string; theme: string; color: string }>;
  onSelectLevel: (world: number, level: number) => void;
  onBack: () => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ gameState, worlds, onSelectLevel, onBack }) => {
  const getLevelStatus = (world: number, level: number) => {
    const absoluteLevel = (world - 1) * 5 + level;
    if (absoluteLevel <= gameState.unlockedLevels) {
      return 'unlocked';
    }
    return 'locked';
  };

  const isBossLevel = (level: number) => level === 5;

  const getBossStatus = (world: number) => {
    return gameState.bossDefeated[world - 1] ? 'defeated' : 'active';
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-stars opacity-40"></div>
      </div>

      <div className="relative z-50 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-yellow-400 mb-4 pixel-font">
            🗺️ WORLD MAP
          </h1>
          <div className="text-white pixel-font text-lg">
            Progress: {gameState.unlockedLevels}/{gameState.totalLevels} Levels • Score: {gameState.score.toLocaleString()}
          </div>
        </div>

        {/* Worlds Grid */}
        <div className="max-w-6xl mx-auto space-y-8">
          {worlds.map((world, worldIndex) => {
            const worldNumber = worldIndex + 1;
            const worldUnlocked = gameState.unlockedLevels >= (worldNumber - 1) * 5 + 1;
            
            return (
              <div
                key={worldIndex}
                className={`bg-black/80 backdrop-blur-sm border-4 rounded-lg p-6 transition-all duration-300 ${
                  worldUnlocked ? `border-${world.color} shadow-lg` : 'border-gray-600 opacity-50'
                }`}
                style={{ borderColor: worldUnlocked ? world.color : '#4B5563' }}
              >
                {/* World Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-3xl border-4"
                      style={{ 
                        borderColor: world.color,
                        backgroundColor: worldUnlocked ? `${world.color}20` : '#374151'
                      }}
                    >
                      {worldIndex === 0 && '🌿'}
                      {worldIndex === 1 && '🏜️'}
                      {worldIndex === 2 && '🏔️'}
                      {worldIndex === 3 && '🏙️'}
                      {worldIndex === 4 && '🌲'}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold pixel-font" style={{ color: world.color }}>
                        World {worldNumber}
                      </h2>
                      <p className="text-xl text-white pixel-font">{world.name}</p>
                    </div>
                  </div>
                  
                  {/* World Progress */}
                  <div className="text-right">
                    <div className="text-white pixel-font text-sm">
                      Levels: {Math.min(5, Math.max(0, gameState.unlockedLevels - (worldNumber - 1) * 5))}/5
                    </div>
                    {gameState.bossDefeated[worldIndex] && (
                      <div className="text-yellow-400 pixel-font text-sm">
                        👑 Boss Defeated
                      </div>
                    )}
                  </div>
                </div>

                {/* Level Buttons */}
                <div className="grid grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(level => {
                    const status = getLevelStatus(worldNumber, level);
                    const isUnlocked = status === 'unlocked';
                    const isBoss = isBossLevel(level);
                    const bossStatus = isBoss ? getBossStatus(worldNumber) : null;
                    
                    return (
                      <button
                        key={level}
                        onClick={() => isUnlocked && onSelectLevel(worldNumber, level)}
                        disabled={!isUnlocked}
                        className={`relative h-20 rounded-lg border-2 pixel-font text-lg transition-all duration-200 ${
                          isUnlocked
                            ? `hover:scale-105 hover:shadow-lg ${
                                isBoss
                                  ? 'bg-red-600 hover:bg-red-700 border-red-400 text-white'
                                  : 'bg-blue-600 hover:bg-blue-700 border-blue-400 text-white'
                              }`
                            : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {/* Level Content */}
                        <div className="flex flex-col items-center justify-center h-full">
                          {isBoss ? (
                            <>
                              <div className="text-2xl mb-1">👹</div>
                              <div className="text-xs">BOSS</div>
                              {bossStatus === 'defeated' && (
                                <div className="absolute -top-2 -right-2 text-yellow-400 text-lg">
                                  ⭐
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="text-xl mb-1">{level}</div>
                              <div className="text-xs">LEVEL</div>
                            </>
                          )}
                        </div>

                        {/* Lock Icon */}
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-3xl">🔒</div>
                          </div>
                        )}

                        {/* Completion Star */}
                        {isUnlocked && !isBoss && (
                          <div className="absolute -top-2 -right-2 text-yellow-400 text-lg">
                            ⭐
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* World Description */}
                <div className="mt-4 text-center text-gray-300 pixel-font text-sm">
                  {worldIndex === 0 && "Ancient ruins filled with mysterious creatures and hidden treasures"}
                  {worldIndex === 1 && "Scorching sands with dangerous mirages and buried secrets"}
                  {worldIndex === 2 && "Frozen peaks with slippery platforms and ice-cold challenges"}
                  {worldIndex === 3 && "High-tech metropolis with laser barriers and robot enemies"}
                  {worldIndex === 4 && "Dark forest where the final boss awaits in the shadows"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-gray-400 hover:border-gray-300 transition-all duration-200 transform hover:scale-105"
          >
            ← BACK TO MENU
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;