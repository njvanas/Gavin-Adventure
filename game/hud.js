(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const COLORS = window.COLORS;

    class HUD {
        constructor(ctx) {
            this.ctx = ctx;
        }

        draw(state) {
            const ctx = this.ctx;
            const hudTop = GAME_CONFIG.CANVAS_HEIGHT - GAME_CONFIG.HUD_HEIGHT;
            const w = GAME_CONFIG.CANVAS_WIDTH;
            const h = GAME_CONFIG.HUD_HEIGHT;
            ctx.save();

            const panel = ctx.createLinearGradient(0, hudTop, 0, hudTop + h);
            panel.addColorStop(0, 'rgba(15,23,42,0.97)');
            panel.addColorStop(1, 'rgba(30,41,59,0.98)');
            ctx.fillStyle = panel;
            ctx.fillRect(0, hudTop, w, h);

            ctx.strokeStyle = 'rgba(249,115,22,0.45)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, hudTop + 0.5);
            ctx.lineTo(w, hudTop + 0.5);
            ctx.stroke();

            const y = hudTop + h / 2;
            ctx.textBaseline = 'middle';

            ctx.shadowColor = 'rgba(0,0,0,0.45)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetY = 1;
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = 'bold 22px system-ui,Segoe UI,sans-serif';
            ctx.fillText(`GAINS ${state.gains}`, 20, y);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;

            const meterW = 188;
            const meterH = 14;
            const mx = 140;
            const my = y - meterH / 2;
            const track = ctx.createLinearGradient(mx, my, mx + meterW, my + meterH);
            track.addColorStop(0, 'rgba(255,255,255,0.12)');
            track.addColorStop(1, 'rgba(255,255,255,0.04)');
            ctx.fillStyle = track;
            roundRectPath(ctx, mx, my, meterW, meterH, 6);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.28)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const fill = Math.min(1, state.gains / 5000);
            const fillG = ctx.createLinearGradient(mx, my, mx + meterW * fill, my + meterH);
            fillG.addColorStop(0, '#fb923c');
            fillG.addColorStop(0.5, COLORS.ACCENT);
            fillG.addColorStop(1, '#ea580c');
            ctx.fillStyle = fillG;
            roundRectPath(ctx, mx + 1, my + 1, (meterW - 2) * fill, meterH - 2, 5);
            ctx.fill();

            ctx.fillStyle = COLORS.WHITE;
            ctx.font = 'bold 22px system-ui,Segoe UI,sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`W${state.world + 1}-${state.stage + 1}`, w - 78, y);

            ctx.font = '22px system-ui,sans-serif';
            ctx.fillStyle = '#fecaca';
            ctx.fillText('♥', w - 56, y);
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = 'bold 22px system-ui,sans-serif';
            ctx.fillText(`${state.lives}`, w - 20, y);
            ctx.textAlign = 'left';

            if (state.title) {
                ctx.font = '14px system-ui,Segoe UI,sans-serif';
                ctx.fillStyle = 'rgba(255,255,255,0.72)';
                ctx.fillText(state.title, 360, y);
            }
            ctx.restore();
        }
    }

    function roundRectPath(ctx, x, y, w, h, r) {
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
    }

    window.HUD = HUD;
})();
