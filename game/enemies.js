// Enemy System
class Enemy extends Entity {
    constructor(x, y, type) {
        super(x, y);
        this.enemyType = type;
        this.active = true;
        this.health = 1;
        this.direction = -1; // Start facing left
        this.speed = 0.5;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.stateTimer = 0;
        
        // Movement smoothing
        this.targetVx = 0;
        this.acceleration = 0.001; // Drastically reduced from 0.005 for very gradual movement
        this.deceleration = 0.99; // Increased from 0.98 for even smoother deceleration
        
        this.setupEnemyType();
    }
    
    setupEnemyType() {
        switch (this.enemyType) {
            case ENEMY_TYPES.SLOUCHER:
                this.speed = 0.03; // Drastically reduced from 0.08 for very slow movement
                this.width = 16;
                this.height = 16;
                // Sloucher has a smaller, more precise hitbox
                this.setHitbox(2, 2, 12, 12);
                break;
            case ENEMY_TYPES.FORM_POLICE:
                this.speed = 0.05; // Drastically reduced from 0.12 for very slow movement
                this.width = 16;
                this.height = 16;
                this.health = 2; // Takes 2 hits
                // Form Police has a medium hitbox
                this.setHitbox(1, 1, 14, 14);
                break;
            case ENEMY_TYPES.SNAPPER:
                this.speed = 0;
                this.width = 16;
                this.height = 16;
                this.solid = false; // Can be passed through when retracted
                // Snapper has a small hitbox when extended
                this.setHitbox(3, 3, 10, 10);
                break;
            case ENEMY_TYPES.KETTLE_BELL:
                this.speed = 0.06; // Drastically reduced from 0.15 for very slow movement
                this.width = 16;
                this.height = 16;
                this.vy = -0.5; // Drastically reduced from -1.0 for very gentle jumping
                // Kettle Bell has a circular hitbox for more natural collision
                this.setHitbox(8, 8, 16, 16, 'circle', 6);
                break;
            case ENEMY_TYPES.PROTEIN_DRONE:
                this.speed = 0.08; // Drastically reduced from 0.2 for very slow movement
                this.width = 16;
                this.height = 16;
                this.solid = false; // Flies, doesn't collide with tiles
                // Protein Drone has a precise hitbox
                this.setHitbox(2, 2, 12, 12);
                break;
            case ENEMY_TYPES.BOSS_SHREDDER:
                this.speed = 0.06; // Drastically reduced from 0.15 for very slow movement
                this.width = 32;
                this.height = 32;
                this.health = 6;
                // Boss has a large but precise hitbox
                this.setHitbox(2, 2, 28, 28);
                break;
        }
    }
    
    update(deltaTime, level, player, particleSystem) {
        if (!this.active) return;
        
        // Clamp maximum velocity to prevent super fast movement
        const maxSpeed = this.speed * 1.5; // Reduced from 2.0 for more controlled movement
        this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));
        this.vy = Math.max(-maxSpeed * 1.5, Math.min(maxSpeed * 1.5, this.vy));
        
        this.updateAnimation(deltaTime);
        
        switch (this.enemyType) {
            case ENEMY_TYPES.SLOUCHER:
                this.updateSloucher(deltaTime, level);
                break;
            case ENEMY_TYPES.FORM_POLICE:
                this.updateFormPolice(deltaTime, level);
                break;
            case ENEMY_TYPES.SNAPPER:
                this.updateSnapper(deltaTime, level);
                break;
            case ENEMY_TYPES.KETTLE_BELL:
                this.updateKettleBell(deltaTime, level);
                break;
            case ENEMY_TYPES.PROTEIN_DRONE:
                this.updateProteinDrone(deltaTime, level);
                break;
            case ENEMY_TYPES.BOSS_SHREDDER:
                this.updateBossShredder(deltaTime, level, player);
                break;
        }
        
        // Check collision with player
        if (player && player.active && this.overlaps(player)) {
            this.handlePlayerCollision(player, particleSystem);
        }
        
        // Check collision with player projectiles
        if (player) {
            for (let i = player.projectiles.length - 1; i >= 0; i--) {
                const projectile = player.projectiles[i];
                if (this.overlaps(projectile)) {
                    this.takeDamage(1, particleSystem);
                    projectile.destroy();
                    player.projectiles.splice(i, 1);
                    break;
                }
            }
        }
    }
    
    updateSloucher(deltaTime, level) {
        // Simple walking enemy with proper time scaling and smoothing
        const timeScale = deltaTime / 16.67;
        
        // Set target velocity
        this.targetVx = this.direction * this.speed;
        
        // Smoothly accelerate/decelerate towards target velocity
        if (Math.abs(this.vx - this.targetVx) > 0.01) {
            if (this.vx < this.targetVx) {
                this.vx = Math.min(this.vx + this.acceleration * timeScale, this.targetVx);
            } else {
                this.vx = Math.max(this.vx - this.acceleration * timeScale, this.targetVx);
            }
        }
        
        // Apply physics
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        // Turn around at edges or walls
        if (this.vx === 0 || !this.onGround) {
            this.handleEdgeFall();
        }
    }
    
    updateFormPolice(deltaTime, level) {
        // Similar to Sloucher but faster with smoothing
        const timeScale = deltaTime / 16.67;
        
        // Set target velocity
        this.targetVx = this.direction * this.speed;
        
        // Smoothly accelerate/decelerate towards target velocity
        if (Math.abs(this.vx - this.targetVx) > 0.01) {
            if (this.vx < this.targetVx) {
                this.vx = Math.min(this.vx + this.acceleration * timeScale, this.targetVx);
            } else {
                this.vx = Math.max(this.vx - this.acceleration * timeScale, this.targetVx);
            }
        }
        
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        if (this.vx === 0 || !this.onGround) {
            this.handleEdgeFall();
        }
    }
    
    updateSnapper(deltaTime, level) {
        // Rises and falls on a timer with proper time scaling
        const timeScale = deltaTime / 16.67;
        this.stateTimer += deltaTime;
        
        if (this.stateTimer > 2000) { // 2 second cycle
            this.stateTimer = 0;
            this.solid = !this.solid; // Toggle between up and down
            
            if (this.solid) {
                // Rising - check if player is standing on top
                this.vy = -0.8; // Reduced from -1.0
            } else {
                // Falling
                this.vy = 0.8; // Reduced from 1.0
            }
        }
        
        // Use proper time scaling for movement
        this.y += this.vy * timeScale;
        
        // Clamp to vertical range
        const baseY = this.y; // This would be set from level data
        this.y = Math.max(baseY - 16, Math.min(baseY + 16, this.y));
    }
    
    updateKettleBell(deltaTime, level) {
        // Hopping enemy with proper time scaling
        const timeScale = deltaTime / 16.67;
        this.vx = this.direction * this.speed;
        
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        // Bounce off walls
        if (this.vx === 0) {
            this.handleWallCollision();
        }
        
        // Jump when hitting ground
        if (this.onGround && this.vy >= 0) {
            this.vy = -2.0; // Reduced from -3.0
        }
    }
    
    updateProteinDrone(deltaTime, level) {
        // Flying enemy with sine wave movement and proper time scaling
        const timeScale = deltaTime / 16.67;
        this.stateTimer += deltaTime;
        
        this.vx = this.direction * this.speed;
        this.vy = Math.sin(this.stateTimer * 0.003) * 0.3; // Reduced from 0.5
        
        // Use proper time scaling for movement
        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;
        
        // Turn around at screen edges (simplified)
        if (this.x < 0 || this.x > 800) {
            this.handleWallCollision();
        }
    }
    
    updateBossShredder(deltaTime, level, player) {
        // Complex boss behavior with proper time scaling
        const timeScale = deltaTime / 16.67;
        this.stateTimer += deltaTime;
        
        if (this.stateTimer > 3000) { // Change pattern every 3 seconds
            this.stateTimer = 0;
            
            // Simple charging attack
            if (player) {
                this.direction = player.x > this.x ? 1 : -1;
                this.vx = this.direction * this.speed * 1.5; // Reduced multiplier from 2.0
            }
        }
        
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        // Gradually slow down
        this.vx *= 0.98; // Increased from 0.95 for smoother deceleration
    }
    
    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        
        if (this.animationTimer >= 200) {
            this.animationFrame++;
            this.animationTimer = 0;
        }
    }
    
    handlePlayerCollision(player, particleSystem) {
        const playerBottom = player.y + player.height;
        const playerTop = player.y;
        const enemyTop = this.y;
        
        // Check if player is stomping enemy (landing on top)
        if (playerBottom <= enemyTop + 8 && player.vy >= 0) {
            // Player stomps enemy
            this.takeDamage(1, particleSystem);
            player.vy = -3; // Bounce player up
            player.score += 100;
        } else {
            // Enemy damages player
            if (player.takeDamage(particleSystem)) {
                // Player died
            }
        }
    }
    
    takeDamage(amount, particleSystem) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.destroy();
            particleSystem.enemyDefeated(this.x + this.width/2, this.y + this.height/2);
            window.audio.playSound('enemy_death');
        } else {
            // Flash or show damage
            window.audio.playSound('boss_hit');
        }
    }
    
    render(ctx, camera) {
        if (!this.active) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Get sprite based on enemy type - try Mario sprites first
        let spriteName = '';
        switch (this.enemyType) {
            case ENEMY_TYPES.SLOUCHER:
                // Use Goomba sprites for sloucher
                spriteName = this.animationFrame % 2 === 0 ? 'goomba_walk1' : 'goomba_walk2';
                break;
            case ENEMY_TYPES.FORM_POLICE:
                // Use Koopa sprites for form police
                spriteName = this.animationFrame % 2 === 0 ? 'koopa_walk1' : 'koopa_walk2';
                break;
            case ENEMY_TYPES.SNAPPER:
                spriteName = 'snapper';
                break;
            case ENEMY_TYPES.KETTLE_BELL:
                spriteName = 'kettle_bell';
                break;
            case ENEMY_TYPES.PROTEIN_DRONE:
                spriteName = 'protein_drone';
                break;
            case ENEMY_TYPES.BOSS_SHREDDER:
                spriteName = 'boss_shredder';
                break;
        }
        
        // Try to get Mario sprite first
        let sprite = window.sprites.getSprite(spriteName);
        
        // Fallback to original enemy sprites if Mario sprites aren't available
        if (!sprite) {
            switch (this.enemyType) {
                case ENEMY_TYPES.SLOUCHER:
                    spriteName = 'sloucher';
                    break;
                case ENEMY_TYPES.FORM_POLICE:
                    spriteName = 'form_police';
                    break;
                case ENEMY_TYPES.SNAPPER:
                    spriteName = 'snapper';
                    break;
                case ENEMY_TYPES.KETTLE_BELL:
                    spriteName = 'kettle_bell';
                    break;
                case ENEMY_TYPES.PROTEIN_DRONE:
                    spriteName = 'protein_drone';
                    break;
                case ENEMY_TYPES.BOSS_SHREDDER:
                    spriteName = 'boss_shredder';
                    break;
            }
            sprite = window.sprites.getSprite(spriteName);
        }
        
        if (sprite) {
            ctx.save();
            
            // Flip sprite based on direction
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
            ctx.fillStyle = this.getEnemyColor();
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
        
        // Debug hitbox
        if (window.game && window.game.debug) {
            ctx.strokeStyle = 'red';
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
        
        // Boss health bar
        if (this.enemyType === ENEMY_TYPES.BOSS_SHREDDER) {
            this.renderHealthBar(ctx, screenX, screenY - 20);
        }
    }
    
    getEnemyColor() {
        switch (this.enemyType) {
            case ENEMY_TYPES.SLOUCHER:
                return '#8B4513';
            case ENEMY_TYPES.FORM_POLICE:
                return '#000080';
            case ENEMY_TYPES.SNAPPER:
                return '#228B22';
            case ENEMY_TYPES.KETTLE_BELL:
                return COLORS.BLACK;
            case ENEMY_TYPES.PROTEIN_DRONE:
                return '#FF6B6B';
            case ENEMY_TYPES.BOSS_SHREDDER:
                return '#8B0000';
            default:
                return COLORS.ERROR;
        }
    }
    
    renderHealthBar(ctx, x, y) {
        const maxHealth = 6; // Boss max health
        const barWidth = 48;
        const barHeight = 6;
        
        // Background
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(x - 8, y, barWidth, barHeight);
        
        // Health
        ctx.fillStyle = COLORS.ERROR;
        const healthWidth = (this.health / maxHealth) * (barWidth - 2);
        ctx.fillRect(x - 7, y + 1, healthWidth, barHeight - 2);
        
        // Border
        ctx.strokeStyle = COLORS.WHITE;
        ctx.strokeRect(x - 8, y, barWidth, barHeight);
    }

    // Handle direction change smoothly
    changeDirection() {
        this.direction *= -1;
        // Reset velocity to prevent jerky movement
        this.vx = 0;
        this.targetVx = 0;
    }
    
    // Handle wall collision smoothly
    handleWallCollision() {
        if (this.vx !== 0) {
            this.changeDirection();
        }
    }
    
    // Handle falling off edge smoothly
    handleEdgeFall() {
        if (this.onGround) {
            this.changeDirection();
        }
    }
}

// Export to global scope
window.Enemy = Enemy;

// Global enemy debugging functions
window.resetAllEnemyMovement = () => {
    if (window.game && window.game.engine && window.game.engine.currentScene) {
        const scene = window.game.engine.engine.scenes.get(window.game.engine.currentScene);
        if (scene && scene.entities) {
            const enemies = scene.entities.filter(e => e.type === 'enemy' || e.enemyType !== undefined);
            enemies.forEach(enemy => {
                enemy.vx = 0;
                enemy.vy = 0;
                enemy.targetVx = 0;
            });
            console.log(`✅ Reset movement for ${enemies.length} enemies`);
        }
    } else {
        console.log('❌ Game scene not available');
    }
};

window.debugEnemyMovement = () => {
    if (window.game && window.game.engine && window.game.engine.currentScene) {
        const scene = window.game.engine.engine.scenes.get(window.game.engine.currentScene);
        if (scene && scene.entities) {
            const enemies = scene.entities.filter(e => e.type === 'enemy' || e.enemyType !== undefined);
            console.log(`Found ${enemies.length} enemies`);
            
            enemies.forEach((enemy, index) => {
                console.log(`Enemy ${index + 1}:`, {
                    type: enemy.enemyType,
                    speed: enemy.speed,
                    vx: enemy.vx?.toFixed(3),
                    vy: enemy.vy?.toFixed(3),
                    direction: enemy.direction,
                    onGround: enemy.onGround
                });
            });
        }
    } else {
        console.log('❌ Game scene not available');
    }
};