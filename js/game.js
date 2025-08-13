// Gavin Adventure - Main Game Engine
// Handles game loop, input, rendering, and game state

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Game state
        this.gameState = 'title'; // title, playing, paused, gameOver, victory
        this.currentLevel = null;
        this.player = null;
        this.entities = [];
        this.camera = new Camera(this.width, this.height);
        
        // Input handling
        this.keys = {};
        this.setupInput();
        
        // Game loop
        this.lastTime = 0;
        this.running = false;
        
        // Game settings
        this.gameMode = 'story'; // story, freePlay, timeAttack
        this.selectedLevel = '1-1';
        this.timeAttackTime = 0;
        this.bestTimes = this.loadBestTimes();
        
        // Initialize
        this.init();
    }

    init() {
        this.loadLevel(this.selectedLevel);
        this.setupAudio();
        this.startGameLoop();
    }

    setupInput() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch(e.touches[0]);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'Escape':
                this.togglePause();
                break;
            case 'KeyR':
                if (this.gameState === 'gameOver') {
                    this.restart();
                }
                break;
        }
    }

    handleTouch(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        // Simple touch controls
        if (x < this.width / 3) {
            this.moveLeft();
        } else if (x > (this.width * 2) / 3) {
            this.moveRight();
        } else {
            this.jump();
        }
    }

    setupAudio() {
        // Resume audio context on first user interaction
        document.addEventListener('click', () => {
            AUDIO_MANAGER.resumeAudio();
        }, { once: true });
    }

    startGameLoop() {
        this.running = true;
        this.gameLoop();
    }

    gameLoop(currentTime = 0) {
        if (!this.running) return;

        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update(deltaTime) {
        if (this.gameState !== 'playing') return;

        // Update player
        if (this.player) {
            this.updatePlayerInput();
            this.player.update(deltaTime);
        }

        // Update entities
        this.entities.forEach(entity => {
            if (entity.update) {
                entity.update(deltaTime);
            }
        });

        // Remove dead entities
        this.entities = this.entities.filter(entity => !entity.removed);

        // Update camera
        if (this.player) {
            this.camera.follow(this.player);
            this.camera.update();
        }

        // Check collisions
        this.checkCollisions();

        // Check level completion
        this.checkLevelCompletion();

        // Update time attack timer
        if (this.gameMode === 'timeAttack') {
            this.timeAttackTime += deltaTime;
        }
    }

    updatePlayerInput() {
        if (!this.player) return;

        // Movement
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.player.velocityX = -PHYSICS.maxWalkSpeed;
            this.player.facing = -1;
        } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.player.velocityX = PHYSICS.maxWalkSpeed;
            this.player.facing = 1;
        } else {
            this.player.velocityX = 0;
        }

        // Running
        if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) {
            if (this.player.velocityX !== 0) {
                this.player.velocityX *= 2;
                this.player.isRunning = true;
            }
        } else {
            this.player.isRunning = false;
        }

        // Jumping
        if (this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.player.jump();
        }

        // Crouching
        if (this.keys['KeyC'] || this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.player.crouch();
        } else {
            this.player.stand();
        }

        // Attack
        if (this.keys['KeyX']) {
            this.player.attack();
        }
    }

    checkCollisions() {
        if (!this.player) return;

        // Player vs entities
        this.entities.forEach(entity => {
            if (PHYSICS.checkCollision(this.player, entity)) {
                this.handleCollision(this.player, entity);
            }
        });

        // Player projectiles vs enemies
        this.player.projectiles.forEach(projectile => {
            this.entities.forEach(entity => {
                if (entity instanceof Enemy && PHYSICS.checkCollision(projectile, entity)) {
                    projectile.onCollisionWithEnemy(entity);
                }
            });
        });

        // Player vs level tiles
        this.checkPlayerTileCollisions();
    }

    handleCollision(player, entity) {
        if (entity instanceof Enemy) {
            // Check if player is stomping enemy
            if (player.velocityY > 0 && player.y < entity.y) {
                entity.onStompedByPlayer(player);
            } else {
                entity.onCollisionWithPlayer(player);
            }
        } else if (entity instanceof Item) {
            entity.onCollisionWithPlayer(player);
        }
    }

    checkPlayerTileCollisions() {
        if (!this.player || !this.currentLevel) return;

        const tiles = PHYSICS.getNearbyTiles(this.player, this.currentLevel);
        
        // Check for checkpoint
        if (this.currentLevel.checkpoint) {
            const checkpoint = this.currentLevel.checkpoint;
            if (PHYSICS.checkCollision(this.player, {
                x: checkpoint.x,
                y: checkpoint.y,
                width: 16,
                height: 16
            })) {
                this.player.setCheckpoint(checkpoint.x, checkpoint.y);
            }
        }

        // Check for end flag
        if (this.currentLevel.endFlag) {
            const endFlag = this.currentLevel.endFlag;
            if (PHYSICS.checkCollision(this.player, {
                x: endFlag.x,
                y: endFlag.y,
                width: 16,
                height: 16
            })) {
                this.completeLevel();
            }
        }
    }

    checkLevelCompletion() {
        if (!this.player) return;

        // Check if player fell off screen
        if (this.player.y > this.height + 100) {
            this.player.takeDamage(1, null);
        }

        // Check if player is dead
        if (this.player.lives <= 0) {
            this.gameOver();
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.fillRect(0, 0, this.width, this.height);

        if (this.gameState === 'playing' && this.currentLevel) {
            this.renderLevel();
            this.renderEntities();
            this.renderHUD();
        }
    }

    renderLevel() {
        if (!this.currentLevel) return;

        // Render background
        this.renderBackground();

        // Render tiles
        this.renderTiles();
    }

    renderBackground() {
        const background = this.currentLevel.background;
        
        // Simple background rendering
        switch (background) {
            case 'overworld':
                this.renderOverworldBackground();
                break;
            case 'underground':
                this.renderUndergroundBackground();
                break;
            case 'underwater':
                this.renderUnderwaterBackground();
                break;
            case 'castle':
                this.renderCastleBackground();
                break;
        }
    }

    renderOverworldBackground() {
        // Render clouds and mountains
        const cloudSprite = SPRITE_SHEET.getSprite('cloud');
        const mountainSprite = SPRITE_SHEET.getSprite('mountain');
        
        if (cloudSprite) {
            for (let i = 0; i < 3; i++) {
                const x = (i * 200 - this.camera.x * 0.5) % (this.width + 100);
                this.ctx.drawImage(cloudSprite, x, 50);
            }
        }
        
        if (mountainSprite) {
            for (let i = 0; i < 2; i++) {
                const x = (i * 300 - this.camera.x * 0.3) % (this.width + 100);
                this.ctx.drawImage(mountainSprite, x, this.height - 100);
            }
        }
    }

    renderUndergroundBackground() {
        // Dark underground background
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Some underground details
        this.ctx.fillStyle = '#404040';
        for (let i = 0; i < 10; i++) {
            this.ctx.fillRect(i * 80, 0, 2, this.height);
        }
    }

    renderUnderwaterBackground() {
        // Underwater effect
        this.ctx.fillStyle = '#006994';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Bubbles
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
            const x = (i * 40 + Date.now() * 0.01) % this.width;
            const y = (this.height - (i * 30 + Date.now() * 0.02) % this.height);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    renderCastleBackground() {
        // Castle background
        this.ctx.fillStyle = '#2d2d2d';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        const gymSprite = SPRITE_SHEET.getSprite('gym');
        if (gymSprite) {
            for (let i = 0; i < 3; i++) {
                const x = (i * 150 - this.camera.x * 0.2) % (this.width + 100);
                this.ctx.drawImage(gymSprite, x, this.height - 120);
            }
        }
    }

    renderTiles() {
        if (!this.currentLevel) return;

        for (let y = 0; y < this.currentLevel.height; y++) {
            for (let x = 0; x < this.currentLevel.width; x++) {
                const tile = this.currentLevel.getTile(x, y);
                if (tile && tile.type !== 'empty') {
                    this.renderTile(tile, x * 16, y * 16);
                }
            }
        }
    }

    renderTile(tile, x, y) {
        const sprite = SPRITE_SHEET.getSprite(tile.type);
        if (sprite) {
            this.ctx.drawImage(sprite, x - this.camera.x, y - this.camera.y);
        }
    }

    renderEntities() {
        // Render all entities
        this.entities.forEach(entity => {
            if (entity.render && PHYSICS.isInView(entity, this.camera)) {
                entity.render(this.ctx, this.camera);
            }
        });

        // Render player
        if (this.player && this.player.render) {
            this.player.render(this.ctx, this.camera);
        }
    }

    renderHUD() {
        if (!this.player) return;

        // Score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Courier New';
        this.ctx.fillText(`SCORE: ${this.player.score}`, 10, 30);

        // Lives
        this.ctx.fillText(`LIVES: ${this.player.lives}`, 10, 60);

        // Level
        this.ctx.fillText(`WORLD ${this.selectedLevel}`, 10, 90);

        // Power level
        this.ctx.fillText(`POWER: ${this.player.powerLevel}`, 10, 120);

        // Gains meter
        this.renderGainsMeter(10, 150);

        // Time attack timer
        if (this.gameMode === 'timeAttack') {
            this.ctx.fillText(`TIME: ${Math.floor(this.timeAttackTime / 1000)}s`, 10, 180);
        }
    }

    renderGainsMeter(x, y) {
        const width = 100;
        const height = 20;
        
        // Background
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(x, y, width, height);
        
        // Meter
        const fillWidth = (this.player.gainsMeter / this.player.maxGainsMeter) * width;
        this.ctx.fillStyle = '#ff6b35';
        this.ctx.fillRect(x, y, fillWidth, height);
        
        // Border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.strokeRect(x, y, width, height);
        
        // Label
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Courier New';
        this.ctx.fillText('GAINS', x, y + height + 15);
    }

    loadLevel(levelName) {
        this.currentLevel = LEVEL_MANAGER.loadLevel(levelName);
        if (!this.currentLevel) return;

        this.selectedLevel = levelName;
        this.entities = [];
        
        // Create player
        this.player = new Gavin(100, 200);
        this.camera.follow(this.player);
        
        // Create level entities
        this.currentLevel.entities.forEach(entityData => {
            const entity = EntityFactory.createEntity(entityData.type, entityData.x, entityData.y);
            if (entity) {
                this.entities.push(entity);
            }
        });

        // Play level music
        AUDIO_MANAGER.playMusic(this.currentLevel.music);
        
        // Reset time attack timer
        if (this.gameMode === 'timeAttack') {
            this.timeAttackTime = 0;
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.gameMode = 'story';
        this.loadLevel('1-1');
        this.showScreen('gameScreen');
    }

    startFreePlay() {
        this.gameState = 'playing';
        this.gameMode = 'freePlay';
        this.showLevelSelect();
    }

    startTimeAttack() {
        this.gameState = 'playing';
        this.gameMode = 'timeAttack';
        this.showLevelSelect();
    }

    showLevelSelect() {
        this.showScreen('levelSelect');
        this.populateLevelSelect();
    }

    populateLevelSelect() {
        const worldsContainer = document.getElementById('worlds');
        worldsContainer.innerHTML = '';

        const levels = LEVEL_MANAGER.getAllLevels();
        const unlockedLevels = LEVEL_MANAGER.getUnlockedLevels();

        levels.forEach(levelName => {
            const button = document.createElement('button');
            button.className = 'world-button';
            button.textContent = levelName;
            
            if (!unlockedLevels.includes(levelName)) {
                button.classList.add('locked');
                button.disabled = true;
            } else {
                button.addEventListener('click', () => {
                    this.loadLevel(levelName);
                    this.showScreen('gameScreen');
                });
            }
            
            worldsContainer.appendChild(button);
        });
    }

    completeLevel() {
        if (this.gameMode === 'story') {
            LEVEL_MANAGER.completeLevel(this.selectedLevel);
            
            // Check if game is complete
            if (this.selectedLevel === '8-4') {
                this.victory();
            } else {
                // Load next level
                const [world, level] = this.selectedLevel.split('-');
                const nextLevel = `${world}-${parseInt(level) + 1}`;
                if (LEVEL_DATA[nextLevel]) {
                    this.loadLevel(nextLevel);
                }
            }
        } else if (this.gameMode === 'timeAttack') {
            this.recordTime();
            this.showLevelSelect();
        }
    }

    recordTime() {
        const time = Math.floor(this.timeAttackTime / 1000);
        const currentBest = this.bestTimes[this.selectedLevel] || Infinity;
        
        if (time < currentBest) {
            this.bestTimes[this.selectedLevel] = time;
            this.saveBestTimes();
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        this.showScreen('gameOver');
        document.getElementById('finalScore').textContent = `FINAL SCORE: ${this.player.score}`;
        AUDIO_MANAGER.playSound('death');
    }

    victory() {
        this.gameState = 'victory';
        this.showScreen('victory');
        document.getElementById('victoryScore').textContent = `FINAL SCORE: ${this.player.score}`;
        AUDIO_MANAGER.playSound('victory');
    }

    restart() {
        this.loadLevel(this.selectedLevel);
        this.showScreen('gameScreen');
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseMenu').classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseMenu').classList.add('hidden');
        }
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenName).classList.add('active');
    }

    loadBestTimes() {
        try {
            return JSON.parse(localStorage.getItem('gavinAdventureBestTimes')) || {};
        } catch {
            return {};
        }
    }

    saveBestTimes() {
        try {
            localStorage.setItem('gavinAdventureBestTimes', JSON.stringify(this.bestTimes));
        } catch {
            console.warn('Could not save best times');
        }
    }

    saveGame() {
        const saveData = {
            level: this.selectedLevel,
            score: this.player ? this.player.score : 0,
            lives: this.player ? this.player.lives : 3,
            unlockedLevels: Array.from(LEVEL_MANAGER.getUnlockedLevels()),
            completedLevels: Array.from(LEVEL_MANAGER.getCompletedLevels())
        };
        
        try {
            localStorage.setItem('gavinAdventureSave', JSON.stringify(saveData));
        } catch {
            console.warn('Could not save game');
        }
    }

    loadGame() {
        try {
            const saveData = JSON.parse(localStorage.getItem('gavinAdventureSave'));
            if (saveData) {
                // Restore level manager state
                saveData.unlockedLevels.forEach(level => LEVEL_MANAGER.unlockLevel(level));
                saveData.completedLevels.forEach(level => LEVEL_MANAGER.completeLevel(level));
                
                // Load saved level
                this.loadLevel(saveData.level);
                this.showScreen('gameScreen');
                
                // Restore player stats
                if (this.player) {
                    this.player.score = saveData.score;
                    this.player.lives = saveData.lives;
                }
            }
        } catch {
            console.warn('Could not load game');
        }
    }
}
