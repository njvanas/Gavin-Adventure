import { PhysicsSystem, PhysicsBody } from './PhysicsSystem';
import { InputSystem, InputState } from './InputSystem';
import { CameraSystem, CameraTarget } from './CameraSystem';
import { 
  GameState, 
  PlayerState, 
  LevelData, 
  Enemy, 
  Platform, 
  Collectible, 
  PowerUp, 
  Checkpoint,
  GameConfig 
} from '../types/GameTypes';

export class GameEngine {
  private physicsSystem: PhysicsSystem;
  private inputSystem: InputSystem;
  private cameraSystem: CameraSystem;
  
  private gameState: GameState;
  private playerState: PlayerState;
  private currentLevel: LevelData | null;
  
  private platforms: Platform[];
  private enemies: Enemy[];
  private collectibles: Collectible[];
  private powerUps: PowerUp[];
  private checkpoints: Checkpoint[];
  
  private lastTime: number;
  private deltaTime: number;
  private isRunning: boolean;
  
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = {
      physics: {
        gravity: 0.8,
        maxFallSpeed: 12,
        moveSpeed: 6,
        jumpPower: 15,
        acceleration: 0.8,
        deceleration: 0.9,
        airResistance: 0.85,
        jumpCutoff: 0.5,
      },
      camera: {
        followSpeed: 0.1,
        lookAheadDistance: 100,
        verticalOffset: 0,
      },
      audio: {
        masterVolume: 1.0,
        musicVolume: 0.8,
        sfxVolume: 1.0,
        enableMusic: true,
        enableSFX: true,
      },
      graphics: {
        quality: 'medium',
        enableParticles: true,
        enableScreenShake: true,
        enableBlur: false,
      },
      controls: {
        enableGamepad: true,
        deadzone: 0.1,
        keyRepeatDelay: 500,
        keyRepeatInterval: 50,
      },
      ...config
    };

    // Initialize systems
    this.physicsSystem = new PhysicsSystem(this.config.physics);
    this.inputSystem = new InputSystem(this.config.controls);
    this.cameraSystem = new CameraSystem(800, 600, this.config.camera);

    // Initialize game state
    this.gameState = this.createInitialGameState();
    this.playerState = this.createInitialPlayerState();
    
    // Initialize level data
    this.currentLevel = null;
    this.platforms = [];
    this.enemies = [];
    this.collectibles = [];
    this.powerUps = [];
    this.checkpoints = [];

    this.lastTime = 0;
    this.deltaTime = 0;
    this.isRunning = false;
  }

  private createInitialGameState(): GameState {
    return {
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
      showWorldMap: false,
      isPaused: false,
      currentWorld: 1,
      currentLevel: 1,
      unlockedLevels: 1,
      totalLevels: 25,
      powerUpActive: null,
      powerUpTimer: 0,
      bossDefeated: [false, false, false, false, false],
      cameraX: 0,
      lastCheckpoint: null,
      checkpointReached: false,
    };
  }

  private createInitialPlayerState(): PlayerState {
    return {
      position: { x: 100, y: 0 },
      velocity: { x: 0, y: 0 },
      size: 'small',
      state: 'idle',
      direction: 'right',
      onGround: false,
      canJump: true,
      canDoubleJump: false,
      doubleJumpUsed: false,
      invulnerabilityTimer: 0,
      powerUpEffects: [],
      animationFrame: 0,
      animationTimer: 0,
    };
  }

  start(): void {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    this.isRunning = false;
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(this.deltaTime);
    this.render();

    requestAnimationFrame(() => this.gameLoop());
  }

  private update(deltaTime: number): void {
    if (this.gameState.isPaused) return;

    // Update input system
    this.inputSystem.update();

    // Update player physics
    this.updatePlayer(deltaTime);

    // Update enemies
    this.updateEnemies(deltaTime);

    // Update camera
    this.updateCamera(deltaTime);

    // Update power-ups
    this.updatePowerUps(deltaTime);

    // Check collisions
    this.checkCollisions();

    // Update game state
    this.updateGameState(deltaTime);
  }

  private updatePlayer(deltaTime: number): void {
    const input = this.inputSystem.getInputState();
    
    // Convert player state to physics body
    const physicsBody: PhysicsBody = {
      x: this.playerState.position.x,
      y: this.playerState.position.y,
      width: this.getPlayerWidth(),
      height: this.getPlayerHeight(),
      velocityX: this.playerState.velocity.x,
      velocityY: this.playerState.velocity.y,
      onGround: this.playerState.onGround,
      canJump: this.playerState.canJump,
    };

    // Update physics
    const updatedBody = this.physicsSystem.updatePlayerPhysics(physicsBody, input);

    // Update player state from physics
    this.playerState.position.x = updatedBody.x;
    this.playerState.position.y = updatedBody.y;
    this.playerState.velocity.x = updatedBody.velocityX;
    this.playerState.velocity.y = updatedBody.velocityY;
    this.playerState.onGround = updatedBody.onGround;
    this.playerState.canJump = updatedBody.canJump;

    // Update player state based on input
    if (input.left) {
      this.playerState.direction = 'left';
      this.playerState.state = this.playerState.onGround ? 'running' : 'jumping';
    } else if (input.right) {
      this.playerState.direction = 'right';
      this.playerState.state = this.playerState.onGround ? 'running' : 'jumping';
    } else {
      this.playerState.state = this.playerState.onGround ? 'idle' : 'falling';
    }

    // Handle jumping
    if (input.jumpPressed && this.playerState.canJump) {
      this.playerState.state = 'jumping';
      this.playerState.doubleJumpUsed = false;
    }

    // Handle double jump
    if (input.jumpPressed && !this.playerState.onGround && !this.playerState.doubleJumpUsed && this.playerState.canDoubleJump) {
      this.playerState.velocity.y = -this.config.physics.jumpPower * 0.8;
      this.playerState.doubleJumpUsed = true;
    }

    // Update invulnerability
    if (this.playerState.invulnerabilityTimer > 0) {
      this.playerState.invulnerabilityTimer -= deltaTime;
      if (this.playerState.invulnerabilityTimer <= 0) {
        this.playerState.state = 'idle';
      }
    }

    // Update animations
    this.updatePlayerAnimation(deltaTime);
  }

  private updateEnemies(deltaTime: number): void {
    this.enemies.forEach(enemy => {
      // Basic AI behavior
      if (enemy.aiState === 'patrolling') {
        // Move back and forth
        enemy.velocity.x = enemy.direction === 'right' ? 1 : -1;
        
        // Check if should turn around
        if (enemy.position.x <= enemy.patrolStart) {
          enemy.direction = 'right';
        } else if (enemy.position.x >= enemy.patrolStart + enemy.patrolDistance) {
          enemy.direction = 'left';
        }
      }

      // Apply gravity
      if (!enemy.onGround) {
        enemy.velocity.y += this.config.physics.gravity;
        enemy.velocity.y = Math.min(enemy.velocity.y, this.config.physics.maxFallSpeed);
      }

      // Update position
      enemy.position.x += enemy.velocity.x;
      enemy.position.y += enemy.velocity.y;

      // Check platform collisions
      this.checkEnemyPlatformCollisions(enemy);

      // Update animations
      enemy.animationTimer += deltaTime;
      if (enemy.animationTimer >= 0.2) { // 5 FPS
        enemy.animationFrame = (enemy.animationFrame + 1) % 4;
        enemy.animationTimer = 0;
      }
    });
  }

  private updateCamera(deltaTime: number): void {
    // Set camera target to player
    const cameraTarget: CameraTarget = {
      x: this.playerState.position.x,
      y: this.playerState.position.y,
      width: this.getPlayerWidth(),
      height: this.getPlayerHeight(),
    };

    this.cameraSystem.setTarget(cameraTarget);
    this.cameraSystem.update(deltaTime);

    // Update game state camera position
    const cameraPos = this.cameraSystem.getPosition();
    this.gameState.cameraX = cameraPos.x;
  }

  private updatePowerUps(deltaTime: number): void {
    // Update active power-up effects
    this.playerState.powerUpEffects = this.playerState.powerUpEffects.filter(effect => {
      effect.remainingTime -= deltaTime;
      if (effect.remainingTime <= 0) {
        this.removePowerUpEffect(effect);
        return false;
      }
      return true;
    });

    // Update power-up timer
    if (this.gameState.powerUpTimer > 0) {
      this.gameState.powerUpTimer -= deltaTime;
      if (this.gameState.powerUpTimer <= 0) {
        this.gameState.powerUpActive = null;
      }
    }
  }

  private checkCollisions(): void {
    // Check player-platform collisions
    this.checkPlayerPlatformCollisions();

    // Check player-enemy collisions
    this.checkPlayerEnemyCollisions();

    // Check player-collectible collisions
    this.checkPlayerCollectibleCollisions();

    // Check player-power-up collisions
    this.checkPlayerPowerUpCollisions();

    // Check player-checkpoint collisions
    this.checkPlayerCheckpointCollisions();
  }

  private checkPlayerPlatformCollisions(): void {
    const playerBody: PhysicsBody = {
      x: this.playerState.position.x,
      y: this.playerState.position.y,
      width: this.getPlayerWidth(),
      height: this.getPlayerHeight(),
      velocityX: this.playerState.velocity.x,
      velocityY: this.playerState.velocity.y,
      onGround: this.playerState.onGround,
      canJump: this.playerState.canJump,
    };

    for (const platform of this.platforms) {
      if (!platform.isActive) continue;

      const platformBody: PhysicsBody = {
        x: platform.position.x,
        y: platform.position.y,
        width: platform.width,
        height: platform.height,
        velocityX: 0,
        velocityY: 0,
        onGround: false,
        canJump: false,
      };

      if (this.physicsSystem.checkCollision(playerBody, platformBody)) {
        // Check if player can jump through from below
        if (platform.type === 'oneWay' && this.physicsSystem.canJumpThrough(playerBody, platformBody)) {
          continue;
        }

        // Resolve collision
        const resolvedBody = this.physicsSystem.resolveCollision(playerBody, platformBody);
        
        // Update player state
        this.playerState.position.x = resolvedBody.x;
        this.playerState.position.y = resolvedBody.y;
        this.playerState.velocity.x = resolvedBody.velocityX;
        this.playerState.velocity.y = resolvedBody.velocityY;
        this.playerState.onGround = resolvedBody.onGround;
        this.playerState.canJump = resolvedBody.canJump;

        // Handle special platform types
        this.handleSpecialPlatform(platform);
      }
    }
  }

  private handleSpecialPlatform(platform: Platform): void {
    switch (platform.type) {
      case 'question':
        if (platform.contains && !platform.collected) {
          this.spawnCollectible(platform);
          platform.collected = true;
        }
        break;
      case 'breakable':
        if (this.playerState.size !== 'small' && this.playerState.velocity.y < 0) {
          this.breakPlatform(platform);
        }
        break;
      case 'conveyor':
        if (this.playerState.onGround) {
          this.playerState.velocity.x += platform.conveyorSpeed;
        }
        break;
    }
  }

  private checkPlayerEnemyCollisions(): void {
    if (this.playerState.state === 'invulnerable') return;

    const playerBody: PhysicsBody = {
      x: this.playerState.position.x,
      y: this.playerState.position.y,
      width: this.getPlayerWidth(),
      height: this.getPlayerHeight(),
      velocityX: this.playerState.velocity.x,
      velocityY: this.playerState.velocity.y,
      onGround: this.playerState.onGround,
      canJump: this.playerState.canJump,
    };

    for (const enemy of this.enemies) {
      if (enemy.state === 'dead') continue;

      const enemyBody: PhysicsBody = {
        x: enemy.position.x,
        y: enemy.position.y,
        width: 32,
        height: 32,
        velocityX: enemy.velocity.x,
        velocityY: enemy.velocity.y,
        onGround: enemy.onGround,
        canJump: false,
      };

      if (this.physicsSystem.checkCollision(playerBody, enemyBody)) {
        // Check if player is landing on enemy
        if (this.playerState.velocity.y > 0 && this.playerState.position.y < enemy.position.y) {
          this.defeatEnemy(enemy);
          this.playerState.velocity.y = -this.config.physics.jumpPower * 0.5; // Bounce
        } else {
          this.playerHit(enemy);
        }
      }
    }
  }

  private defeatEnemy(enemy: Enemy): void {
    enemy.state = 'dead';
    this.gameState.score += 100;
    // Could add particle effects here
  }

  private playerHit(enemy: Enemy): void {
    this.gameState.health -= enemy.damage;
    this.playerState.state = 'invulnerable';
    this.playerState.invulnerabilityTimer = 2.0; // 2 seconds of invulnerability

    if (this.gameState.health <= 0) {
      this.playerDeath();
    }
  }

  private playerDeath(): void {
    this.gameState.lives--;
    if (this.gameState.lives > 0) {
      this.respawnPlayer();
    } else {
      this.gameOver();
    }
  }

  private respawnPlayer(): void {
    if (this.gameState.lastCheckpoint) {
      // Respawn at checkpoint
      this.playerState.position = { ...this.gameState.lastCheckpoint.playerState.position };
      this.gameState.health = this.gameState.maxHealth;
    } else {
      // Respawn at level start
      this.playerState.position = { x: 100, y: 0 };
      this.gameState.health = this.gameState.maxHealth;
    }
  }

  private gameOver(): void {
    this.gameState.gameOver = true;
    this.gameState.gameStarted = false;
  }

  private checkPlayerCollectibleCollisions(): void {
    // Implementation for collectible collisions
  }

  private checkPlayerPowerUpCollisions(): void {
    // Implementation for power-up collisions
  }

  private checkPlayerCheckpointCollisions(): void {
    // Implementation for checkpoint collisions
  }

  private checkEnemyPlatformCollisions(enemy: Enemy): void {
    // Implementation for enemy-platform collisions
  }

  private updatePlayerAnimation(deltaTime: number): void {
    this.playerState.animationTimer += deltaTime;
    if (this.playerState.animationTimer >= 0.1) { // 10 FPS
      this.playerState.animationFrame = (this.playerState.animationFrame + 1) % 4;
      this.playerState.animationTimer = 0;
    }
  }

  private getPlayerWidth(): number {
    return this.playerState.size === 'small' ? 32 : 32;
  }

  private getPlayerHeight(): number {
    return this.playerState.size === 'small' ? 32 : 64;
  }

  private spawnCollectible(platform: Platform): void {
    // Implementation for spawning collectibles
  }

  private breakPlatform(platform: Platform): void {
    // Implementation for breaking platforms
  }

  private removePowerUpEffect(effect: any): void {
    // Implementation for removing power-up effects
  }

  private updateGameState(deltaTime: number): void {
    // Implementation for updating game state
  }

  private render(): void {
    // This will be implemented by the React components
    // The engine just updates the state, React handles rendering
  }

  // Public methods for external use
  getGameState(): GameState {
    return { ...this.gameState };
  }

  getPlayerState(): PlayerState {
    return { ...this.playerState };
  }

  getCurrentLevel(): LevelData | null {
    return this.currentLevel;
  }

  loadLevel(levelData: LevelData): void {
    this.currentLevel = levelData;
    this.platforms = [...levelData.platforms];
    this.enemies = [...levelData.enemies];
    this.collectibles = [...levelData.collectibles];
    this.powerUps = [...levelData.powerUps];
    this.checkpoints = [...levelData.checkpoints];

    // Reset player position
    this.playerState.position = { ...levelData.playerStart };
    this.playerState.velocity = { x: 0, y: 0 };
    this.playerState.onGround = false;

    // Reset camera
    this.cameraSystem.reset();
  }

  pause(): void {
    this.gameState.isPaused = true;
  }

  resume(): void {
    this.gameState.isPaused = false;
  }

  destroy(): void {
    this.stop();
    this.inputSystem.destroy();
  }
}
