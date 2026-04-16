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
        
        this.jumpHeld = false;
        this.jumpTimer = 0;
        this.coyoteTime = 0;
        /** Seconds remaining for jump buffer input */
        this.jumpBuffer = 0;

        this.smbVelX = 0;
        this.smbVelY = 0;
        this.fallAcc = (window.SMB_CONST && window.SMB_CONST.DEFAULT_GRAVITY) || 562.5;
        this.smbState = 0;
        this.smbFacing = 0;
        
        // Animation
        this.animationState = 'idle';
        this.animationFrame = 0;
        this.animationTimer = 0;
        
        // Abilities
        this.canThrow = false;
        this.throwCooldown = 0;
        this.projectiles = [];
        this.canBreakBlocks = true; // Player can break blocks by hitting them from below
        
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
        
        // Auto-fix stuck states
        this.forceUnstuck();
        
        // Update invulnerability
        if (this.invulnerabilityTime > 0) {
            this.invulnerabilityTime -= deltaTime;
        }
        
        // Update cooldowns
        if (this.throwCooldown > 0) {
            this.throwCooldown -= deltaTime;
        }
        
        this.handleInput(input, deltaTime, particleSystem);
        this.updatePhysics(deltaTime, level, input);
        this.updateAnimation(deltaTime);
        this.updateProjectiles(deltaTime, level);

        const dt = deltaTime / 1000;
        if (this.onGround) {
            this.coyoteTime = GAME_CONFIG.PHYSICS.COYOTE_TIME_SEC;
        } else {
            this.coyoteTime = Math.max(0, this.coyoteTime - dt);
        }

        if (this.jumpBuffer > 0) {
            this.jumpBuffer = Math.max(0, this.jumpBuffer - dt);
        }
    }
    
    handleInput(input, deltaTime, particleSystem) {
        this.crouching = input.isDown('down');
        if (input.isPressed('jump')) {
            this.jumpBuffer = GAME_CONFIG.PHYSICS.JUMP_BUFFER_SEC;
        }
        this.jumpHeld = input.isDown('jump');

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
    
    updatePhysics(deltaTime, level, input) {
        if (!input || !level) return;

        window.SMBIntegrator.stepGavin(this, input, deltaTime);

        const dt = deltaTime / 1000;
        this.x += this.vx * dt;
        Collision.resolveEntityTilesHorizontal(this, level);
        this.y += this.vy * dt;
        Collision.resolveEntityTilesVertical(this, level);

        const PS = window.SMB_CONST.POS_SCALE;
        this.smbVelX = this.vx / PS;
        this.smbVelY = this.vy / PS;
        if (this.onGround) {
            this.smbVelY = 0;
            this.fallAcc = (window.SMB_CONST && window.SMB_CONST.DEFAULT_GRAVITY) || 562.5;
            if (this.smbState === 4) {
                this.smbState = 0;
            }
        }
    }
    
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        
        const frameTime = this.animationState === 'run' ? 100 : 200;
        
        if (this.animationTimer >= frameTime) {
            this.animationFrame++;
            this.animationTimer = 0;
        }
        
        if (!this.onGround) {
            this.animationState = 'jump';
            this.animationFrame = this.vy < 0 ? 0 : 1;
        }
        /* Ground: idle / walk / run / skid come from applySMBStyleHorizontal */
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
        
        // Get Mario sprite based on power state and animation state
        let spriteName = '';
        switch (this.powerState) {
            case POWER_STATES.SMALL:
                switch (this.animationState) {
                    case 'idle':
                        spriteName = 'mario_small_idle';
                        break;
                    case 'walk':
                    case 'run':
                        // Cycle through run animations
                        const runFrame = (this.animationFrame % 3) + 1;
                        spriteName = `mario_small_run${runFrame}`;
                        break;
                    case 'skid':
                        spriteName = 'mario_small_run2';
                        break;
                    case 'jump':
                        spriteName = 'mario_small_jump';
                        break;
                    default:
                        spriteName = 'mario_small_idle';
                }
                break;
            case POWER_STATES.PUMP:
            case POWER_STATES.BEAST:
                switch (this.animationState) {
                    case 'idle':
                        spriteName = 'mario_big_idle';
                        break;
                    case 'walk':
                    case 'run':
                        // Cycle through run animations
                        const runFrame = (this.animationFrame % 3) + 1;
                        spriteName = `mario_big_run${runFrame}`;
                        break;
                    case 'skid':
                        spriteName = 'mario_big_run2';
                        break;
                    case 'jump':
                        spriteName = 'mario_big_jump';
                        break;
                    default:
                        spriteName = 'mario_big_idle';
                }
                break;
        }
        
        // Try to get Mario sprite first
        let sprite = window.sprites.getSprite(spriteName);
        
        // Fallback to original Gavin sprites if Mario sprites aren't available
        if (!sprite) {
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
            sprite = window.sprites.getSprite(spriteName);
        }
        
        if (sprite) {
            ctx.save();
            
            // Flip sprite if facing left
            if (this.direction < 0) {
                ctx.scale(-1, 1);
                ctx.drawImage(
                    sprite.image,
                    sprite.x, sprite.y, sprite.width, sprite.height,
                    -screenX - this.width, screenY,
                    this.width, this.height
                );
            } else {
                ctx.drawImage(
                    sprite.image,
                    sprite.x, sprite.y, sprite.width, sprite.height,
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
            'Vel(px/s)': `${this.vx.toFixed(0)}, ${this.vy.toFixed(0)}`,
            'SMB': `${this.smbVelX.toFixed(0)}, ${this.smbVelY.toFixed(0)} st=${this.smbState}`,
            'On Ground': this.onGround,
            'Lives': this.lives,
            'Score': this.score
        };
    }
    
    // Reset input states to prevent stuck controls
    resetInputStates() {
        this.jumpHeld = false;
        this.jumpBuffer = 0;
        this.running = false;
        this.crouching = false;
    }
    
    // Force reset jump state
    resetJumpState() {
        this.jumpHeld = false;
        this.jumpBuffer = 0;
        this.jumpTimer = 0;
        this.coyoteTime = 0;
    }
    
    // Check if player is in a stuck state
    isStuck() {
        return this.jumpHeld && !this.onGround && this.vy === 0;
    }
    
    // Force unstuck player
    forceUnstuck() {
        if (this.isStuck()) {
            this.resetJumpState();
            const PS = window.SMB_CONST.POS_SCALE;
            this.smbVelY = 2;
            this.vy = this.smbVelY * PS;
        }
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