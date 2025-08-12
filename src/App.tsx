import React, { useState, useEffect, useCallback } from 'react';
import GameBackground from './components/GameBackground';
import Player from './components/Player';
import GameUI from './components/GameUI';
import Shop from './components/Shop';
import Boss from './components/Boss';
import Collectible from './components/Collectible';
import Enemy from './components/Enemy';
import Obstacle from './components/Obstacle';
import PowerUp from './components/PowerUp';
import LevelGoal from './components/LevelGoal';
import WorldMap from './components/WorldMap';
import GameMenu from './components/GameMenu';

export interface GameState {
  coins: number;
  lives: number;
  score: number;
  attackPower: number;
  health: number;
  maxHealth: number;
  gameStarted: boolean;
  showShop: boolean;
  currentBoss: number | null;
  playerPosition: { x: number; y: number };
  currentWorld: number;
  currentLevel: number;
  levelComplete: boolean;
  gameOver: boolean;
  gameWon: boolean;
  powerUpActive: string | null;
  powerUpTimer: number;
  showWorldMap: boolean;
  bossDefeated: boolean[];
  unlockedLevels: number;
  totalLevels: number;
  cameraX: number;
}

const WORLDS = [
  { name: 'Jungle Ruins', theme: 'jungle', color: '#228B22' },
  { name: 'Desert Wastelands', theme: 'desert', color: '#DAA520' },
  { name: 'Snowy Mountains', theme: 'snow', color: '#87CEEB' },
  { name: 'Futuristic City', theme: 'cyber', color: '#00FFFF' },
  { name: 'Haunted Forest', theme: 'haunted', color: '#8B008B' }
];

function App() {
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    lives: 3,
    score: 0,
    attackPower: 100,
    health: 100,
    maxHealth: 100,
    gameStarted: false,
    showShop: false,
    currentBoss: null,
    playerPosition: { x: 100, y: 0 },
    currentWorld: 1,
    currentLevel: 1,
    levelComplete: false,
    gameOver: false,
    gameWon: false,
    powerUpActive: null,
    powerUpTimer: 0,
    showWorldMap: false,
    bossDefeated: [false, false, false, false, false],
    unlockedLevels: 1,
    totalLevels: 25,
    cameraX: 0
  });

  const [collectibles, setCollectibles] = useState<Array<{id: number, x: number, y: number, type: 'coin' | 'gem'}>>([]);
  const [enemies, setEnemies] = useState<Array<{id: number, x: number, y: number, type: 'goomba' | 'koopa' | 'spiker'}>>([]);
  const [obstacles, setObstacles] = useState<Array<{id: number, x: number, y: number, type: 'block' | 'pipe' | 'platform'}>>([]);
  const [powerUps, setPowerUps] = useState<Array<{id: number, x: number, y: number, type: 'attack' | 'shield' | 'speed'}>>([]);
  const [levelGoal, setLevelGoal] = useState<{x: number, y: number} | null>(null);

  // Power-up timer
  useEffect(() => {
    if (gameState.powerUpTimer > 0) {
      const timer = setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          powerUpTimer: prev.powerUpTimer - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.powerUpActive) {
      setGameState(prev => ({
        ...prev,
        powerUpActive: null
      }));
    }
  }, [gameState.powerUpTimer, gameState.powerUpActive]);

  // Generate level content
  useEffect(() => {
    const generateLevel = (world: number, level: number) => {
      const levelWidth = 3000 + (level * 200);
      const difficulty = world + (level * 0.5);
      const isBossLevel = level % 5 === 0;

      if (isBossLevel) {
        // Boss level - minimal collectibles, focus on boss fight
        setCollectibles([]);
        setEnemies([]);
        setObstacles([]);
        setPowerUps([]);
        setLevelGoal({ x: levelWidth - 200, y: 0 });
        return;
      }

      // Generate collectibles
      const newCollectibles = [];
      const collectibleCount = 20 + (level * 3);
      for (let i = 0; i < collectibleCount; i++) {
        newCollectibles.push({
          id: i,
          x: 200 + i * (levelWidth / collectibleCount) + Math.random() * 150,
          y: Math.random() * 100,
          type: Math.random() > 0.7 ? 'gem' : 'coin' as 'coin' | 'gem'
        });
      }
      setCollectibles(newCollectibles);

      // Generate enemies based on world theme
      const newEnemies = [];
      const enemyCount = 8 + (level * 2);
      const worldEnemyTypes = {
        1: ['goomba', 'koopa'],
        2: ['spiker', 'goomba'],
        3: ['koopa', 'spiker'],
        4: ['spiker', 'koopa'],
        5: ['goomba', 'spiker', 'koopa']
      };
      
      const enemyTypes = worldEnemyTypes[world as keyof typeof worldEnemyTypes] || ['goomba'];
      
      for (let i = 0; i < enemyCount; i++) {
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        newEnemies.push({
          id: i + 1000,
          x: 400 + i * (levelWidth / enemyCount) + Math.random() * 200,
          y: Math.random() * 50,
          type: enemyType as 'goomba' | 'koopa' | 'spiker'
        });
      }
      setEnemies(newEnemies);

      // Generate obstacles
      const newObstacles = [];
      const obstacleCount = 12 + level;
      const obstacleTypes: ('block' | 'pipe' | 'platform')[] = ['block', 'pipe', 'platform'];
      for (let i = 0; i < obstacleCount; i++) {
        newObstacles.push({
          id: i + 2000,
          x: 500 + i * (levelWidth / obstacleCount) + Math.random() * 150,
          y: Math.random() * 80,
          type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
        });
      }
      setObstacles(newObstacles);

      // Generate power-ups
      const newPowerUps = [];
      const powerUpCount = 4 + Math.floor(level / 2);
      const powerUpTypes: ('attack' | 'shield' | 'speed')[] = ['attack', 'shield', 'speed'];
      for (let i = 0; i < powerUpCount; i++) {
        newPowerUps.push({
          id: i + 3000,
          x: 600 + i * (levelWidth / powerUpCount) + Math.random() * 300,
          y: Math.random() * 80,
          type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
        });
      }
      setPowerUps(newPowerUps);

      // Set level goal
      setLevelGoal({
        x: levelWidth - 150,
        y: 0
      });
    };

    if (gameState.gameStarted && !gameState.levelComplete && !gameState.showWorldMap) {
      generateLevel(gameState.currentWorld, gameState.currentLevel);
    }
  }, [gameState.gameStarted, gameState.currentWorld, gameState.currentLevel, gameState.levelComplete, gameState.showWorldMap]);

  const startGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      gameStarted: true,
      gameOver: false,
      gameWon: false,
      showWorldMap: false
    }));
  };

  const showWorldMap = () => {
    setGameState(prev => ({ ...prev, showWorldMap: true }));
  };

  const selectLevel = (world: number, level: number) => {
    const absoluteLevel = (world - 1) * 5 + level;
    if (absoluteLevel <= gameState.unlockedLevels) {
      setGameState(prev => ({
        ...prev,
        currentWorld: world,
        currentLevel: level,
        showWorldMap: false,
        levelComplete: false,
        playerPosition: { x: 100, y: 0 },
        cameraX: 0
      }));
    }
  };

  const restartGame = () => {
    setGameState({
      coins: 0,
      lives: 3,
      score: 0,
      attackPower: 100,
      health: 100,
      maxHealth: 100,
      gameStarted: true,
      showShop: false,
      currentBoss: null,
      playerPosition: { x: 100, y: 0 },
      currentWorld: 1,
      currentLevel: 1,
      levelComplete: false,
      gameOver: false,
      gameWon: false,
      powerUpActive: null,
      powerUpTimer: 0,
      showWorldMap: false,
      bossDefeated: [false, false, false, false, false],
      unlockedLevels: 1,
      totalLevels: 25,
      cameraX: 0
    });
  };

  const collectItem = useCallback((id: number, type: 'coin' | 'gem') => {
    setCollectibles(prev => prev.filter(item => item.id !== id));
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + (type === 'coin' ? 10 : 50),
      score: prev.score + (type === 'coin' ? 100 : 500)
    }));
  }, []);

  const collectPowerUp = useCallback((id: number, type: 'attack' | 'shield' | 'speed') => {
    setPowerUps(prev => prev.filter(item => item.id !== id));
    
    const powerUpEffects = {
      attack: { name: 'ATTACK BOOST', timer: 10 },
      shield: { name: 'SHIELD', timer: 15 },
      speed: { name: 'SPEED BOOST', timer: 12 }
    };

    const effect = powerUpEffects[type];
    
    setGameState(prev => ({
      ...prev,
      attackPower: type === 'attack' ? prev.attackPower * 2 : prev.attackPower,
      powerUpActive: effect.name,
      powerUpTimer: effect.timer,
      score: prev.score + 1000
    }));
  }, []);

  const handleEnemyCollision = useCallback((id: number, damage: number) => {
    setEnemies(prev => prev.filter(enemy => enemy.id !== id));
    setGameState(prev => {
      const newHealth = Math.max(0, prev.health - damage);
      const newLives = newHealth <= 0 ? prev.lives - 1 : prev.lives;
      const gameOver = newLives <= 0;
      
      return {
        ...prev,
        health: newHealth <= 0 ? prev.maxHealth : newHealth,
        lives: newLives,
        gameOver: gameOver,
        attackPower: Math.max(25, prev.attackPower * 0.75), // Reduce attack power by 25%
        playerPosition: newHealth <= 0 ? { x: 100, y: 0 } : prev.playerPosition,
        cameraX: newHealth <= 0 ? 0 : prev.cameraX
      };
    });
  }, []);

  const spawnBoss = (bossId: number) => {
    setGameState(prev => ({ ...prev, currentBoss: bossId }));
  };

  const defeatBoss = () => {
    const bossIndex = Math.floor((gameState.currentLevel - 1) / 5);
    setGameState(prev => {
      const newBossDefeated = [...prev.bossDefeated];
      newBossDefeated[bossIndex] = true;
      
      const isGameWon = bossIndex === 4; // Final boss defeated
      
      return {
        ...prev,
        currentBoss: null,
        bossDefeated: newBossDefeated,
        coins: prev.coins + 1000,
        score: prev.score + 5000,
        attackPower: prev.attackPower * 2, // Double attack power
        gameWon: isGameWon,
        unlockedLevels: isGameWon ? prev.unlockedLevels : prev.unlockedLevels + 1
      };
    });
  };

  const updatePlayerPosition = (x: number, y: number) => {
    setGameState(prev => ({ 
      ...prev, 
      playerPosition: { x, y },
      cameraX: Math.max(0, x - window.innerWidth / 2)
    }));
    
    // Check level completion
    if (levelGoal && x >= levelGoal.x - 50) {
      completeLevel();
    }
  };

  const completeLevel = () => {
    const isBossLevel = gameState.currentLevel % 5 === 0;
    
    if (isBossLevel) {
      // Spawn boss instead of completing level
      spawnBoss(Math.floor((gameState.currentLevel - 1) / 5) + 1);
      return;
    }

    setGameState(prev => {
      const nextLevel = prev.currentLevel + 1;
      const nextWorld = Math.ceil(nextLevel / 5);
      
      return {
        ...prev,
        levelComplete: true,
        currentLevel: nextLevel,
        currentWorld: nextWorld,
        score: prev.score + 2000,
        coins: prev.coins + 200,
        unlockedLevels: Math.max(prev.unlockedLevels, nextLevel)
      };
    });
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        levelComplete: false,
        playerPosition: { x: 100, y: 0 },
        cameraX: 0
      }));
    }, 3000);
  };

  // Game Won Screen
  if (gameState.gameWon) {
    return (
      <div className="min-h-screen overflow-hidden">
        <GameBackground world={5} />
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 backdrop-blur-sm border-4 border-yellow-400 p-12 rounded-lg shadow-2xl max-w-2xl">
            <h1 className="text-6xl font-bold text-yellow-400 mb-6 text-center pixel-font animate-pulse">
              🏆 VICTORY! 🏆
            </h1>
            <div className="text-green-400 text-center pixel-font text-lg mb-8 space-y-4">
              <p>🎉 You conquered all 5 worlds!</p>
              <p>👑 Final Score: {gameState.score.toLocaleString()}</p>
              <p>💰 Total Coins: {gameState.coins}</p>
              <p>⚔️ Final Attack Power: {gameState.attackPower}</p>
              <p className="text-yellow-400">You are the ultimate platformer champion!</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={restartGame}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-green-400 hover:border-green-300 transition-all duration-200 transform hover:scale-105"
              >
                PLAY AGAIN
              </button>
              <button 
                onClick={showWorldMap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-blue-400 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                WORLD MAP
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState.gameOver) {
    return (
      <div className="min-h-screen overflow-hidden">
        <GameBackground world={gameState.currentWorld} />
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 backdrop-blur-sm border-4 border-red-400 p-12 rounded-lg shadow-2xl max-w-2xl">
            <h1 className="text-6xl font-bold text-red-400 mb-6 text-center pixel-font">
              GAME OVER
            </h1>
            <div className="text-white text-center pixel-font text-lg mb-8 space-y-4">
              <p>💀 Better luck next time!</p>
              <p>🏆 Final Score: {gameState.score.toLocaleString()}</p>
              <p>🌍 World Reached: {gameState.currentWorld}</p>
              <p>📊 Level Reached: {gameState.currentLevel}</p>
              <p>⚔️ Attack Power: {gameState.attackPower}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={restartGame}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-green-400 hover:border-green-300 transition-all duration-200 transform hover:scale-105"
              >
                TRY AGAIN
              </button>
              <button 
                onClick={showWorldMap}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-blue-400 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                WORLD MAP
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Level Complete Screen
  if (gameState.levelComplete) {
    return (
      <div className="min-h-screen overflow-hidden">
        <GameBackground world={gameState.currentWorld} />
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 backdrop-blur-sm border-4 border-yellow-400 p-12 rounded-lg shadow-2xl max-w-2xl">
            <h1 className="text-6xl font-bold text-yellow-400 mb-6 text-center pixel-font">
              LEVEL COMPLETE!
            </h1>
            <div className="text-green-400 text-center pixel-font text-lg mb-8 space-y-4">
              <p>🎉 {WORLDS[gameState.currentWorld - 1]?.name} Level {((gameState.currentLevel - 1) % 5) + 1} Complete!</p>
              <p>🏆 Score: {gameState.score.toLocaleString()}</p>
              <p>💰 Bonus: +200 coins</p>
              <p>⚔️ Attack Power: {gameState.attackPower}</p>
              {gameState.currentLevel % 5 === 0 && (
                <p className="text-red-400 animate-pulse">⚠️ BOSS BATTLE NEXT!</p>
              )}
            </div>
            <div className="text-white text-center pixel-font text-sm">
              <p>Loading next level...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // World Map Screen
  if (gameState.showWorldMap) {
    return (
      <WorldMap
        gameState={gameState}
        worlds={WORLDS}
        onSelectLevel={selectLevel}
        onBack={() => setGameState(prev => ({ ...prev, showWorldMap: false }))}
      />
    );
  }

  // Start Screen
  if (!gameState.gameStarted) {
    return (
      <GameMenu
        onStartGame={startGame}
        onShowWorldMap={showWorldMap}
        gameState={gameState}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-hidden relative">
      <GameBackground world={gameState.currentWorld} />
      
      <GameUI 
        gameState={gameState}
        worlds={WORLDS}
        onShowWorldMap={showWorldMap}
        onSpawnBoss={spawnBoss}
      />
      
      <div style={{ transform: `translateX(-${gameState.cameraX}px)` }}>
        <Player 
          gameState={gameState}
          onUpdatePosition={updatePlayerPosition}
        />
        
        {collectibles.map(item => (
          <Collectible
            key={item.id}
            id={item.id}
            x={item.x}
            y={item.y}
            type={item.type}
            playerPosition={gameState.playerPosition}
            onCollect={collectItem}
          />
        ))}
        
        {powerUps.map(powerUp => (
          <PowerUp
            key={powerUp.id}
            id={powerUp.id}
            x={powerUp.x}
            y={powerUp.y}
            type={powerUp.type}
            playerPosition={gameState.playerPosition}
            onCollect={collectPowerUp}
          />
        ))}
        
        {enemies.map(enemy => (
          <Enemy
            key={enemy.id}
            id={enemy.id}
            x={enemy.x}
            y={enemy.y}
            type={enemy.type}
            playerPosition={gameState.playerPosition}
            onCollision={handleEnemyCollision}
            world={gameState.currentWorld}
          />
        ))}
        
        {obstacles.map(obstacle => (
          <Obstacle
            key={obstacle.id}
            x={obstacle.x}
            y={obstacle.y}
            type={obstacle.type}
            world={gameState.currentWorld}
          />
        ))}
        
        {levelGoal && (
          <LevelGoal
            x={levelGoal.x}
            y={levelGoal.y}
            playerPosition={gameState.playerPosition}
            isBossLevel={gameState.currentLevel % 5 === 0}
          />
        )}
      </div>
      
      {gameState.currentBoss !== null && (
        <Boss
          bossId={gameState.currentBoss}
          playerAttackPower={gameState.attackPower}
          onDefeat={defeatBoss}
          onPlayerHit={() => setGameState(prev => ({ 
            ...prev, 
            attackPower: Math.max(25, prev.attackPower * 0.75),
            health: Math.max(0, prev.health - 25)
          }))}
          onClose={() => setGameState(prev => ({ ...prev, currentBoss: null }))}
        />
      )}
    </div>
  );
}

export default App;