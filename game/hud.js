(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const COLORS = window.COLORS;

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
            panel.addColorStop(0, 'rgba(15,23,42,0.88)');
            panel.addColorStop(0.5, 'rgba(30,41,59,0.92)');
            panel.addColorStop(1, 'rgba(15,23,42,0.95)');
            ctx.fillStyle = panel;
            ctx.fillRect(0, hudTop, w, h);

            const glass = ctx.createLinearGradient(0, hudTop, 0, hudTop + h);
            glass.addColorStop(0, 'rgba(255,255,255,0.08)');
            glass.addColorStop(0.5, 'rgba(255,255,255,0.02)');
            glass.addColorStop(1, 'rgba(0,0,0,0.15)');
            ctx.fillStyle = glass;
            ctx.fillRect(0, hudTop, w, h);

            ctx.strokeStyle = 'rgba(249,115,22,0.55)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, hudTop + 0.5);
            ctx.lineTo(w, hudTop + 0.5);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, hudTop + 2);
            ctx.lineTo(w, hudTop + 2);
            ctx.stroke();

            const y = hudTop + h / 2;
            ctx.textBaseline = 'middle';

            const gainsLabel = ctx.createLinearGradient(18, y - 12, 140, y + 12);
            gainsLabel.addColorStop(0, '#fdba74');
            gainsLabel.addColorStop(1, '#fff7ed');
            ctx.font = 'bold 24px system-ui,Segoe UI,sans-serif';
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 8;
            ctx.fillStyle = gainsLabel;
            ctx.fillText('GAINS', 22, y);
            ctx.shadowBlur = 0;

            ctx.fillStyle = COLORS.WHITE;
            ctx.font = 'bold 24px system-ui,Segoe UI,sans-serif';
            ctx.fillText(String(state.gains), 108, y);

            const meterW = 200;
            const meterH = 16;
            const mx = 168;
            const my = y - meterH / 2;

            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            roundRectPath(ctx, mx - 1, my - 1, meterW + 2, meterH + 2, 9);
            ctx.fill();

            const track = ctx.createLinearGradient(mx, my, mx + meterW, my + meterH);
            track.addColorStop(0, 'rgba(255,255,255,0.1)');
            track.addColorStop(1, 'rgba(255,255,255,0.03)');
            ctx.fillStyle = track;
            roundRectPath(ctx, mx, my, meterW, meterH, 8);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.22)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const fill = Math.min(1, state.gains / 5000);
            const fillG = ctx.createLinearGradient(mx, my, mx + meterW * fill, my + meterH);
            fillG.addColorStop(0, '#fb923c');
            fillG.addColorStop(0.45, COLORS.ACCENT);
            fillG.addColorStop(1, '#c2410c');
            ctx.fillStyle = fillG;
            roundRectPath(ctx, mx + 2, my + 2, (meterW - 4) * fill, meterH - 4, 6);
            ctx.fill();

            ctx.fillStyle = 'rgba(255,255,255,0.35)';
            roundRectPath(ctx, mx + 3, my + 3, (meterW - 6) * fill, (meterH - 6) * 0.35, 4);
            ctx.fill();

            ctx.shadowColor = 'rgba(0,0,0,0.45)';
            ctx.shadowBlur = 4;
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = 'bold 22px system-ui,Segoe UI,sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(`W${state.world + 1}-${state.stage + 1}`, w - 96, y);

            ctx.font = '24px system-ui,sans-serif';
            ctx.fillStyle = '#fecaca';
            ctx.fillText('♥', w - 68, y);
            ctx.fillStyle = COLORS.WHITE;
            ctx.font = 'bold 22px system-ui,sans-serif';
            ctx.fillText(`${state.lives}`, w - 22, y);
            ctx.textAlign = 'left';

            if (state.title) {
                ctx.shadowBlur = 0;
                ctx.font = '15px system-ui,Segoe UI,sans-serif';
                ctx.fillStyle = 'rgba(226,232,240,0.82)';
                ctx.fillText(state.title, 400, y);
            }
            ctx.restore();
        }
    }

    window.HUD = HUD;
})();
