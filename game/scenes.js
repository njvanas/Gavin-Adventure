(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const POWER_STATES = window.POWER_STATES;
    const Renderer = window.Renderer;
    const ParticleSystem = window.ParticleSystem;
    const HUD = window.HUD;
    const Player = window.Player;
    const Enemies = window.Enemies;
    const Collectibles = window.Collectibles;
    const Campaign = window.Campaign;
    const Sprites = window.Sprites;
    const GameSave = window.GameSave;

    class MenuScene {
        constructor(engine, input, onStart) {
            this.engine = engine;
            this.canvas = engine.canvas;
            this.ctx = this.canvas.getContext('2d');
            this.input = input;
            this.onStart = onStart;
            this.hasSave = !!GameSave.load();
        }

        enter() {
            this.input.enabled = true;
        }

        update() {
            if (this.input.isPressed('confirm') || this.input.isPressed('jump')) {
                this.onStart({ resume: this.hasSave && this.input.isDown('run') });
            }
        }

        render() {
            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;
            Sprites.drawMenuBackdrop(ctx, w, h, performance.now());

            ctx.textAlign = 'center';
            const titleY = h * 0.28;
            const tg = ctx.createLinearGradient(w * 0.2, titleY - 24, w * 0.8, titleY + 8);
            tg.addColorStop(0, '#fdba74');
            tg.addColorStop(0.5, '#fff7ed');
            tg.addColorStop(1, '#f97316');
            ctx.font = 'bold 44px system-ui,Segoe UI,sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.55)';
            ctx.shadowBlur = 12;
            ctx.fillStyle = tg;
            ctx.fillText('Gavin Adventure', w / 2, titleY);
            ctx.shadowBlur = 0;

            ctx.font = '20px system-ui,Segoe UI,sans-serif';
            ctx.fillStyle = 'rgba(226,232,240,0.92)';
            ctx.fillText('Bodybuilder platformer — chase gains, crush the Shredder', w / 2, h * 0.38);

            ctx.fillStyle = '#fb923c';
            ctx.font = '22px system-ui,Segoe UI,sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.35)';
            ctx.shadowBlur = 4;
            ctx.fillText('ENTER / SPACE — Start   |   SHIFT+ENTER — Continue', w / 2, h * 0.55);
            ctx.shadowBlur = 0;
            if (this.hasSave) {
                ctx.fillStyle = '#38bdf8';
                ctx.font = '16px system-ui,Segoe UI,sans-serif';
                ctx.fillText('Saved progress found. Hold Shift and press Enter to continue.', w / 2, h * 0.62);
            }
            ctx.textAlign = 'left';
            this.input.clearJustPressed();
        }
    }

    class GameScene {
        constructor(engine, input, options) {
            this.engine = engine;
            this.canvas = engine.canvas;
            this.ctx = this.canvas.getContext('2d');
            this.input = input;
            this.resume = options && options.resume;
            this.saved = GameSave.load();
            this.world = this.resume && this.saved ? this.saved.world | 0 : 0;
            this.stage = this.resume && this.saved ? this.saved.stage | 0 : 0;
            this.gains = this.resume && this.saved ? this.saved.gains | 0 : 0;
            this.lives = 3;
            this.particles = new ParticleSystem();
            this.renderer = new Renderer(this.canvas);
            this.hud = new HUD(this.ctx);
            this.levelCompleteTimer = 0;
            this.gameOverTimer = 0;
            this._loadLevel();
        }

        _loadLevel() {
            this.level = Campaign.getLevelFor(this.world, this.stage);
            const ps = this.saved && this.saved.powerState != null ? this.saved.powerState : POWER_STATES.SMALL;
            this.player = Player.createPlayer(this.level.spawn.x, this.level.spawn.y, ps);
            this.player.gains = this.gains;
            this.enemies = this.level.enemyDefs.map((d) => Enemies.createEnemy(d));
            this.collectibles = this.level.collectibleDefs.map((d) => Collectibles.createCollectible(d));
            this.levelCompleteTimer = 0;
            this.gameOverTimer = 0;
        }

        _advanceWorld() {
            const maxS = Campaign.totalStagesPerWorld() - 1;
            if (this.stage >= maxS) {
                this.stage = 0;
                this.world = Math.min(Campaign.totalWorlds() - 1, this.world + 1);
            } else {
                this.stage++;
            }
            this.gains = this.player.gains;
            GameSave.save({
                world: this.world,
                stage: this.stage,
                gains: this.gains,
                powerState: this.player.powerState
            });
            this._loadLevel();
            if (window.audio && window.audio.playSound) window.audio.playSound('level_complete');
        }

        enter() {
            this.input.enabled = true;
            if (window.audio && window.audio.resume) window.audio.resume();
        }

        update(deltaMs) {
            if (this.levelCompleteTimer > 0) {
                this.levelCompleteTimer -= deltaMs;
                if (this.levelCompleteTimer <= 0) this._advanceWorld();
                return;
            }
            if (this.gameOverTimer > 0) {
                this.gameOverTimer -= deltaMs;
                if (this.gameOverTimer <= 0) {
                    GameSave.clear();
                    this.engine.setScene(new MenuScene(this.engine, this.input, (o) => {
                        this.engine.setScene(new GameScene(this.engine, this.input, o));
                    }));
                }
                return;
            }

            if (this.input.isPressed('pause')) {
                /* placeholder: could toggle pause */
            }

            Player.updatePlayer(this.player, this.input, this.level, deltaMs);
            this.particles.update(deltaMs / 16.67);
            Enemies.updateEnemies(this.enemies, this.level, this.player, deltaMs, this.particles);
            Collectibles.checkCollectibles(this.player, this.collectibles, this.particles);
            Enemies.checkPlayerVsEnemies(this.player, this.enemies, this.particles);

            const pitY = this.level.heightPx + GAME_CONFIG.TILE_SIZE * 2;
            if (this.player.y > pitY) {
                this.player.alive = false;
            }

            if (!this.player.alive) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOverTimer = 2500;
                    if (window.audio && window.audio.playSound) window.audio.playSound('game_over');
                } else {
                    this.player = Player.createPlayer(this.level.spawn.x, this.level.spawn.y, POWER_STATES.SMALL);
                    this.player.gains = this.gains;
                }
            }

            const goalOk =
                this.level.isBoss
                    ? !this.enemies.some((e) => e.type === window.ENEMY_TYPES.BOSS_SHREDDER && e.alive)
                    : this.player.x + this.player.width >= this.level.goalX;

            if (goalOk && this.player.alive && this.levelCompleteTimer <= 0 && this.gameOverTimer <= 0) {
                this.levelCompleteTimer = 1800;
                this.gains = this.player.gains;
            }

            this.gains = this.player.gains;
            this.renderer.setCamera(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                this.level.widthPx,
                this.level.heightPx
            );

            this.input.clearJustPressed();
        }

        render() {
            const ctx = this.ctx;
            const timeMs = performance.now();
            const playH = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.HUD_HEIGHT;
            Sprites.drawBackgroundLayers(ctx, this.renderer.camera.x, this.canvas.width, playH, this.level.theme, timeMs);
            this.renderer.drawLevel(this.level, this.level.theme);

            const cam = this.renderer.camera;
            const ts = GAME_CONFIG.TILE_SIZE;

            const drawEntity = (fn, worldX, worldY, ...rest) => {
                const sx = worldX - cam.x;
                const sy = worldY - cam.y;
                fn(ctx, sx, sy, ...rest);
            };

            for (const c of this.collectibles) {
                if (c.taken) continue;
                drawEntity((cx, x, y) => Sprites.drawCollectible(cx, x, y, c.width, c.type, timeMs), c.x, c.y);
            }

            for (const e of this.enemies) {
                if (!e.alive) continue;
                drawEntity((cx, x, y) => Sprites.drawEnemy(cx, x, y, e.width, e.height, e.type, timeMs), e.x, e.y);
            }

            const px = this.player.x - cam.x;
            const py = this.player.y - cam.y;
            if (this.player.invuln > 0) {
                ctx.globalAlpha = Math.floor(performance.now() / 120) % 2 === 0 ? 0.42 : 1;
            }
            Sprites.drawPlayer(
                ctx,
                px,
                py,
                this.player.width,
                this.player.height,
                this.player.powerState,
                this.player.animationState,
                this.player.direction < 0 ? 1 : 0,
                timeMs
            );
            ctx.globalAlpha = 1;

            if (!this.level.isBoss) {
                const gx = this.level.goalX - cam.x;
                const gy = (this.level.height - 5) * ts - cam.y;
                Sprites.drawGoalFlag(ctx, gx, gy, ts * 5, timeMs);
            }

            this.particles.draw(ctx);

            this.hud.draw({
                gains: this.gains,
                world: this.world,
                stage: this.stage,
                lives: this.lives,
                title: this.level.title
            });

            const overlayTitle = Math.max(28, Math.round(this.canvas.width * 0.028));
            if (this.levelCompleteTimer > 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.55)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.fillStyle = '#fff';
                ctx.font = `bold ${overlayTitle}px system-ui,sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('Level clear — loading next stage…', this.canvas.width / 2, this.canvas.height * 0.45);
                ctx.textAlign = 'left';
            }
            if (this.gameOverTimer > 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.65)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                ctx.fillStyle = '#fca5a5';
                ctx.font = `bold ${overlayTitle + 4}px system-ui,sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height * 0.45);
                ctx.textAlign = 'left';
            }
        }
    }

    window.MenuScene = MenuScene;
    window.GameScene = GameScene;
})();
