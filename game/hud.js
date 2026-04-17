// HUD — SMB-style status bar (no overlapping columns)
class HUD {
    constructor() {
        this.visible = true;
        this.lives = 3;
        this.score = 0;
        this.gainsPoints = 0;
        this.world = 1;
        this.level = 1;
        this.levelTitle = '';
        this.time = 400;
        this.powerState = POWER_STATES.SMALL;

        this.scoreAnimation = 0;
        this.lifeAnimation = 0;
        this.gainsAnimation = 0;
    }

    update(deltaTime, player) {
        if (!player) return;

        this.lives = player.lives;
        this.score = player.score;
        this.gainsPoints = player.gainsPoints;
        this.powerState = player.powerState;

        this.updateAnimations(deltaTime);

        if (this.time > 0) {
            this.time -= deltaTime / 1000;
            this.time = Math.max(0, this.time);
        }
    }

    updateAnimations(deltaTime) {
        if (this.scoreAnimation > 0) this.scoreAnimation -= deltaTime;
        if (this.lifeAnimation > 0) this.lifeAnimation -= deltaTime;
        if (this.gainsAnimation > 0) this.gainsAnimation -= deltaTime;
    }

    render(ctx) {
        if (!this.visible) return;

        const W = GAME_CONFIG.CANVAS_WIDTH;
        const H = GAME_CONFIG.HUD_HEIGHT || 56;

        ctx.save();
        this.drawBackground(ctx, W, H);

        ctx.textBaseline = 'alphabetic';

        this.drawScoreBlock(ctx, W, H);
        this.drawLives(ctx, W, H);
        this.drawGAINSMeter(ctx, W, H);
        this.drawPowerState(ctx, W, H);
        this.drawWorldAndTime(ctx, W, H);
        this.drawLevelSubtitle(ctx, W, H);

        ctx.restore();
    }

    drawBackground(ctx, W, H) {
        const grd = ctx.createLinearGradient(0, 0, 0, H);
        grd.addColorStop(0, '#0f172a');
        grd.addColorStop(1, '#020617');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.fillRect(0, H - 1, W, 1);
    }

    drawScoreBlock(ctx, W, H) {
        ctx.fillStyle = COLORS.WHITE;
        ctx.font = 'bold 13px "Segoe UI", ui-sans-serif, system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('SCORE', 14, 18);
        ctx.font = '15px "Consolas", "Courier New", monospace';
        ctx.fillText(this.score.toString().padStart(8, '0'), 14, 36);
    }

    drawLives(ctx, W, H) {
        ctx.fillStyle = '#fca5a5';
        ctx.font = '11px "Segoe UI", sans-serif';
        ctx.fillText('LIVES', 130, 18);
        const heartSprite = window.sprites.getSprite('heart');
        for (let i = 0; i < this.lives; i++) {
            const x = 130 + i * 18;
            const y = 22;
            if (heartSprite) {
                ctx.drawImage(heartSprite.image, x, y, 14, 14);
            } else {
                ctx.fillStyle = COLORS.ERROR;
                ctx.fillRect(x, y, 12, 12);
            }
        }
        if (this.lifeAnimation > 0) {
            ctx.save();
            ctx.globalAlpha = this.lifeAnimation / 500;
            ctx.fillStyle = COLORS.SUCCESS;
            ctx.font = '12px monospace';
            ctx.fillText('+1', 200, 34);
            ctx.restore();
        }
    }

    drawGAINSMeter(ctx, W, H) {
        const x = 268;
        const y = 22;
        const width = 100;
        const barH = 10;

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('GAINS', x, 18);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(x, y, width, barH);
        const fillW = Math.min(1, this.gainsPoints / 100) * (width - 2);
        ctx.fillStyle = COLORS.ACCENT;
        ctx.fillRect(x + 1, y + 1, fillW, barH - 2);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(x, y, width, barH);
    }

    drawPowerState(ctx, W, H) {
        const x = 392;
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '10px sans-serif';
        ctx.fillText('POWER', x, 18);
        const iconY = 22;
        ctx.font = 'bold 11px monospace';
        switch (this.powerState) {
            case POWER_STATES.SMALL:
                ctx.fillStyle = '#fb923c';
                ctx.fillRect(x, iconY, 18, 14);
                ctx.fillStyle = '#0f172a';
                ctx.fillText('S', x + 5, iconY + 11);
                break;
            case POWER_STATES.PUMP:
                ctx.fillStyle = COLORS.PRIMARY;
                ctx.fillRect(x, iconY, 18, 14);
                ctx.fillStyle = '#fff';
                ctx.fillText('P', x + 5, iconY + 11);
                break;
            case POWER_STATES.BEAST:
                ctx.fillStyle = COLORS.ERROR;
                ctx.fillRect(x, iconY, 22, 14);
                ctx.fillStyle = '#fff';
                ctx.fillText('B', x + 7, iconY + 11);
                break;
        }
    }

    drawWorldAndTime(ctx, W, H) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Consolas", monospace';
        ctx.fillText(`WORLD  ${this.world}-${this.level}`, W / 2, 24);

        const timeDisp = Math.max(0, Math.ceil(this.time));
        const minutes = Math.floor(timeDisp / 60);
        const seconds = timeDisp % 60;
        ctx.textAlign = 'right';
        if (timeDisp <= 0) {
            ctx.fillStyle = COLORS.ERROR;
        } else if (timeDisp < 100) {
            ctx.fillStyle = COLORS.WARNING;
        } else {
            ctx.fillStyle = '#f8fafc';
        }
        ctx.font = '14px "Consolas", monospace';
        ctx.fillText(`TIME ${minutes}:${seconds.toString().padStart(2, '0')}`, W - 14, 24);
        ctx.textAlign = 'left';
    }

    drawLevelSubtitle(ctx, W, H) {
        if (!this.levelTitle) return;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        const t = this.levelTitle.length > 42 ? this.levelTitle.slice(0, 40) + '…' : this.levelTitle;
        ctx.fillText(t, W / 2, 46);
        ctx.textAlign = 'left';
    }

    animateScoreGain(points) {
        this.scoreAnimation = 300;
    }

    animateLifeGain() {
        this.lifeAnimation = 500;
    }

    animateGAINS() {
        this.gainsAnimation = 400;
    }

    setWorldLevel(world, level) {
        this.world = world;
        this.level = level;
    }

    setLevelTitle(title) {
        this.levelTitle = title || '';
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

class PauseMenu {
    constructor() {
        this.visible = false;
        this.selectedOption = 0;
        this.options = ['RESUME', 'RESTART', 'OPTIONS', 'QUIT'];
        this.onSelect = null;
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

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, GAME_CONFIG.CANVAS_HEIGHT);

        const menuWidth = 300;
        const menuHeight = 200;
        const menuX = (GAME_CONFIG.CANVAS_WIDTH - menuWidth) / 2;
        const menuY = (GAME_CONFIG.CANVAS_HEIGHT - menuHeight) / 2;

        ctx.fillStyle = COLORS.GRAY_DARK;
        ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

        ctx.strokeStyle = COLORS.WHITE;
        ctx.lineWidth = 2;
        ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

        ctx.fillStyle = COLORS.WHITE;
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', GAME_CONFIG.CANVAS_WIDTH / 2, menuY + 40);

        ctx.font = '16px monospace';
        this.options.forEach((option, index) => {
            const y = menuY + 80 + index * 30;

            if (index === this.selectedOption) {
                ctx.fillStyle = COLORS.ACCENT;
                ctx.fillRect(menuX + 50, y - 20, 200, 25);
                ctx.fillStyle = COLORS.BLACK;
            } else {
                ctx.fillStyle = COLORS.WHITE;
            }

            ctx.fillText(option, GAME_CONFIG.CANVAS_WIDTH / 2, y);
        });

        ctx.textAlign = 'left';
    }
}

window.HUD = HUD;
window.PauseMenu = PauseMenu;
