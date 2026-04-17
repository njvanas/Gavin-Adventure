// Game Scene Management
class MenuScene extends Scene {
    constructor() {
        super();
        this.selectedOption = 0;
        this.options = ['CONTINUE', 'NEW GAME', 'CREDITS'];
        this.title = 'GAVIN ADVENTURE';
        this.subtitle = 'Make GAINS. Beat The Shredder.';
        this.backgroundOffset = 0;
    }
    
    enter() {
        window.audio.playMusic('menu');
    }
    
    update(deltaTime) {
        this.backgroundOffset += deltaTime * 0.001;
        
        // Handle input
        if (window.input.isPressed('down')) {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
        } else if (window.input.isPressed('up')) {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
        } else if (window.input.isPressed('jump') || window.input.isPressed('start')) {
            this.selectOption();
        }
    }
    
    selectOption() {
        switch (this.selectedOption) {
            case 0:
                if (window.game) window.game.campaignMode = 'continue';
                this.engine.setScene('game');
                break;
            case 1:
                if (window.game) window.game.campaignMode = 'new';
                this.engine.setScene('game');
                break;
            case 2:
                this.engine.setScene('credits');
                break;
        }
    }
    
    render(ctx) {
        // Animated background
        const gradient = ctx.createLinearGradient(0, 0, 0, GAME_CONFIG.CANVAS_HEIGHT);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Animated background elements
        this.renderAnimatedBackground(ctx);
        
        // Title
        ctx.fillStyle = COLORS.COIN_GOLD;
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, GAME_CONFIG.CANVAS_WIDTH / 2, 150);
        
        // Subtitle
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '18px monospace';
        ctx.fillText(this.subtitle, GAME_CONFIG.CANVAS_WIDTH / 2, 180);
        
        // Menu options
        ctx.font = '24px monospace';
        this.options.forEach((option, index) => {
            const y = 280 + (index * 50);
            
            if (index === this.selectedOption) {
                // Highlight selected option
                ctx.fillStyle = COLORS.ACCENT;
                ctx.fillRect(GAME_CONFIG.CANVAS_WIDTH / 2 - 120, y - 30, 240, 40);
                ctx.fillStyle = COLORS.BLACK;
            } else {
                ctx.fillStyle = COLORS.WHITE;
            }
            
            ctx.fillText(option, GAME_CONFIG.CANVAS_WIDTH / 2, y);
        });
        
        // Instructions
        ctx.fillStyle = COLORS.GRAY_LIGHT;
        ctx.font = '14px monospace';
        ctx.fillText('ARROWS — move   SPACE / Z — select', GAME_CONFIG.CANVAS_WIDTH / 2, 500);
        
        ctx.textAlign = 'left'; // Reset
    }
    
    renderAnimatedBackground(ctx) {
        // Animated dumbbells
        ctx.save();
        ctx.globalAlpha = 0.3;
        
        for (let i = 0; i < 5; i++) {
            const x = 100 + (i * 200) + Math.sin(this.backgroundOffset + i) * 50;
            const y = 300 + Math.cos(this.backgroundOffset * 0.5 + i) * 30;
            
            // Draw dumbbell
            ctx.fillStyle = COLORS.COIN_GOLD;
            ctx.fillRect(x, y, 8, 8);
            ctx.fillRect(x + 12, y + 3, 16, 2);
            ctx.fillRect(x + 32, y, 8, 8);
        }
        
        ctx.restore();
    }
}

class GameScene extends Scene {
    constructor() {
        super();
        this.level = null;
        this.player = null;
        this.camera = { x: 0, y: 0 };
        this.hud = new HUD();
        this.pauseMenu = new PauseMenu();
        this.paused = false;
        this.levelComplete = false;
        this.gameOver = false;
        this.campaignWorld = 1;
        this.campaignStage = 1;
        this._advanceScheduled = false;
        
        // Camera settings
        this.cameraDeadZone = { x: 100, y: 50 };
        this.cameraSpeed = 0.1;
        
        this.setupPauseMenu();
    }
    
    setupPauseMenu() {
        this.pauseMenu.onSelect = (option) => {
            switch (option) {
                case 'RESUME':
                    this.togglePause();
                    break;
                case 'RESTART':
                    this.restartLevel();
                    break;
                case 'OPTIONS':
                    // TODO: Implement options
                    break;
                case 'QUIT':
                    this.engine.setScene('menu');
                    break;
            }
        };
    }
    
    enter() {
        if (window.game && window.game.campaignMode === 'new') {
            window.saveManager.resetCampaignProgress();
        }
        if (window.game) {
            window.game.campaignMode = null;
        }
        const save = window.saveManager.getSaveData();
        const w = save.campaign && save.campaign.resumeWorld ? save.campaign.resumeWorld : 1;
        const s = save.campaign && save.campaign.resumeLevel ? save.campaign.resumeLevel : 1;
        this.loadCampaignLevel(w, s);
        
        this.paused = false;
        this.levelComplete = false;
        this.gameOver = false;
        this._advanceScheduled = false;
    }

    loadCampaignLevel(world, stage) {
        this.campaignWorld = world;
        this.campaignStage = stage;
        this.levelComplete = false;
        this.gameOver = false;
        this._advanceScheduled = false;
        this.level = window.Campaign.createLevel(world, stage);
        this.player = new Player(this.level.playerSpawn.x, this.level.playerSpawn.y);
        this.hud.setWorldLevel(world, stage);
        this.hud.setLevelTitle(window.Campaign.getLevelTitle(world, stage));
        this.hud.time = 400;
        this.updateCamera();
        window.audio.playMusic('level');
    }
    
    exit() {
        window.audio.stopMusic();
    }
    
    update(deltaTime) {
        // Handle pause
        if (window.input.isPressed('pause')) {
            this.togglePause();
        }
        
        if (this.paused) {
            this.pauseMenu.handleInput(window.input);
            return;
        }

        if (this.levelComplete || this._advanceScheduled) {
            return;
        }
        
        // Check game over
        if (this.player && !this.player.active) {
            this.gameOver = true;
            // Handle game over logic
            if (window.input.isPressed('start')) {
                this.restartLevel();
            }
            return;
        }
        
        // Update game objects
        if (this.level) {
            this.level.update(deltaTime, this.player, window.particles);
        }
        
        if (this.player) {
            this.player.update(deltaTime, this.level, window.input, window.particles);
        }

        if (this.player && this.player.active && this.level) {
            const killY = this.level.height * GAME_CONFIG.TILE_SIZE + 64;
            if (this.player.y > killY) {
                const died = this.player.takeDamage(window.particles);
                if (this.player.active) {
                    this.player.x = this.level.playerSpawn.x;
                    this.player.y = this.level.playerSpawn.y;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.player.smbVelX = 0;
                    this.player.smbVelY = 0;
                    this.player.smbState = 0;
                    if (window.SMB_CONST) {
                        this.player.fallAcc = window.SMB_CONST.DEFAULT_GRAVITY;
                    }
                } else {
                    this.gameOver = true;
                }
            }
        }
        
        // Update camera
        this.updateCamera();
        
        // Update HUD
        this.hud.update(deltaTime, this.player);
        
        // Check level completion
        if (this.level && this.level.completed && !this.levelComplete) {
            this.levelComplete = true;
            this.completeLevel();
        }
    }
    
    updateCamera() {
        if (!this.player) return;

        const hud = GAME_CONFIG.HUD_HEIGHT || 56;
        const playH = GAME_CONFIG.CANVAS_HEIGHT - hud;
        const levelWpx = this.level ? this.level.width * GAME_CONFIG.TILE_SIZE : GAME_CONFIG.CANVAS_WIDTH;
        const levelHpx = this.level ? this.level.height * GAME_CONFIG.TILE_SIZE : GAME_CONFIG.CANVAS_HEIGHT;

        // NES SMB: horizontal camera locks to player with small lookahead (no floaty lerp)
        const look = this.player.direction > 0 ? 48 : -48;
        let targetX = this.player.x - GAME_CONFIG.CANVAS_WIDTH * 0.42 + look;
        targetX = Math.max(0, Math.min(targetX, levelWpx - GAME_CONFIG.CANVAS_WIDTH));

        this.camera.x += (targetX - this.camera.x) * 0.92;

        let targetY = this.player.y - playH * 0.55;
        targetY = Math.max(0, Math.min(targetY, levelHpx - playH));
        this.camera.y += (targetY - this.camera.y) * 0.88;

        window.renderer.setCamera(this.camera.x, this.camera.y);
    }
    
    togglePause() {
        this.paused = !this.paused;
        
        if (this.paused) {
            this.pauseMenu.show();
            window.audio.stopMusic();
        } else {
            this.pauseMenu.hide();
            window.audio.playMusic('level');
        }
    }
    
    restartLevel() {
        this.gameOver = false;
        this.loadCampaignLevel(this.campaignWorld, this.campaignStage);
    }
    
    completeLevel() {
        if (this._advanceScheduled) return;
        this._advanceScheduled = true;
        window.audio.playSound('victory');
        const w = this.campaignWorld;
        const s = this.campaignStage;
        window.saveManager.completeStage(w, s, this.player ? this.player.score : 0);
        const finale = w === 8 && s === 4;
        setTimeout(() => {
            this._advanceScheduled = false;
            if (finale) {
                this.engine.setScene('menu');
                return;
            }
            const save = window.saveManager.getSaveData();
            const cw = save.campaign.resumeWorld;
            const cs = save.campaign.resumeLevel;
            this.loadCampaignLevel(cw, cs);
        }, 2400);
    }
    
    render(ctx) {
        const hud = GAME_CONFIG.HUD_HEIGHT || 56;
        const W = GAME_CONFIG.CANVAS_WIDTH;
        const H = GAME_CONFIG.CANVAS_HEIGHT;

        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, W, hud);

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, hud, W, H - hud);
        ctx.clip();
        ctx.translate(0, hud);

        if (this.level) {
            this.level.render(ctx, this.camera);
        }
        if (this.player) {
            this.player.render(ctx, this.camera);
        }
        window.particles.render(window.renderer);

        ctx.restore();

        this.hud.render(ctx);
        
        // Render pause menu
        if (this.paused) {
            this.pauseMenu.render(ctx);
        }
        
        // Render game over screen
        if (this.gameOver) {
            this.renderGameOver(ctx);
        }
        
        // Render level complete screen
        if (this.levelComplete) {
            this.renderLevelComplete(ctx);
        }
    }
    
    renderGameOver(ctx) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Game Over text
        ctx.fillStyle = COLORS.ERROR;
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 - 50);
        
        // Instructions
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '18px monospace';
        ctx.fillText('Press START to try again', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 50);
        
        ctx.textAlign = 'left'; // Reset
    }
    
    renderLevelComplete(ctx) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Level Complete text
        ctx.fillStyle = COLORS.SUCCESS;
        ctx.font = 'bold 36px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LEVEL COMPLETE!', GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 - 50);
        
        // Score display
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '18px monospace';
        ctx.fillText(`Final Score: ${this.player ? this.player.score : 0}`, 
            GAME_CONFIG.CANVAS_WIDTH / 2, GAME_CONFIG.CANVAS_HEIGHT / 2 + 20);
        
        ctx.textAlign = 'left'; // Reset
    }
    
    getDebugInfo() {
        return {
            'Paused': this.paused,
            'Level Complete': this.levelComplete,
            'Game Over': this.gameOver,
            'Camera': `${Math.floor(this.camera.x)}, ${Math.floor(this.camera.y)}`,
            ...(this.level ? this.level.getDebugInfo() : {}),
            ...(this.player ? this.player.getDebugInfo() : {})
        };
    }
}

class CreditsScene extends Scene {
    constructor() {
        super();
    }

    enter() {}

    update(deltaTime) {
        if (
            window.input.isPressed('jump') ||
            window.input.isPressed('start') ||
            window.input.isPressed('pause')
        ) {
            this.engine.setScene('menu');
        }
    }

    render(ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

        ctx.fillStyle = COLORS.COIN_GOLD;
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CREDITS', GAME_CONFIG.CANVAS_WIDTH / 2, 100);

        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '14px monospace';
        const lines = [
            'Gavin Adventure',
            'Bodybuilding hero. Epic bosses.',
            '',
            'Built with HTML5 Canvas & JavaScript',
            'Chiptune audio · Pixel polish',
            '',
            'Make GAINS. Beat The Shredder.'
        ];
        let y = 160;
        for (const line of lines) {
            ctx.fillText(line, GAME_CONFIG.CANVAS_WIDTH / 2, y);
            y += 28;
        }

        ctx.fillStyle = COLORS.GRAY_LIGHT;
        ctx.font = '12px monospace';
        ctx.fillText(
            'SPACE / ENTER / ESC — menu',
            GAME_CONFIG.CANVAS_WIDTH / 2,
            GAME_CONFIG.CANVAS_HEIGHT - 40
        );
        ctx.textAlign = 'left';
    }
}

class LoadingScene extends Scene {
    constructor() {
        super();
        this.progress = 0;
        this.loadingText = 'Loading assets...';
        this.dots = '';
        this.dotTimer = 0;
    }
    
    enter() {
        this.startLoading();
    }
    
    async startLoading() {
        // Simulate asset loading
        for (let i = 0; i <= 100; i += 10) {
            this.progress = i;
            this.updateLoadingText();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Transition to menu
        this.engine.setScene('menu');
    }
    
    updateLoadingText() {
        if (this.progress < 30) {
            this.loadingText = 'Loading sprites...';
        } else if (this.progress < 60) {
            this.loadingText = 'Loading audio...';
        } else if (this.progress < 90) {
            this.loadingText = 'Loading levels...';
        } else {
            this.loadingText = 'Ready to make GAINS!';
        }
    }
    
    update(deltaTime) {
        // Animate loading dots
        this.dotTimer += deltaTime;
        if (this.dotTimer >= 500) {
            this.dotTimer = 0;
            this.dots = this.dots.length >= 3 ? '' : this.dots + '.';
        }
        
        // Update progress display
        const loadingElement = document.getElementById('loadingProgress');
        if (loadingElement) {
            loadingElement.style.width = this.progress + '%';
        }
        
        const loadingTextElement = document.getElementById('loadingText');
        if (loadingTextElement) {
            loadingTextElement.textContent = this.loadingText + this.dots;
        }
    }
    
    render(ctx) {
        // This scene renders using DOM elements
        // The actual loading screen is in the HTML
    }
}

// Export to global scope
window.MenuScene = MenuScene;
window.GameScene = GameScene;
window.CreditsScene = CreditsScene;
window.LoadingScene = LoadingScene;