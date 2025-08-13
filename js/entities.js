// Gavin Adventure - Entity System
// All game entities including Gavin, enemies, items, and projectiles

class Entity {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.isJumping = false;
        this.health = 1;
        this.maxHealth = 1;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.facing = 1; // 1 = right, -1 = left
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.removed = false;
    }

    update(deltaTime) {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.updateAnimation(deltaTime);
    }

    updateAnimation(deltaTime) {
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 100) { // 100ms per frame
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationTimer = 0;
        }
    }

    render(ctx, camera) {
        // Override in subclasses
    }

    takeDamage(damage, source) {
        if (!this.invulnerable) {
            this.health -= damage;
            this.invulnerable = true;
            this.invulnerableTime = 60;
            
            if (this.health <= 0) {
                this.die();
            }
        }
    }

    die() {
        this.removed = true;
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

// Gavin - Main character
class Gavin extends Entity {
    constructor(x, y) {
        super(x, y, 16, 32);
        this.powerLevel = 1; // 1 = small, 2 = pump, 3 = beast
        this.isCrouched = false;
        this.isRunning = false;
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.projectiles = [];
        this.score = 0;
        this.lives = 3;
        this.gainsMeter = 0;
        this.maxGainsMeter = 100;
        this.checkpointX = x;
        this.checkpointY = y;
        this.dead = false;
        this.respawnTimer = 0;
        this.invincibilityTimer = 0;
    }

    update(deltaTime) {
        if (this.dead) {
            this.respawnTimer -= deltaTime;
            if (this.respawnTimer <= 0) {
                this.respawn();
            }
            return;
        }

        super.update(deltaTime);
        
        // Update attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Update invincibility
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer -= deltaTime;
        }
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(proj => !proj.removed);
        this.projectiles.forEach(proj => proj.update(deltaTime));
        
        // Apply physics
        PHYSICS.updateEntity(this, this.getNearbyTiles());
    }

    render(ctx, camera) {
        if (this.dead) return;
        
        // Don't render if invincible and flashing
        if (this.invincibilityTimer > 0 && Math.floor(this.invincibilityTimer / 10) % 2 === 0) {
            return;
        }

        let sprite;
        if (this.isJumping) {
            sprite = SPRITE_SHEET.getSprite('gavinJump');
        } else if (this.isCrouched) {
            sprite = SPRITE_SHEET.getSprite('gavinSquat');
        } else if (this.isRunning) {
            sprite = SPRITE_SHEET.getSprite('gavinWalk')[this.animationFrame];
        } else {
            // Choose sprite based on power level
            switch (this.powerLevel) {
                case 1:
                    sprite = SPRITE_SHEET.getSprite('gavinSmall');
                    break;
                case 2:
                    sprite = SPRITE_SHEET.getSprite('gavinPump');
                    break;
                case 3:
                    sprite = SPRITE_SHEET.getSprite('gavinBeast');
                    break;
            }
        }

        if (sprite) {
            ctx.save();
            if (this.facing < 0) {
                ctx.scale(-1, 1);
                ctx.translate(-this.x - this.width, 0);
            }
            ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
            ctx.restore();
        }

        // Render projectiles
        this.projectiles.forEach(proj => proj.render(ctx, camera));
    }

    jump() {
        if (PHYSICS.makeJump(this)) {
            AUDIO_MANAGER.playSound('jump');
        }
    }

    crouch() {
        this.isCrouched = true;
        this.velocityX = 0;
    }

    stand() {
        this.isCrouched = false;
    }

    run() {
        this.isRunning = true;
    }

    walk() {
        this.isRunning = false;
    }

    attack() {
        if (this.canAttack() && this.attackCooldown <= 0) {
            this.isAttacking = true;
            this.attackCooldown = 500; // 500ms cooldown
            
            if (this.powerLevel >= 3) {
                this.throwProteinScoop();
            }
            
            AUDIO_MANAGER.playSound('powerUp');
        }
    }

    canAttack() {
        return this.powerLevel >= 2 && !this.isAttacking;
    }

    throwProteinScoop() {
        const direction = this.facing;
        const projectile = new ProteinScoop(
            this.x + (direction > 0 ? this.width : 0),
            this.y + this.height / 2,
            direction
        );
        this.projectiles.push(projectile);
    }

    powerUp() {
        if (this.powerLevel < 3) {
            this.powerLevel++;
            this.updateSize();
            AUDIO_MANAGER.playSound('powerUp');
        }
    }

    powerDown() {
        if (this.powerLevel > 1) {
            this.powerLevel--;
            this.updateSize();
        }
    }

    updateSize() {
        switch (this.powerLevel) {
            case 1:
                this.width = 16;
                this.height = 32;
                break;
            case 2:
                this.width = 24;
                this.height = 40;
                break;
            case 3:
                this.width = 32;
                this.height = 48;
                break;
        }
    }

    collectItem(item) {
        switch (item.type) {
            case 'proteinShake':
                this.powerUp();
                this.score += 100;
                break;
            case 'preWorkout':
                this.powerUp();
                this.score += 200;
                break;
            case 'dumbbell':
                this.score += 50;
                this.gainsMeter = Math.min(this.maxGainsMeter, this.gainsMeter + 10);
                AUDIO_MANAGER.playSound('coin');
                break;
            case 'membershipCard':
                this.lives++;
                this.score += 500;
                AUDIO_MANAGER.playSound('powerUp');
                break;
        }
    }

    takeDamage(damage, source) {
        if (this.invincibilityTimer > 0) return;
        
        this.powerDown();
        this.lives--;
        this.invincibilityTimer = 120; // 2 seconds
        
        if (this.lives <= 0) {
            this.die();
        } else {
            this.respawn();
        }
        
        AUDIO_MANAGER.playSound('death');
    }

    die() {
        this.dead = true;
        this.respawnTimer = 3000; // 3 seconds
    }

    respawn() {
        this.x = this.checkpointX;
        this.y = this.checkpointY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.dead = false;
        this.powerLevel = 1;
        this.updateSize();
        this.projectiles = [];
    }

    setCheckpoint(x, y) {
        this.checkpointX = x;
        this.checkpointY = y;
    }

    getNearbyTiles() {
        // This would be implemented to get tiles from the level
        return [];
    }
}

// Enemy base class
class Enemy extends Entity {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 1;
        this.direction = -1;
        this.patrolDistance = 100;
        this.startX = x;
        this.health = 1;
        this.damage = 1;
        this.scoreValue = 100;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Basic patrol behavior
        this.velocityX = this.speed * this.direction;
        
        // Turn around at patrol boundaries
        if (this.x <= this.startX - this.patrolDistance || 
            this.x >= this.startX + this.patrolDistance) {
            this.direction *= -1;
            this.facing = this.direction;
        }
        
        // Apply physics
        PHYSICS.updateEntity(this, this.getNearbyTiles());
    }

    onCollisionWithPlayer(player) {
        player.takeDamage(this.damage, this);
    }

    onStompedByPlayer(player) {
        this.die();
        player.score += this.scoreValue;
        player.velocityY = -10; // Bounce
        AUDIO_MANAGER.playSound('stomp');
    }

    getNearbyTiles() {
        // This would be implemented to get tiles from the level
        return [];
    }
}

// Sloucher (replaces Goomba)
class Sloucher extends Enemy {
    constructor(x, y) {
        super(x, y, 16, 16);
        this.speed = 0.5;
        this.patrolDistance = 80;
    }

    render(ctx, camera) {
        const sprite = SPRITE_SHEET.getSprite('sloucher');
        if (sprite) {
            ctx.save();
            if (this.facing < 0) {
                ctx.scale(-1, 1);
                ctx.translate(-this.x - this.width, 0);
            }
            ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
            ctx.restore();
        }
    }
}

// Form Police (replaces Koopa Troopa)
class FormPolice extends Enemy {
    constructor(x, y) {
        super(x, y, 16, 24);
        this.speed = 1.5;
        this.patrolDistance = 120;
        this.damage = 2;
        this.scoreValue = 200;
    }

    render(ctx, camera) {
        const sprite = SPRITE_SHEET.getSprite('formPolice');
        if (sprite) {
            ctx.save();
            if (this.facing < 0) {
                ctx.scale(-1, 1);
                ctx.translate(-this.x - this.width, 0);
            }
            ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
            ctx.restore();
        }
    }
}

// Resistance Band (replaces Piranha Plant)
class ResistanceBand extends Enemy {
    constructor(x, y) {
        super(x, y, 16, 24);
        this.speed = 0;
        this.damage = 2;
        this.scoreValue = 150;
        this.attackRange = 32;
        this.attackCooldown = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
    }

    render(ctx, camera) {
        const sprite = SPRITE_SHEET.getSprite('resistanceBand');
        if (sprite) {
            ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
        }
    }

    onCollisionWithPlayer(player) {
        if (this.attackCooldown <= 0) {
            super.onCollisionWithPlayer(player);
            this.attackCooldown = 1000; // 1 second cooldown
        }
    }
}

// The Shredder (replaces Bowser)
class Shredder extends Enemy {
    constructor(x, y) {
        super(x, y, 32, 32);
        this.speed = 2;
        this.patrolDistance = 200;
        this.health = 10;
        this.maxHealth = 10;
        this.damage = 3;
        this.scoreValue = 1000;
        this.attackPattern = 'charge';
        this.attackCooldown = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
        
        // Boss AI patterns
        if (this.attackCooldown <= 0) {
            this.performAttack();
        }
    }

    performAttack() {
        switch (this.attackPattern) {
            case 'charge':
                this.chargeAttack();
                break;
            case 'jump':
                this.jumpAttack();
                break;
            case 'projectile':
                this.projectileAttack();
                break;
        }
        this.attackCooldown = 2000; // 2 seconds
    }

    chargeAttack() {
        this.speed = 4;
        this.attackPattern = 'jump';
    }

    jumpAttack() {
        this.velocityY = -15;
        this.attackPattern = 'projectile';
    }

    projectileAttack() {
        // Throw weights or equipment
        this.attackPattern = 'charge';
    }

    render(ctx, camera) {
        const sprite = SPRITE_SHEET.getSprite('shredder');
        if (sprite) {
            ctx.save();
            if (this.facing < 0) {
                ctx.scale(-1, 1);
                ctx.translate(-this.x - this.width, 0);
            }
            ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
            ctx.restore();
        }
    }
}

// Item base class
class Item extends Entity {
    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type;
        this.collected = false;
        this.bobOffset = 0;
        this.bobSpeed = 0.05;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Bobbing animation
        this.bobOffset = Math.sin(Date.now() * this.bobSpeed) * 3;
    }

    onCollisionWithPlayer(player) {
        if (!this.collected) {
            player.collectItem(this);
            this.collected = true;
            this.removed = true;
        }
    }

    render(ctx, camera) {
        if (this.collected) return;
        
        const sprite = SPRITE_SHEET.getSprite(this.type);
        if (sprite) {
            ctx.drawImage(sprite, 
                this.x - camera.x, 
                this.y - camera.y + this.bobOffset);
        }
    }
}

// Protein Shake (replaces mushroom)
class ProteinShake extends Item {
    constructor(x, y) {
        super(x, y, 16, 16, 'proteinShake');
    }
}

// Pre-workout (replaces fire flower)
class PreWorkout extends Item {
    constructor(x, y) {
        super(x, y, 16, 16, 'preWorkout');
    }
}

// Golden Dumbbell (replaces coin)
class Dumbbell extends Item {
    constructor(x, y) {
        super(x, y, 16, 16, 'dumbbell');
    }
}

// Gym Membership Card (replaces 1-UP)
class MembershipCard extends Item {
    constructor(x, y) {
        super(x, y, 16, 16, 'membershipCard');
    }
}

// Protein Scoop (projectile)
class ProteinScoop extends Entity {
    constructor(x, y, direction) {
        super(x, y, 8, 8);
        this.velocityX = direction * 8;
        this.velocityY = -2;
        this.direction = direction;
        this.lifetime = 60; // 1 second at 60 FPS
        this.damage = 2;
    }

    update(deltaTime) {
        super.update(deltaTime);
        
        // Apply gravity
        this.velocityY += 0.3;
        
        // Lifetime
        this.lifetime--;
        if (this.lifetime <= 0) {
            this.removed = true;
        }
        
        // Bounce off ground
        if (this.y > 400) {
            this.removed = true;
        }
    }

    render(ctx, camera) {
        const sprite = SPRITE_SHEET.getSprite('proteinScoop');
        if (sprite) {
            ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
        }
    }

    onCollisionWithEnemy(enemy) {
        enemy.takeDamage(this.damage, this);
        this.removed = true;
    }
}

// Camera for following player
class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.target = null;
        this.smoothness = 0.1;
    }

    follow(target) {
        this.target = target;
    }

    update() {
        if (this.target) {
            const targetX = this.target.x - this.width / 2;
            const targetY = this.target.y - this.height / 2;
            
            this.x += (targetX - this.x) * this.smoothness;
            this.y += (targetY - this.y) * this.smoothness;
            
            // Keep camera within level bounds
            this.x = Math.max(0, this.x);
            this.y = Math.max(0, this.y);
        }
    }
}

// Entity factory
class EntityFactory {
    static createEntity(type, x, y) {
        switch (type) {
            case 'gavin':
                return new Gavin(x, y);
            case 'sloucher':
                return new Sloucher(x, y);
            case 'formPolice':
                return new FormPolice(x, y);
            case 'resistanceBand':
                return new ResistanceBand(x, y);
            case 'shredder':
                return new Shredder(x, y);
            case 'proteinShake':
                return new ProteinShake(x, y);
            case 'preWorkout':
                return new PreWorkout(x, y);
            case 'dumbbell':
                return new Dumbbell(x, y);
            case 'membershipCard':
                return new MembershipCard(x, y);
            default:
                console.warn('Unknown entity type:', type);
                return null;
        }
    }
}
