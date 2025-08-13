// Level Management System
class Level {
    constructor(levelData) {
        this.width = levelData.width || 64;
        this.height = levelData.height || 36;
        this.tiles = levelData.tiles || [];
        this.entities = [];
        this.collectibles = [];
        this.enemies = [];
        this.checkpoints = [];
        this.secrets = [];
        this.completed = false;
        
        // Level properties
        this.theme = levelData.theme || WORLD_THEMES.NEIGHBORHOOD_GYM;
        this.music = levelData.music || 'level';
        this.backgroundColor = this.getThemeColor();
        
        // Spawn points
        this.playerSpawn = levelData.playerSpawn || { x: 32, y: 300 };
        this.exitPoint = levelData.exitPoint || { x: this.width * 16 - 64, y: 300 };
        
        this.initializeLevel(levelData);
    }
    
    initializeLevel(levelData) {
        // Create tile grid if not provided
        if (this.tiles.length === 0) {
            this.generateDefaultTiles();
        }
        
        // Spawn entities from level data
        if (levelData.enemies) {
            levelData.enemies.forEach(enemyData => {
                this.addEnemy(enemyData.type, enemyData.x, enemyData.y);
            });
        }
        
        if (levelData.collectibles) {
            levelData.collectibles.forEach(collectibleData => {
                this.addCollectible(collectibleData.type, collectibleData.x, collectibleData.y);
            });
        }
        
        // Add some default collectibles for testing
        this.addDefaultCollectibles();
    }
    
    generateDefaultTiles() {
        // Create empty tile grid
        this.tiles = new Array(this.width * this.height).fill(TILES.AIR);
        
        // Add ground
        for (let x = 0; x < this.width; x++) {
            for (let y = this.height - 4; y < this.height; y++) {
                this.setTile(x, y, TILES.SOLID);
            }
        }
        
        // Add some platforms
        for (let x = 10; x < 15; x++) {
            this.setTile(x, this.height - 8, TILES.PLATFORM);
        }
        
        for (let x = 20; x < 25; x++) {
            this.setTile(x, this.height - 12, TILES.PLATFORM);
        }
        
        // Add some breakable blocks
        for (let x = 30; x < 35; x++) {
            this.setTile(x, this.height - 6, TILES.BREAKABLE);
        }
        
        // Add obstacles and gaps
        this.addObstacles();
    }
    
    addObstacles() {
        // Add some gaps for jumping
        for (let x = 16; x < 19; x++) {
            for (let y = this.height - 4; y < this.height; y++) {
                this.setTile(x, y, TILES.AIR);
            }
        }
        
        // Add elevated platforms
        for (let x = 35; x < 40; x++) {
            this.setTile(x, this.height - 10, TILES.SOLID);
        }
        
        // Add some spikes
        for (let x = 45; x < 48; x++) {
            this.setTile(x, this.height - 5, TILES.SPIKES);
        }
    }
    
    addDefaultCollectibles() {
        // Add golden dumbbells
        this.addCollectible(COLLECTIBLE_TYPES.GOLDEN_DUMBBELL, 8 * 16, (this.height - 6) * 16);
        this.addCollectible(COLLECTIBLE_TYPES.GOLDEN_DUMBBELL, 12 * 16, (this.height - 10) * 16);
        this.addCollectible(COLLECTIBLE_TYPES.GOLDEN_DUMBBELL, 22 * 16, (this.height - 14) * 16);
        
        // Add power-ups
        this.addCollectible(COLLECTIBLE_TYPES.PROTEIN_SHAKE, 15 * 16, (this.height - 6) * 16);
        this.addCollectible(COLLECTIBLE_TYPES.PRE_WORKOUT, 40 * 16, (this.height - 12) * 16);
        
        // Add a gym card (1-up)
        this.addCollectible(COLLECTIBLE_TYPES.GYM_CARD, 50 * 16, (this.height - 8) * 16);
    }
    
    addEnemy(type, x, y) {
        const enemy = new Enemy(x, y, type);
        this.enemies.push(enemy);
        this.entities.push(enemy);
    }
    
    addCollectible(type, x, y) {
        const collectible = new Collectible(x, y, type);
        this.collectibles.push(collectible);
        this.entities.push(collectible);
    }
    
    setTile(x, y, tileType) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.tiles[y * this.width + x] = tileType;
        }
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return TILES.SOLID; // Treat out-of-bounds as solid
        }
        return this.tiles[y * this.width + x];
    }
    
    update(deltaTime, player, particleSystem) {
        // Update all entities
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            entity.update(deltaTime, this, player, particleSystem);
            
            if (!entity.active) {
                this.entities.splice(i, 1);
                
                // Remove from specific arrays
                const enemyIndex = this.enemies.indexOf(entity);
                if (enemyIndex !== -1) {
                    this.enemies.splice(enemyIndex, 1);
                }
                
                const collectibleIndex = this.collectibles.indexOf(entity);
                if (collectibleIndex !== -1) {
                    this.collectibles.splice(collectibleIndex, 1);
                }
            }
        }
        
        // Check if player reached exit
        if (player && this.isPlayerAtExit(player)) {
            this.completed = true;
        }
    }
    
    isPlayerAtExit(player) {
        return player.x >= this.exitPoint.x && 
               player.y >= this.exitPoint.y - 32 && 
               player.y <= this.exitPoint.y + 32;
    }
    
    render(ctx, camera) {
        // Render background
        this.renderBackground(ctx, camera);
        
        // Render tiles
        this.renderTiles(ctx, camera);
        
        // Render entities
        for (const entity of this.entities) {
            entity.render(ctx, camera);
        }
        
        // Render exit point
        this.renderExit(ctx, camera);
    }
    
    renderBackground(ctx, camera) {
        // Clear with theme color
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Add simple parallax background elements
        this.renderParallaxBackground(ctx, camera);
    }
    
    renderParallaxBackground(ctx, camera) {
        // Simple cloud-like background elements
        const parallax = 0.3;
        const offsetX = camera.x * parallax;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 5; i++) {
            const x = (i * 200) - offsetX;
            const y = 50 + Math.sin(i) * 30;
            
            // Simple cloud shape
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.arc(x + 20, y, 25, 0, Math.PI * 2);
            ctx.arc(x + 40, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderTiles(ctx, camera) {
        const tileSize = GAME_CONFIG.TILE_SIZE;
        
        // Calculate visible tile range
        const leftTile = Math.max(0, Math.floor(camera.x / tileSize) - 1);
        const rightTile = Math.min(this.width - 1, Math.floor((camera.x + GAME_CONFIG.CANVAS_WIDTH) / tileSize) + 1);
        const topTile = Math.max(0, Math.floor(camera.y / tileSize) - 1);
        const bottomTile = Math.min(this.height - 1, Math.floor((camera.y + GAME_CONFIG.CANVAS_HEIGHT) / tileSize) + 1);
        
        // Render visible tiles
        for (let y = topTile; y <= bottomTile; y++) {
            for (let x = leftTile; x <= rightTile; x++) {
                const tile = this.getTile(x, y);
                if (tile === TILES.AIR) continue;
                
                const screenX = (x * tileSize) - camera.x;
                const screenY = (y * tileSize) - camera.y;
                
                this.renderTile(ctx, tile, screenX, screenY);
            }
        }
    }
    
    renderTile(ctx, tileType, x, y) {
        const size = GAME_CONFIG.TILE_SIZE;
        
        switch (tileType) {
            case TILES.SOLID:
                const groundSprite = window.sprites.getSprite('ground');
                if (groundSprite) {
                    ctx.drawImage(groundSprite.image, x, y, size, size);
                } else {
                    ctx.fillStyle = COLORS.GROUND_BROWN;
                    ctx.fillRect(x, y, size, size);
                }
                break;
                
            case TILES.PLATFORM:
                const platformSprite = window.sprites.getSprite('platform');
                if (platformSprite) {
                    ctx.drawImage(platformSprite.image, x, y, size, size);
                } else {
                    ctx.fillStyle = COLORS.GRAY;
                    ctx.fillRect(x, y, size, 4);
                }
                break;
                
            case TILES.BREAKABLE:
                const breakableSprite = window.sprites.getSprite('breakable');
                if (breakableSprite) {
                    ctx.drawImage(breakableSprite.image, x, y, size, size);
                } else {
                    ctx.fillStyle = '#DEB887';
                    ctx.fillRect(x, y, size, size);
                    ctx.strokeStyle = COLORS.BLACK;
                    ctx.strokeRect(x, y, size, size);
                }
                break;
                
            case TILES.SPIKES:
                ctx.fillStyle = COLORS.ERROR;
                // Draw triangle spikes
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const spikeX = x + (i * 4);
                    ctx.moveTo(spikeX, y + size);
                    ctx.lineTo(spikeX + 2, y);
                    ctx.lineTo(spikeX + 4, y + size);
                }
                ctx.fill();
                break;
        }
    }
    
    renderExit(ctx, camera) {
        const screenX = this.exitPoint.x - camera.x;
        const screenY = this.exitPoint.y - camera.y;
        
        // Draw flag or exit marker
        ctx.fillStyle = COLORS.SUCCESS;
        ctx.fillRect(screenX, screenY - 32, 4, 32);
        
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.fillRect(screenX + 4, screenY - 32, 20, 16);
        
        // Draw "EXIT" text
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', screenX + 14, screenY - 24);
        ctx.textAlign = 'left';
    }
    
    getThemeColor() {
        switch (this.theme) {
            case WORLD_THEMES.NEIGHBORHOOD_GYM:
                return COLORS.NEIGHBORHOOD;
            case WORLD_THEMES.CITY_ROOFTOPS:
                return COLORS.CITY;
            case WORLD_THEMES.LOCKER_DEPTHS:
                return COLORS.LOCKER;
            case WORLD_THEMES.AQUATIC_MIXERS:
                return COLORS.AQUATIC;
            case WORLD_THEMES.STEEL_FACTORY:
                return COLORS.FACTORY;
            case WORLD_THEMES.NEON_NIGHT:
                return COLORS.NEON;
            case WORLD_THEMES.ALPINE_ALTITUDE:
                return COLORS.ALPINE;
            case WORLD_THEMES.CHAMPIONSHIP:
                return COLORS.CHAMPIONSHIP;
            default:
                return COLORS.SKY_BLUE;
        }
    }
    
    // Collision helpers
    canBreakTile(x, y, powerState) {
        const tile = this.getTile(x, y);
        
        if (tile === TILES.BREAKABLE && powerState >= POWER_STATES.PUMP) {
            return true;
        }
        
        if (tile === TILES.STRONG_PLATE && powerState >= POWER_STATES.BEAST) {
            return true;
        }
        
        return false;
    }
    
    breakTile(x, y, particleSystem) {
        this.setTile(x, y, TILES.AIR);
        
        if (particleSystem) {
            particleSystem.blockBreak(x * GAME_CONFIG.TILE_SIZE, y * GAME_CONFIG.TILE_SIZE);
        }
        
        window.audio.playSound('break');
    }
    
    getDebugInfo() {
        return {
            'Size': `${this.width}x${this.height}`,
            'Entities': this.entities.length,
            'Enemies': this.enemies.length,
            'Collectibles': this.collectibles.length,
            'Theme': this.theme,
            'Completed': this.completed
        };
    }
}

// Level Generator for creating test levels
class LevelGenerator {
    static createTestLevel() {
        return new Level({
            width: 64,
            height: 36,
            theme: WORLD_THEMES.NEIGHBORHOOD_GYM,
            playerSpawn: { x: 32, y: 300 },
            enemies: [
                { type: ENEMY_TYPES.SLOUCHER, x: 200, y: 300 },
                { type: ENEMY_TYPES.FORM_POLICE, x: 400, y: 300 },
                { type: ENEMY_TYPES.KETTLE_BELL, x: 600, y: 300 },
            ]
        });
    }
    
    static createWorld1Level1() {
        return new Level({
            width: 80,
            height: 36,
            theme: WORLD_THEMES.NEIGHBORHOOD_GYM,
            playerSpawn: { x: 32, y: 480 },
            enemies: [
                { type: ENEMY_TYPES.SLOUCHER, x: 160, y: 480 },
                { type: ENEMY_TYPES.SLOUCHER, x: 320, y: 480 },
                { type: ENEMY_TYPES.FORM_POLICE, x: 480, y: 480 },
            ]
        });
    }
    
    static createBossLevel() {
        return new Level({
            width: 48,
            height: 24,
            theme: WORLD_THEMES.CHAMPIONSHIP,
            playerSpawn: { x: 32, y: 300 },
            enemies: [
                { type: ENEMY_TYPES.BOSS_SHREDDER, x: 600, y: 280 },
            ]
        });
    }
}

// Export to global scope
window.Level = Level;
window.LevelGenerator = LevelGenerator;