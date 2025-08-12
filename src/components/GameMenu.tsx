import React from 'react';
import { GameState } from '../App';

interface GameMenuProps {
  onStartGame: () => void;
  onShowWorldMap: () => void;
  gameState: GameState;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame, onShowWorldMap, gameState }) => {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-stars opacity-60"></div>
        <div className="absolute inset-0">
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-50 flex items-center justify-center min-h-screen">
        <div className="bg-black/90 backdrop-blur-sm border-4 border-yellow-400 p-12 rounded-lg shadow-2xl max-w-4xl">
          {/* Game Title */}
          <div className="text-center mb-8">
            <h1 className="text-8xl font-bold text-yellow-400 mb-4 pixel-font animate-pulse">
              SUPER
            </h1>
            <h1 className="text-6xl font-bold text-red-400 mb-2 pixel-font">
              PLATFORMER
            </h1>
            <h2 className="text-2xl font-bold text-green-400 pixel-font">
              ADVENTURE
            </h2>
          </div>

          {/* Game Description */}
          <div className="text-center mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white pixel-font text-sm">
              <div className="space-y-2">
                <h3 className="text-yellow-400 text-lg">🎮 GAMEPLAY</h3>
                <p>• Jump and run through 25 levels</p>
                <p>• Explore 5 unique worlds</p>
                <p>• Collect coins and power-ups</p>
                <p>• Defeat enemies and obstacles</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-red-400 text-lg">👹 BOSS BATTLES</h3>
                <p>• Epic boss fights every 5 levels</p>
                <p>• Two-phase boss mechanics</p>
                <p>• Attack power doubles when you hit boss</p>
                <p>• Attack power decreases when hit</p>
              </div>
            </div>
          </div>

          {/* World Preview */}
          <div className="mb-8">
            <h3 className="text-center text-yellow-400 pixel-font text-lg mb-4">🌍 EXPLORE 5 WORLDS</h3>
            <div className="grid grid-cols-5 gap-2 text-center pixel-font text-xs">
              <div className="bg-green-800/50 p-2 rounded border border-green-400">
                <div className="text-2xl mb-1">🌿</div>
                <div className="text-green-400">Jungle Ruins</div>
              </div>
              <div className="bg-yellow-800/50 p-2 rounded border border-yellow-400">
                <div className="text-2xl mb-1">🏜️</div>
                <div className="text-yellow-400">Desert Wastelands</div>
              </div>
              <div className="bg-blue-800/50 p-2 rounded border border-blue-400">
                <div className="text-2xl mb-1">🏔️</div>
                <div className="text-blue-400">Snowy Mountains</div>
              </div>
              <div className="bg-cyan-800/50 p-2 rounded border border-cyan-400">
                <div className="text-2xl mb-1">🏙️</div>
                <div className="text-cyan-400">Futuristic City</div>
              </div>
              <div className="bg-purple-800/50 p-2 rounded border border-purple-400">
                <div className="text-2xl mb-1">🌲</div>
                <div className="text-purple-400">Haunted Forest</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mb-8 bg-gray-900/50 p-4 rounded border border-gray-600">
            <h3 className="text-center text-blue-400 pixel-font text-lg mb-3">🎮 CONTROLS</h3>
            <div className="grid grid-cols-2 gap-4 text-white pixel-font text-xs">
              <div>
                <p>🏃 <strong>WASD / Arrow Keys:</strong> Move</p>
                <p>🦘 <strong>Space / W:</strong> Jump</p>
              </div>
              <div>
                <p>👊 <strong>X:</strong> Attack</p>
                <p>⏸️ <strong>ESC:</strong> Pause</p>
              </div>
            </div>
          </div>

          {/* Progress Display */}
          {gameState.unlockedLevels > 1 && (
            <div className="mb-6 text-center">
              <div className="text-green-400 pixel-font text-sm">
                🏆 Progress: {gameState.unlockedLevels}/{gameState.totalLevels} Levels Unlocked
              </div>
              <div className="text-yellow-400 pixel-font text-sm">
                💰 Best Score: {gameState.score.toLocaleString()}
              </div>
            </div>
          )}

          {/* Menu Buttons */}
          <div className="flex justify-center space-x-6">
            <button 
              onClick={onStartGame}
              className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded pixel-font text-2xl border-4 border-green-400 hover:border-green-300 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-green-400/50"
            >
              🚀 START GAME
            </button>
            
            {gameState.unlockedLevels > 1 && (
              <button 
                onClick={onShowWorldMap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded pixel-font text-2xl border-4 border-blue-400 hover:border-blue-300 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-400/50"
              >
                🗺️ WORLD MAP
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 pixel-font text-xs">
            <p>A classic 2D platformer adventure • Made with React & TypeScript</p>
            <p className="mt-2">Ready for GitHub Pages deployment 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;