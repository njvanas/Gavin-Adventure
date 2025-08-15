// HUD (Heads-Up Display) System
class HUD {
    constructor() {
        this.visible = true;
        this.lives = 3;
        this.score = 0;
        this.gainsPoints = 0;
        this.world = 1;
        this.level = 1;
        this.time = 400; // Timer in seconds
        this.powerState = POWER_STATES.SMALL;
        
        // Animation properties
        this.scoreAnimation = 0;
        this.lifeAnimation = 0;
        this.gainsAnimation = 0;
    }
    
    update(deltaTime, player) {
        if (!player) return;
        
        // Update from player
        this.lives = player.lives;
        this.score = player.score;
        this.gainsPoints = player.gainsPoints;
        this.powerState = player.powerState;
        
        // Update animations
        this.updateAnimations(deltaTime);
        
        // Update timer (if applicable)
        if (this.time > 0) {
            this.time -= deltaTime / 1000;
            this.time = Math.max(0, this.time);
        }
    }
    
    updateAnimations(deltaTime) {
        // Animate score changes
        if (this.scoreAnimation > 0) {
            this.scoreAnimation -= deltaTime;
        }
        
        if (this.lifeAnimation > 0) {
            this.lifeAnimation -= deltaTime;
        }
        
        if (this.gainsAnimation > 0) {
            this.gainsAnimation -= deltaTime;
        }
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // Save context state
        ctx.save();
        
        // Draw HUD background
        this.drawBackground(ctx);
        
        // Draw HUD elements
        this.drawLives(ctx);
        this.drawScore(ctx);
        this.drawGAINSMeter(ctx);
        this.drawPowerState(ctx);
        this.drawWorldLevel(ctx);
        this.drawTimer(ctx);
        
        // Restore context state
        ctx.restore();
    }
    
    drawBackground(ctx) {
        // Semi-transparent background bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, 48);
        
        // Bottom border
        ctx.fillStyle = COLORS.PRIMARY;
        ctx.fillRect(0, 46, GAME_CONFIG.CANVAS_WIDTH, 2);
    }
    
    drawLives(ctx) {
        // Lives label
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '14px monospace';
        ctx.fillText('LIVES', 20, 20);
        
        // Heart icons
        const heartSprite = window.sprites.getSprite('heart');
        for (let i = 0; i < this.lives; i++) {
            const x = 20 + (i * 16);
            const y = 25;
            
            if (heartSprite) {
                ctx.drawImage(heartSprite.image, x, y, 12, 12);
            } else {
                // Fallback heart
                ctx.fillStyle = COLORS.ERROR;
                ctx.fillRect(x, y, 12, 12);
            }
        }
        
        // Life animation effect
        if (this.lifeAnimation > 0) {
            ctx.save();
            ctx.globalAlpha = this.lifeAnimation / 500;
            ctx.fillStyle = COLORS.SUCCESS;
            ctx.font = '16px monospace';
            ctx.fillText('+1 LIFE', 150, 35);
            ctx.restore();
        }
    }
    
    drawScore(ctx) {
        // Score
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '14px monospace';
        ctx.textAlign = 'right';
        
        const scoreText = `SCORE ${this.score.toString().padStart(8, '0')}`;
        ctx.fillText(scoreText, GAME_CONFIG.CANVAS_WIDTH - 20, 20);
        
        // Score animation effect
        if (this.scoreAnimation > 0) {
            ctx.save();
            ctx.globalAlpha = this.scoreAnimation / 300;
            ctx.fillStyle = COLORS.COIN_GOLD;
            ctx.font = '12px monospace';
            ctx.fillText('+100', GAME_CONFIG.CANVAS_WIDTH - 20, 35);
            ctx.restore();
        }
        
        ctx.textAlign = 'left'; // Reset
    }
    
    drawGAINSMeter(ctx) {
        const x = 250;
        const y = 8;
        const width = 120;
        const height = 12;
        
        // Label
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '12px monospace';
        ctx.fillText('GAINS', x, y);
        
        // Background
        ctx.fillStyle = COLORS.BLACK;
        ctx.fillRect(x, y + 2, width, height);
        
        // Fill based on gains points
        const fillWidth = (this.gainsPoints / 100) * (width - 2);
        ctx.fillStyle = COLORS.ACCENT;
        ctx.fillRect(x + 1, y + 3, fillWidth, height - 2);
        
        // Border
        ctx.strokeStyle = COLORS.WHITE;
        ctx.strokeRect(x, y + 2, width, height);
        
        // Threshold markers
        for (let i = 1; i < 4; i++) {
            const markerX = x + (i * width / 4);
            ctx.strokeStyle = COLORS.WHITE;
            ctx.beginPath();
            ctx.moveTo(markerX, y + 2);
            ctx.lineTo(markerX, y + height + 2);
            ctx.stroke();
        }
        
        // Animation effect
        if (this.gainsAnimation > 0) {
            ctx.save();
            ctx.globalAlpha = this.gainsAnimation / 400;
            ctx.fillStyle = COLORS.SUCCESS;
            ctx.font = '12px monospace';
            ctx.fillText('GAINS!', x + width + 10, y + 10);
            ctx.restore();
        }
    }
    
    drawPowerState(ctx) {
        const x = 450;
        const y = 8;
        
        // Power state indicator
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '12px monospace';
        ctx.fillText('POWER', x, y);
        
        // Power icon based on state
        const iconX = x;
        const iconY = y + 4;
        
        switch (this.powerState) {
            case POWER_STATES.SMALL:
                ctx.fillStyle = COLORS.ACCENT;
                ctx.fillRect(iconX, iconY, 16, 16);
                ctx.fillStyle = COLORS.WHITE;
                ctx.font = '10px monospace';
                ctx.fillText('S', iconX + 6, iconY + 12);
                break;
                
            case POWER_STATES.PUMP:
                ctx.fillStyle = COLORS.PRIMARY;
                ctx.fillRect(iconX, iconY, 20, 20);
                ctx.fillStyle = COLORS.WHITE;
                ctx.font = '10px monospace';
                ctx.fillText('P', iconX + 8, iconY + 14);
                break;
                
            case POWER_STATES.BEAST:
                ctx.fillStyle = COLORS.ERROR;
                ctx.fillRect(iconX, iconY, 24, 20);
                ctx.fillStyle = COLORS.WHITE;
                ctx.font = '10px monospace';
                ctx.fillText('B', iconX + 10, iconY + 14);
                break;
        }
    }
    
    drawWorldLevel(ctx) {
        const x = 550;
        const y = 20;
        
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '14px monospace';
        ctx.fillText(`WORLD ${this.world}-${this.level}`, x, y);
    }
    
    drawTimer(ctx) {
        if (this.time <= 0) return;
        
        const x = 550;
        const y = 35;
        
        const minutes = Math.floor(this.time / 60);
        const seconds = Math.floor(this.time % 60);
        const timeText = `TIME ${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Color based on remaining time
        if (this.time < 60) {
            ctx.fillStyle = COLORS.ERROR; // Red when low
        } else if (this.time < 120) {
            ctx.fillStyle = COLORS.WARNING; // Yellow when medium
        } else {
            ctx.fillStyle = COLORS.WHITE; // White when plenty
        }
        
        ctx.font = '12px monospace';
        ctx.fillText(timeText, x, y);
    }
    
    // Animation triggers
    animateScoreGain(points) {
        this.scoreAnimation = 300; // 0.3 seconds
    }
    
    animateLifeGain() {
        this.lifeAnimation = 500; // 0.5 seconds
    }
    
    animateGAINS() {
        this.gainsAnimation = 400; // 0.4 seconds
    }
    
    setWorldLevel(world, level) {
        this.world = world;
        this.level = level;
    }
    
    setTimer(seconds) {
        this.time = seconds;
    }
    
    show() {
        this.visible = true;
    }
    
    hide() {
        this.visible = false;
    }
    
    reset() {
        this.scoreAnimation = 0;
        this.lifeAnimation = 0;
        this.gainsAnimation = 0;
    }
}

// Pause Menu
class PauseMenu {
    constructor() {
        this.visible = false;
        this.selectedOption = 0;
        this.options = ['RESUME', 'RESTART', 'OPTIONS', 'QUIT'];
        this.onSelect = null; // Callback function
    }
    
    show() {
        this.visible = true;
        this.selectedOption = 0;
    }
    
    hide() {
        this.visible = false;
    }
    
    handleInput(input) {
        if (!this.visible) return;
        
        if (input.isPressed('down')) {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
        } else if (input.isPressed('up')) {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
        } else if (input.isPressed('jump') || input.isPressed('start')) {
            if (this.onSelect) {
                this.onSelect(this.options[this.selectedOption]);
            }
        }
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);
        
        // Menu background
        const menuWidth = 300;
        const menuHeight = 200;
        const menuX = (GAME_CONFIG.CANVAS_WIDTH - menuWidth) / 2;
        const menuY = (GAME_CONFIG.CANVAS_HEIGHT - menuHeight) / 2;
        
        ctx.fillStyle = COLORS.GRAY_DARK;
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);
        
        ctx.strokeStyle = COLORS.WHITE;
        ctx.lineWidth = 2;
        ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);
        
        // Title
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', GAME_CONFIG.CANVAS_WIDTH / 2, menuY + 40);
        
        // Options
        ctx.font = '16px monospace';
        this.options.forEach((option, index) => {
            const y = menuY + 80 + (index * 30);
            
            if (index === this.selectedOption) {
                ctx.fillStyle = COLORS.ACCENT;
                ctx.fillRect(menuX + 50, y - 20, 200, 25);
                ctx.fillStyle = COLORS.BLACK;
            } else {
                ctx.fillStyle = COLORS.WHITE;
            }
            
            ctx.fillText(option, GAME_CONFIG.CANVAS_WIDTH / 2, y);
        });
        
        ctx.textAlign = 'left'; // Reset
    }
}

// Export to global scope
window.HUD = HUD;
window.PauseMenu = PauseMenu;