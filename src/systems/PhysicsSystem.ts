import { PlayerState, Platform, Enemy, GamePhysics } from '../types/GameTypes';

export interface PhysicsBody {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  onGround: boolean;
  canJump: boolean;
}

export interface PhysicsConfig {
  gravity: number;
  maxFallSpeed: number;
  moveSpeed: number;
  jumpPower: number;
  acceleration: number;
  deceleration: number;
  airResistance: number;
  jumpCutoff: number;
}

export class PhysicsSystem {
  private config: PhysicsConfig;

  constructor(config: Partial<PhysicsConfig> = {}) {
    this.config = {
      gravity: 0.8,
      maxFallSpeed: 12,
      moveSpeed: 6,
      jumpPower: 15,
      acceleration: 0.8,
      deceleration: 0.9,
      airResistance: 0.85,
      jumpCutoff: 0.5,
      ...config
    };
  }

  updatePlayerPhysics(
    body: PhysicsBody,
    input: { left: boolean; right: boolean; jump: boolean; jumpPressed: boolean }
  ): PhysicsBody {
    const newBody = { ...body };
    
    // Horizontal movement with acceleration
    if (input.left) {
      newBody.velocityX = Math.max(
        -this.config.moveSpeed,
        newBody.velocityX - this.config.acceleration
      );
    } else if (input.right) {
      newBody.velocityX = Math.min(
        this.config.moveSpeed,
        newBody.velocityX + this.config.acceleration
      );
    } else {
      // Apply deceleration when no input
      if (newBody.onGround) {
        newBody.velocityX *= this.config.deceleration;
      } else {
        newBody.velocityX *= this.config.airResistance;
      }
      
      // Stop completely if very slow
      if (Math.abs(newBody.velocityX) < 0.1) {
        newBody.velocityX = 0;
      }
    }

    // Jumping with variable height
    if (input.jumpPressed && newBody.canJump && newBody.onGround) {
      newBody.velocityY = -this.config.jumpPower;
      newBody.onGround = false;
      newBody.canJump = false;
    }

    // Variable jump height - cut jump short if button released
    if (input.jump && newBody.velocityY < 0) {
      // Continue jump
    } else if (!input.jump && newBody.velocityY < 0) {
      // Cut jump short
      newBody.velocityY *= this.config.jumpCutoff;
    }

    // Apply gravity
    if (!newBody.onGround) {
      newBody.velocityY = Math.min(
        this.config.maxFallSpeed,
        newBody.velocityY + this.config.gravity
      );
    }

    // Update position
    newBody.x += newBody.velocityX;
    newBody.y += newBody.velocityY;

    // Reset jump ability when landing
    if (newBody.onGround && newBody.velocityY >= 0) {
      newBody.canJump = true;
    }

    return newBody;
  }

  checkCollision(body1: PhysicsBody, body2: PhysicsBody): boolean {
    return (
      body1.x < body2.x + body2.width &&
      body1.x + body1.width > body2.x &&
      body1.y < body2.y + body2.height &&
      body1.y + body1.height > body2.y
    );
  }

  resolveCollision(body: PhysicsBody, obstacle: PhysicsBody): PhysicsBody {
    const newBody = { ...body };
    
    // Calculate overlap
    const overlapX = Math.min(
      body.x + body.width - obstacle.x,
      obstacle.x + obstacle.width - body.x
    );
    const overlapY = Math.min(
      body.y + body.height - obstacle.y,
      obstacle.y + obstacle.height - body.y
    );

    // Resolve collision based on overlap direction
    if (overlapX < overlapY) {
      // Horizontal collision
      if (body.x < obstacle.x) {
        newBody.x = obstacle.x - body.width;
      } else {
        newBody.x = obstacle.x + obstacle.width;
      }
      newBody.velocityX = 0;
    } else {
      // Vertical collision
      if (body.y < obstacle.y) {
        // Landing on top
        newBody.y = obstacle.y - body.height;
        newBody.velocityY = 0;
        newBody.onGround = true;
      } else {
        // Hitting head
        newBody.y = obstacle.y + obstacle.height;
        newBody.velocityY = 0;
      }
    }

    return newBody;
  }

  // Check if player can jump through platform from below
  canJumpThrough(body: PhysicsBody, platform: PhysicsBody): boolean {
    return (
      body.velocityY < 0 && // Moving upward
      body.y + body.height > platform.y && // Below platform
      body.y + body.height < platform.y + platform.height / 2 // Close to platform bottom
    );
  }

  // Get physics configuration
  getConfig(): PhysicsConfig {
    return { ...this.config };
  }

  // Update physics configuration (for power-ups)
  updateConfig(newConfig: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}