(function () {
    const TILES = window.TILES;
    const GAME_CONFIG = window.GAME_CONFIG;
    const Sprites = window.Sprites;

    class Renderer {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            if (this.ctx.imageSmoothingEnabled !== undefined) {
                this.ctx.imageSmoothingEnabled = true;
            }
            if (this.ctx.imageSmoothingQuality !== undefined) {
                this.ctx.imageSmoothingQuality = 'high';
            }
            this.camera = { x: 0, y: 0 };
        }

        setCamera(x, y, levelWidthPx, levelHeightPx) {
            const vw = GAME_CONFIG.CANVAS_WIDTH;
            const vh = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.HUD_HEIGHT;
            let cx = x - vw / 2;
            let cy = y - vh / 2;
            cx = Math.max(0, Math.min(cx, Math.max(0, levelWidthPx - vw)));
            cy = Math.max(0, Math.min(cy, Math.max(0, levelHeightPx - vh)));
            this.camera.x = cx;
            this.camera.y = cy;
        }

        /**
         * Legacy solid sky fill — prefer Sprites.drawBackgroundLayers in scenes for parallax.
         */
        clear(skyTop, skyBot) {
            const h = GAME_CONFIG.CANVAS_HEIGHT;
            const g = this.ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, skyTop || '#5b9cff');
            g.addColorStop(1, skyBot || '#87ceeb');
            this.ctx.fillStyle = g;
            this.ctx.fillRect(0, 0, GAME_CONFIG.CANVAS_WIDTH, h);
        }

        drawLevel(level, theme) {
            const ctx = this.ctx;
            const ts = GAME_CONFIG.TILE_SIZE;
            const cam = this.camera;
            const vw = GAME_CONFIG.CANVAS_WIDTH;
            const vh = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.HUD_HEIGHT;

            const startX = Math.floor(cam.x / ts);
            const endX = Math.ceil((cam.x + vw) / ts) + 1;
            const startY = Math.floor(cam.y / ts);
            const endY = Math.ceil((cam.y + vh) / ts) + 1;

            for (let ty = startY; ty < endY; ty++) {
                for (let tx = startX; tx < endX; tx++) {
                    const tile = level.getTile(tx, ty);
                    if (tile === TILES.AIR) continue;
                    const sx = tx * ts - cam.x;
                    const sy = ty * ts - cam.y;

                    let exposedTop = false;
                    if (tile === TILES.SOLID || tile === TILES.BREAKABLE) {
                        const above = ty > 0 ? level.getTile(tx, ty - 1) : TILES.AIR;
                        exposedTop = above === TILES.AIR;
                    }

                    Sprites.drawTile(ctx, tile, sx, sy, ts, theme, { exposedTop });
                }
            }
        }

        worldToScreen(wx, wy) {
            return { x: wx - this.camera.x, y: wy - this.camera.y };
        }
    }

    window.Renderer = Renderer;
})();
