import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { AssetLoader, ALL_ASSETS } from './config/Assets';

const WORLDS = [
  { name: 'Jungle Ruins', theme: 'jungle', color: '#228B22' },
  { name: 'Desert Wastelands', theme: 'desert', color: '#DAA520' },
  { name: 'Snowy Mountains', theme: 'snow', color: '#87CEEB' },
  { name: 'Futuristic City', theme: 'cyber', color: '#00FFFF' },
  { name: 'Haunted Forest', theme: 'haunted', color: '#8B008B' }
];

function App() {
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
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
  const levelGoalRef = useRef<{x: number, y: number} | null>(null);

  // Ensure initial state is correct
  useEffect(() => {
    console.log('Component mounted, ensuring initial state...');
    setLevelGoal(null);
    levelGoalRef.current = null;
    setCollectibles([]);
    setEnemies([]);
    setObstacles([]);
    setPowerUps([]);
  }, []);

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

  // Preload all game assets
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        console.log('Starting asset preload...');
        setLoadingProgress(0);
        
        // Collect all sprite assets
        const allSprites = [
          ...ALL_ASSETS.gavin,
          ...ALL_ASSETS.blocks.map(block => block.sprite),
          ...ALL_ASSETS.coins.map(coin => coin.sprite),
          ALL_ASSETS.chicken.sprite,
          ...ALL_ASSETS.dumbbells.map(dumbbell => dumbbell.sprite),
          ALL_ASSETS.superSerum.sprite,
          ALL_ASSETS.miniFatWoman.sprite,
          ...ALL_ASSETS.fatWomanBosses.map(boss => boss.sprite)
        ];
        
        console.log('Total sprites to load:', allSprites.length);
        console.log('Sprite paths:', allSprites.map(s => s.path));
        
        let loadedCount = 0;
        const totalAssets = allSprites.length;
        
        for (const sprite of allSprites) {
          try {
            console.log(`Loading sprite: ${sprite.path}`);
            await AssetLoader.loadImage(sprite.path);
            loadedCount++;
            setLoadingProgress((loadedCount / totalAssets) * 100);
            console.log(`Successfully loaded: ${sprite.path}`);
          } catch (error) {
            console.warn(`Failed to load sprite: ${sprite.path}`, error);
            loadedCount++;
            setLoadingProgress((loadedCount / totalAssets) * 100);
          }
        }
        
        console.log('Asset preload complete!');
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Asset preload failed:', error);
        setAssetsLoaded(true); // Continue anyway
      }
    };
    
    // Add a timeout to ensure assets load or we continue anyway
    const timeout = setTimeout(() => {
      console.log('Asset preload timeout - continuing anyway');
      setAssetsLoaded(true);
    }, 10000); // 10 second timeout
    
    preloadAssets();
    
    return () => clearTimeout(timeout);
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
  const generateLevel = useCallback((world: number, level: number) => {
    console.log('generateLevel called with:', { world, level });
    const levelWidth = 3000 + (level * 200);
    const difficulty = world + (level * 0.5);
    const isBossLevel = level % 5 === 0;

    if (isBossLevel) {
      // Boss level - minimal collectibles, focus on boss fight
      setCollectibles([]);
      setEnemies([]);
      setObstacles([]);
      setPowerUps([]);
      const newLevelGoal = { x: levelWidth - 200, y: 0 };
      setLevelGoal(newLevelGoal);
      levelGoalRef.current = newLevelGoal;
      console.log('Boss level generated, level goal set to:', newLevelGoal);
      return;
    }

    // Generate collectibles with better distribution
    const newCollectibles = [];
    const collectibleCount = 15 + (level * 2);
    const collectibleTypes: ('coin' | 'gem' | 'chicken' | 'dumbbell' | 'serum')[] = ['coin', 'gem', 'chicken', 'dumbbell', 'serum'];
    
    for (let i = 0; i < collectibleCount; i++) {
      const type = collectibleTypes[Math.floor(Math.random() * collectibleTypes.length)];
      const x = 200 + (i * (levelWidth / collectibleCount)) + Math.random() * 200;
      const y = 0; // Place all collectibles at ground level
      
      newCollectibles.push({
        id: i,
        x: x,
        y: y,
        type: type
      });
    }
    setCollectibles(newCollectibles);
    console.log('Generated collectibles:', newCollectibles.length, 'at positions:', newCollectibles.map(c => ({ x: c.x, y: c.y, type: c.type })));

    // Generate enemies based on world theme with better positioning
    const newEnemies = [];
    const enemyCount = 6 + (level * 1.5);
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
      const x = 400 + (i * (levelWidth / enemyCount)) + Math.random() * 300;
      const y = 0; // Place enemies at ground level
      
      newEnemies.push({
        id: i + 1000,
        x: x,
        y: y,
        type: enemyType as 'goomba' | 'koopa' | 'spiker'
      });
    }
    setEnemies(newEnemies);
    console.log('Generated enemies:', newEnemies.length, 'at positions:', newEnemies.map(e => ({ x: e.x, y: e.y, type: e.type })));

    // Generate obstacles with better variety
    const newObstacles = [];
    const obstacleCount = 10 + Math.floor(level / 2);
    const obstacleTypes: ('block' | 'pipe' | 'platform')[] = ['block', 'pipe', 'platform'];
    
    for (let i = 0; i < obstacleCount; i++) {
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
      const x = 300 + (i * (levelWidth / obstacleCount)) + Math.random() * 250;
      const y = 0; // Place obstacles at ground level
      
      newObstacles.push({
        id: i + 2000,
        x: x,
        y: y,
        type: type
      });
    }
    setObstacles(newObstacles);
    console.log('Generated obstacles:', newObstacles.length, 'at positions:', newObstacles.map(o => ({ x: o.x, y: o.y, type: o.type })));

    // Generate power-ups with strategic placement
    const newPowerUps = [];
    const powerUpCount = 3 + Math.floor(level / 3);
    const powerUpTypes: ('attack' | 'shield' | 'speed')[] = ['attack', 'shield', 'speed'];
    
    for (let i = 0; i < powerUpCount; i++) {
      const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
      const x = 500 + (i * (levelWidth / powerUpCount)) + Math.random() * 400;
      const y = 0; // Place power-ups at ground level
      
      newPowerUps.push({
        id: i + 3000,
        x: x,
        y: y,
        type: type
      });
    }
    setPowerUps(newPowerUps);
    console.log('Generated power-ups:', newPowerUps.length, 'at positions:', newPowerUps.map(p => ({ x: p.x, y: p.y, type: p.type })));

    // Set level goal
    const newLevelGoal = {
      x: levelWidth - 150,
      y: 0
    };
    setLevelGoal(newLevelGoal);
    levelGoalRef.current = newLevelGoal;
    console.log('Level goal set to:', newLevelGoal);
    console.log('Level generation complete!');
  }, []); // Empty dependency array since it doesn't depend on any props or state

  useEffect(() => {
    console.log('Level generation useEffect triggered:', {
      gameStarted: gameState.gameStarted,
      levelComplete: gameState.levelComplete,
      showWorldMap: gameState.showWorldMap,
      currentWorld: gameState.currentWorld,
      currentLevel: gameState.currentLevel
    });
    
    if (gameState.gameStarted && !gameState.levelComplete && !gameState.showWorldMap) {
      console.log('Generating level...');
      generateLevel(gameState.currentWorld, gameState.currentLevel);
    }
  }, [gameState.gameStarted, gameState.currentWorld, gameState.currentLevel, gameState.levelComplete, gameState.showWorldMap, generateLevel]);

  const startGame = useCallback(() => {
    console.log('Starting game...');
    
    // Reset all level-related state
    setCollectibles([]);
    setEnemies([]);
    setObstacles([]);
    setPowerUps([]);
    setLevelGoal(null);
    levelGoalRef.current = null;
    
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
  }, []);

  const showWorldMap = useCallback(() => {
    setGameState(prev => ({ ...prev, showWorldMap: true }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const selectLevel = useCallback((world: number, level: number) => {
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
      
      // Reset level goal ref
      levelGoalRef.current = null;
    }
  }, [gameState.unlockedLevels]);

  const restartGame = useCallback(() => {
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
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const closeBoss = useCallback(() => {
    setGameState(prev => ({ ...prev, currentBoss: null }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const closeShop = useCallback(() => {
    setGameState(prev => ({ ...prev, showShop: false }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const openShop = useCallback(() => {
    setGameState(prev => ({ ...prev, showShop: true, isPaused: false }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const testGameEngine = useCallback(() => {
    if (gameEngineRef.current) {
      console.log('Manual engine start test');
      gameEngineRef.current.start();
    }
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const closeWorldMap = useCallback(() => {
    setGameState(prev => ({ ...prev, showWorldMap: false }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const handlePlayerHit = useCallback(() => {
    setGameState(prev => ({ 
      ...prev, 
      attackPower: Math.max(25, prev.attackPower * 0.75),
      health: Math.max(0, prev.health - 25)
    }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

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
    
    // Reset level goal ref
    levelGoalRef.current = null;
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
    
    // Reset level goal ref
    levelGoalRef.current = null;
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
      
      // Reset level goal ref
      levelGoalRef.current = null;
    }
  }, [gameState.health]);

  const spawnBoss = useCallback((bossId: number) => {
    setGameState(prev => ({ ...prev, currentBoss: bossId }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const defeatBoss = useCallback(() => {
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
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, [gameState.currentLevel]);

  const completeLevel = useCallback(() => {
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
      
      // Reset level goal ref
      levelGoalRef.current = null;
    }, 3000);
  }, [gameState.currentLevel, spawnBoss]);

  const updatePlayerPosition = useCallback((x: number, y: number) => {
    setPlayerState(prev => ({ 
      ...prev, 
      position: { x, y }
    }));
    
    // Only update camera if player has moved significantly
    const newCameraX = Math.max(0, x - window.innerWidth / 2);
    if (Math.abs(newCameraX - gameState.cameraX) > 5) { // Only update if moved more than 5px
      setGameState(prev => ({ 
        ...prev, 
        cameraX: newCameraX
      }));
    }
    
    // Check level completion
    if (levelGoalRef.current && x >= levelGoalRef.current.x - 50) {
      completeLevel();
    }
  }, [completeLevel, gameState.cameraX]);



  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

  const buyChicken = useCallback(() => {
    if (gameState.coins >= 50) {
      setGameState(prev => ({
        ...prev,
        coins: prev.coins - 50,
        chicken: prev.chicken + 1
      }));
      
      // Reset level goal ref
      levelGoalRef.current = null;
    }
  }, []);

  // Test level creation for GameEngine
  const createTestLevel = useCallback(() => {
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
    
    // Reset level goal ref
    levelGoalRef.current = null;
  }, []);

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
      <div className="min-h-screen overflow-hidden bg-black">
        {/* Fallback background in case GameBackground fails */}
        <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-black"></div>
        
        {/* Try to render GameBackground, but don't let it break the app */}
        <div className="relative z-10">
          <GameBackground world={1} />
        </div>
        
        {/* Always visible debug info */}
        <div className="fixed top-0 left-0 bg-red-600 text-white p-2 z-60 text-xs font-mono">
          DEBUG: App Component Rendered
        </div>
        
        <div className="relative z-50 flex items-center justify-center min-h-screen">
          <div className="bg-black/90 border-4 border-blue-400 rounded-lg p-8 text-center">
            <h1 className="text-4xl font-bold text-blue-400 mb-4 pixel-font">Gavin Adventure</h1>
            <p className="text-xl text-white mb-6 pixel-font">Mario-Style Bodybuilding Platformer</p>
            
            {/* Asset loading status */}
            <div className="text-white pixel-font text-sm mb-4">
              Asset Loading Status: {assetsLoaded ? '✅ Complete' : '⏳ In Progress'}
            </div>
            
            {!assetsLoaded ? (
              <div className="space-y-4">
                <div className="text-white pixel-font text-sm mb-4">
                  Loading Assets... {Math.round(loadingProgress)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 border-2 border-gray-500">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="text-gray-400 pixel-font text-xs">
                  Please wait while we prepare your adventure...
                </div>
                <div className="text-yellow-400 pixel-font text-xs">
                  If this takes too long, check the browser console for errors
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-green-400 pixel-font text-sm mb-2 animate-pulse">
                  ✅ Assets Loaded! Ready to Play!
                </div>
                <button
                  onClick={startGame}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg border-2 border-blue-400 text-lg font-bold transition-all duration-200 hover:scale-105 block w-full"
                >
                  🎮 Start Game
                </button>
                <button
                  onClick={testGameEngine}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg border-2 border-green-400 text-lg font-bold transition-all duration-200 hover:scale-105 block w-full"
                >
                  🔧 Test GameEngine
                </button>
                <button
                  onClick={createTestLevel}
                  className="bg-purple-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg border-2 border-green-400 text-lg font-bold transition-all duration-200 hover:scale-105 block w-full"
                >
                  🗺️ Load Test Level
                </button>
              </div>
            )}
            
            {/* Additional debug info */}
            <div className="mt-6 text-left text-xs text-gray-400">
              <div>Component State: {assetsLoaded ? 'Assets Loaded' : 'Loading Assets'}</div>
              <div>Loading Progress: {Math.round(loadingProgress)}%</div>
              <div>Game State: {gameState.gameStarted ? 'Started' : 'Not Started'}</div>
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
        onBack={closeWorldMap}
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
                onClick={openShop}
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
      
      {/* Debug Info */}
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg z-50 text-xs font-mono">
        <div>Assets: {assetsLoaded ? '✅' : '⏳'}</div>
        <div>Game: {gameState.gameStarted ? '✅' : '❌'}</div>
        <div>Level: {gameState.currentWorld}-{gameState.currentLevel}</div>
        <div>Player: ({Math.round(playerState.position.x)}, {Math.round(playerState.position.y)})</div>
        <div>Camera: {Math.round(gameState.cameraX)}</div>
        <div>Collectibles: {collectibles.length}</div>
        <div>Enemies: {enemies.length}</div>
        <div>Obstacles: {obstacles.length}</div>
      </div>
      
      <div style={{ transform: `translateX(-${gameState.cameraX}px)` }}>
        {gameState.gameStarted && (
          <Player 
            gameState={gameState}
            onUpdatePosition={updatePlayerPosition}
          />
        )}
        
        {gameState.gameStarted && (
          <>
            {console.log('Rendering game entities:', { 
              collectibles: collectibles.length, 
              powerUps: powerUps.length, 
              enemies: enemies.length, 
              obstacles: obstacles.length,
              levelGoal: levelGoal 
            })}
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
          </>
        )}
      </div>
      
      {gameState.currentBoss !== null && (
        <Boss
          bossId={gameState.currentBoss}
          playerAttackPower={gameState.attackPower}
          onDefeat={defeatBoss}
          onPlayerHit={handlePlayerHit}
          onClose={closeBoss}
        />
      )}
      
      {gameState.showShop && (
        <Shop
          gameState={gameState}
          onBuyChicken={buyChicken}
          onClose={closeShop}
        />
      )}
    </div>
  );
}

export default App;