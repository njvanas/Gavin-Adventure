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
        
        // Load Mario-style image assets
        this.loadMarioAssets();
        
        // Load sprite sheet assets
        this.loadSpriteSheets();
        
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
        // Small Gavin
        const smallGavin = this.createCanvas(16, 16);
        this.drawGavin(smallGavin.ctx, 16, 16, COLORS.ACCENT, false);
        this.sprites.set('gavin_small_idle', {
            image: smallGavin.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Pump Gavin
        const pumpGavin = this.createCanvas(16, 24);
        this.drawGavin(pumpGavin.ctx, 16, 24, COLORS.PRIMARY, true);
        this.sprites.set('gavin_pump_idle', {
            image: pumpGavin.canvas,
            x: 0, y: 0, width: 16, height: 24
        });
        
        // Beast Gavin
        const beastGavin = this.createCanvas(24, 24);
        this.drawGavin(beastGavin.ctx, 24, 24, COLORS.ERROR, true, true);
        this.sprites.set('gavin_beast_idle', {
            image: beastGavin.canvas,
            x: 0, y: 0, width: 24, height: 24
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
        const sloucher = this.createCanvas(16, 16);
        this.drawSloucher(sloucher.ctx);
        this.sprites.set('sloucher', {
            image: sloucher.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Form Police
        const formPolice = this.createCanvas(16, 16);
        this.drawFormPolice(formPolice.ctx);
        this.sprites.set('form_police', {
            image: formPolice.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Snapper
        const snapper = this.createCanvas(16, 16);
        this.drawSnapper(snapper.ctx);
        this.sprites.set('snapper', {
            image: snapper.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Kettle Bell
        const kettleBell = this.createCanvas(16, 16);
        this.drawKettleBell(kettleBell.ctx);
        this.sprites.set('kettle_bell', {
            image: kettleBell.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Protein Drone
        const proteinDrone = this.createCanvas(16, 16);
        this.drawProteinDrone(proteinDrone.ctx);
        this.sprites.set('protein_drone', {
            image: proteinDrone.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Boss Shredder
        const bossShredder = this.createCanvas(32, 32);
        this.drawBossShredder(bossShredder.ctx);
        this.sprites.set('boss_shredder', {
            image: bossShredder.canvas,
            x: 0, y: 0, width: 32, height: 32
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
        const dumbbell = this.createCanvas(16, 16);
        this.drawDumbbell(dumbbell.ctx);
        this.sprites.set('golden_dumbbell', {
            image: dumbbell.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Gym Card
        const gymCard = this.createCanvas(16, 16);
        this.drawGymCard(gymCard.ctx);
        this.sprites.set('gym_card', {
            image: gymCard.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Protein Shake
        const proteinShake = this.createCanvas(16, 16);
        this.drawProteinShake(proteinShake.ctx);
        this.sprites.set('protein_shake', {
            image: proteinShake.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Pre-Workout
        const preWorkout = this.createCanvas(16, 16);
        this.drawPreWorkout(preWorkout.ctx);
        this.sprites.set('pre_workout', {
            image: preWorkout.canvas,
            x: 0, y: 0, width: 16, height: 16
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
        const ground = this.createCanvas(16, 16);
        this.drawGround(ground.ctx);
        this.sprites.set('ground', {
            image: ground.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Platform
        const platform = this.createCanvas(16, 16);
        this.drawPlatform(platform.ctx);
        this.sprites.set('platform', {
            image: platform.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
        
        // Breakable Block
        const breakable = this.createCanvas(16, 16);
        this.drawBreakable(breakable.ctx);
        this.sprites.set('breakable', {
            image: breakable.canvas,
            x: 0, y: 0, width: 16, height: 16
        });
    }
    
    drawGround(ctx) {
        ctx.fillStyle = COLORS.GROUND_BROWN;
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#A0522D'; // Lighter brown for texture
        ctx.fillRect(2, 2, 2, 2);
        ctx.fillRect(8, 6, 2, 2);
        ctx.fillRect(4, 12, 2, 2);
        ctx.fillRect(12, 10, 2, 2);
    }
    
    drawPlatform(ctx) {
        ctx.fillStyle = COLORS.GRAY;
        ctx.fillRect(0, 0, 16, 4);
        ctx.fillStyle = COLORS.GRAY_LIGHT;
        ctx.fillRect(0, 0, 16, 2);
        ctx.strokeStyle = COLORS.GRAY_DARK;
        ctx.strokeRect(0, 0, 16, 4);
    }
    
    drawBreakable(ctx) {
        ctx.fillStyle = '#DEB887'; // Burlywood
        ctx.fillRect(0, 0, 16, 16);
        ctx.strokeStyle = '#8B7355';
        ctx.strokeRect(0, 0, 16, 16);
        ctx.strokeRect(4, 4, 8, 8);
        ctx.fillStyle = '#F5DEB3'; // Wheat highlights
        ctx.fillRect(2, 2, 2, 2);
        ctx.fillRect(12, 12, 2, 2);
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
    
    // Load Mario-style image assets
    loadMarioAssets() {
        // Player sprites (Mario)
        this.loadImageSprite('mario_small_idle', 'Assets/Mario_Small_Idle.png', 16, 16);
        this.loadImageSprite('mario_small_run1', 'Assets/Mario_Small_Run1.png', 16, 16);
        this.loadImageSprite('mario_small_run2', 'Assets/Mario_Small_Run2.png', 16, 16);
        this.loadImageSprite('mario_small_run3', 'Assets/Mario_Small_Run3.png', 16, 16);
        this.loadImageSprite('mario_small_jump', 'Assets/Mario_Small_Jump.png', 16, 16);
        this.loadImageSprite('mario_small_slide', 'Assets/Mario_Small_Slide.png', 16, 16);
        this.loadImageSprite('mario_small_death', 'Assets/Mario_Small_Death.png', 16, 16);
        
        this.loadImageSprite('mario_big_idle', 'Assets/Mario_Big_Idle.png', 16, 24);
        this.loadImageSprite('mario_big_run1', 'Assets/Mario_Big_Run1.png', 16, 24);
        this.loadImageSprite('mario_big_run2', 'Assets/Mario_Big_Run2.png', 16, 24);
        this.loadImageSprite('mario_big_run3', 'Assets/Mario_Big_Run3.png', 16, 24);
        this.loadImageSprite('mario_big_jump', 'Assets/Mario_Big_Jump.png', 16, 24);
        this.loadImageSprite('mario_big_slide', 'Assets/Mario_Big_Slide.png', 16, 24);
        
        // Enemies
        this.loadImageSprite('goomba_walk1', 'Assets/Goomba_Walk1.png', 16, 16);
        this.loadImageSprite('goomba_walk2', 'Assets/Goomba_Walk2.png', 16, 16);
        this.loadImageSprite('goomba_flat', 'Assets/Goomba_Flat.png', 16, 16);
        this.loadImageSprite('koopa_walk1', 'Assets/Koopa_Walk1.png', 16, 16);
        this.loadImageSprite('koopa_walk2', 'Assets/Koopa_Walk2.png', 16, 16);
        this.loadImageSprite('koopa_shell', 'Assets/Koopa_Shell.png', 16, 16);
        
        // Collectibles
        this.loadImageSprite('coin', 'Assets/Coin.png', 16, 16);
        this.loadImageSprite('coin_underground', 'Assets/Coin_Underground.png', 16, 16);
        this.loadImageSprite('magic_mushroom', 'Assets/MagicMushroom.png', 16, 16);
        this.loadImageSprite('1up_mushroom', 'Assets/1upMushroom.png', 16, 16);
        this.loadImageSprite('starman', 'Assets/Starman.png', 16, 16);
        
        // Blocks and tiles
        this.loadImageSprite('brick', 'Assets/Brick.png', 16, 16);
        this.loadImageSprite('hard_block', 'Assets/HardBlock.png', 16, 16);
        this.loadImageSprite('ground_block', 'Assets/GroundBlock.png', 16, 16);
        this.loadImageSprite('mystery_block', 'Assets/MysteryBlock.png', 16, 16);
        this.loadImageSprite('empty_block', 'Assets/EmptyBlock.png', 16, 16);
        this.loadImageSprite('underground_brick', 'Assets/UndergroundBrick.png', 16, 16);
        this.loadImageSprite('underground_block', 'Assets/UndergroundBlock.png', 16, 16);
        
        // Pipes
        this.loadImageSprite('pipe_top', 'Assets/PipeTop.png', 32, 32);
        this.loadImageSprite('pipe_bottom', 'Assets/PipeBottom.png', 32, 32);
        this.loadImageSprite('pipe_connection', 'Assets/PipeConnection.png', 16, 16);
        
        // Decorative elements
        this.loadImageSprite('bush1', 'Assets/Bush1.png', 16, 16);
        this.loadImageSprite('bush2', 'Assets/Bush2.png', 16, 16);
        this.loadImageSprite('bush3', 'Assets/Bush3.png', 16, 16);
        this.loadImageSprite('cloud1', 'Assets/Cloud1.png', 32, 24);
        this.loadImageSprite('cloud2', 'Assets/Cloud2.png', 32, 24);
        this.loadImageSprite('cloud3', 'Assets/Cloud3.png', 32, 24);
        this.loadImageSprite('hill1', 'Assets/Hill1.png', 16, 16);
        this.loadImageSprite('hill2', 'Assets/Hill2.png', 16, 16);
        this.loadImageSprite('castle', 'Assets/Castle.png', 32, 32);
        this.loadImageSprite('flag', 'Assets/Flag.png', 16, 16);
        this.loadImageSprite('flag_pole', 'Assets/FlagPole.png', 16, 16);
        
        console.log('🎮 Mario-style assets loaded successfully!');
    }
    
    // Load sprite sheet assets
    loadSpriteSheets() {
        // Load background sprite sheet
        this.loadSpriteSheet('bg_1_1_a', 'Assets/Tiles/bg-1-1-a.png', [
            { name: 'sky', x: 0, y: 0, width: 16, height: 16 },
            { name: 'cloud_small', x: 16, y: 0, width: 16, height: 16 },
            { name: 'cloud_medium', x: 32, y: 0, width: 24, height: 16 },
            { name: 'cloud_large', x: 56, y: 0, width: 32, height: 24 },
            { name: 'hill_small', x: 0, y: 16, width: 16, height: 16 },
            { name: 'hill_medium', x: 16, y: 16, width: 24, height: 16 },
            { name: 'hill_large', x: 40, y: 16, width: 32, height: 24 },
            { name: 'bush_small', x: 0, y: 32, width: 16, height: 16 },
            { name: 'bush_medium', x: 16, y: 32, width: 24, height: 16 },
            { name: 'bush_large', x: 40, y: 32, width: 32, height: 24 }
        ]);
        
        // Load blocks sprite sheet
        this.loadSpriteSheet('blocks', 'Assets/Tiles/blocks.png', [
            { name: 'question_block', x: 0, y: 0, width: 16, height: 16 },
            { name: 'brick_block', x: 16, y: 0, width: 16, height: 16 },
            { name: 'ground_block', x: 32, y: 0, width: 16, height: 16 },
            { name: 'underground_block', x: 48, y: 0, width: 16, height: 16 },
            { name: 'hard_block', x: 0, y: 16, width: 16, height: 16 },
            { name: 'breakable_block', x: 16, y: 16, width: 16, height: 16 },
            { name: 'empty_block', x: 32, y: 16, width: 16, height: 16 },
            { name: 'pipe_top_left', x: 0, y: 32, width: 16, height: 16 },
            { name: 'pipe_top_right', x: 16, y: 32, width: 16, height: 16 },
            { name: 'pipe_body_left', x: 0, y: 48, width: 16, height: 16 },
            { name: 'pipe_body_right', x: 16, y: 48, width: 16, height: 16 }
        ]);
        
        // Load enemies sprite sheet
        this.loadSpriteSheet('enemies', 'Assets/Tiles/enemies.png', [
            { name: 'goomba_walk1_sheet', x: 0, y: 0, width: 16, height: 16 },
            { name: 'goomba_walk2_sheet', x: 16, y: 0, width: 16, height: 16 },
            { name: 'goomba_flat_sheet', x: 32, y: 0, width: 16, height: 16 },
            { name: 'koopa_walk1_sheet', x: 0, y: 16, width: 16, height: 16 },
            { name: 'koopa_walk2_sheet', x: 16, y: 16, width: 16, height: 16 },
            { name: 'koopa_shell_sheet', x: 32, y: 16, width: 16, height: 16 },
            { name: 'piranha_plant', x: 0, y: 32, width: 16, height: 24 },
            { name: 'bullet_bill', x: 16, y: 32, width: 16, height: 16 },
            { name: 'spiny', x: 32, y: 32, width: 16, height: 16 }
        ]);
        
        // Load Mario and items sprite sheet
        this.loadSpriteSheet('mario_items', 'Assets/Tiles/mario_and_items.png', [
            { name: 'mario_small_idle_sheet', x: 0, y: 0, width: 16, height: 16 },
            { name: 'mario_small_run1_sheet', x: 16, y: 0, width: 16, height: 16 },
            { name: 'mario_small_run2_sheet', x: 32, y: 0, width: 16, height: 16 },
            { name: 'mario_small_run3_sheet', x: 48, y: 0, width: 16, height: 16 },
            { name: 'mario_small_jump_sheet', x: 0, y: 16, width: 16, height: 16 },
            { name: 'mario_small_slide_sheet', x: 16, y: 16, width: 16, height: 16 },
            { name: 'mario_big_idle_sheet', x: 0, y: 32, width: 16, height: 24 },
            { name: 'mario_big_run1_sheet', x: 16, y: 32, width: 16, height: 24 },
            { name: 'mario_big_run2_sheet', x: 32, y: 32, width: 16, height: 24 },
            { name: 'mario_big_run3_sheet', x: 48, y: 32, width: 16, height: 24 },
            { name: 'mario_big_jump_sheet', x: 0, y: 56, width: 16, height: 24 },
            { name: 'mario_big_slide_sheet', x: 16, y: 56, width: 16, height: 24 },
            { name: 'coin_sheet', x: 0, y: 80, width: 16, height: 16 },
            { name: 'magic_mushroom_sheet', x: 16, y: 80, width: 16, height: 16 },
            { name: '1up_mushroom_sheet', x: 32, y: 80, width: 16, height: 16 },
            { name: 'starman_sheet', x: 48, y: 80, width: 16, height: 16 }
        ]);
        
        console.log('🎨 Sprite sheet assets loaded successfully!');
    }
    
    // Helper method to load sprite sheets
    loadSpriteSheet(sheetName, src, sprites) {
        const img = new Image();
        img.onload = () => {
            sprites.forEach(sprite => {
                this.sprites.set(sprite.name, {
                    image: img,
                    x: sprite.x,
                    y: sprite.y,
                    width: sprite.width,
                    height: sprite.height
                });
            });
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to load sprite sheet: ${src}`);
        };
        img.src = src;
    }
    
    // Helper method to load image sprites
    loadImageSprite(name, src, width, height) {
        const img = new Image();
        img.onload = () => {
            this.sprites.set(name, {
                image: img,
                x: 0, y: 0, width: width, height: height
            });
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to load sprite: ${src}`);
            // Fallback to synthetic sprite if image fails to load
            this.createFallbackSprite(name, width, height);
        };
        img.src = src;
    }
    
    // Create fallback sprite if image loading fails
    createFallbackSprite(name, width, height) {
        const canvas = this.createCanvas(width, height);
        const ctx = canvas.ctx;
        
        // Create a simple colored rectangle as fallback
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(name.substring(0, 3), 2, height - 2);
        
        this.sprites.set(name, {
            image: canvas.canvas,
            x: 0, y: 0, width: width, height: height
        });
    }
}

// Export to global scope
window.SpriteManager = SpriteManager;