import React from 'react';
import { GameState } from '../App';

interface GameUIProps {
  gameState: GameState;
  worlds: Array<{ name: string; theme: string; color: string }>;
  onShowWorldMap: () => void;
  onSpawnBoss: (bossId: number) => void;
  onTogglePause: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, worlds, onShowWorldMap, onSpawnBoss, onTogglePause }) => {
  const currentWorld = worlds[gameState.currentWorld - 1];
  const isBossLevel = gameState.currentLevel % 5 === 0;
  const levelInWorld = ((gameState.currentLevel - 1) % 5) + 1;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      {/* Top Stats Bar */}
      <div className="bg-black/90 border-2 border-yellow-400 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center pixel-font text-sm">
          <div className="flex space-x-6">
            <div className="text-yellow-400">
              💰 COINS: {gameState.coins}
            </div>
            <div className="text-blue-400">
              🏆 SCORE: {gameState.score.toLocaleString()}
            </div>
            <div className="text-green-400">
              ❤️ LIVES: {gameState.lives}
            </div>
            <div className="text-red-400">
              ⚔️ ATTACK: {gameState.attackPower}
            </div>
            <div className="text-orange-400">
              🍗 CHICKEN: {gameState.chicken}
            </div>
            <div className="text-purple-400">
              💪 STRENGTH: {gameState.strength}
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={onTogglePause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded border-2 border-yellow-400 transition-all duration-200"
            >
              ⏸️ PAUSE
            </button>
            
            <button
              onClick={onShowWorldMap}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded border-2 border-blue-400 transition-all duration-200"
            >
              🗺️ MAP
            </button>
            
            {isBossLevel && (
              <button
                onClick={() => onSpawnBoss(Math.floor((gameState.currentLevel - 1) / 5) + 1)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded border-2 border-red-400 transition-all duration-200 animate-pulse"
              >
                👹 BOSS FIGHT
              </button>
            )}
          </div>
        </div>
        
        {/* Health Bar */}
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            <span className="text-red-400 pixel-font text-xs">❤️ HP:</span>
            <div className="flex-1 bg-gray-700 rounded-full h-3 border border-gray-500">
              <div 
                className="bg-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(gameState.health / gameState.maxHealth) * 100}%` }}
              ></div>
            </div>
            <span className="text-white pixel-font text-xs">
              {gameState.health}/{gameState.maxHealth}
            </span>
          </div>
        </div>
        
        {/* Power-up indicator */}
        {gameState.powerUpActive && (
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 pixel-font text-xs">⚡ POWER:</span>
              <div className="flex-1 bg-gray-700 rounded-full h-3 border border-yellow-500">
                <div 
                  className="bg-yellow-500 h-full rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: `${(gameState.powerUpTimer / 20) * 100}%` }}
                ></div>
              </div>
              <span className="text-yellow-400 pixel-font text-xs">
                {gameState.powerUpActive} ({gameState.powerUpTimer}s)
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Level Info */}
      <div className="bg-black/80 border-2 border-purple-400 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="pixel-font text-lg text-purple-400">
              🌍 {currentWorld?.name || 'Unknown World'}
            </div>
            <div className="pixel-font text-sm text-white">
              Level {levelInWorld}/5 {isBossLevel ? '(BOSS LEVEL)' : ''}
            </div>
          </div>
          <div className="text-right">
            <div className="pixel-font text-sm text-gray-300">
              Progress: {gameState.unlockedLevels}/{gameState.totalLevels}
            </div>
            <div className="pixel-font text-xs text-gray-400">
              World {gameState.currentWorld}/5
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls reminder */}
      <div className="absolute top-4 right-4 bg-black/80 border-2 border-green-400 rounded-lg p-3 max-w-xs">
        <div className="pixel-font text-xs text-green-400 mb-2">🎮 CONTROLS</div>
        <div className="pixel-font text-xs text-white space-y-1">
          <div>• WASD/Arrows: Move & Jump</div>
          <div>• X: Attack (when available)</div>
          <div>• Jump on enemies to defeat them</div>
          <div>• Collect coins and power-ups</div>
          <div>• Reach the flag to complete level</div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;