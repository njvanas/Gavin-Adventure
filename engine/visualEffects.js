/**
 * Screen-space polish: vignette, color grade, soft bloom, film grain.
 * Complements canvas 2D art toward a cinematic / high-end 2D look.
 */
(function () {
    function fract(n) {
        return n - Math.floor(n);
    }

    function hash11(n) {
        return fract(Math.sin(n * 127.1) * 43758.5453);
    }

    function filmGrain(ctx, w, h, timeMs) {
        ctx.save();
        ctx.globalAlpha = 0.045;
        const base = (timeMs / 40) | 0;
        for (let i = 0; i < 1100; i++) {
            const u = hash11(base + i * 17.17);
            const v = hash11(base + i * 91.91);
            const px = (u * w) | 0;
            const py = (v * h) | 0;
            ctx.fillStyle = u > 0.5 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)';
            ctx.fillRect(px, py, 1, 1);
        }
        ctx.restore();
    }

    /**
     * Full-frame cinematic treatment (menu / title).
     */
    function applyMenuCinematic(ctx, w, h, timeMs) {
        const cx = w * 0.5;
        const cy = h * 0.42;
        const rg = ctx.createRadialGradient(cx, cy, Math.min(w, h) * 0.12, cx, cy, Math.max(w, h) * 0.58);
        rg.addColorStop(0, 'rgba(0,0,0,0)');
        rg.addColorStop(0.55, 'rgba(5,8,22,0.35)');
        rg.addColorStop(1, 'rgba(2,4,14,0.78)');
        ctx.save();
        ctx.fillStyle = rg;
        ctx.fillRect(0, 0, w, h);

        const lift = ctx.createLinearGradient(0, 0, w, h);
        lift.addColorStop(0, 'rgba(255,180,120,0.06)');
        lift.addColorStop(0.5, 'rgba(0,0,0,0)');
        lift.addColorStop(1, 'rgba(40,60,120,0.12)');
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = lift;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
        filmGrain(ctx, w, h, timeMs);
    }

    /**
     * Gameplay area only (above HUD): mood grade + vignette + subtle bloom + grain.
     */
    function applyGameplayCinematic(ctx, playW, playH, themeIndex, timeMs) {
        const t = (timeMs || 0) * 0.001;
        const cx = playW * 0.5;
        const cy = playH * 0.46;

        ctx.save();

        const vig = ctx.createRadialGradient(cx, cy, playH * 0.22, cx, cy, Math.max(playW, playH) * 0.62);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(0.5, 'rgba(4,6,16,0.14)');
        vig.addColorStop(1, 'rgba(1,3,10,0.38)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, playW, playH);

        const warm = ctx.createLinearGradient(playW, 0, 0, playH);
        warm.addColorStop(0, 'rgba(255,230,200,0.09)');
        warm.addColorStop(0.45, 'rgba(255,255,255,0)');
        warm.addColorStop(1, 'rgba(20,35,70,0.14)');
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = warm;
        ctx.fillRect(0, 0, playW, playH);
        ctx.globalCompositeOperation = 'source-over';

        const skyBloom = ctx.createLinearGradient(0, 0, 0, playH * 0.55);
        skyBloom.addColorStop(0, 'rgba(180,220,255,0.07)');
        skyBloom.addColorStop(0.35, 'rgba(255,255,255,0.02)');
        skyBloom.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = skyBloom;
        ctx.fillRect(0, 0, playW, playH * 0.55);
        ctx.globalCompositeOperation = 'source-over';

        const horizon = ctx.createLinearGradient(0, playH * 0.45, 0, playH * 0.92);
        horizon.addColorStop(0, 'rgba(0,0,0,0)');
        horizon.addColorStop(1, 'rgba(15,20,35,0.12)');
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = horizon;
        ctx.fillRect(0, playH * 0.45, playW, playH * 0.5);
        ctx.globalCompositeOperation = 'source-over';

        ctx.restore();

        filmGrain(ctx, playW, playH, timeMs + themeIndex * 17);
    }

    window.VisualEffects = {
        applyMenuCinematic,
        applyGameplayCinematic,
        filmGrain
    };
})();
