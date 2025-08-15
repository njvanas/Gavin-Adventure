// Player Character - Gavin
class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'player';
        this.width = 16;
        this.height = 16;
        
        // Power states
        this.powerState = POWER_STATES.SMALL;
        this.invulnerabilityTime = 0;
        this.maxInvulnerabilityTime = 1000; // 1 second
        
        // Movement
        this.direction = 1; // 1 = right, -1 = left
        this.running = false;
        this.crouching = false;
        this.onGround = false;
        
        // Jump mechanics
        this.jumpHeld = false;
        this.jumpTimer = 0;
        this.coyoteTime = 0;
        this.jumpBuffer = 0;
        
        // Animation
        this.animationState = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;
        
        // Abilities
        this.canThrow = false;
        this.throwCooldown = 0;
        this.projectiles = [];
        
        // Stats
        this.lives = 3;
        this.score = 0;
        this.gainsPoints = 0;
        
        this.updateSizeForPowerState();
    }
    
    updateSizeForPowerState() {
        switch (this.powerState) {
            case POWER_STATES.SMALL:
                this.width = 16;
                this.height = 16;
                this.canThrow = false;
                // Small hitbox centered on sprite
                this.setHitbox(0, 0, 14, 14);
                break;
            case POWER_STATES.PUMP:
                this.width = 16;
                this.height = 24;
                this.canThrow = false;
                // Pump hitbox - wider and taller, slightly offset
                this.setHitbox(-1, 0, 18, 22);
                break;
            case POWER_STATES.BEAST:
                this.width = 24;
                this.height = 24;
                this.canThrow = true;
                // Beast hitbox - larger and more precise
                this.setHitbox(-2, 0, 20, 22);
                break;
        }
    }
    
    update(deltaTime, level, input, particleSystem) {
        if (!this.active) return;
        
        // Update invulnerability
        if (this.invulnerabilityTime > 0) {
            this.invulnerabilityTime -= deltaTime;
        }
        
        // Update cooldowns
        if (this.throwCooldown > 0) {
            this.throwCooldown -= deltaTime;
        }
        
        this.handleInput(input, deltaTime, particleSystem);
        this.updatePhysics(deltaTime, level);
        this.updateAnimation(deltaTime);
        this.updateProjectiles(deltaTime, level);
        
        // Update coyote time and jump buffer
        if (this.onGround) {
            this.coyoteTime = GAME_CONFIG.PHYSICS.COYOTE_TIME;
        } else {
            this.coyoteTime = Math.max(0, this.coyoteTime - deltaTime / 16.67);
        }
        
        if (this.jumpBuffer > 0) {
            this.jumpBuffer = Math.max(0, this.jumpBuffer - deltaTime / 16.67);
        }
    }
    
    handleInput(input, deltaTime, particleSystem) {
        const timeScale = deltaTime / 16.67;
        
        // Horizontal movement
        this.running = input.isDown('run');
        const speed = this.running ? GAME_CONFIG.PHYSICS.RUN_SPEED : GAME_CONFIG.PHYSICS.WALK_SPEED;
        
        if (input.isDown('left')) {
            this.vx = -speed;
            this.direction = -1;
            this.animationState = this.running ? 'run' : 'walk';
        } else if (input.isDown('right')) {
            this.vx = speed;
            this.direction = 1;
            this.animationState = this.running ? 'run' : 'walk';
        } else {
            this.vx = 0;
            this.animationState = 'idle';
        }
        
        // Crouching
        this.crouching = input.isDown('down');
        if (this.crouching && this.onGround) {
            this.vx *= 0.5; // Slow down when crouching
        }
        
        // Jumping
        if (input.isPressed('jump')) {
            this.jumpBuffer = GAME_CONFIG.PHYSICS.JUMP_BUFFER;
        }
        
        this.jumpHeld = input.isDown('jump');
        
        // Execute jump
        if (this.jumpBuffer > 0 && (this.onGround || this.coyoteTime > 0)) {
            this.jump();
            this.jumpBuffer = 0;
            this.coyoteTime = 0;
            particleSystem.playerLand(this.x, this.y + this.height);
            window.audio.playSound('jump');
        }
        
        // Variable jump height
        if (this.jumpHeld && this.jumpTimer > 0 && this.vy < 0) {
            this.jumpTimer = Math.max(0, this.jumpTimer - timeScale);
        } else {
            this.jumpTimer = 0;
        }
        
        // Throwing (Beast Mode only)
        if (this.canThrow && input.isPressed('throw') && this.throwCooldown <= 0) {
            this.throwProjectile();
            this.throwCooldown = 300; // 0.3 second cooldown
        }
        
        // Update throw button visibility
        const throwBtn = document.getElementById('throwBtn');
        if (throwBtn) {
            throwBtn.style.opacity = this.canThrow ? '1' : '0.3';
        }
    }
    
    jump() {
        const jumpPower = this.running ? 
            GAME_CONFIG.PHYSICS.JUMP_IMPULSE_RUN : 
            GAME_CONFIG.PHYSICS.JUMP_IMPULSE_SMALL;
        
        this.vy = -jumpPower;
        this.jumpTimer = GAME_CONFIG.PHYSICS.VARIABLE_JUMP_FRAMES;
        this.onGround = false;
        this.animationState = 'jump';
    }
    
    throwProjectile() {
        if (!this.canThrow) return;
        
        const projectile = new ProteinScoop(
            this.x + (this.direction > 0 ? this.width : 0),
            this.y + this.height / 2,
            this.direction
        );
        this.projectiles.push(projectile);
        
        window.audio.playSound('throw');
    }
    
    updatePhysics(deltaTime, level) {
        // Apply friction
        if (this.onGround) {
            Physics.applyFriction(this, GAME_CONFIG.PHYSICS.FRICTION);
        } else {
            Physics.applyFriction(this, GAME_CONFIG.PHYSICS.AIR_FRICTION);
        }
        
        // Apply gravity and update position
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        
        // Collision with level
        if (level) {
            Collision.resolveEntityTiles(this, level);
        }
    }
    
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        
        const frameTime = this.animationState === 'run' ? 100 : 200;
        
        if (this.animationTimer >= frameTime) {
            this.animationFrame++;
            this.animationTimer = 0;
        }
        
        // Set animation state based on movement
        if (!this.onGround) {
            this.animationState = 'jump';
            this.animationFrame = this.vy < 0 ? 0 : 1; // Rising or falling
        } else if (Math.abs(this.vx) > 0.1) {
            this.animationState = this.running ? 'run' : 'walk';
        } else {
            this.animationState = 'idle';
            this.animationFrame = 0;
        }
    }
    
    updateProjectiles(deltaTime, level) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(deltaTime, level);
            
            if (!projectile.active) {
                this.projectiles.splice(i, 1);
            }
        }
    }
    
    powerUp(newState, particleSystem) {
        if (newState <= this.powerState) return;
        
        const oldState = this.powerState;
        this.powerState = newState;
        this.updateSizeForPowerState();
        
        // Emit power-up particles
        particleSystem.powerUpCollected(this.x + this.width / 2, this.y + this.height / 2);
        
        window.audio.playSound('powerup');
        
        // Adjust position to prevent getting stuck
        if (oldState === POWER_STATES.SMALL && newState >= POWER_STATES.PUMP) {
            this.y -= 8; // Move up to accommodate new height
        }
    }
    
    takeDamage(particleSystem) {
        if (this.invulnerabilityTime > 0) return false;
        
        if (this.powerState > POWER_STATES.SMALL) {
            // Lose power state
            this.powerState--;
            this.updateSizeForPowerState();
            this.invulnerabilityTime = this.maxInvulnerabilityTime;
            
            window.audio.playSound('hurt');
            return false; // Didn't die
        } else {
            // Lose life
            this.lives--;
            this.invulnerabilityTime = this.maxInvulnerabilityTime;
            
            if (this.lives <= 0) {
                this.active = false;
                return true; // Died
            }
            
            window.audio.playSound('hurt');
            return false;
        }
    }
    
    collectCoin(value = 100) {
        this.score += value;
        this.gainsPoints += value;
        
        // GAINS meter bonus
        if (this.gainsPoints >= 100) {
            this.gainsPoints -= 100;
            // Could add bonus here
        }
        
        window.audio.playSound('coin');
    }
    
    collectLife() {
        this.lives++;
        window.audio.playSound('powerup');
    }
    
    render(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Invulnerability blinking
        if (this.invulnerabilityTime > 0 && Math.floor(this.invulnerabilityTime / 100) % 2 === 0) {
            return; // Skip rendering for blink effect
        }
        
        // Get sprite based on power state
        let spriteName = '';
        switch (this.powerState) {
            case POWER_STATES.SMALL:
                spriteName = 'gavin_small_idle';
                break;
            case POWER_STATES.PUMP:
                spriteName = 'gavin_pump_idle';
                break;
            case POWER_STATES.BEAST:
                spriteName = 'gavin_beast_idle';
                break;
        }
        
        const sprite = window.sprites.getSprite(spriteName);
        if (sprite) {
            ctx.save();
            
            // Flip sprite if facing left
            if (this.direction < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(
                    sprite.image,
                    -screenX - this.width, screenY,
                    this.width, this.height
                );
            } else {
                ctx.drawImage(
                    sprite.image,
                    screenX, screenY,
                    this.width, this.height
                );
            }
            
            ctx.restore();
        } else {
            // Fallback colored rectangle
            ctx.fillStyle = this.getPowerColor();
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
        
        // Debug hitbox
        if (window.game && window.game.debug) {
            ctx.strokeStyle = 'lime';
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
        
        // Render projectiles
        for (const projectile of this.projectiles) {
            projectile.render(ctx, camera);
        }
    }
    
    getPowerColor() {
        switch (this.powerState) {
            case POWER_STATES.SMALL:
                return COLORS.ACCENT;
            case POWER_STATES.PUMP:
                return COLORS.PRIMARY;
            case POWER_STATES.BEAST:
                return COLORS.ERROR;
            default:
                return COLORS.WHITE;
        }
    }
    
    onDeath() {
        // Handle falling into pits
        this.takeDamage(window.particles);
        if (this.active) {
            // Respawn at checkpoint or level start
            // This would be handled by the level/scene
        }
    }
    
    getDebugInfo() {
        return {
            'Power State': this.powerState,
            'Position': `${Math.floor(this.x)}, ${Math.floor(this.y)}`,
            'Velocity': `${this.vx.toFixed(1)}, ${this.vy.toFixed(1)}`,
            'On Ground': this.onGround,
            'Lives': this.lives,
            'Score': this.score
        };
    }
}

// Protein Scoop Projectile
class ProteinScoop extends Entity {
    constructor(x, y, direction) {
        super(x, y);
        this.type = 'projectile';
        this.width = 8;
        this.height = 8;
        this.vx = direction * 4; // Fast horizontal movement
        this.vy = -1; // Slight upward arc
        this.direction = direction;
        this.bounces = 3;
        this.maxLifetime = 3000; // 3 seconds
        this.lifetime = 0;
    }
    
    update(deltaTime, level) {
        this.lifetime += deltaTime;
        if (this.lifetime > this.maxLifetime) {
            this.destroy();
            return;
        }
        
        // Apply gravity
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        
        // Bounce off walls and ground
        if (level) {
            const originalX = this.x;
            const originalY = this.y;
            
            if (Collision.checkTileCollision(this, level)) {
                // Simple bounce logic
                if (this.x !== originalX) {
                    this.vx = -this.vx;
                    this.bounces--;
                }
                if (this.y !== originalY) {
                    this.vy = -Math.abs(this.vy) * 0.7; // Bouncy
                    this.bounces--;
                }
                
                if (this.bounces <= 0) {
                    this.destroy();
                    return;
                }
            }
        }
        
        // Destroy if too far off screen
        if (this.x < -100 || this.x > 2000 || this.y > 1000) {
            this.destroy();
        }
    }
    
    render(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Draw as small white circle (protein scoop)
        ctx.fillStyle = COLORS.WHITE;
        ctx.beginPath();
        ctx.arc(screenX + 4, screenY + 4, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = COLORS.PRIMARY;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Debug hitbox
        if (window.game && window.game.debug) {
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    }
}

// Export to global scope
window.Player = Player;
window.ProteinScoop = ProteinScoop;