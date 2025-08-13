// Sprite Management System
class SpriteManager {
    constructor() {
        this.sprites = new Map();
        this.loaded = false;
        this.loadProgress = 0;
        this.totalSprites = 0;
        
        // Create synthetic pixel art sprites
        this.createSyntheticSprites();
    }
    
    createSyntheticSprites() {
        // Create canvas-based pixel art sprites
        this.createGavinSprites();
        this.createEnemySprites();
        this.createCollectibleSprites();
        this.createTileSprites();
        this.createUISprites();
        
        this.loaded = true;
        this.loadProgress = 100;
    }
    
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas, ctx };
    }
    
    createGavinSprites() {
        // Small Gavin - doubled size
        const smallGavin = this.createCanvas(32, 32);
        this.drawGavin(smallGavin.ctx, 32, 32, COLORS.ACCENT, false);
        this.sprites.set('gavin_small_idle', {
            image: smallGavin.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Pump Gavin - doubled size
        const pumpGavin = this.createCanvas(32, 48);
        this.drawGavin(pumpGavin.ctx, 32, 48, COLORS.PRIMARY, true);
        this.sprites.set('gavin_pump_idle', {
            image: pumpGavin.canvas,
            x: 0, y: 0, width: 32, height: 48
        });
        
        // Beast Gavin - doubled size
        const beastGavin = this.createCanvas(48, 48);
        this.drawGavin(beastGavin.ctx, 48, 48, COLORS.ERROR, true, true);
        this.sprites.set('gavin_beast_idle', {
            image: beastGavin.canvas,
            x: 0, y: 0, width: 48, height: 48
        });
    }
    
    drawGavin(ctx, width, height, color, muscular = false, beast = false) {
        // Body
        ctx.fillStyle = color;
        const bodyWidth = beast ? width - 4 : width - 6;
        const bodyHeight = height - 8;
        ctx.fillRect((width - bodyWidth) / 2, height - bodyHeight - 2, bodyWidth, bodyHeight);
        
        // Head
        ctx.fillStyle = '#FFDBAC'; // Skin color
        const headSize = beast ? 8 : 6;
        ctx.fillRect((width - headSize) / 2, 2, headSize, headSize);
        
        // Eyes
        ctx.fillStyle = COLORS.BLACK;
        const eyeOffset = beast ? 2 : 1;
        ctx.fillRect((width - headSize) / 2 + eyeOffset, 4, 1, 1);
        ctx.fillRect((width - headSize) / 2 + headSize - eyeOffset - 1, 4, 1, 1);
        
        // Arms
        if (muscular) {
            ctx.fillStyle = color;
            ctx.fillRect(0, height - bodyHeight, 3, 8);
            ctx.fillRect(width - 3, height - bodyHeight, 3, 8);
        }
        
        // Legs
        ctx.fillStyle = '#654321'; // Brown shorts
        ctx.fillRect((width - 6) / 2, height - 6, 6, 4);
        ctx.fillStyle = '#FFDBAC'; // Legs
        ctx.fillRect((width - 4) / 2, height - 4, 4, 4);
    }
    
    createEnemySprites() {
        // Sloucher
        const sloucher = this.createCanvas(32, 32);
        this.drawSloucher(sloucher.ctx);
        this.sprites.set('sloucher', {
            image: sloucher.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Form Police
        const formPolice = this.createCanvas(32, 32);
        this.drawFormPolice(formPolice.ctx);
        this.sprites.set('form_police', {
            image: formPolice.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Snapper
        const snapper = this.createCanvas(32, 32);
        this.drawSnapper(snapper.ctx);
        this.sprites.set('snapper', {
            image: snapper.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Kettle Bell
        const kettleBell = this.createCanvas(32, 32);
        this.drawKettleBell(kettleBell.ctx);
        this.sprites.set('kettle_bell', {
            image: kettleBell.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Protein Drone
        const proteinDrone = this.createCanvas(32, 32);
        this.drawProteinDrone(proteinDrone.ctx);
        this.sprites.set('protein_drone', {
            image: proteinDrone.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Boss Shredder
        const bossShredder = this.createCanvas(64, 64);
        this.drawBossShredder(bossShredder.ctx);
        this.sprites.set('boss_shredder', {
            image: bossShredder.canvas,
            x: 0, y: 0, width: 64, height: 64
        });
    }
    
    drawSloucher(ctx) {
        // Lazy, slouched character
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(4, 8, 8, 8);
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(6, 2, 6, 6);
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(7, 4, 1, 1);
        ctx.fillRect(10, 4, 1, 1);
    }
    
    drawFormPolice(ctx) {
        // Clipboard-carrying official
        ctx.fillStyle = '#000080'; // Navy uniform
        ctx.fillRect(4, 8, 8, 8);
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(6, 2, 6, 6);
        ctx.fillStyle = COLORS.WHITE; // Clipboard
        ctx.fillRect(2, 6, 3, 4);
        ctx.strokeStyle = COLORS.BLACK;
        ctx.strokeRect(2, 6, 3, 4);
    }
    
    drawSnapper(ctx) {
        // Plant-like creature
        ctx.fillStyle = '#228B22'; // Green
        ctx.fillRect(6, 10, 4, 6);
        ctx.fillStyle = '#006400'; // Dark green head
        ctx.fillRect(4, 4, 8, 8);
        ctx.fillStyle = COLORS.WHITE; // Teeth
        ctx.fillRect(6, 8, 1, 2);
        ctx.fillRect(9, 8, 1, 2);
    }
    
    drawKettleBell(ctx) {
        // Black kettlebell with handle
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(4, 8, 8, 6);
        ctx.strokeStyle = COLORS.GRAY;
        ctx.strokeRect(6, 4, 4, 2);
        ctx.strokeRect(7, 2, 2, 6);
    }
    
    drawProteinDrone(ctx) {
        // Flying protein supplement
        ctx.fillStyle = '#FF6B6B'; // Pink protein color
        ctx.fillRect(4, 6, 8, 6);
        ctx.fillStyle = COLORS.WHITE; // Label
        ctx.fillRect(5, 7, 6, 4);
        ctx.fillStyle = COLORS.GRAY_LIGHT; // Propeller
        ctx.fillRect(2, 8, 2, 1);
        ctx.fillRect(12, 8, 2, 1);
    }
    
    drawBossShredder(ctx) {
        // Large muscular boss
        ctx.fillStyle = '#8B0000'; // Dark red
        ctx.fillRect(8, 16, 16, 16);
        ctx.fillStyle = '#FFDBAC'; // Head
        ctx.fillRect(10, 4, 12, 12);
        ctx.fillStyle = COLORS.BLACK; // Eyes
        ctx.fillRect(12, 8, 2, 2);
        ctx.fillRect(18, 8, 2, 2);
        // Arms
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(0, 12, 8, 12);
        ctx.fillRect(24, 12, 8, 12);
    }
    
    createCollectibleSprites() {
        // Golden Dumbbell
        const dumbbell = this.createCanvas(32, 32);
        this.drawDumbbell(dumbbell.ctx);
        this.sprites.set('golden_dumbbell', {
            image: dumbbell.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Gym Card
        const gymCard = this.createCanvas(32, 32);
        this.drawGymCard(gymCard.ctx);
        this.sprites.set('gym_card', {
            image: gymCard.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Protein Shake
        const proteinShake = this.createCanvas(32, 32);
        this.drawProteinShake(proteinShake.ctx);
        this.sprites.set('protein_shake', {
            image: proteinShake.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Pre-Workout
        const preWorkout = this.createCanvas(32, 32);
        this.drawPreWorkout(preWorkout.ctx);
        this.sprites.set('pre_workout', {
            image: preWorkout.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
    }
    
    drawDumbbell(ctx) {
        ctx.fillStyle = COLORS.COIN_GOLD;
        ctx.fillRect(2, 6, 4, 4);
        ctx.fillRect(6, 7, 4, 2);
        ctx.fillRect(10, 6, 4, 4);
        ctx.strokeStyle = '#B8860B'; // Dark gold outline
        ctx.strokeRect(2, 6, 4, 4);
        ctx.strokeRect(10, 6, 4, 4);
    }
    
    drawGymCard(ctx) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.fillRect(3, 4, 10, 8);
        ctx.strokeStyle = COLORS.BLACK;
        ctx.strokeRect(3, 4, 10, 8);
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.fillRect(4, 6, 8, 2);
        ctx.fillStyle = COLORS.SUCCESS;
        ctx.fillRect(4, 9, 8, 1);
    }
    
    drawProteinShake(ctx) {
        ctx.fillStyle = COLORS.WHITE; // Bottle
        ctx.fillRect(6, 2, 4, 12);
        ctx.fillStyle = COLORS.PRIMARY; // Liquid
        ctx.fillRect(6, 6, 4, 8);
        ctx.fillStyle = COLORS.BLACK; // Cap
        ctx.fillRect(6, 2, 4, 2);
    }
    
    drawPreWorkout(ctx) {
        ctx.fillStyle = COLORS.ERROR; // Red container
        ctx.fillRect(4, 4, 8, 8);
        ctx.fillStyle = COLORS.WHITE; // Label
        ctx.fillRect(5, 6, 6, 4);
        ctx.strokeStyle = COLORS.BLACK;
        ctx.strokeRect(4, 4, 8, 8);
    }
    
    createTileSprites() {
        // Solid Ground
        const ground = this.createCanvas(32, 32);
        this.drawGround(ground.ctx);
        this.sprites.set('ground', {
            image: ground.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Platform
        const platform = this.createCanvas(32, 32);
        this.drawPlatform(platform.ctx);
        this.sprites.set('platform', {
            image: platform.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
        
        // Breakable Block
        const breakable = this.createCanvas(32, 32);
        this.drawBreakable(breakable.ctx);
        this.sprites.set('breakable', {
            image: breakable.canvas,
            x: 0, y: 0, width: 32, height: 32
        });
    }
    
    drawGround(ctx) {
        ctx.fillStyle = COLORS.GROUND_BROWN;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#A0522D'; // Lighter brown for texture
        ctx.fillRect(4, 4, 4, 4);
        ctx.fillRect(16, 12, 4, 4);
        ctx.fillRect(8, 24, 4, 4);
        ctx.fillRect(24, 20, 4, 4);
    }
    
    drawPlatform(ctx) {
        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(0, 0, 32, 8);
        ctx.fillStyle = COLORS.GRAY_LIGHT;
        ctx.fillRect(0, 0, 32, 4);
        ctx.strokeStyle = COLORS.GRAY_DARK;
        ctx.strokeRect(0, 0, 32, 8);
    }
    
    drawBreakable(ctx) {
        ctx.fillStyle = '#DEB887'; // Burlywood
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#8B7355';
        ctx.strokeRect(0, 0, 32, 32);
        ctx.strokeRect(8, 8, 16, 16);
        ctx.fillStyle = '#F5DEB3'; // Wheat highlights
        ctx.fillRect(4, 4, 4, 4);
        ctx.fillRect(24, 24, 4, 4);
    }
    
    createUISprites() {
        // Hearts for lives
        const heart = this.createCanvas(12, 12);
        this.drawHeart(heart.ctx);
        this.sprites.set('heart', {
            image: heart.canvas,
            x: 0, y: 0, width: 12, height: 12
        });
    }
    
    drawHeart(ctx) {
        ctx.fillStyle = COLORS.ERROR;
        // Simple heart shape using rectangles
        ctx.fillRect(3, 2, 2, 2);
        ctx.fillRect(7, 2, 2, 2);
        ctx.fillRect(2, 4, 8, 4);
        ctx.fillRect(3, 8, 6, 2);
        ctx.fillRect(4, 10, 4, 1);
        ctx.fillRect(5, 11, 2, 1);
    }
    
    getSprite(name) {
        return this.sprites.get(name);
    }
    
    hasSprite(name) {
        return this.sprites.has(name);
    }
    
    isLoaded() {
        return this.loaded;
    }
    
    getLoadProgress() {
        return this.loadProgress;
    }
}

// Export to global scope
window.SpriteManager = SpriteManager;