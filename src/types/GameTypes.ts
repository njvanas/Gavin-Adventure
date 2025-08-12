// Core game state types
export interface GameState {
  // Player stats
  coins: number;
  lives: number;
  score: number;
  attackPower: number;
  health: number;
  maxHealth: number;
  strength: number;
  chicken: number;
  
  // Game flow
  gameStarted: boolean;
  showShop: boolean;
  currentBoss: number | null;
  levelComplete: boolean;
  gameOver: boolean;
  gameWon: boolean;
  showWorldMap: boolean;
  isPaused: boolean;
  
  // Level progression
  currentWorld: number;
  currentLevel: number;
  unlockedLevels: number;
  totalLevels: number;
  
  // Power-ups
  powerUpActive: string | null;
  powerUpTimer: number;
  
  // Boss system
  bossDefeated: boolean[];
  
  // Camera
  cameraX: number;
  
  // Checkpoint system
  lastCheckpoint: Checkpoint | null;
  checkpointReached: boolean;
}

// Player state with enhanced physics
export interface PlayerState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  size: 'small' | 'big' | 'fire' | 'star';
  state: 'idle' | 'running' | 'jumping' | 'falling' | 'climbing' | 'attacking' | 'invulnerable';
  direction: 'left' | 'right';
  onGround: boolean;
  canJump: boolean;
  canDoubleJump: boolean;
  doubleJumpUsed: boolean;
  invulnerabilityTimer: number;
  powerUpEffects: PowerUpEffect[];
  animationFrame: number;
  animationTimer: number;
}

// Power-up system
export interface PowerUpEffect {
  type: 'speed' | 'jump' | 'attack' | 'shield' | 'invincibility' | 'size';
  duration: number;
  remainingTime: number;
  value: number;
  active: boolean;
}

// Enemy types with AI
export interface Enemy {
  id: number;
  type: 'goomba' | 'koopa' | 'spiker' | 'dumbbellBot' | 'treadmill' | 'gymBro';
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  health: number;
  maxHealth: number;
  damage: number;
  state: 'patrol' | 'chase' | 'attack' | 'stunned' | 'dead';
  direction: 'left' | 'right';
  patrolDistance: number;
  patrolStart: number;
  aiState: 'idle' | 'patrolling' | 'chasing' | 'attacking';
  playerDetected: boolean;
  lastAttackTime: number;
  attackCooldown: number;
  onGround: boolean;
  animationFrame: number;
  animationTimer: number;
}

// Platform and obstacle system
export interface Platform {
  id: number;
  type: 'solid' | 'breakable' | 'question' | 'conveyor' | 'moving' | 'oneWay';
  position: { x: number; y: number };
  width: number;
  height: number;
  isActive: boolean;
  contains: 'coin' | 'powerUp' | '1up' | null;
  breakable: boolean;
  conveyorSpeed: number;
  movePattern: 'horizontal' | 'vertical' | 'circular' | null;
  moveDistance: number;
  moveSpeed: number;
  moveTimer: number;
  originalPosition: { x: number; y: number };
}

// Collectible items
export interface Collectible {
  id: number;
  type: 'coin' | 'gem' | 'proteinBar' | 'waterBottle' | 'trophy' | 'key';
  position: { x: number; y: number };
  collected: boolean;
  value: number;
  animationFrame: number;
  animationTimer: number;
  floating: boolean;
  floatOffset: number;
}

// Power-up items
export interface PowerUp {
  id: number;
  type: 'proteinShake' | 'preWorkout' | 'weightBelt' | 'doubleJumpShoes' | 'shield' | 'star';
  position: { x: number; y: number };
  collected: boolean;
  duration: number;
  effect: PowerUpEffect;
  animationFrame: number;
  animationTimer: number;
}

// Checkpoint system
export interface Checkpoint {
  id: number;
  position: { x: number; y: number };
  activated: boolean;
  levelState: LevelState;
  playerState: Partial<PlayerState>;
}

// Level state for checkpoints
export interface LevelState {
  collectiblesCollected: number[];
  enemiesDefeated: number[];
  platformsDestroyed: number[];
  powerUpsCollected: number[];
  timeElapsed: number;
}

// Level data structure
export interface LevelData {
  id: number;
  world: number;
  level: number;
  name: string;
  theme: string;
  background: string;
  music: string;
  width: number;
  height: number;
  playerStart: { x: number; y: number };
  goal: { x: number; y: number };
  platforms: Platform[];
  enemies: Enemy[];
  collectibles: Collectible[];
  powerUps: PowerUp[];
  checkpoints: Checkpoint[];
  hazards: Hazard[];
  decorations: Decoration[];
  parallaxLayers: ParallaxLayer[];
}

// Hazard system
export interface Hazard {
  id: number;
  type: 'spike' | 'lava' | 'pit' | 'electric' | 'poison';
  position: { x: number; y: number };
  width: number;
  height: number;
  damage: number;
  active: boolean;
  animationFrame: number;
  animationTimer: number;
}

// Decoration system
export interface Decoration {
  id: number;
  type: 'tree' | 'rock' | 'cloud' | 'building' | 'gymEquipment';
  position: { x: number; y: number };
  width: number;
  height: number;
  layer: 'background' | 'midground' | 'foreground';
  parallaxSpeed: number;
  animationFrame: number;
  animationTimer: number;
}

// Parallax background system
export interface ParallaxLayer {
  id: number;
  image: string;
  speed: number;
  offset: number;
  repeat: boolean;
  y: number;
}

// World data
export interface World {
  id: number;
  name: string;
  theme: string;
  color: string;
  background: string;
  music: string;
  levels: number[];
  bossLevel: number;
  unlocked: boolean;
  completed: boolean;
}

// Boss system
export interface Boss {
  id: number;
  name: string;
  type: 'gymChampion' | 'proteinMonster' | 'weightliftingRobot';
  position: { x: number; y: number };
  health: number;
  maxHealth: number;
  phase: 'intro' | 'attack' | 'vulnerable' | 'defeated';
  attackPattern: BossAttack[];
  currentAttack: number;
  attackTimer: number;
  invulnerable: boolean;
  animationFrame: number;
  animationTimer: number;
}

// Boss attack patterns
export interface BossAttack {
  name: string;
  damage: number;
  duration: number;
  cooldown: number;
  range: number;
  animation: string;
}

// Multiplayer types
export interface MultiplayerPlayer {
  id: string;
  name: string;
  playerState: PlayerState;
  connected: boolean;
  ping: number;
  lastUpdate: number;
}

export interface MultiplayerRoom {
  id: string;
  name: string;
  maxPlayers: number;
  currentPlayers: MultiplayerPlayer[];
  levelData: LevelData;
  gameState: GameState;
  started: boolean;
  hostId: string;
}

// Game configuration
export interface GameConfig {
  physics: {
    gravity: number;
    maxFallSpeed: number;
    moveSpeed: number;
    jumpPower: number;
    acceleration: number;
    deceleration: number;
    airResistance: number;
    jumpCutoff: number;
  };
  camera: {
    followSpeed: number;
    lookAheadDistance: number;
    verticalOffset: number;
  };
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    enableMusic: boolean;
    enableSFX: boolean;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high';
    enableParticles: boolean;
    enableScreenShake: boolean;
    enableBlur: boolean;
  };
  controls: {
    enableGamepad: boolean;
    deadzone: number;
    keyRepeatDelay: number;
    keyRepeatInterval: number;
  };
}

// Event system types
export interface GameEvent {
  type: string;
  data: any;
  timestamp: number;
}

// Animation system
export interface Animation {
  name: string;
  frames: number[];
  frameTime: number;
  loop: boolean;
  onComplete?: () => void;
}

// Particle system
export interface Particle {
  id: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
  gravity: number;
  friction: number;
}

// Save data structure
export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
  unlockedWorlds: number[];
  completedLevels: number[];
  highScores: { [level: string]: number };
  totalPlayTime: number;
  achievements: string[];
  settings: GameConfig;
}