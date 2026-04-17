(function () {
    const TILES = window.TILES;
    const POWER_STATES = window.POWER_STATES;
    const ENEMY_TYPES = window.ENEMY_TYPES;
    const COLORS = window.COLORS;
    const COLLECTIBLE_TYPES = window.COLLECTIBLE_TYPES;

    /**
     * Per-world art direction: sky, parallax silhouettes, accents, ground.
     */
    const THEME_PALETTES = {
        0: {
            brick: '#7c4a21',
            brickHi: '#a1622a',
            brickLo: '#4a2f14',
            accent: '#f97316',
            sky1: '#38bdf8',
            sky2: '#bae6fd',
            skyHorizon: '#e0f2fe',
            sun: '#fde68a',
            haze: 'rgba(255,255,255,0.12)',
            parallax: ['rgba(30,58,95,0.35)', 'rgba(45,74,120,0.55)', 'rgba(25,52,88,0.75)'],
            grass: '#4ade80',
            grassDark: '#166534'
        },
        1: {
            brick: '#475569',
            brickHi: '#64748b',
            brickLo: '#334155',
            accent: '#22d3ee',
            sky1: '#0c4a6e',
            sky2: '#0369a1',
            skyHorizon: '#1e3a5f',
            sun: '#94a3b8',
            haze: 'rgba(56,189,248,0.08)',
            parallax: ['rgba(15,23,42,0.4)', 'rgba(30,41,59,0.65)', 'rgba(15,23,42,0.85)'],
            grass: '#64748b',
            grassDark: '#1e293b'
        },
        2: {
            brick: '#57534e',
            brickHi: '#78716c',
            brickLo: '#44403c',
            accent: '#a78bfa',
            sky1: '#312e81',
            sky2: '#4c1d95',
            skyHorizon: '#6d28d9',
            sun: '#c4b5fd',
            haze: 'rgba(167,139,250,0.1)',
            parallax: ['rgba(49,46,129,0.35)', 'rgba(67,56,202,0.55)', 'rgba(30,27,75,0.8)'],
            grass: '#86efac',
            grassDark: '#14532d'
        },
        3: {
            brick: '#0369a1',
            brickHi: '#0ea5e9',
            brickLo: '#075985',
            accent: '#fcd34d',
            sky1: '#0284c7',
            sky2: '#7dd3fc',
            skyHorizon: '#e0f2fe',
            sun: '#fef9c3',
            haze: 'rgba(255,255,255,0.15)',
            parallax: ['rgba(12,74,110,0.35)', 'rgba(14,116,144,0.6)', 'rgba(8,47,73,0.82)'],
            grass: '#34d399',
            grassDark: '#047857'
        },
        4: {
            brick: '#57534e',
            brickHi: '#78716c',
            brickLo: '#292524',
            accent: '#f59e0b',
            sky1: '#1c1917',
            sky2: '#44403c',
            skyHorizon: '#57534e',
            sun: '#fdba74',
            haze: 'rgba(251,191,36,0.06)',
            parallax: ['rgba(41,37,36,0.45)', 'rgba(68,64,60,0.7)', 'rgba(28,25,23,0.9)'],
            grass: '#a8a29e',
            grassDark: '#44403c'
        },
        5: {
            brick: '#831843',
            brickHi: '#be185d',
            brickLo: '#500724',
            accent: '#f472b6',
            sky1: '#1e1b4b',
            sky2: '#5b21b6',
            skyHorizon: '#7c3aed',
            sun: '#f0abfc',
            haze: 'rgba(192,132,252,0.12)',
            parallax: ['rgba(76,29,149,0.4)', 'rgba(91,33,182,0.65)', 'rgba(49,46,129,0.85)'],
            grass: '#4ade80',
            grassDark: '#14532d'
        },
        6: {
            brick: '#cbd5e1',
            brickHi: '#f1f5f9',
            brickLo: '#94a3b8',
            accent: '#0ea5e9',
            sky1: '#7dd3fc',
            sky2: '#f0f9ff',
            skyHorizon: '#ffffff',
            sun: '#fffbeb',
            haze: 'rgba(255,255,255,0.35)',
            parallax: ['rgba(148,163,184,0.35)', 'rgba(100,116,139,0.5)', 'rgba(71,85,105,0.65)'],
            grass: '#22c55e',
            grassDark: '#166534'
        },
        7: {
            brick: '#9a3412',
            brickHi: '#c2410c',
            brickLo: '#7c2d12',
            accent: '#fcd34d',
            sky1: '#7c2d12',
            sky2: '#ea580c',
            skyHorizon: '#fdba74',
            sun: '#fef08a',
            haze: 'rgba(254,215,170,0.15)',
            parallax: ['rgba(124,45,18,0.4)', 'rgba(154,52,18,0.65)', 'rgba(67,20,7,0.88)'],
            grass: '#84cc16',
            grassDark: '#3f6212'
        }
    };

    function pal(themeIndex) {
        return THEME_PALETTES[themeIndex % 8] || THEME_PALETTES[0];
    }

    function roundRect(ctx, x, y, w, h, r) {
        const rr = Math.min(r, w / 2, h / 2);
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
    }

    function brickPattern(ctx, x, y, size, base, hi, lo, seed) {
        ctx.save();
        const g = ctx.createLinearGradient(x, y, x + size, y + size);
        g.addColorStop(0, hi);
        g.addColorStop(0.45, base);
        g.addColorStop(1, lo);
        ctx.fillStyle = g;
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = 'rgba(0,0,0,0.22)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);
        const mortar = Math.max(1, Math.floor(size / 16));
        ctx.strokeStyle = 'rgba(0,0,0,0.18)';
        for (let i = 1; i < 4; i++) {
            const o = (i * size) / 4 + ((seed + i * 13) % 3) - 1;
            ctx.beginPath();
            ctx.moveTo(x, y + o);
            ctx.lineTo(x + size, y + o);
            ctx.stroke();
        }
        const hl = ctx.createLinearGradient(x, y, x + size * 0.4, y + size * 0.4);
        hl.addColorStop(0, 'rgba(255,255,255,0.2)');
        hl.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hl;
        ctx.fillRect(x + 1, y + 1, size * 0.5, size * 0.38);
        const ao = ctx.createLinearGradient(x, y + size * 0.35, x, y + size);
        ao.addColorStop(0, 'rgba(0,0,0,0)');
        ao.addColorStop(1, 'rgba(0,0,0,0.28)');
        ctx.fillStyle = ao;
        ctx.fillRect(x, y + size * 0.35, size, size * 0.65);
        const topRim = ctx.createLinearGradient(x, y, x, y + size * 0.12);
        topRim.addColorStop(0, 'rgba(255,255,255,0.12)');
        topRim.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = topRim;
        ctx.fillRect(x + 1, y + 1, size - 2, size * 0.1);
        ctx.restore();
    }

    function drawGrassCap(ctx, x, y, size, themeIndex) {
        const p = pal(themeIndex);
        ctx.save();
        const gy = y - size * 0.15;
        const g = ctx.createLinearGradient(x, gy, x, y + size * 0.35);
        g.addColorStop(0, p.grass);
        g.addColorStop(1, p.grassDark);
        ctx.fillStyle = g;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const px = x + (i / 4) * size;
            const sp = Math.sin(i * 1.7 + x * 0.1) * size * 0.06;
            ctx.lineTo(px, gy + sp);
        }
        ctx.lineTo(x + size, y + size * 0.28);
        ctx.lineTo(x, y + size * 0.28);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    /**
     * @param {object} [opts] — exposedTop: grass on solid tops; variant: tile hash for variety
     */
    function drawTile(ctx, tile, x, y, size, themeIndex, opts) {
        const p = pal(themeIndex);
        const o = opts || {};
        const seed = (Math.floor(x * 0.1) ^ Math.floor(y * 0.1)) & 255;

        ctx.save();
        switch (tile) {
            case TILES.SOLID:
                brickPattern(ctx, x, y, size, p.brick, p.brickHi, p.brickLo, seed);
                if (o.exposedTop) drawGrassCap(ctx, x, y, size, themeIndex);
                break;
            case TILES.PLATFORM: {
                const wood = ctx.createLinearGradient(x, y, x, y + size);
                wood.addColorStop(0, '#d97706');
                wood.addColorStop(0.35, '#b45309');
                wood.addColorStop(1, '#78350f');
                ctx.fillStyle = wood;
                roundRect(ctx, x, y + size * 0.32, size, size * 0.68, size * 0.08);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.25)';
                ctx.lineWidth = 1;
                ctx.stroke();
                const top = ctx.createLinearGradient(x, y, x, y + size * 0.38);
                top.addColorStop(0, '#fbbf24');
                top.addColorStop(1, '#d97706');
                ctx.fillStyle = top;
                roundRect(ctx, x, y, size, size * 0.38, size * 0.06);
                ctx.fill();
                ctx.fillStyle = 'rgba(0,0,0,0.12)';
                ctx.fillRect(x + size * 0.08, y + size * 0.1, size * 0.84, size * 0.06);
                break;
            }
            case TILES.BREAKABLE: {
                const g = ctx.createRadialGradient(x + size * 0.3, y + size * 0.3, 2, x + size * 0.5, y + size * 0.5, size * 0.8);
                g.addColorStop(0, '#fde68a');
                g.addColorStop(0.55, '#ca8a04');
                g.addColorStop(1, '#713f12');
                ctx.fillStyle = g;
                roundRect(ctx, x + 0.5, y + 0.5, size - 1, size - 1, size * 0.12);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
                ctx.fillRect(x + size * 0.15, y + size * 0.15, size * 0.35, size * 0.12);
                break;
            }
            case TILES.STRONG_PLATE: {
                const m = ctx.createLinearGradient(x, y, x + size, y + size);
                m.addColorStop(0, '#cbd5e1');
                m.addColorStop(0.5, '#64748b');
                m.addColorStop(1, '#1e293b');
                ctx.fillStyle = m;
                roundRect(ctx, x, y, size, size, size * 0.1);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.4)';
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.strokeStyle = 'rgba(255,255,255,0.35)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + size * 0.2, y + size * 0.25);
                ctx.lineTo(x + size * 0.8, y + size * 0.75);
                ctx.moveTo(x + size * 0.8, y + size * 0.25);
                ctx.lineTo(x + size * 0.2, y + size * 0.75);
                ctx.stroke();
                break;
            }
            case TILES.INVISIBLE_BLOCK: {
                ctx.fillStyle = 'rgba(255,255,255,0.12)';
                roundRect(ctx, x, y, size, size, size * 0.12);
                ctx.fill();
                const gl = ctx.createLinearGradient(x, y, x + size, y + size);
                gl.addColorStop(0, 'rgba(255,255,255,0.45)');
                gl.addColorStop(0.5, 'rgba(255,255,255,0.08)');
                gl.addColorStop(1, 'rgba(255,255,255,0.25)');
                ctx.strokeStyle = gl;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                break;
            }
            case TILES.SPIKES: {
                const base = ctx.createLinearGradient(x, y + size * 0.4, x, y + size);
                base.addColorStop(0, '#94a3b8');
                base.addColorStop(1, '#334155');
                ctx.fillStyle = base;
                ctx.beginPath();
                const spikes = 4;
                for (let i = 0; i < spikes; i++) {
                    const sx = x + (i / spikes) * size;
                    const mx = sx + size / spikes / 2;
                    ctx.moveTo(sx, y + size);
                    ctx.lineTo(mx, y + size * 0.08);
                    ctx.lineTo(sx + size / spikes, y + size);
                }
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                ctx.lineWidth = 1;
                ctx.stroke();
                const shine = ctx.createLinearGradient(x, y, x + size, y);
                shine.addColorStop(0, 'rgba(255,255,255,0.35)');
                shine.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = shine;
                ctx.beginPath();
                ctx.moveTo(x + size * 0.2, y + size * 0.35);
                ctx.lineTo(x + size * 0.5, y + size * 0.1);
                ctx.lineTo(x + size * 0.8, y + size * 0.35);
                ctx.lineTo(x + size * 0.65, y + size * 0.45);
                ctx.lineTo(x + size * 0.35, y + size * 0.45);
                ctx.closePath();
                ctx.fill();
                break;
            }
            case TILES.CHECKPOINT: {
                const pole = ctx.createLinearGradient(x + size * 0.38, y, x + size * 0.42 + size * 0.24, y);
                pole.addColorStop(0, '#64748b');
                pole.addColorStop(1, '#1e293b');
                ctx.fillStyle = pole;
                ctx.fillRect(x + size * 0.38, y, size * 0.24, size);
                const banner = ctx.createLinearGradient(x, y, x + size, y + size * 0.5);
                banner.addColorStop(0, p.accent);
                banner.addColorStop(1, '#ea580c');
                ctx.fillStyle = banner;
                ctx.beginPath();
                ctx.moveTo(x + size * 0.62, y + size * 0.12);
                ctx.lineTo(x + size * 0.98, y + size * 0.22);
                ctx.lineTo(x + size * 0.62, y + size * 0.38);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.font = `bold ${Math.max(8, size * 0.28)}px system-ui,sans-serif`;
                ctx.fillText('PR', x + size * 0.68, y + size * 0.3);
                break;
            }
            case TILES.WARP_PIPE: {
                const body = ctx.createLinearGradient(x, y, x + size, y);
                body.addColorStop(0, '#166534');
                body.addColorStop(0.5, '#22c55e');
                body.addColorStop(1, '#14532d');
                ctx.fillStyle = body;
                roundRect(ctx, x + 1, y, size - 2, size, size * 0.1);
                ctx.fill();
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(x + size * 0.12, y + size * 0.1, size * 0.2, size * 0.8);
                ctx.fillStyle = 'rgba(255,255,255,0.12)';
                ctx.fillRect(x + size * 0.68, y + size * 0.1, size * 0.15, size * 0.8);
                ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x + 1.5, y + 0.5, size - 3, size - 1);
                break;
            }
            default:
                break;
        }
        ctx.restore();
    }

    /**
     * Cinematic sky: multi-stop HDR-style gradient, sun corona, aerial perspective,
     * volumetric-ish clouds, parallax ridges with depth fog.
     */
    function drawBackgroundLayers(ctx, cameraX, viewW, viewH, themeIndex, timeMs) {
        const p = pal(themeIndex);
        const t = (timeMs || 0) * 0.001;

        const sky = ctx.createLinearGradient(0, 0, 0, viewH);
        sky.addColorStop(0, p.sky1);
        sky.addColorStop(0.28, p.sky2);
        sky.addColorStop(0.62, p.skyHorizon);
        sky.addColorStop(0.88, 'rgba(255,255,255,0.35)');
        sky.addColorStop(1, 'rgba(230,240,255,0.55)');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, viewW, viewH);

        const zenith = ctx.createRadialGradient(viewW * 0.35, viewH * 0.08, 0, viewW * 0.4, viewH * 0.15, viewW * 0.9);
        zenith.addColorStop(0, 'rgba(255,255,255,0.12)');
        zenith.addColorStop(0.4, 'rgba(255,255,255,0.02)');
        zenith.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = zenith;
        ctx.fillRect(0, 0, viewW, viewH * 0.55);

        const sunX = viewW * 0.76 + Math.sin(t * 0.12) * 8;
        const sunY = viewH * 0.16 + Math.cos(t * 0.1) * 5;
        const sunR = Math.min(viewW, viewH) * 0.095;

        const corona = ctx.createRadialGradient(sunX, sunY, sunR * 0.05, sunX, sunY, sunR * 3.6);
        corona.addColorStop(0, 'rgba(255,250,220,0.55)');
        corona.addColorStop(0.2, 'rgba(255,230,150,0.22)');
        corona.addColorStop(0.45, 'rgba(255,200,100,0.08)');
        corona.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = corona;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 3.6, 0, Math.PI * 2);
        ctx.fill();

        const glow2 = ctx.createRadialGradient(sunX, sunY, sunR * 0.3, sunX, sunY, sunR * 1.8);
        glow2.addColorStop(0, p.sun);
        glow2.addColorStop(0.5, 'rgba(255,240,200,0.4)');
        glow2.addColorStop(1, 'rgba(255,220,120,0)');
        ctx.fillStyle = glow2;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fffef5';
        ctx.globalAlpha = 0.98;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR * 0.62, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.09;
        const rays = ctx.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, Math.max(viewW, viewH) * 0.85);
        rays.addColorStop(0, 'rgba(255,248,230,0.5)');
        rays.addColorStop(0.12, 'rgba(255,235,190,0.12)');
        rays.addColorStop(0.35, 'rgba(255,220,160,0.04)');
        rays.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = rays;
        ctx.fillRect(0, 0, viewW, viewH * 0.65);
        ctx.restore();

        const hazeBand = ctx.createLinearGradient(0, viewH * 0.38, 0, viewH * 0.72);
        hazeBand.addColorStop(0, 'rgba(255,255,255,0)');
        hazeBand.addColorStop(0.5, p.haze);
        hazeBand.addColorStop(1, 'rgba(200,210,230,0.18)');
        ctx.fillStyle = hazeBand;
        ctx.fillRect(0, viewH * 0.38, viewW, viewH * 0.36);

        function hillLayer(yBase, amp, scroll, color, freq, depthFade) {
            ctx.save();
            ctx.globalAlpha = depthFade;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, viewH + 2);
            for (let x = -120; x <= viewW + 120; x += 5) {
                const wx = x + scroll;
                const y =
                    yBase +
                    Math.sin(wx * freq) * amp +
                    Math.sin(wx * freq * 2.3 + 1.2) * amp * 0.38 +
                    Math.sin(wx * 0.002 + t) * amp * 0.12;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(viewW + 120, viewH + 2);
            ctx.lineTo(-120, viewH + 2);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.restore();
        }

        const s0 = (cameraX * 0.045) % 900;
        const s1 = (cameraX * 0.1) % 900;
        const s2 = (cameraX * 0.18) % 900;
        const s3 = (cameraX * 0.28) % 900;
        hillLayer(viewH * 0.52, viewH * 0.04, s0, p.parallax[0], 0.0032, 0.55);
        hillLayer(viewH * 0.58, viewH * 0.055, s1, p.parallax[0], 0.004, 0.72);
        hillLayer(viewH * 0.64, viewH * 0.07, s2, p.parallax[1], 0.0052, 0.88);
        hillLayer(viewH * 0.71, viewH * 0.09, s3, p.parallax[2], 0.0068, 1);

        const fogNear = ctx.createLinearGradient(0, viewH * 0.48, 0, viewH * 0.85);
        fogNear.addColorStop(0, 'rgba(255,255,255,0)');
        fogNear.addColorStop(1, 'rgba(220,230,245,0.25)');
        ctx.fillStyle = fogNear;
        ctx.fillRect(0, viewH * 0.48, viewW, viewH * 0.4);

        function drawCloud(cx, cy, rw, rh, alpha) {
            ctx.save();
            ctx.globalAlpha = alpha;
            const sh = ctx.createRadialGradient(cx - rw * 0.2, cy + rh * 0.3, 0, cx, cy, rw * 1.2);
            sh.addColorStop(0, 'rgba(80,100,130,0.35)');
            sh.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = sh;
            ctx.beginPath();
            ctx.ellipse(cx - rw * 0.15, cy + rh * 0.25, rw * 0.9, rh * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();
            const body = ctx.createRadialGradient(cx - rw * 0.1, cy - rh * 0.1, 0, cx, cy, rw);
            body.addColorStop(0, 'rgba(255,255,255,0.95)');
            body.addColorStop(0.7, 'rgba(255,255,255,0.75)');
            body.addColorStop(1, 'rgba(255,255,255,0.35)');
            ctx.fillStyle = body;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rw * 0.85, rh, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.55)';
            ctx.beginPath();
            ctx.ellipse(cx - rw * 0.35, cy - rh * 0.15, rw * 0.35, rh * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (let i = 0; i < 9; i++) {
            const cx = ((i * 263 + t * 14) % (viewW + 200)) - 80;
            const cy = viewH * (0.06 + (i % 4) * 0.055) + Math.sin(t * 0.8 + i) * 6;
            const rw = 85 + (i % 5) * 22;
            const rh = 20 + (i % 3) * 7;
            drawCloud(cx, cy, rw, rh, 0.5 + (i % 3) * 0.08);
        }
    }

    function drawMenuBackdrop(ctx, w, h, timeMs) {
        const t = (timeMs || 0) * 0.001;
        const g = ctx.createLinearGradient(0, 0, w * 0.6, h);
        g.addColorStop(0, '#020617');
        g.addColorStop(0.35, '#0f172a');
        g.addColorStop(0.65, '#1e3a8a');
        g.addColorStop(1, '#312e81');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        const spot = ctx.createRadialGradient(w * 0.55, h * 0.25, 10, w * 0.55, h * 0.35, h * 0.65);
        spot.addColorStop(0, 'rgba(251,146,60,0.45)');
        spot.addColorStop(0.25, 'rgba(249,115,22,0.18)');
        spot.addColorStop(0.55, 'rgba(59,130,246,0.15)');
        spot.addColorStop(1, 'rgba(15,23,42,0)');
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, w, h);

        const floor = ctx.createLinearGradient(0, h * 0.55, 0, h);
        floor.addColorStop(0, 'rgba(0,0,0,0)');
        floor.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = floor;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);

        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 22; i++) {
            const y = (i / 22) * h + Math.sin(t * 0.8 + i * 0.35) * 8;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.bezierCurveTo(w * 0.33, y - 24, w * 0.66, y + 24, w, y);
            ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        for (let s = 0; s < 120; s++) {
            const sx = (s * 127 + t * 22) % w;
            const sy = (s * 83 + s * s) % h;
            const sz = 1 + (s % 3);
            ctx.globalAlpha = 0.3 + (s % 5) * 0.12;
            ctx.fillRect(sx, sy, sz, sz);
        }
        ctx.globalAlpha = 1;
    }

    function drawPlayer(ctx, px, py, w, h, powerState, anim, facing, timeMs) {
        const t = (timeMs || 0) * 0.008;
        const skinHi = '#ffedd5';
        const skin = '#fdba74';
        const skinLo = '#c2410c';
        const shortsTop = '#1d4ed8';
        const shortsBot = '#1e3a8a';
        const scale = facing === 1 ? -1 : 1;

        const pump = powerState === POWER_STATES.PUMP;
        const beast = powerState === POWER_STATES.BEAST;
        const tankC1 = beast ? '#ea580c' : pump ? '#fb923c' : skin;
        const tankC2 = beast ? '#9a3412' : pump ? '#c2410c' : '#fed7aa';

        let bob = 0;
        let armSwing = 0;
        let legSwing = 0;
        if (anim === 'walk' || anim === 'run') {
            const sp = anim === 'run' ? 1.6 : 1;
            bob = Math.sin(t * sp * 2.2) * h * 0.02;
            armSwing = Math.sin(t * sp * 2.2) * 0.35;
            legSwing = Math.cos(t * sp * 2.2) * 0.4;
        } else if (anim === 'jump' || anim === 'skid') {
            armSwing = anim === 'jump' ? -0.7 : 0.2;
        }

        ctx.save();
        ctx.translate(px + w / 2, py + h / 2 + bob);
        ctx.scale(scale, 1);

        const hw = w * 0.48;
        const hh = h * 0.48;

        const shadowGrad = ctx.createRadialGradient(0, hh * 0.92, 0, 0, hh * 0.92, hw * 1.45);
        shadowGrad.addColorStop(0, 'rgba(0,0,0,0.52)');
        shadowGrad.addColorStop(0.55, 'rgba(0,0,0,0.18)');
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(0, hh * 0.94, hw * 1.25, hh * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        const legW = hw * 0.28;
        const legH = hh * 0.95;
        function drawLeg(side) {
            ctx.save();
            ctx.rotate(side * legSwing * 0.35);
            const lx = side * hw * 0.22;
            const shortsGrad = ctx.createLinearGradient(lx - legW / 2, hh * 0.15, lx + legW / 2, hh * 0.95);
            shortsGrad.addColorStop(0, shortsTop);
            shortsGrad.addColorStop(1, shortsBot);
            ctx.fillStyle = shortsGrad;
            roundRect(ctx, lx - legW / 2, hh * 0.22, legW, hh * 0.55, legW * 0.2);
            ctx.fill();
            const calf = ctx.createLinearGradient(lx - legW / 2, hh * 0.65, lx, hh);
            calf.addColorStop(0, skin);
            calf.addColorStop(1, skinLo);
            ctx.fillStyle = calf;
            roundRect(ctx, lx - legW * 0.45, hh * 0.62, legW * 0.9, hh * 0.38, legW * 0.25);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            roundRect(ctx, lx - legW * 0.5, hh * 0.92, legW, hh * 0.12, 3);
            ctx.fill();
            ctx.restore();
        }
        drawLeg(-1);
        drawLeg(1);

        const torsoW = hw * (beast ? 1.55 : pump ? 1.35 : 1.15);
        const torsoH = hh * (beast ? 1.15 : pump ? 1.05 : 0.95);
        const tg = ctx.createLinearGradient(0, -torsoH * 0.35, 0, torsoH * 0.45);
        tg.addColorStop(0, tankC2);
        tg.addColorStop(0.5, tankC1);
        tg.addColorStop(1, '#7c2d12');
        ctx.fillStyle = tg;
        roundRect(ctx, -torsoW / 2, -torsoH * 0.15, torsoW, torsoH * 0.9, hw * 0.12);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (beast || pump) {
            ctx.strokeStyle = 'rgba(0,0,0,0.18)';
            for (let i = 1; i <= (beast ? 4 : 2); i++) {
                ctx.beginPath();
                ctx.moveTo(-torsoW * 0.35, -torsoH * 0.05 + i * torsoH * 0.12);
                ctx.lineTo(torsoW * 0.35, -torsoH * 0.05 + i * torsoH * 0.12);
                ctx.stroke();
            }
        }

        function drawArm(side) {
            ctx.save();
            ctx.translate(side * hw * 0.55, -hh * 0.05);
            ctx.rotate(side * armSwing);
            const ag = ctx.createLinearGradient(0, -hh * 0.1, 0, hh * 0.55);
            ag.addColorStop(0, skinHi);
            ag.addColorStop(0.55, skin);
            ag.addColorStop(1, skinLo);
            ctx.fillStyle = ag;
            roundRect(ctx, -hw * 0.14, -hh * 0.05, hw * 0.28, hh * 0.62, hw * 0.12);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            roundRect(ctx, -hw * 0.15, hh * 0.48, hw * 0.3, hh * 0.14, 4);
            ctx.fill();
            ctx.restore();
        }
        drawArm(-1);
        drawArm(1);

        const headR = hw * 0.42;
        const hg = ctx.createRadialGradient(-headR * 0.15, -hh * 0.62, headR * 0.1, 0, -hh * 0.55, headR);
        hg.addColorStop(0, skinHi);
        hg.addColorStop(0.65, skin);
        hg.addColorStop(1, skinLo);
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(0, -hh * 0.52, headR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(120,53,15,0.35)';
        ctx.beginPath();
        ctx.ellipse(0, -hh * 0.42, headR * 0.55, headR * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, -hh * 0.52, headR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(-headR * 0.22, -hh * 0.56, headR * 0.09, 0, Math.PI * 2);
        ctx.arc(headR * 0.22, -hh * 0.56, headR * 0.09, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f97316';
        ctx.fillRect(-headR * 0.55, -hh * 0.78, headR * 1.1, headR * 0.22);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.strokeRect(-headR * 0.55, -hh * 0.78, headR * 1.1, headR * 0.22);

        if (beast) {
            ctx.strokeStyle = 'rgba(255,255,255,0.75)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-torsoW * 0.52, -torsoH * 0.2, torsoW * 1.04, torsoH * 1.05);
        }

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.22;
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = Math.max(1.2, hw * 0.06);
        ctx.beginPath();
        ctx.arc(-headR * 0.35, -hh * 0.58, headR * 0.85, -Math.PI * 0.7, -Math.PI * 0.1);
        ctx.stroke();
        ctx.restore();

        ctx.restore();
    }

    function drawEnemy(ctx, ex, ey, ew, eh, type, timeMs) {
        const t = (timeMs || 0) * 0.006;
        const wobble = Math.sin(t + ex * 0.01) * 1.5;
        ctx.save();
        switch (type) {
            case ENEMY_TYPES.SLOUCHER: {
                const g = ctx.createLinearGradient(ex, ey, ex, ey + eh);
                g.addColorStop(0, '#9ca3af');
                g.addColorStop(1, '#4b5563');
                ctx.fillStyle = g;
                roundRect(ex, ey + eh * 0.28 + wobble * 0.2, ew, eh * 0.72, ew * 0.12);
                ctx.fill();
                const hg = ctx.createRadialGradient(ex + ew * 0.5, ey + eh * 0.32, 2, ex + ew * 0.5, ey + eh * 0.35, ew * 0.42);
                hg.addColorStop(0, '#e5e7eb');
                hg.addColorStop(1, '#6b7280');
                ctx.fillStyle = hg;
                ctx.beginPath();
                ctx.arc(ex + ew / 2, ey + eh * 0.35 + wobble * 0.2, ew * 0.38, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#1f2937';
                ctx.fillRect(ex + ew * 0.35, ey + eh * 0.3, ew * 0.12, eh * 0.08);
                ctx.fillRect(ex + ew * 0.55, ey + eh * 0.3, ew * 0.12, eh * 0.08);
                break;
            }
            case ENEMY_TYPES.FORM_POLICE: {
                const u = ctx.createLinearGradient(ex, ey, ex + ew, ey + eh);
                u.addColorStop(0, '#2563eb');
                u.addColorStop(1, '#1e3a8a');
                ctx.fillStyle = u;
                roundRect(ex, ey, ew, eh, ew * 0.08);
                ctx.fill();
                ctx.fillStyle = '#fef9c3';
                ctx.fillRect(ex + ew * 0.18, ey + eh * 0.22, ew * 0.64, eh * 0.12);
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(ex + ew * 0.42, ey + eh * 0.08, ew * 0.16, eh * 0.55);
                break;
            }
            case ENEMY_TYPES.SNAPPER: {
                const body = ctx.createLinearGradient(ex, ey, ex, ey + eh);
                body.addColorStop(0, '#22c55e');
                body.addColorStop(1, '#14532d');
                ctx.fillStyle = body;
                roundRect(ex, ey + eh * 0.38, ew, eh * 0.62, ew * 0.2);
                ctx.fill();
                ctx.fillStyle = '#16a34a';
                ctx.beginPath();
                ctx.arc(ex + ew / 2, ey + eh * 0.42, ew * 0.44, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(ex + ew * 0.62, ey + eh * 0.38, ew * 0.1, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.arc(ex + ew * 0.62, ey + eh * 0.38, ew * 0.05, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
            case ENEMY_TYPES.KETTLE_BELL: {
                const kg = ctx.createRadialGradient(ex + ew / 2, ey + eh * 0.55, 2, ex + ew / 2, ey + eh * 0.55, ew * 0.48);
                kg.addColorStop(0, '#525252');
                kg.addColorStop(0.65, '#171717');
                kg.addColorStop(1, '#0a0a0a');
                ctx.fillStyle = kg;
                ctx.beginPath();
                ctx.arc(ex + ew / 2, ey + eh * 0.55, ew * 0.44, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ex + ew / 2, ey + eh * 0.55, ew * 0.22, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = '#404040';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(ex + ew * 0.5, ey + eh * 0.18);
                ctx.lineTo(ex + ew * 0.5, ey + eh * 0.42);
                ctx.stroke();
                break;
            }
            case ENEMY_TYPES.PROTEIN_DRONE: {
                const bob = Math.sin(t * 2 + ex) * 3;
                const dg = ctx.createLinearGradient(ex, ey + bob, ex + ew, ey + eh + bob);
                dg.addColorStop(0, '#fb7185');
                dg.addColorStop(1, '#be123c');
                ctx.fillStyle = dg;
                roundRect(ex + ew * 0.18, ey + bob, ew * 0.64, eh * 0.38, 6);
                ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.fillRect(ex + ew * 0.28, ey + eh * 0.12 + bob, ew * 0.44, eh * 0.08);
                ctx.fillStyle = '#fda4af';
                roundRect(ex, ey + eh * 0.35 + bob, ew, eh * 0.65, ew * 0.15);
                ctx.fill();
                break;
            }
            case ENEMY_TYPES.BOSS_SHREDDER: {
                const bx = ex + Math.sin(t * 1.2) * 2;
                const cape = ctx.createLinearGradient(bx, ey, bx + ew, ey + eh);
                cape.addColorStop(0, '#7f1d1d');
                cape.addColorStop(1, '#450a0a');
                ctx.fillStyle = cape;
                roundRect(bx, ey + eh * 0.18, ew, eh * 0.82, ew * 0.08);
                ctx.fill();
                const face = ctx.createRadialGradient(bx + ew * 0.5, ey + eh * 0.22, 2, bx + ew * 0.5, ey + eh * 0.26, ew * 0.42);
                face.addColorStop(0, '#fecaca');
                face.addColorStop(1, '#b91c1c');
                ctx.fillStyle = face;
                ctx.beginPath();
                ctx.arc(bx + ew * 0.5, ey + eh * 0.26, ew * 0.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(bx + ew * 0.28, ey + eh * 0.42, ew * 0.44, eh * 0.1);
                ctx.fillStyle = '#1f2937';
                ctx.fillRect(bx + ew * 0.35, ey + eh * 0.52, ew * 0.3, eh * 0.08);
                ctx.fillStyle = 'rgba(0,0,0,0.35)';
                ctx.beginPath();
                ctx.moveTo(bx + ew * 0.2, ey + eh * 0.18);
                ctx.lineTo(bx + ew * 0.8, ey + eh * 0.18);
                ctx.lineTo(bx + ew * 0.65, ey);
                ctx.lineTo(bx + ew * 0.35, ey);
                ctx.closePath();
                ctx.fill();
                break;
            }
            default:
                ctx.fillStyle = '#64748b';
                ctx.fillRect(ex, ey, ew, eh);
        }
        ctx.restore();
    }

    function drawCollectible(ctx, x, y, s, ctype, timeMs) {
        const t = (timeMs || 0) * 0.01;
        const pulse = 1 + Math.sin(t * 3) * 0.06;
        const cx = x + s / 2;
        const cy = y + s / 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.translate(-cx, -cy);

        switch (ctype) {
            case COLLECTIBLE_TYPES.GOLDEN_DUMBBELL: {
                const g = ctx.createLinearGradient(x, y, x + s, y + s);
                g.addColorStop(0, '#fde68a');
                g.addColorStop(0.45, '#f59e0b');
                g.addColorStop(1, '#b45309');
                ctx.fillStyle = g;
                roundRect(x + s * 0.08, y + s * 0.38, s * 0.84, s * 0.22, s * 0.08);
                ctx.fill();
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x + s * 0.2, y + s * 0.5, s * 0.16, 0, Math.PI * 2);
                ctx.arc(x + s * 0.8, y + s * 0.5, s * 0.16, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.25)';
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.45)';
                ctx.fillRect(x + s * 0.35, y + s * 0.42, s * 0.3, s * 0.06);
                break;
            }
            case COLLECTIBLE_TYPES.GYM_CARD: {
                const cg = ctx.createLinearGradient(x, y, x + s, y + s);
                cg.addColorStop(0, '#38bdf8');
                cg.addColorStop(1, '#0369a1');
                ctx.fillStyle = cg;
                roundRect(x + s * 0.12, y + s * 0.08, s * 0.76, s * 0.84, s * 0.06);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.45)';
                ctx.strokeRect(x + s * 0.18, y + s * 0.14, s * 0.64, s * 0.5);
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.font = `bold ${s * 0.22}px system-ui,sans-serif`;
                ctx.fillText('VIP', x + s * 0.28, y + s * 0.42);
                break;
            }
            case COLLECTIBLE_TYPES.PROTEIN_SHAKE: {
                const bot = ctx.createLinearGradient(x, y + s * 0.35, x + s, y + s);
                bot.addColorStop(0, '#f472b6');
                bot.addColorStop(1, '#be185d');
                ctx.fillStyle = bot;
                roundRect(x + s * 0.32, y + s * 0.35, s * 0.36, s * 0.62, s * 0.1);
                ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.fillRect(x + s * 0.38, y + s * 0.45, s * 0.1, s * 0.45);
                ctx.fillStyle = '#fda4af';
                roundRect(x + s * 0.28, y, s * 0.44, s * 0.38, s * 0.12);
                ctx.fill();
                break;
            }
            case COLLECTIBLE_TYPES.PRE_WORKOUT: {
                const tri = ctx.createLinearGradient(x, y, x + s, y + s);
                tri.addColorStop(0, '#c084fc');
                tri.addColorStop(1, '#6b21a8');
                ctx.fillStyle = tri;
                ctx.beginPath();
                ctx.moveTo(x + s / 2, y + s * 0.08);
                ctx.lineTo(x + s * 0.92, y + s * 0.92);
                ctx.lineTo(x + s * 0.08, y + s * 0.92);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.font = `bold ${s * 0.28}px system-ui,sans-serif`;
                ctx.fillText('!', x + s * 0.42, y + s * 0.72);
                break;
            }
            case COLLECTIBLE_TYPES.MACRO: {
                const cap = ctx.createLinearGradient(x, y + s * 0.35, x + s, y + s * 0.65);
                cap.addColorStop(0, '#6ee7b7');
                cap.addColorStop(1, '#047857');
                ctx.fillStyle = cap;
                roundRect(x + s * 0.15, y + s * 0.38, s * 0.7, s * 0.35, s * 0.12);
                ctx.fill();
                ctx.fillStyle = '#ecfdf5';
                roundRect(x + s * 0.2, y + s * 0.22, s * 0.6, s * 0.22, s * 0.08);
                ctx.fill();
                break;
            }
            case COLLECTIBLE_TYPES.TROPHY: {
                const cup = ctx.createLinearGradient(x + s * 0.2, y, x + s * 0.8, y + s);
                cup.addColorStop(0, '#fde68a');
                cup.addColorStop(0.5, '#f59e0b');
                cup.addColorStop(1, '#b45309');
                ctx.fillStyle = cup;
                ctx.beginPath();
                ctx.moveTo(x + s * 0.5, y + s * 0.12);
                ctx.lineTo(x + s * 0.72, y + s * 0.42);
                ctx.lineTo(x + s * 0.62, y + s * 0.72);
                ctx.lineTo(x + s * 0.38, y + s * 0.72);
                ctx.lineTo(x + s * 0.28, y + s * 0.42);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#92400e';
                ctx.fillRect(x + s * 0.42, y + s * 0.72, s * 0.16, s * 0.18);
                break;
            }
            default: {
                const gg = ctx.createLinearGradient(x, y, x + s, y + s);
                gg.addColorStop(0, '#6ee7b7');
                gg.addColorStop(1, '#059669');
                ctx.fillStyle = gg;
                roundRect(x + s * 0.12, y + s * 0.12, s * 0.76, s * 0.76, s * 0.12);
                ctx.fill();
                ctx.strokeStyle = 'rgba(255,255,255,0.35)';
                ctx.strokeRect(x + s * 0.18, y + s * 0.18, s * 0.64, s * 0.64);
            }
        }
        ctx.restore();
    }

    function drawGoalFlag(ctx, x, y, h, timeMs) {
        const t = (timeMs || 0) * 0.004;
        const wave = Math.sin(t * 2) * 3;
        ctx.save();
        const pole = ctx.createLinearGradient(x, y, x + 6, y);
        pole.addColorStop(0, '#a8a29e');
        pole.addColorStop(1, '#57534e');
        ctx.fillStyle = pole;
        ctx.fillRect(x, y, 6, h);

        const banner = ctx.createLinearGradient(x + 6, y, x + 52, y + h * 0.35);
        banner.addColorStop(0, '#f97316');
        banner.addColorStop(0.5, '#fb923c');
        banner.addColorStop(1, '#ea580c');
        ctx.fillStyle = banner;
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 6 + wave * 0.1);
        ctx.lineTo(x + 52, y + 18 + wave);
        ctx.lineTo(x + 6, y + 32 + wave * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${Math.max(10, h * 0.08)}px system-ui,sans-serif`;
        ctx.fillText('FINISH', x + 12, y + 22 + wave * 0.05);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(x + 3, y + h - 8, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(x + 3, y + h - 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    window.Sprites = {
        drawTile,
        drawPlayer,
        drawEnemy,
        drawCollectible,
        drawGoalFlag,
        drawBackgroundLayers,
        drawMenuBackdrop,
        THEME_PALETTES
    };
})();
