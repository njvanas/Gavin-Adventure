// Collectible Items System
class Collectible extends Entity {
    constructor(x, y, type) {
        super(x, y);
        this.collectibleType = type;
        this.width = 16;
        this.height = 16;
        this.solid = false;
        this.collected = false;
        this.animationTimer = 0;
        this.animationFrame = 0;
        this.bobOffset = 0;
        this.bobTimer = 0;
        
        this.setupCollectibleType();
    }
    
    setupCollectibleType() {
        switch (this.collectibleType) {
            case COLLECTIBLE_TYPES.GOLDEN_DUMBBELL:
                this.value = 100;
                break;
            case COLLECTIBLE_TYPES.GYM_CARD:
                this.value = 1000;
                break;
            case COLLECTIBLE_TYPES.PROTEIN_SHAKE:
                this.value = 200;
                break;
            case COLLECTIBLE_TYPES.PRE_WORKOUT:
                this.value = 500;
                break;
            case COLLECTIBLE_TYPES.MACRO:
                this.value = 300;
                break;
            case COLLECTIBLE_TYPES.TROPHY:
                this.value = 5000;
                break;
        }
    }
    
    update(deltaTime, level, player, particleSystem) {
        if (!this.active || this.collected) return;
        
        // Animate bobbing motion
        this.bobTimer += deltaTime;
        this.bobOffset = Math.sin(this.bobTimer * 0.003) * 2;
        
        // Animate sprite
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 150) {
            this.animationFrame++;
            this.animationTimer = 0;
        }
        
        // Check collision with player
        if (player && player.active && this.overlaps(player)) {
            this.collect(player, particleSystem);
        }
    }
    
    collect(player, particleSystem) {
        if (this.collected) return;
        
        this.collected = true;
        this.active = false;
        
        switch (this.collectibleType) {
            case COLLECTIBLE_TYPES.GOLDEN_DUMBBELL:
                player.collectCoin(this.value);
                particleSystem.coinCollected(this.x, this.y);
                break;
                
            case COLLECTIBLE_TYPES.GYM_CARD:
                player.collectLife();
                particleSystem.powerUpCollected(this.x, this.y);
                break;
                
            case COLLECTIBLE_TYPES.PROTEIN_SHAKE:
                player.powerUp(POWER_STATES.PUMP, particleSystem);
                player.score += this.value;
                break;
                
            case COLLECTIBLE_TYPES.PRE_WORKOUT:
                player.powerUp(POWER_STATES.BEAST, particleSystem);
                player.score += this.value;
                break;
                
            case COLLECTIBLE_TYPES.MACRO:
                player.score += this.value;
                player.gainsPoints += this.value;
                particleSystem.coinCollected(this.x, this.y);
                break;
                
            case COLLECTIBLE_TYPES.TROPHY:
                player.score += this.value;
                particleSystem.powerUpCollected(this.x, this.y);
                window.audio.playSound('victory');
                break;
        }
        
        window.audio.playSound('coin');
    }
    
    render(ctx, camera) {
        if (!this.active || this.collected) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y + this.bobOffset;
        
        // Get sprite based on collectible type
        let spriteName = '';
        switch (this.collectibleType) {
            case COLLECTIBLE_TYPES.GOLDEN_DUMBBELL:
                spriteName = 'golden_dumbbell';
                break;
            case COLLECTIBLE_TYPES.GYM_CARD:
                spriteName = 'gym_card';
                break;
            case COLLECTIBLE_TYPES.PROTEIN_SHAKE:
                spriteName = 'protein_shake';
                break;
            case COLLECTIBLE_TYPES.PRE_WORKOUT:
                spriteName = 'pre_workout';
                break;
            case COLLECTIBLE_TYPES.MACRO:
                spriteName = 'golden_dumbbell'; // Reuse dumbbell sprite with different color
                break;
            case COLLECTIBLE_TYPES.TROPHY:
                spriteName = 'golden_dumbbell'; // Placeholder
                break;
        }
        
        const sprite = window.sprites.getSprite(spriteName);
        if (sprite) {
            // Add subtle glow effect for special items
            if (this.collectibleType === COLLECTIBLE_TYPES.GYM_CARD || 
                this.collectibleType === COLLECTIBLE_TYPES.TROPHY) {
                ctx.save();
                ctx.shadowColor = COLORS.COIN_GOLD;
                ctx.shadowBlur = 5;
                ctx.drawImage(sprite.image, screenX, screenY, this.width, this.height);
                ctx.restore();
            } else {
                ctx.drawImage(sprite.image, screenX, screenY, this.width, this.height);
            }
        } else {
            // Fallback colored rectangle
            ctx.fillStyle = this.getCollectibleColor();
            ctx.fillRect(screenX, screenY, this.width, this.height);
        }
        
        // Debug hitbox
        if (window.game && window.game.debug) {
            ctx.strokeStyle = 'yellow';
            ctx.strokeRect(screenX, screenY, this.width, this.height);
        }
    }
    
    getCollectibleColor() {
        switch (this.collectibleType) {
            case COLLECTIBLE_TYPES.GOLDEN_DUMBBELL:
                return COLORS.COIN_GOLD;
            case COLLECTIBLE_TYPES.GYM_CARD:
                return COLORS.SUCCESS;
            case COLLECTIBLE_TYPES.PROTEIN_SHAKE:
                return COLORS.PRIMARY;
            case COLLECTIBLE_TYPES.PRE_WORKOUT:
                return COLORS.ERROR;
            case COLLECTIBLE_TYPES.MACRO:
                return COLORS.ACCENT;
            case COLLECTIBLE_TYPES.TROPHY:
                return COLORS.COIN_GOLD;
            default:
                return COLORS.WHITE;
        }
    }
}

// Invisible Block that appears when hit
class InvisibleBlock extends Entity {
    constructor(x, y) {
        super(x, y);
        this.type = 'invisible_block';
        this.width = 16;
        this.height = 16;
        this.visible = false;
        this.contents = null; // Can contain collectibles
        this.hits = 0;
        this.maxHits = 1;
    }
    
    hit(player, particleSystem) {
        if (this.hits >= this.maxHits) return;
        
        this.visible = true;
        this.hits++;
        
        // Spawn contents
        if (this.contents) {
            const collectible = new Collectible(this.x, this.y - 16, this.contents);
            // In a full implementation, this would be added to the level
            particleSystem.coinCollected(this.x, this.y);
        }
        
        window.audio.playSound('break');
        particleSystem.blockBreak(this.x, this.y);
    }
    
    render(ctx, camera) {
        if (!this.visible) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Draw as a questioned block
        ctx.fillStyle = COLORS.GROUND_BROWN;
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        ctx.strokeStyle = COLORS.BLACK;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
        
        // Question mark if not hit
        if (this.hits === 0) {
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('?', screenX + 8, screenY + 12);
            ctx.textAlign = 'left';
        }
    }
}

// Multi-hit Bench
class MultihitBench extends Entity {
    constructor(x, y, contents = COLLECTIBLE_TYPES.GOLDEN_DUMBBELL, maxHits = 5) {
        super(x, y);
        this.type = 'multihit_bench';
        this.width = 32;
        this.height = 16;
        this.contents = contents;
        this.hits = 0;
        this.maxHits = maxHits;
        this.crackLevel = 0;
    }
    
    hit(player, particleSystem) {
        if (this.hits >= this.maxHits) return;
        
        this.hits++;
        this.crackLevel = Math.floor((this.hits / this.maxHits) * 3);
        
        // Spawn reward
        if (this.hits === this.maxHits) {
            // Final reward
            const collectible = new Collectible(this.x + 8, this.y - 16, COLLECTIBLE_TYPES.PROTEIN_SHAKE);
            window.audio.playSound('powerup');
        } else {
            // Regular reward
            const collectible = new Collectible(this.x + 8, this.y - 16, COLLECTIBLE_TYPES.GOLDEN_DUMBBELL);
        }
        
        window.audio.playSound('coin');
        particleSystem.coinCollected(this.x + 16, this.y);
    }
    
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Draw bench
        ctx.fillStyle = COLORS.GROUND_BROWN;
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Draw cracks based on damage
        ctx.strokeStyle = COLORS.BLACK;
        for (let i = 0; i < this.crackLevel; i++) {
            const x = screenX + 8 + i * 8;
            ctx.beginPath();
            ctx.moveTo(x, screenY);
            ctx.lineTo(x + 4, screenY + this.height);
            ctx.stroke();
        }
        
        ctx.strokeStyle = COLORS.GRAY_DARK;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
    }
}

// Export to global scope
window.Collectible = Collectible;
window.InvisibleBlock = InvisibleBlock;
window.MultihitBench = MultihitBench;