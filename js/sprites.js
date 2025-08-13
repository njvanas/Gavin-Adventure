// Gavin Adventure - Sprite System
// All sprites are generated programmatically for original pixel art

class SpriteSheet {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.sprites = {};
        this.generateAllSprites();
    }

    generateAllSprites() {
        this.generateGavinSprites();
        this.generateEnemySprites();
        this.generateItemSprites();
        this.generateTileSprites();
        this.generateBackgroundSprites();
    }

    // Generate Gavin sprites (16x32 pixels)
    generateGavinSprites() {
        // Small Gavin (basic form)
        this.sprites.gavinSmall = this.generateGavinSprite(16, 32, '#ff6b35', '#f7b731');
        
        // Pump mode Gavin (bigger, more muscles)
        this.sprites.gavinPump = this.generateGavinSprite(24, 40, '#ff6b35', '#f7b731', true);
        
        // Beast mode Gavin (full pre-workout effect)
        this.sprites.gavinBeast = this.generateGavinSprite(32, 48, '#ff6b35', '#f7b731', true, true);
        
        // Gavin animations
        this.sprites.gavinWalk = this.generateGavinWalkAnimation();
        this.sprites.gavinJump = this.generateGavinJumpSprite();
        this.sprites.gavinSquat = this.generateGavinSquatSprite();
        this.sprites.gavinDeadlift = this.generateGavinDeadliftSprite();
        this.sprites.gavinVictory = this.generateGavinVictorySprite();
    }

    generateGavinSprite(width, height, skinColor, muscleColor, isPump = false, isBeast = false) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        // Background transparent
        ctx.clearRect(0, 0, width, height);
        
        // Head
        ctx.fillStyle = skinColor;
        ctx.fillRect(width/2 - 4, 0, 8, 8);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(width/2 - 2, 2, 1, 1);
        ctx.fillRect(width/2 + 1, 2, 1, 1);
        
        // Mouth
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(width/2 - 1, 5, 2, 1);
        
        // Body
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(width/2 - 3, 8, 6, height - 16);
        
        // Muscles
        ctx.fillStyle = muscleColor;
        if (isPump || isBeast) {
            // Bigger muscles
            ctx.fillRect(width/2 - 4, 10, 8, 6);
            ctx.fillRect(width/2 - 5, 18, 10, 8);
        }
        
        // Arms
        ctx.fillStyle = skinColor;
        ctx.fillRect(width/2 - 6, 12, 3, 8);
        ctx.fillRect(width/2 + 3, 12, 3, 8);
        
        // Legs
        ctx.fillRect(width/2 - 4, height - 8, 3, 8);
        ctx.fillRect(width/2 + 1, height - 8, 3, 8);
        
        // Gym shorts
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(width/2 - 4, height - 12, 8, 4);
        
        return canvas;
    }

    generateGavinWalkAnimation() {
        const frames = [];
        for (let i = 0; i < 4; i++) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 16;
            canvas.height = 32;
            
            // Copy base sprite
            ctx.drawImage(this.sprites.gavinSmall, 0, 0);
            
            // Animate legs based on frame
            ctx.fillStyle = '#ff6b35';
            if (i % 2 === 0) {
                ctx.fillRect(4, 24, 3, 8);
                ctx.fillRect(9, 24, 3, 6);
            } else {
                ctx.fillRect(4, 24, 3, 6);
                ctx.fillRect(9, 24, 3, 8);
            }
            
            frames.push(canvas);
        }
        return frames;
    }

    generateGavinJumpSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 32;
        
        // Copy base sprite
        ctx.drawImage(this.sprites.gavinSmall, 0, 0);
        
        // Jump pose - arms up
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(2, 8, 3, 8);
        ctx.fillRect(11, 8, 3, 8);
        
        return canvas;
    }

    generateGavinSquatSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 32;
        
        // Copy base sprite
        ctx.drawImage(this.sprites.gavinSmall, 0, 0);
        
        // Squat pose - legs bent
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(4, 20, 3, 12);
        ctx.fillRect(9, 20, 3, 12);
        
        return canvas;
    }

    generateGavinDeadliftSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 32;
        
        // Copy base sprite
        ctx.drawImage(this.sprites.gavinSmall, 0, 0);
        
        // Deadlift pose - arms down, legs bent
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(2, 16, 3, 8);
        ctx.fillRect(11, 16, 3, 8);
        ctx.fillRect(4, 22, 3, 10);
        ctx.fillRect(9, 22, 3, 10);
        
        return canvas;
    }

    generateGavinVictorySprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 32;
        
        // Copy base sprite
        ctx.drawImage(this.sprites.gavinSmall, 0, 0);
        
        // Victory pose - arms up, flexing
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(1, 6, 3, 10);
        ctx.fillRect(12, 6, 3, 10);
        
        // Flexing muscles
        ctx.fillStyle = '#f7b731';
        ctx.fillRect(4, 10, 8, 8);
        
        return canvas;
    }

    // Generate enemy sprites
    generateEnemySprites() {
        // Slouchers (replaces Goombas)
        this.sprites.sloucher = this.generateSloucherSprite();
        
        // Form Police (replaces Koopa Troopas)
        this.sprites.formPolice = this.generateFormPoliceSprite();
        
        // Overgrown Resistance Bands (replaces Piranha Plants)
        this.sprites.resistanceBand = this.generateResistanceBandSprite();
        
        // The Shredder (replaces Bowser)
        this.sprites.shredder = this.generateShredderSprite();
    }

    generateSloucherSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Lazy gym-goer
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(4, 2, 8, 8); // Head
        
        // Eyes (sleepy)
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 4, 1, 1);
        ctx.fillRect(9, 4, 1, 1);
        
        // Mouth (yawn)
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(7, 7, 2, 2);
        
        // Body (slouched)
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(3, 10, 10, 6);
        
        return canvas;
    }

    generateFormPoliceSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 24;
        
        // Trainer with clipboard
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(4, 0, 8, 8); // Head
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 2, 1, 1);
        ctx.fillRect(9, 2, 1, 1);
        
        // Body
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(3, 8, 10, 12);
        
        // Clipboard
        ctx.fillStyle = '#fff';
        ctx.fillRect(10, 10, 4, 6);
        ctx.fillStyle = '#000';
        ctx.fillRect(11, 11, 2, 4);
        
        return canvas;
    }

    generateResistanceBandSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 24;
        
        // Overgrown resistance band
        ctx.fillStyle = '#228b22';
        ctx.fillRect(6, 0, 4, 24);
        
        // Band details
        ctx.fillStyle = '#32cd32';
        ctx.fillRect(7, 2, 2, 20);
        
        // Snap effect
        ctx.fillStyle = '#ff4500';
        ctx.fillRect(5, 8, 6, 2);
        
        return canvas;
    }

    generateShredderSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        
        // Rival bodybuilder boss
        ctx.fillStyle = '#ff6347';
        ctx.fillRect(8, 0, 16, 12); // Head
        
        // Eyes (angry)
        ctx.fillStyle = '#000';
        ctx.fillRect(12, 3, 2, 2);
        ctx.fillRect(18, 3, 2, 2);
        
        // Body (massive)
        ctx.fillStyle = '#ff4500';
        ctx.fillRect(4, 12, 24, 20);
        
        // Muscles
        ctx.fillStyle = '#ff8c00';
        ctx.fillRect(6, 14, 20, 16);
        
        return canvas;
    }

    // Generate item sprites
    generateItemSprites() {
        // Protein shake (replaces mushroom)
        this.sprites.proteinShake = this.generateProteinShakeSprite();
        
        // Pre-workout (replaces fire flower)
        this.sprites.preWorkout = this.generatePreWorkoutSprite();
        
        // Golden dumbbell (replaces coin)
        this.sprites.dumbbell = this.generateDumbbellSprite();
        
        // Gym membership card (replaces 1-UP)
        this.sprites.membershipCard = this.generateMembershipCardSprite();
        
        // Protein powder scoop (projectile)
        this.sprites.proteinScoop = this.generateProteinScoopSprite();
    }

    generateProteinShakeSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Protein shake bottle
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(4, 2, 8, 12);
        
        // Bottle cap
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(5, 0, 6, 2);
        
        // Protein powder
        ctx.fillStyle = '#f7b731';
        ctx.fillRect(5, 4, 6, 8);
        
        // Shake effect
        ctx.fillStyle = '#fff';
        ctx.fillRect(6, 6, 4, 4);
        
        return canvas;
    }

    generatePreWorkoutSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Pre-workout container
        ctx.fillStyle = '#ff4500';
        ctx.fillRect(4, 2, 8, 12);
        
        // Energy effect
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(5, 4, 6, 8);
        
        // Lightning bolt
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(7, 6, 2, 4);
        
        return canvas;
    }

    generateDumbbellSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Golden dumbbell
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(2, 6, 4, 4); // Left weight
        ctx.fillRect(10, 6, 4, 4); // Right weight
        
        // Bar
        ctx.fillStyle = '#daa520';
        ctx.fillRect(6, 7, 4, 2);
        
        // Shine effect
        ctx.fillStyle = '#fff';
        ctx.fillRect(3, 7, 1, 2);
        ctx.fillRect(12, 7, 1, 2);
        
        return canvas;
    }

    generateMembershipCardSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Gym membership card
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(2, 4, 12, 8);
        
        // Card details
        ctx.fillStyle = '#fff';
        ctx.fillRect(4, 6, 8, 4);
        
        // Text
        ctx.fillStyle = '#000';
        ctx.fillRect(5, 7, 6, 2);
        
        return canvas;
    }

    generateProteinScoopSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 8;
        canvas.height = 8;
        
        // Protein powder scoop
        ctx.fillStyle = '#f7b731';
        ctx.fillRect(2, 2, 4, 4);
        
        // Powder effect
        ctx.fillStyle = '#fff';
        ctx.fillRect(3, 3, 2, 2);
        
        return canvas;
    }

    // Generate tile sprites
    generateTileSprites() {
        // Ground tiles
        this.sprites.ground = this.generateGroundTile();
        this.sprites.brick = this.generateBrickTile();
        this.sprites.question = this.generateQuestionTile();
        this.sprites.flag = this.generateFlagTile();
        
        // Gym equipment tiles
        this.sprites.bench = this.generateBenchTile();
        this.sprites.squatRack = this.generateSquatRackTile();
        this.sprites.weightPlate = this.generateWeightPlateTile();
    }

    generateGroundTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Gym floor
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0, 0, 16, 16);
        
        // Floor pattern
        ctx.fillStyle = '#a0522d';
        for (let i = 0; i < 16; i += 4) {
            for (let j = 0; j < 16; j += 4) {
                ctx.fillRect(i, j, 2, 2);
            }
        }
        
        return canvas;
    }

    generateBrickTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Gym wall
        ctx.fillStyle = '#696969';
        ctx.fillRect(0, 0, 16, 16);
        
        // Brick pattern
        ctx.fillStyle = '#808080';
        for (let i = 0; i < 16; i += 4) {
            ctx.fillRect(i, 0, 2, 16);
        }
        for (let j = 0; j < 16; j += 4) {
            ctx.fillRect(0, j, 16, 2);
        }
        
        return canvas;
    }

    generateQuestionTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Question block
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(0, 0, 16, 16);
        
        // Question mark
        ctx.fillStyle = '#000';
        ctx.fillRect(6, 2, 4, 2);
        ctx.fillRect(6, 6, 2, 2);
        ctx.fillRect(6, 10, 2, 2);
        ctx.fillRect(8, 8, 2, 2);
        
        return canvas;
    }

    generateFlagTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Checkpoint flag
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(2, 2, 12, 8);
        
        // Flag pole
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(1, 2, 2, 12);
        
        // Flag pattern
        ctx.fillStyle = '#fff';
        ctx.fillRect(4, 4, 8, 4);
        
        return canvas;
    }

    generateBenchTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Gym bench
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0, 8, 16, 8);
        
        // Bench padding
        ctx.fillStyle = '#000';
        ctx.fillRect(2, 6, 12, 2);
        
        return canvas;
    }

    generateSquatRackTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Squat rack
        ctx.fillStyle = '#696969';
        ctx.fillRect(2, 0, 2, 16);
        ctx.fillRect(12, 0, 2, 16);
        
        // Safety bars
        ctx.fillRect(2, 8, 12, 2);
        ctx.fillRect(2, 12, 12, 2);
        
        return canvas;
    }

    generateWeightPlateTile() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;
        
        // Weight plate
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(4, 4, 8, 8);
        
        // Center hole
        ctx.fillStyle = '#000';
        ctx.fillRect(7, 7, 2, 2);
        
        return canvas;
    }

    // Generate background sprites
    generateBackgroundSprites() {
        this.sprites.cloud = this.generateCloudSprite();
        this.sprites.mountain = this.generateMountainSprite();
        this.sprites.gym = this.generateGymSprite();
    }

    generateCloudSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 16;
        
        // Cloud
        ctx.fillStyle = '#fff';
        ctx.fillRect(4, 8, 24, 8);
        ctx.fillRect(8, 4, 16, 8);
        ctx.fillRect(12, 0, 8, 8);
        
        return canvas;
    }

    generateMountainSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        
        // Mountain
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.moveTo(0, 32);
        ctx.lineTo(8, 16);
        ctx.lineTo(16, 24);
        ctx.lineTo(24, 8);
        ctx.lineTo(32, 20);
        ctx.lineTo(32, 32);
        ctx.closePath();
        ctx.fill();
        
        return canvas;
    }

    generateGymSprite() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 32;
        canvas.height = 32;
        
        // Gym building
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(4, 8, 24, 24);
        
        // Windows
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(8, 12, 4, 4);
        ctx.fillRect(20, 12, 4, 4);
        ctx.fillRect(8, 20, 4, 4);
        ctx.fillRect(20, 20, 4, 4);
        
        // Door
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(14, 20, 4, 12);
        
        return canvas;
    }

    // Get sprite by name
    getSprite(name) {
        return this.sprites[name];
    }

    // Get sprite animation frames
    getAnimation(name) {
        return this.sprites[name];
    }
}

// Create global sprite sheet instance
const SPRITE_SHEET = new SpriteSheet();
