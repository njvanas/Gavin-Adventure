(function () {
    const GAME_CONFIG = window.GAME_CONFIG;
    const TILES = window.TILES;
    const Level = window.Level;
    const ENEMY_TYPES = window.ENEMY_TYPES;
    const COLLECTIBLE_TYPES = window.COLLECTIBLE_TYPES;

    const WORLD_NAMES = [
        'Neighborhood Gym',
        'City Rooftop Run',
        'Locker Room Depths',
        'Aquatic Mixers',
        'Steel Will Factory',
        'Neon Night Circuit',
        'Alpine Altitude',
        'Championship Gauntlet'
    ];

    function hashSeed(w, s) {
        return w * 31 + s * 17 + 12345;
    }

    function rnd(seed) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function fillGround(tiles, w, h, floorY) {
        for (let x = 0; x < w; x++) {
            tiles[floorY][x] = TILES.SOLID;
            tiles[floorY + 1][x] = TILES.SOLID;
        }
    }

    function carvePit(tiles, w, h, floorY, x0, len) {
        for (let x = x0; x < x0 + len && x < w; x++) {
            tiles[floorY][x] = TILES.AIR;
            tiles[floorY + 1][x] = TILES.AIR;
        }
    }

    function buildStage(worldIndex, stageIndex) {
        const W = 72 + stageIndex * 8;
        const H = 24;
        const floorY = H - 3;
        const seed = hashSeed(worldIndex, stageIndex);
        const tiles = [];
        for (let y = 0; y < H; y++) {
            tiles[y] = new Array(W).fill(TILES.AIR);
        }
        fillGround(tiles, W, H, floorY);

        const pits = 1 + Math.floor(rnd(seed) * 2);
        for (let p = 0; p < pits; p++) {
            const px = 12 + Math.floor(rnd(seed + p * 9) * (W - 36));
            const plen = 2 + Math.floor(rnd(seed + p * 3) * 3);
            carvePit(tiles, W, H, floorY, px, plen);
        }

        const platCount = 6 + worldIndex + stageIndex;
        for (let i = 0; i < platCount; i++) {
            const px = 8 + Math.floor(rnd(seed + 100 + i) * (W - 20));
            const py = floorY - 4 - Math.floor(rnd(seed + 200 + i) * 8);
            const pw = 3 + Math.floor(rnd(seed + 300 + i) * 5);
            for (let x = px; x < px + pw && x < W; x++) {
                if (py >= 0 && py < H) tiles[py][x] = rnd(seed + i) > 0.85 ? TILES.BREAKABLE : TILES.PLATFORM;
            }
        }

        if (rnd(seed + 400) > 0.4) {
            const sx = 20 + Math.floor(rnd(seed + 401) * (W - 40));
            tiles[floorY - 1][sx] = TILES.SPIKES;
            tiles[floorY - 1][sx + 1] = TILES.SPIKES;
        }

        const spawnX = 2 * GAME_CONFIG.TILE_SIZE;
        const spawnY = (floorY - 4) * GAME_CONFIG.TILE_SIZE;
        const goalX = (W - 4) * GAME_CONFIG.TILE_SIZE;

        tiles[floorY - 1][W - 3] = TILES.CHECKPOINT;

        const enemies = [];
        const collectibles = [];
        let et = 0;
        for (let x = 10; x < W - 10; x += 6 + Math.floor(rnd(seed + x) * 4)) {
            if (rnd(seed + x + 1) > 0.55) {
                const ty = [ENEMY_TYPES.SLOUCHER, ENEMY_TYPES.FORM_POLICE, ENEMY_TYPES.SNAPPER, ENEMY_TYPES.KETTLE_BELL][et % 4];
                et++;
                enemies.push({
                    x: x * GAME_CONFIG.TILE_SIZE,
                    y: (floorY - 2) * GAME_CONFIG.TILE_SIZE,
                    type: ty,
                    vx: rnd(seed + x) > 0.5 ? -55 : 55
                });
            }
            if (rnd(seed + x + 2) > 0.35) {
                collectibles.push({
                    x: x * GAME_CONFIG.TILE_SIZE + 4,
                    y: (floorY - 5) * GAME_CONFIG.TILE_SIZE,
                    type: rnd(seed + x) > 0.7 ? COLLECTIBLE_TYPES.GOLDEN_DUMBBELL : COLLECTIBLE_TYPES.MACRO
                });
            }
        }

        if (stageIndex === 1) {
            collectibles.push({
                x: 8 * GAME_CONFIG.TILE_SIZE,
                y: (floorY - 6) * GAME_CONFIG.TILE_SIZE,
                type: COLLECTIBLE_TYPES.PROTEIN_SHAKE
            });
        }

        const title = `${WORLD_NAMES[worldIndex % WORLD_NAMES.length]} — Stage ${stageIndex + 1}`;

        return new Level({
            width: W,
            height: H,
            tiles,
            theme: worldIndex,
            spawn: { x: spawnX, y: spawnY },
            goalX,
            title,
            isBoss: false,
            enemyDefs: enemies,
            collectibleDefs: collectibles
        });
    }

    function buildBossArena(worldIndex) {
        const W = 48;
        const H = 20;
        const floorY = H - 3;
        const tiles = [];
        for (let y = 0; y < H; y++) tiles[y] = new Array(W).fill(TILES.AIR);
        fillGround(tiles, W, H, floorY);
        for (let x = 6; x < W - 6; x++) {
            if (x % 9 === 0) tiles[floorY - 2][x] = TILES.PLATFORM;
        }
        const spawnX = 3 * GAME_CONFIG.TILE_SIZE;
        const spawnY = (floorY - 4) * GAME_CONFIG.TILE_SIZE;
        const goalX = (W - 2) * GAME_CONFIG.TILE_SIZE;
        const bossDefs = [
            {
                x: (W / 2) * GAME_CONFIG.TILE_SIZE - GAME_CONFIG.TILE_SIZE * 0.5,
                y: (floorY - 3) * GAME_CONFIG.TILE_SIZE,
                type: ENEMY_TYPES.BOSS_SHREDDER,
                vx: 70,
                hp: 5
            }
        ];

        return new Level({
            width: W,
            height: H,
            tiles,
            theme: worldIndex,
            spawn: { x: spawnX, y: spawnY },
            goalX,
            title: `${WORLD_NAMES[worldIndex % WORLD_NAMES.length]} — Boss: Shredder`,
            isBoss: true,
            enemyDefs: bossDefs,
            collectibleDefs: []
        });
    }

    function getLevelFor(world, stage) {
        if (stage === 3) return buildBossArena(world);
        return buildStage(world, stage);
    }

    function totalStagesPerWorld() {
        return 4;
    }

    function totalWorlds() {
        return 8;
    }

    window.Campaign = {
        getLevelFor,
        totalStagesPerWorld,
        totalWorlds,
        WORLD_NAMES
    };
})();
