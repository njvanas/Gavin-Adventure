/**
 * Campaign: 8 worlds × 4 stages — procedural layouts + boss arenas.
 * Uses deterministic PRNG from (world, stage) for variety while staying playable.
 */
(function () {
    const TS = GAME_CONFIG.TILE_SIZE;

    function rngSeed(world, stage) {
        return world * 7919 + stage * 104729;
    }

    function makeRng(seed) {
        let s = seed >>> 0;
        return function next() {
            s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
            return s / 0xffffffff;
        };
    }

    function groundTopTileRow(h) {
        return h - 4;
    }

    function entityYOnGround(h, entityH) {
        const row = groundTopTileRow(h);
        return row * TS - entityH;
    }

    function fillRectSolid(tiles, w, h, x0, y0, x1, y1, tile) {
        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                if (x >= 0 && x < w && y >= 0 && y < h) {
                    tiles[y * w + x] = tile;
                }
            }
        }
    }

    function carvePit(tiles, w, h, x0, x1) {
        const g0 = groundTopTileRow(h);
        for (let x = x0; x <= x1; x++) {
            for (let y = g0; y < h; y++) {
                if (x >= 0 && x < w) tiles[y * w + x] = TILES.AIR;
            }
        }
    }

    function buildBaseGround(tiles, w, h, pitRanges) {
        const bottom = h - 1;
        const gTop = groundTopTileRow(h);
        for (let y = gTop; y <= bottom; y++) {
            for (let x = 0; x < w; x++) {
                tiles[y * w + x] = TILES.SOLID;
            }
        }
        for (const pr of pitRanges) {
            carvePit(tiles, w, h, pr[0], pr[1]);
        }
    }

    function addPlatformSpan(tiles, w, h, x0, x1, row, tile) {
        for (let x = x0; x <= x1; x++) {
            if (x >= 0 && x < w && row >= 0 && row < h) {
                tiles[row * w + x] = tile;
            }
        }
    }

    function placeSpikeRow(tiles, w, h, x0, x1, row) {
        for (let x = x0; x <= x1; x++) {
            if (x >= 0 && x < w && row >= 0 && row < h) {
                if (tiles[row * w + x] === TILES.AIR) {
                    tiles[row * w + x] = TILES.SPIKES;
                }
            }
        }
    }

    function getWorldTheme(world) {
        const map = {
            1: WORLD_THEMES.NEIGHBORHOOD_GYM,
            2: WORLD_THEMES.CITY_ROOFTOPS,
            3: WORLD_THEMES.LOCKER_DEPTHS,
            4: WORLD_THEMES.AQUATIC_MIXERS,
            5: WORLD_THEMES.STEEL_FACTORY,
            6: WORLD_THEMES.NEON_NIGHT,
            7: WORLD_THEMES.ALPINE_ALTITUDE,
            8: WORLD_THEMES.CHAMPIONSHIP
        };
        return map[world] || WORLD_THEMES.NEIGHBORHOOD_GYM;
    }

    function pickEnemies(world, stage, rand, count) {
        const pool = [];
        if (world <= 2) {
            pool.push(ENEMY_TYPES.SLOUCHER, ENEMY_TYPES.FORM_POLICE);
        } else if (world <= 4) {
            pool.push(ENEMY_TYPES.SLOUCHER, ENEMY_TYPES.FORM_POLICE, ENEMY_TYPES.KETTLE_BELL);
        } else if (world <= 6) {
            pool.push(ENEMY_TYPES.FORM_POLICE, ENEMY_TYPES.KETTLE_BELL, ENEMY_TYPES.PROTEIN_DRONE);
        } else {
            pool.push(ENEMY_TYPES.KETTLE_BELL, ENEMY_TYPES.PROTEIN_DRONE, ENEMY_TYPES.FORM_POLICE);
        }
        if (stage >= 2 && world >= 3) {
            pool.push(ENEMY_TYPES.SNAPPER);
        }
        const out = [];
        for (let i = 0; i < count; i++) {
            out.push(pool[Math.floor(rand() * pool.length)]);
        }
        return out;
    }

    function buildStandardLevel(world, stage) {
        const rand = makeRng(rngSeed(world, stage));
        const w = Math.min(110, 52 + world * 4 + stage * 3);
        const h = 36;
        const tiles = new Array(w * h).fill(TILES.AIR);
        const difficulty = (world - 1) * 4 + (stage - 1);
        const pitCount = Math.min(5, 1 + Math.floor(difficulty / 6) + Math.floor(rand() * 2));
        const pitRanges = [];
        let cursor = 8 + Math.floor(rand() * 6);
        for (let p = 0; p < pitCount; p++) {
            const pw = 2 + (rand() > 0.6 ? 1 : 0);
            cursor += 10 + Math.floor(rand() * 14);
            if (cursor + pw >= w - 10) break;
            pitRanges.push([cursor, cursor + pw - 1]);
            cursor += pw;
        }
        buildBaseGround(tiles, w, h, pitRanges);

        const platRows = [h - 8, h - 11, h - 14, h - 17];
        let px = 12;
        while (px < w - 16) {
            const row = platRows[Math.floor(rand() * platRows.length)];
            const len = 3 + Math.floor(rand() * 5);
            const useBrick = rand() > 0.35;
            addPlatformSpan(tiles, w, h, px, Math.min(px + len, w - 6), row, useBrick ? TILES.PLATFORM : TILES.SOLID);
            if (rand() > 0.55) {
                const qx = px + Math.floor(len / 2);
                if (qx < w - 1) tiles[row * w + qx] = TILES.BREAKABLE;
            }
            px += len + 8 + Math.floor(rand() * 10);
        }

        if (difficulty >= 8 && rand() > 0.4) {
            const sx = 20 + Math.floor(rand() * (w - 40));
            placeSpikeRow(tiles, w, h, sx, sx + 2 + Math.floor(rand() * 3), h - 5);
        }

        const gy = entityYOnGround(h, 16);
        const enemies = [];
        const enemyCount = Math.min(10, 4 + Math.floor(difficulty / 4) + Math.floor(rand() * 3));
        const types = pickEnemies(world, stage, rand, enemyCount);
        const spread = types.length <= 1 ? 0 : Math.floor((w * TS - 320) / (types.length - 1));
        for (let i = 0; i < types.length; i++) {
            const ex = 160 + i * spread + Math.floor((rand() - 0.5) * 24);
            enemies.push({ type: types[i], x: ex, y: gy });
        }

        const collectibles = [];
        for (let c = 0; c < 8 + Math.floor(rand() * 6); c++) {
            const cx = 64 + c * Math.floor((w * TS - 128) / 9);
            collectibles.push({ type: COLLECTIBLE_TYPES.GOLDEN_DUMBBELL, x: cx, y: gy - 80 - (c % 3) * 32 });
        }
        if (stage >= 2) {
            collectibles.push({ type: COLLECTIBLE_TYPES.PROTEIN_SHAKE, x: Math.floor(w * TS * 0.35), y: gy - 96 });
        }
        if (world >= 2 || stage === 4) {
            collectibles.push({ type: COLLECTIBLE_TYPES.PRE_WORKOUT, x: Math.floor(w * TS * 0.55), y: gy - 112 });
        }
        collectibles.push({ type: COLLECTIBLE_TYPES.GYM_CARD, x: Math.floor(w * TS * 0.72), y: gy - 64 });

        const exitX = w * TS - 56;
        return {
            width: w,
            height: h,
            tiles,
            theme: getWorldTheme(world),
            playerSpawn: { x: 40, y: gy },
            exitPoint: { x: exitX, y: gy },
            enemies,
            collectibles,
            useDefaultCollectibles: false,
            isBossLevel: false
        };
    }

    function buildBossLevel(world) {
        const w = 52;
        const h = 28;
        const tiles = new Array(w * h).fill(TILES.AIR);
        buildBaseGround(tiles, w, h, []);
        const gy = entityYOnGround(h, 16);
        const bossY = groundTopTileRow(h) * TS - 32;
        addPlatformSpan(tiles, w, h, 4, 8, h - 9, TILES.PLATFORM);
        addPlatformSpan(tiles, w, h, w - 12, w - 6, h - 9, TILES.PLATFORM);

        const bossX = Math.floor(w * TS * 0.55);
        return {
            width: w,
            height: h,
            tiles,
            theme: getWorldTheme(world),
            playerSpawn: { x: 48, y: gy },
            exitPoint: { x: w * TS - 48, y: gy },
            enemies: [{ type: ENEMY_TYPES.BOSS_SHREDDER, x: bossX, y: bossY }],
            collectibles: [
                { type: COLLECTIBLE_TYPES.PROTEIN_SHAKE, x: Math.floor(w * TS * 0.25), y: gy - 64 },
                { type: COLLECTIBLE_TYPES.PRE_WORKOUT, x: Math.floor(w * TS * 0.4), y: gy - 80 }
            ],
            useDefaultCollectibles: false,
            isBossLevel: true
        };
    }

    window.Campaign = {
        levelsPerWorld: 4,
        totalWorlds: 8,

        getLevelTitle(world, stage) {
            const TITLES = {
                1: ['Morning Warm-up', 'Equipment Tour', 'First Workout', 'Gym Manager Boss'],
                2: ['Urban Parkour', 'Wind Challenge', 'Skyscraper Sprint', 'Shredder\'s Lair'],
                3: ['Steam Tunnels', 'Slippery Slopes', 'Forgotten Lockers', 'Underground Arena'],
                4: ['Pool Training', 'Protein Rapids', 'Deep End Challenge', 'Shredder Returns'],
                5: ['Assembly Line', 'Crusher Gauntlet', 'Molten Core', 'Industrial Complex'],
                6: ['Laser Light Show', 'Bounce Pad Mania', 'Neon Maze', 'Shredder\'s Revenge'],
                7: ['Mountain Climb', 'Icy Peaks', 'Avalanche Escape', 'Summit Challenge'],
                8: ['Qualifier Round', 'Semi-Finals', 'Championship Match', 'Ultimate Shredder']
            };
            const row = TITLES[world];
            if (row && row[stage - 1]) return row[stage - 1];
            return `World ${world}-${stage}`;
        },

        createLevel(world, stage) {
            if (world < 1) world = 1;
            if (world > 8) world = 8;
            if (stage < 1) stage = 1;
            if (stage > 4) stage = 4;

            let data;
            if (stage === 4) {
                data = buildBossLevel(world);
            } else {
                data = buildStandardLevel(world, stage);
            }
            return new Level(data);
        }
    };
})();
