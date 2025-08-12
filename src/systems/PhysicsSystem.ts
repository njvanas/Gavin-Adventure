import { PlayerState, Platform, Enemy, GamePhysics } from '../types/GameTypes';

export class PhysicsSystem {
  private physics: GamePhysics = {
    gravity: 0.8,
    friction: 0.85,
    airResistance: 0.98,
    terminalVelocity: 16,
    jumpBufferTime: 150, // ms
    coyoteTime: 100 // ms
  };

  private jumpBuffer: number = 0;
  private coyoteTimer: number = 0;
  private lastGroundedTime: number = 0;

  updatePlayer(player: PlayerState, platforms: Platform[], deltaTime: number): PlayerState {
    const newPlayer = { ...player };

    // Apply gravity
    if (!newPlayer.isGrounded) {
      newPlayer.velocity.y += this.physics.gravity;
      newPlayer.velocity.y = Math.min(newPlayer.velocity.y, this.physics.terminalVelocity);
    }

    // Handle jump buffering and coyote time
    if (newPlayer.isGrounded) {
      this.lastGroundedTime = Date.now();
      this.coyoteTimer = this.physics.coyoteTime;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - deltaTime);
    }

    // Apply horizontal friction
    if (newPlayer.isGrounded) {
      newPlayer.velocity.x *= this.physics.friction;
    } else {
      newPlayer.velocity.x *= this.physics.airResistance;
    }

    // Update position
    newPlayer.position.x += newPlayer.velocity.x;
    newPlayer.position.y += newPlayer.velocity.y;

    // Collision detection and response
    const collisionResult = this.checkPlatformCollisions(newPlayer, platforms);
    newPlayer.position = collisionResult.position;
    newPlayer.velocity = collisionResult.velocity;
    newPlayer.isGrounded = collisionResult.isGrounded;

    // Update invulnerability
    if (newPlayer.invulnerable) {
      newPlayer.invulnerabilityTimer -= deltaTime;
      if (newPlayer.invulnerabilityTimer <= 0) {
        newPlayer.invulnerable = false;
      }
    }

    return newPlayer;
  }

  private checkPlatformCollisions(player: PlayerState, platforms: Platform[]) {
    let newPosition = { ...player.position };
    let newVelocity = { ...player.velocity };
    let isGrounded = false;

    const playerBounds = this.getPlayerBounds(player);

    for (const platform of platforms) {
      if (!platform.isActive) continue;

      const platformBounds = {
        left: platform.x,
        right: platform.x + platform.width,
        top: platform.y,
        bottom: platform.y + platform.height
      };

      // Check for collision
      if (this.boundsIntersect(playerBounds, platformBounds)) {
        const overlapX = Math.min(playerBounds.right - platformBounds.left, platformBounds.right - playerBounds.left);
        const overlapY = Math.min(playerBounds.bottom - platformBounds.top, platformBounds.bottom - playerBounds.top);

        // Resolve collision based on smallest overlap
        if (overlapX < overlapY) {
          // Horizontal collision
          if (playerBounds.left < platformBounds.left) {
            newPosition.x = platformBounds.left - this.getPlayerWidth(player);
          } else {
            newPosition.x = platformBounds.right;
          }
          newVelocity.x = 0;
        } else {
          // Vertical collision
          if (playerBounds.top < platformBounds.top) {
            // Landing on top of platform
            newPosition.y = platformBounds.top - this.getPlayerHeight(player);
            newVelocity.y = 0;
            isGrounded = true;

            // Handle special platform types
            if (platform.type === 'question' && platform.contains) {
              this.activateQuestionBlock(platform);
            } else if (platform.type === 'breakable' && player.size !== 'small' && newVelocity.y < 0) {
              this.breakBlock(platform);
            }
          } else {
            // Hitting platform from below
            newPosition.y = platformBounds.bottom;
            newVelocity.y = 0;
          }
        }
      }
    }

    return {
      position: newPosition,
      velocity: newVelocity,
      isGrounded
    };
  }

  private getPlayerBounds(player: PlayerState) {
    const width = this.getPlayerWidth(player);
    const height = this.getPlayerHeight(player);
    
    return {
      left: player.position.x,
      right: player.position.x + width,
      top: player.position.y,
      bottom: player.position.y + height
    };
  }

  private getPlayerWidth(player: PlayerState): number {
    return player.size === 'small' ? 32 : 32;
  }

  private getPlayerHeight(player: PlayerState): number {
    return player.size === 'small' ? 32 : 64;
  }

  private boundsIntersect(a: any, b: any): boolean {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  private activateQuestionBlock(platform: Platform) {
    if (platform.contains) {
      // Spawn power-up or coin
      platform.isActive = false;
      // Trigger power-up spawn event
    }
  }

  private breakBlock(platform: Platform) {
    platform.isActive = false;
    // Trigger break animation and sound
  }

  // Jump mechanics with variable height
  initiateJump(player: PlayerState): PlayerState {
    const newPlayer = { ...player };
    
    if (newPlayer.isGrounded || this.coyoteTimer > 0) {
      newPlayer.velocity.y = -newPlayer.jumpPower;
      newPlayer.isJumping = true;
      newPlayer.jumpHoldTime = 0;
      newPlayer.isGrounded = false;
      this.coyoteTimer = 0;
    } else {
      // Buffer the jump
      this.jumpBuffer = this.physics.jumpBufferTime;
    }

    return newPlayer;
  }

  continueJump(player: PlayerState, deltaTime: number): PlayerState {
    const newPlayer = { ...player };
    
    if (newPlayer.isJumping && newPlayer.jumpHoldTime < newPlayer.maxJumpHoldTime) {
      newPlayer.jumpHoldTime += deltaTime;
      // Apply additional upward force for variable jump height
      const jumpForce = (1 - newPlayer.jumpHoldTime / newPlayer.maxJumpHoldTime) * 0.5;
      newPlayer.velocity.y -= jumpForce;
    }

    return newPlayer;
  }

  releaseJump(player: PlayerState): PlayerState {
    const newPlayer = { ...player };
    newPlayer.isJumping = false;
    
    // Reduce upward velocity for shorter jumps
    if (newPlayer.velocity.y < 0) {
      newPlayer.velocity.y *= 0.5;
    }
    
    return newPlayer;
  }

  updateEnemies(enemies: Enemy[], platforms: Platform[], deltaTime: number): Enemy[] {
    return enemies.map(enemy => {
      const newEnemy = { ...enemy };

      // Apply gravity
      if (!newEnemy.isGrounded) {
        newEnemy.velocity.y += this.physics.gravity;
        newEnemy.velocity.y = Math.min(newEnemy.velocity.y, this.physics.terminalVelocity);
      }

      // Apply movement based on enemy type
      switch (newEnemy.type) {
        case 'goomba':
          newEnemy.velocity.x = newEnemy.direction * 1;
          break;
        case 'koopa':
          if (newEnemy.state === 'walking') {
            newEnemy.velocity.x = newEnemy.direction * 1.5;
          } else if (newEnemy.state === 'shell') {
            newEnemy.velocity.x *= 0.95; // Friction for shell
          }
          break;
      }

      // Update position
      newEnemy.x += newEnemy.velocity.x;
      newEnemy.y += newEnemy.velocity.y;

      // Platform collision for enemies
      const enemyCollision = this.checkEnemyPlatformCollisions(newEnemy, platforms);
      newEnemy.x = enemyCollision.x;
      newEnemy.y = enemyCollision.y;
      newEnemy.velocity = enemyCollision.velocity;
      newEnemy.isGrounded = enemyCollision.isGrounded;

      // Turn around at edges or walls
      if (enemyCollision.hitWall) {
        newEnemy.direction *= -1;
      }

      return newEnemy;
    });
  }

  private checkEnemyPlatformCollisions(enemy: Enemy, platforms: Platform[]) {
    // Similar to player collision but simpler
    let newX = enemy.x;
    let newY = enemy.y;
    let newVelocity = { ...enemy.velocity };
    let isGrounded = false;
    let hitWall = false;

    const enemyBounds = {
      left: newX,
      right: newX + 32,
      top: newY,
      bottom: newY + 32
    };

    for (const platform of platforms) {
      if (!platform.isActive) continue;

      const platformBounds = {
        left: platform.x,
        right: platform.x + platform.width,
        top: platform.y,
        bottom: platform.y + platform.height
      };

      if (this.boundsIntersect(enemyBounds, platformBounds)) {
        const overlapX = Math.min(enemyBounds.right - platformBounds.left, platformBounds.right - enemyBounds.left);
        const overlapY = Math.min(enemyBounds.bottom - platformBounds.top, platformBounds.bottom - enemyBounds.top);

        if (overlapX < overlapY) {
          // Horizontal collision - hit wall
          hitWall = true;
          if (enemyBounds.left < platformBounds.left) {
            newX = platformBounds.left - 32;
          } else {
            newX = platformBounds.right;
          }
          newVelocity.x = 0;
        } else {
          // Vertical collision
          if (enemyBounds.top < platformBounds.top) {
            newY = platformBounds.top - 32;
            newVelocity.y = 0;
            isGrounded = true;
          }
        }
      }
    }

    return {
      x: newX,
      y: newY,
      velocity: newVelocity,
      isGrounded,
      hitWall
    };
  }
}