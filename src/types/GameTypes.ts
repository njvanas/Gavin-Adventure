// Core game types for Mario-style mechanics
export interface PlayerState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  size: 'small' | 'super' | 'fire';
  isGrounded: boolean;
  isJumping: boolean;
  isRunning: boolean;
  facingRight: boolean;
  invulnerable: boolean;
  invulnerabilityTimer: number;
  runAcceleration: number;
  maxRunSpeed: number;
  jumpPower: number;
  jumpHoldTime: number;
  maxJumpHoldTime: number;
}

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'solid' | 'breakable' | 'question' | 'pipe' | 'moving';
  isActive: boolean;
  contains?: PowerUpType;
  health?: number;
  movementPattern?: MovementPattern;
}

export interface MovementPattern {
  type: 'horizontal' | 'vertical' | 'circular';
  speed: number;
  range: number;
  startPosition: { x: number; y: number };
  currentDirection: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  type: 'goomba' | 'koopa' | 'piranha' | 'spiny';
  velocity: { x: number; y: number };
  direction: number;
  state: 'walking' | 'shell' | 'defeated' | 'emerging';
  health: number;
  points: number;
  isGrounded: boolean;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'powerup' | 'oneup' | 'star';
  powerUpType?: PowerUpType;
  points: number;
  collected: boolean;
  animationFrame: number;
}

export type PowerUpType = 'mushroom' | 'fireflower' | 'star' | 'oneup';

export interface GamePhysics {
  gravity: number;
  friction: number;
  airResistance: number;
  terminalVelocity: number;
  jumpBufferTime: number;
  coyoteTime: number;
}

export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  smoothing: number;
  bounds: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

export interface LevelData {
  width: number;
  height: number;
  platforms: Platform[];
  enemies: Enemy[];
  collectibles: Collectible[];
  spawnPoint: { x: number; y: number };
  goalPosition: { x: number; y: number };
  backgroundLayers: BackgroundLayer[];
  checkpoints: Checkpoint[];
}

export interface BackgroundLayer {
  id: string;
  image: string;
  scrollSpeed: number;
  repeatX: boolean;
  y: number;
}

export interface Checkpoint {
  id: string;
  x: number;
  y: number;
  activated: boolean;
}

export interface ScoreEvent {
  points: number;
  x: number;
  y: number;
  text: string;
  timestamp: number;
}