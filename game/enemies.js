(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const TILES = window.TILES;
    const ENEMY_TYPES = window.ENEMY_TYPES;
    const Collision = window.Collision;

    function createEnemy(def) {
        const ts = GAME_CONFIG.TILE_SIZE;
        const big = def.type === ENEMY_TYPES.BOSS_SHREDDER;
        const w = big ? ts * 2 : ts;
        const h = big ? ts * 2 : ts;
        return {
            x: def.x,
            y: def.y,
            width: w,
            height: h,
            vx: def.vx != null ? def.vx : -55,
            vy: 0,
            type: def.type,
            alive: true,
            hp: def.hp != null ? def.hp : def.type === ENEMY_TYPES.BOSS_SHREDDER ? 5 : 1,
            t: 0
        };
    }

    function solid(t) {
        return (
            t === TILES.SOLID ||
            t === TILES.BREAKABLE ||
            t === TILES.STRONG_PLATE ||
            t === TILES.INVISIBLE_BLOCK
        );
    }

    function updateEnemies(list, level, player, deltaMs, particles) {
        const TICK = deltaMs / 1000;
        const ts = GAME_CONFIG.TILE_SIZE;

        for (const e of list) {
            if (!e.alive) continue;
            e.t += deltaMs;

            if (e.type === ENEMY_TYPES.PROTEIN_DRONE) {
                e.y += Math.sin(e.t * 0.003) * 0.8;
                e.x += e.vx * TICK;
                if (e.x < ts || e.x > level.widthPx - e.width - ts) e.vx *= -1;
                continue;
            }

            if (e.type === ENEMY_TYPES.BOSS_SHREDDER) {
                e.x += e.vx * TICK;
                const minX = ts * 2;
                const maxX = level.widthPx - e.width - ts * 2;
                if (e.x <= minX || e.x >= maxX) e.vx *= -1;
                continue;
            }

            e.vy = Math.min(240, e.vy + GAME_CONFIG.PHYSICS.GRAVITY * 18 * TICK);
            e.x += e.vx * TICK;

            const hx = e.vx >= 0 ? e.x + e.width + 0.5 : e.x - 0.5;
            const hy = Math.floor((e.y + e.height * 0.5) / ts);
            const ahead = level.getTile(Math.floor(hx / ts), hy);
            if (solid(ahead)) e.vx *= -1;

            const fx = Math.floor((e.x + e.width / 2) / ts);
            const fy = Math.floor((e.y + e.height + 2) / ts);
            const groundBelow = level.getTile(fx, fy);
            if (!solid(groundBelow) && groundBelow !== TILES.PLATFORM) {
                const under = level.getTile(fx + (e.vx >= 0 ? 1 : -1), fy);
                if (!solid(under)) e.vx *= -1;
            }

            const ent = {
                x: e.x,
                y: e.y,
                width: e.width,
                height: e.height,
                vx: e.vx,
                vy: e.vy,
                smbVelX: 0,
                smbVelY: 0,
                onGround: false
            };
            Collision.checkTileCollisionHorizontal(ent, level, ts);
            e.x = ent.x;
            if (Math.abs(ent.vx) < 0.01 && Math.abs(e.vx) > 1) e.vx *= -1;

            e.y += e.vy * TICK;
            ent.x = e.x;
            ent.y = e.y;
            ent.vy = e.vy;
            Collision.checkTileCollisionVertical(ent, level, ts);
            e.y = ent.y;
            e.vy = ent.vy;
        }
    }

    function checkPlayerVsEnemies(player, list, particles) {
        const Player = window.Player;
        for (const e of list) {
            if (!e.alive) continue;
            if (!Collision.checkEntityCollision(player, e)) continue;

            const stomp = player.vy > 100 && player.y + player.height < e.y + e.height * 0.55;
            if (stomp) {
                if (e.type === ENEMY_TYPES.BOSS_SHREDDER) {
                    e.hp -= 1;
                    if (window.audio && window.audio.playSound) window.audio.playSound('boss_hit');
                    if (particles) particles.emit(e.x + e.width / 2, e.y, 12, '#f97316');
                    if (e.hp <= 0) e.alive = false;
                } else {
                    e.alive = false;
                    if (window.audio && window.audio.playSound) window.audio.playSound('stomp');
                    if (particles) particles.emit(e.x + e.width / 2, e.y, 8, '#94a3b8');
                }
                Player.stompBounce(player);
            } else if (player.invuln <= 0) {
                Player.hurtPlayer(player, null);
            }
        }
    }

    window.Enemies = { createEnemy, updateEnemies, checkPlayerVsEnemies };
})();
