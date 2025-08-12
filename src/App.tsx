import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { GameEngine } from './systems/GameEngine';
import { GameState, LevelData, Platform, Enemy as EnemyType, Collectible as CollectibleType, PowerUp as PowerUpType } from './types/GameTypes';

const WORLDS = [
  { name: 'Jungle Ruins', theme: 'jungle', color: '#228B22' },
  { name: 'Desert Wastelands', theme: 'desert', color: '#DAA520' },
  { name: 'Snowy Mountains', theme: 'snow', color: '#87CEEB' },
  { name: 'Futuristic City', theme: 'cyber', color: '#00FFFF' },
  { name: 'Haunted Forest', theme: 'haunted', color: '#8B008B' }
];

function App() {
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    coins: 0,
    lives: 3,
    score: 0,
    attackPower: 100,
    health: 100,
    maxHealth: 100,
    strength: 50,
    chicken: 0,
    gameStarted: false,
    showShop: false,
    currentBoss: null,
    levelComplete: false,
    gameOver: false,
    gameWon: false,
    powerUpActive: null,
    powerUpTimer: 0,
    showWorldMap: false,
    bossDefeated: [false, false, false, false, false],
    unlockedLevels: 1,
    totalLevels: 25,
    cameraX: 0,
    isPaused: false,
    currentWorld: 1,
    currentLevel: 1,
    lastCheckpoint: null,
    checkpointReached: false,
  });

  // Separate player state for position and physics
  const [playerState, setPlayerState] = useState({
    position: { x: 100, y: 0 },
    velocity: { x: 0, y: 0 },
    onGround: false,
    canJump: true,
  });

  const [collectibles, setCollectibles] = useState<Array<{id: number, x: number, y: number, type: 'coin' | 'gem' | 'chicken' | 'dumbbell' | 'serum'}>>([]);
  const [enemies, setEnemies] = useState<Array<{id: number, x: number, y: number, type: 'goomba' | 'koopa' | 'spiker'}>>([]);
  const [obstacles, setObstacles] = useState<Array<{id: number, x: number, y: number, type: 'block' | 'pipe' | 'platform'}>>([]);
  const [powerUps, setPowerUps] = useState<Array<{id: number, x: number, y: number, type: 'attack' | 'shield' | 'speed'}>>([]);
  const [levelGoal, setLevelGoal] = useState<{x: number, y: number} | null>(null);

  // Debug logging
  useEffect(() => {
    console.log('Game state changed:', gameState);
  }, [gameState]);

  // Initialize GameEngine
  useEffect(() => {
    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine();
      console.log('GameEngine initialized');
    }

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.destroy();
      }
    };
  }, []);

  // Sync game state with engine - simplified for now
  useEffect(() => {
    if (gameState.gameStarted) {
      console.log('Game started, initializing basic game...');
      // For now, just start the basic game without complex engine integration
    }
  }, [gameState.gameStarted]);

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
          y: 0, // Ground level
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
          y: 0, // Ground level
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
          y: 0, // Ground level
          type: obstacleTypes[Math.floor(Math.random() * obstacleCount) % obstacleTypes.length]
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
          y: 0, // Ground level
          type: powerUpTypes[Math.floor(Math.random() * powerUpCount) % powerUpTypes.length]
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
    console.log('Starting game...');
    setGameState(prev => ({ 
      ...prev, 
      gameStarted: true,
      gameOver: false,
      gameWon: false,
      showWorldMap: false,
      levelComplete: false,
      currentWorld: 1,
      currentLevel: 1,
      cameraX: 0
    }));
    
    // Reset player position
    setPlayerState(prev => ({
      ...prev,
      position: { x: 100, y: 0 },
      velocity: { x: 0, y: 0 },
      onGround: false,
      canJump: true,
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
      strength: 50,
      chicken: 0,
      gameStarted: true,
      showShop: false,
      currentBoss: null,
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
      cameraX: 0,
      isPaused: false,
      lastCheckpoint: null,
      checkpointReached: false
    });
  };

  const collectItem = useCallback((id: number, type: string, value: number, strength?: number) => {
    setCollectibles(prev => prev.filter(item => item.id !== id));
    
    // Apply strength boost if provided
    if (strength) {
      setGameState(prev => ({
        ...prev,
        strength: prev.strength + strength
      }));
    }
    
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + value,
      score: prev.score + (value * 10)
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
        cameraX: newHealth <= 0 ? 0 : prev.cameraX
      };
    });
    
    // Reset player position if health reaches 0
    if (gameState.health - damage <= 0) {
      setPlayerState(prev => ({
        ...prev,
        position: { x: 100, y: 0 },
        velocity: { x: 0, y: 0 }
      }));
    }
  }, [gameState.health]);

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
    setPlayerState(prev => ({ 
      ...prev, 
      position: { x, y }
    }));
    
    setGameState(prev => ({ 
      ...prev, 
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
        cameraX: 0
      }));
      
      setPlayerState(prev => ({
        ...prev,
        position: { x: 100, y: 0 },
        velocity: { x: 0, y: 0 }
      }));
    }, 3000);
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const buyChicken = () => {
    if (gameState.coins >= 50) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - 50,
        chicken: prev.chicken + 1
      }));
    }
  };

  // Test level creation for GameEngine
  const createTestLevel = () => {
    console.log('Creating test level...');
    if (!gameEngineRef.current) {
      console.log('No game engine available');
      return;
    }
    
    const testLevel: LevelData = {
      id: 1,
      world: 1,
      level: 1,
      name: 'Test Level',
      theme: 'gym',
      background: 'gym-bg',
      music: 'gym-music',
      width: 2000,
      height: 600,
      playerStart: { x: 100, y: 0 },
      goal: { x: 1800, y: 0 },
      platforms: [
        {
          id: 1,
          type: 'solid',
          position: { x: 0, y: 128 },
          width: 2000,
          height: 32,
          isActive: true,
          contains: null,
          breakable: false,
          conveyorSpeed: 0,
          movePattern: null,
          moveDistance: 0,
          moveSpeed: 0,
          moveTimer: 0,
          originalPosition: { x: 0, y: 128 }
        },
        {
          id: 2,
          type: 'solid',
          position: { x: 400, y: 96 },
          width: 200,
          height: 32,
          isActive: true,
          contains: null,
          breakable: false,
          conveyorSpeed: 0,
          movePattern: null,
          moveDistance: 0,
          moveSpeed: 0,
          moveTimer: 0,
          originalPosition: { x: 400, y: 96 }
        }
      ],
      enemies: [],
      collectibles: [],
      powerUps: [],
      checkpoints: [],
      hazards: [],
      decorations: [],
      parallaxLayers: []
    };
    
    console.log('Loading test level into GameEngine...', testLevel);
    gameEngineRef.current.loadLevel(testLevel);
    console.log('Test level loaded successfully');
  };

  // Game Won Screen
  if (gameState.gameWon) {
    return (
      <div className="min-h-screen overflow-hidden">
        <GameBackground world={5} />
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 border-4 border-yellow-400 rounded-lg p-8 text-center">
            <h1 className="text-6xl font-bold text-yellow-400 mb-4 pixel-font">🏆 VICTORY! 🏆</h1>
            <p className="text-2xl text-white mb-6 pixel-font">You've become the Ultimate Bodybuilding Champion!</p>
            <div className="text-xl text-green-400 mb-6 pixel-font">
              Final Score: {gameState.score.toLocaleString()}<br/>
              Coins Collected: {gameState.coins}<br/>
              Total Lives Lost: {3 - gameState.lives}
            </div>
            <button
              onClick={restartGame}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg border-2 border-yellow-400 text-xl font-bold transition-all duration-200 hover:scale-105"
            >
              🎮 Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Start Screen
  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen overflow-hidden">
        <GameBackground world={1} />
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 border-4 border-blue-400 rounded-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-4 pixel-font">Gavin Adventure</h1>
            <p className="text-xl text-white mb-6 pixel-font">Mario-Style Bodybuilding Platformer</p>
            <div className="space-y-4">
              <button
                onClick={startGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg border-2 border-blue-400 text-lg font-bold transition-all duration-200 hover:scale-105 block w-full"
              >
                🎮 Start Game
              </button>
              <button
                onClick={() => {
                  if (gameEngineRef.current) {
                    console.log('Manual engine start test');
                    gameEngineRef.current.start();
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg border-2 border-green-400 text-lg font-bold transition-all duration-200 hover:scale-105 block w-full"
              >
                🔧 Test GameEngine
              </button>
              <button
                onClick={createTestLevel}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg border-2 border-purple-400 text-lg font-bold transition-all duration-200 hover:scale-105 block w-full"
              >
                🗺️ Load Test Level
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

  // Pause Screen
  if (gameState.isPaused && gameState.gameStarted) {
    return (
      <div className="min-h-screen overflow-hidden">
        <GameBackground world={gameState.currentWorld} />
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 backdrop-blur-sm border-4 border-yellow-400 p-12 rounded-lg shadow-2xl max-w-2xl">
            <h1 className="text-6xl font-bold text-yellow-400 mb-6 text-center pixel-font">
              ⏸️ PAUSED
            </h1>
            <div className="text-white text-center pixel-font text-lg mb-8 space-y-4">
              <p>🏆 Current Score: {gameState.score.toLocaleString()}</p>
              <p>💰 Coins: {gameState.coins}</p>
              <p>🍗 Chicken: {gameState.chicken}</p>
              <p>💪 Strength: {gameState.strength}</p>
              <p>🌍 World {gameState.currentWorld} - Level {gameState.currentLevel}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={togglePause}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-green-400 hover:border-green-300 transition-all duration-200 transform hover:scale-105"
              >
                ▶️ RESUME
              </button>
              <button 
                onClick={() => setGameState(prev => ({ ...prev, showShop: true, isPaused: false }))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-blue-400 hover:border-blue-300 transition-all duration-200 transform hover:scale-105"
              >
                🏪 SHOP
              </button>
              <button 
                onClick={showWorldMap}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded pixel-font text-xl border-4 border-purple-400 hover:border-purple-300 transition-all duration-200 transform hover:scale-105"
              >
                🗺️ MAP
              </button>
            </div>
          </div>
        </div>
      </div>
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
        onTogglePause={togglePause}
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
            playerPosition={playerState.position}
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
            playerPosition={playerState.position}
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
            playerPosition={playerState.position}
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
            playerPosition={playerState.position}
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
      
      {gameState.showShop && (
        <Shop
          gameState={gameState}
          onBuyChicken={buyChicken}
          onClose={() => setGameState(prev => ({ ...prev, showShop: false }))}
        />
      )}
    </div>
  );
}

export default App;