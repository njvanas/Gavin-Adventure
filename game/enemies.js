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
        
        this.setupEnemyType();
    }
    
    setupEnemyType() {
        switch (this.enemyType) {
            case ENEMY_TYPES.SLOUCHER:
                this.speed = 0.3;
                this.width = 16;
                this.height = 16;
                break;
            case ENEMY_TYPES.FORM_POLICE:
                this.speed = 0.5;
                this.width = 16;
                this.height = 16;
                this.health = 2; // Takes 2 hits
                break;
            case ENEMY_TYPES.SNAPPER:
                this.speed = 0;
                this.width = 16;
                this.height = 16;
                this.solid = false; // Can be passed through when retracted
                break;
            case ENEMY_TYPES.KETTLE_BELL:
                this.speed = 1;
                this.width = 16;
                this.height = 16;
                this.vy = -2; // Start with upward velocity
                break;
            case ENEMY_TYPES.PROTEIN_DRONE:
                this.speed = 1;
                this.width = 16;
                this.height = 16;
                this.solid = false; // Flies, doesn't collide with tiles
                break;
            case ENEMY_TYPES.BOSS_SHREDDER:
                this.speed = 0.8;
                this.width = 32;
                this.height = 32;
                this.health = 6;
                break;
        }
    }
    
    update(deltaTime, level, player, particleSystem) {
        if (!this.active) return;
        
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
        // Simple walking enemy
        this.vx = this.direction * this.speed;
        
        // Apply physics
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        // Turn around at edges or walls
        if (this.vx === 0 || !this.onGround) {
            this.direction *= -1;
        }
    }
    
    updateFormPolice(deltaTime, level) {
        // Similar to Sloucher but faster
        this.vx = this.direction * this.speed;
        
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        if (this.vx === 0 || !this.onGround) {
            this.direction *= -1;
        }
    }
    
    updateSnapper(deltaTime, level) {
        // Rises and falls on a timer
        this.stateTimer += deltaTime;
        
        if (this.stateTimer > 2000) { // 2 second cycle
            this.stateTimer = 0;
            this.solid = !this.solid; // Toggle between up and down
            
            if (this.solid) {
                // Rising - check if player is standing on top
                // In a full implementation, we'd check for player overlap
                this.vy = -1;
            } else {
                // Falling
                this.vy = 1;
            }
        }
        
        this.y += this.vy * deltaTime / 16.67;
        
        // Clamp to vertical range
        const baseY = this.y; // This would be set from level data
        this.y = Math.max(baseY - 16, Math.min(baseY + 16, this.y));
    }
    
    updateKettleBell(deltaTime, level) {
        // Hopping enemy
        this.vx = this.direction * this.speed;
        
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        // Bounce off walls
        if (this.vx === 0) {
            this.direction *= -1;
        }
        
        // Jump when hitting ground
        if (this.onGround && this.vy >= 0) {
            this.vy = -3;
        }
    }
    
    updateProteinDrone(deltaTime, level) {
        // Flying enemy with sine wave movement
        this.stateTimer += deltaTime;
        
        this.vx = this.direction * this.speed;
        this.vy = Math.sin(this.stateTimer * 0.003) * 0.5; // Gentle up/down movement
        
        this.x += this.vx * deltaTime / 16.67;
        this.y += this.vy * deltaTime / 16.67;
        
        // Turn around at screen edges (simplified)
        if (this.x < 0 || this.x > 800) {
            this.direction *= -1;
        }
    }
    
    updateBossShredder(deltaTime, level, player) {
        // Complex boss behavior
        this.stateTimer += deltaTime;
        
        if (this.stateTimer > 3000) { // Change pattern every 3 seconds
            this.stateTimer = 0;
            
            // Simple charging attack
            if (player) {
                this.direction = player.x > this.x ? 1 : -1;
                this.vx = this.direction * this.speed * 2;
            }
        }
        
        Physics.applyGravity(this, deltaTime);
        Physics.updatePosition(this, deltaTime);
        Collision.resolveEntityTiles(this, level);
        
        // Gradually slow down
        this.vx *= 0.95;
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
        
        // Get sprite based on enemy type
        let spriteName = '';
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
        
        const sprite = window.sprites.getSprite(spriteName);
        if (sprite) {
            ctx.save();
            
            // Flip sprite based on direction
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
}

// Export to global scope
window.Enemy = Enemy;