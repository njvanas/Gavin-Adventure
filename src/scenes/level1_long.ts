import { k } from "../game";
import { spawnPlayer } from "../entities/player";
import { isPaused } from "../systems/pause";
import { makeSmoothCamera } from "../systems/camera";
import { makeParallax } from "../systems/parallax";
import { sfxCoin, sfxHit, sfxCheckpoint, sfxExit } from "../audio/sfx";
import type { RunStats } from "../systems/progress";
import { loadTiledJSON, buildFromTiled } from "../level/tiled";

export default async function level1_long() {
  k.setGravity(1200);
  const par = makeParallax();
  const levelId = "level1_long";

  const loadingText = k.add([k.text("Loading..."), k.pos(8, 8), k.fixed()]);
  let built: any = null;
  try {
    const map = await loadTiledJSON("levels/level1_long.json");
    built = buildFromTiled(map);
  } catch (err) {
    console.warn("Tiled map load failed, proceeding procedural-only", err);
  }
  loadingText.destroy();

  const spawn = built?.spawn ?? k.vec2(0, 180);
  const plr = spawnPlayer(spawn.clone());
  (plr as any).addTag?.("player");

  const startTime = Date.now();
  let coinsCollected = 0;
  let deaths = 0;

  const scoreText = k.add([k.text("0"), k.pos(8, 8), k.fixed()]);
  const heartsUI = k.add([k.text("❤❤❤"), k.pos(8, 18), k.fixed()]);
  k.onUpdate(() => {
    const h = (plr as any).getHearts?.() ?? (plr as any).hearts ?? 3;
    heartsUI.text = "❤".repeat(h);
  });

  const cam = makeSmoothCamera(() => plr.pos.clone(), {
    deadW: 140,
    deadH: 90,
    lerp: 0.18,
  });

  k.onUpdate(() => {
    if (!isPaused()) {
      cam.update();
      par.update(plr.pos.clone());
    }
  });

  let respawn = spawn.clone();

  plr.onCollide("coin", (c: any) => {
    if (!c.exists()) return;
    c.destroy();
    coinsCollected++;
    scoreText.text = String(coinsCollected);
    sfxCoin();
  });

  plr.onCollide("enemy", (e: any) => {
    if (plr.vel.y > 0 && plr.pos.y < e.pos.y - 4) {
      plr.jump(320);
      k.destroy(e);
    } else {
      (plr as any).damage?.(1);
      k.shake(2);
      sfxHit();
    }
  });

  plr.onCollide("hazard", () => {
    (plr as any).damage?.(1);
    k.shake(2);
    sfxHit();
  });

  plr.onCollide("checkpoint", (f: any) => {
    respawn = f.pos.clone();
    sfxCheckpoint();
  });

  k.onUpdate(() => {
    const h = (plr as any).getHearts?.() ?? (plr as any).hearts ?? 3;
    if (h <= 0) {
      deaths++;
      k.wait(0.05, () => {
        plr.pos = respawn.clone();
        (plr as any).hearts = 3;
        plr.vel = k.vec2(0, 0);
      });
    }
  });

  plr.onCollide("exit", () => {
    sfxExit();
    const timeMs = Date.now() - startTime;
    k.go("level_end", {
      stats: { levelId, timeMs, coins: coinsCollected, deaths } as RunStats,
      retryScene: "level1_long",
      nextScene: "level2",
    });
  });

  initProceduralTerrain(plr, spawn.x);
}

// --------------------------------------------------
// Procedural Terrain (reachable coins, tunnels with secret)
// --------------------------------------------------
function initProceduralTerrain(player: any, originX: number) {
  const TILE = 32;
  const CHUNK_TILES = 40;
  const CHUNK_W = CHUNK_TILES * TILE;
  const KEEP_AHEAD = 6;
  const KEEP_BEHIND = 6;

  const BASE_Y = 256;
  const PEAK_UP = 120;
  const VALLEY_DOWN = 110;
  const STEP_Q = 16;

  const SAFE_RADIUS_TILES = 10;

  const MAX_UP_STEP = 32;
  const MAX_DOWN_STEP = 64;
  const MAX_REACH_ABOVE = 80; // max vertical distance a coin/secret may sit above surface

  const TUNNEL_CHANCE = 0.14;
  const TUNNEL_MIN_W = 6;
  const TUNNEL_MAX_W = 16;
  const MIN_CLEAR = 90;
  const ROOF_THICK = 18;
  const FLOOR_THICK = 34;
  const GROUND_THICK = 34;

  const PEAK_COIN_CHANCE = 0.42;
  const TUNNEL_COIN_DENSITY = 0.18;
  const SECRET_CHANCE = 0.75; // chance a tunnel has an easter egg (rare item)

  type Desc =
    | { kind: "solid"; x: number; y: number; w: number; h: number }
    | { kind: "coin"; x: number; y: number }
    | { kind: "egg"; x: number; y: number };

  const cache = new Map<number, { descs: Desc[]; objs: any[] }>();
  const baseTileOffset = Math.floor(originX / TILE);

  function rawSurfaceY(globalTile: number): number {
    const rel = globalTile - baseTileOffset;
    if (Math.abs(rel) <= SAFE_RADIUS_TILES) return BASE_Y;
    const n1 = noise(rel / 18, 101) * 2 - 1;
    const n2 = noise(rel / 43, 227) * 2 - 1;
    const n3 = noise(rel / 9, 509) * 2 - 1;
    let v = n1 * 0.55 + n2 * 0.30 + n3 * 0.15;
    v = Math.tanh(v * 1.2);
    const frac = (v + 1) / 2;
    const offset = -frac * PEAK_UP + (1 - frac) * VALLEY_DOWN;
    return Math.round((BASE_Y + offset) / STEP_Q) * STEP_Q;
  }

  function ensureChunk(idx: number) {
    let entry = cache.get(idx);
    if (!entry) {
      entry = { descs: genChunk(idx), objs: [] };
      cache.set(idx, entry);
    }
    if (entry.objs.length === 0) entry.objs = entry.descs.map(spawnDesc);
  }

  function unloadChunk(idx: number) {
    const e = cache.get(idx);
    if (!e) return;
    e.objs.forEach(o => o.exists() && o.destroy());
    e.objs = [];
  }

  const startChunk = Math.floor(player.pos.x / CHUNK_W);
  for (let c = startChunk - KEEP_BEHIND; c <= startChunk + KEEP_AHEAD; c++) ensureChunk(c);

  k.onUpdate(() => {
    const current = Math.floor(player.pos.x / CHUNK_W);
    for (let c = current - KEEP_BEHIND; c <= current + KEEP_AHEAD; c++) ensureChunk(c);
    for (const idx of [...cache.keys()]) {
      if (idx < current - KEEP_BEHIND - 1 || idx > current + KEEP_AHEAD + 1) unloadChunk(idx);
    }
  });

  function genChunk(idx: number): Desc[] {
    const leftX = idx * CHUNK_W;
    const leftTile = Math.floor(leftX / TILE);
    const rightTile = leftTile + CHUNK_TILES;
    const descs: Desc[] = [];
    const rng = rngSeed(idx ^ 0x9e3779b1);

    // Heights
    const heights: number[] = [];
    for (let t = leftTile; t <= rightTile; t++) heights.push(rawSurfaceY(t));

    // Slope constraints
    for (let i = 1; i < heights.length; i++) {
      const up = heights[i] - heights[i - 1];
      if (up > MAX_UP_STEP) heights[i] = heights[i - 1] + MAX_UP_STEP;
      const down = heights[i - 1] - heights[i];
      if (down > MAX_DOWN_STEP) heights[i] = heights[i - 1] - MAX_DOWN_STEP;
    }
    for (let i = heights.length - 2; i >= 0; i--) {
      const up = heights[i] - heights[i + 1];
      if (up > MAX_UP_STEP) heights[i] = heights[i + 1] + MAX_UP_STEP;
      const down = heights[i + 1] - heights[i];
      if (down > MAX_DOWN_STEP) heights[i] = heights[i + 1] - MAX_DOWN_STEP;
    }

    // Solid runs
    let runStartTile = leftTile;
    let prevY = heights[0];
    for (let t = leftTile + 1; t <= rightTile + 1; t++) {
      const ai = t - leftTile;
      const y = ai <= CHUNK_TILES ? heights[ai] : NaN;
      if (y !== prevY) {
        const runTiles = t - runStartTile;
        descs.push({
          kind: "solid",
          x: runStartTile * TILE,
          y: prevY,
          w: runTiles * TILE,
          h: GROUND_THICK,
        });
        runStartTile = t;
        prevY = y;
      }
    }

    // Keep solids list for coin reach checks
    const solids = () => descs.filter(d => d.kind === "solid") as Extract<Desc, { kind: "solid" }>[];

    // Tunnel
    const midTile = (leftTile + rightTile) / 2;
    const nearSpawn = Math.abs(midTile - baseTileOffset) <= SAFE_RADIUS_TILES + 4;
    let tunnelSpan: { start: number; end: number; floorY: number; roofY: number } | null = null;

    if (!nearSpawn && rng() < TUNNEL_CHANCE) {
      const widthTiles = randInt(rng, TUNNEL_MIN_W, TUNNEL_MAX_W);
      const startTile = leftTile + randInt(rng, 2, CHUNK_TILES - widthTiles - 2);
      const endTile = startTile + widthTiles;
      const baseY = heights[startTile - leftTile];
      const roofY = baseY - randInt(rng, 24, 38);
      const floorY = roofY + Math.max(MIN_CLEAR, 84);

      // Carve: remove overlapping solid slices
      for (let i = descs.length - 1; i >= 0; i--) {
        const s = descs[i];
        if (s.kind !== "solid") continue;
        const sL = s.x;
        const sR = s.x + s.w;
        const tL = startTile * TILE;
        const tR = endTile * TILE;
        if (sR <= tL || sL >= tR) continue;
        descs.splice(i, 1);
        if (sL < tL) {
          descs.push({ kind: "solid", x: sL, y: s.y, w: tL - sL, h: s.h });
        }
        if (sR > tR) {
          descs.push({ kind: "solid", x: tR, y: s.y, w: sR - tR, h: s.h });
        }
      }

      // Add tunnel floor & roof
      descs.push({
        kind: "solid",
        x: startTile * TILE,
        y: floorY,
        w: widthTiles * TILE,
        h: FLOOR_THICK,
      });
      descs.push({
        kind: "solid",
        x: startTile * TILE,
        y: roofY - ROOF_THICK,
        w: widthTiles * TILE,
        h: ROOF_THICK,
      });

      tunnelSpan = { start: startTile, end: endTile, floorY, roofY };

      // Coins in tunnel (midline) – reachable (midline ~ (floor+roof)/2)
      const midY = roofY + (floorY - roofY) / 2;
      const coinCount = Math.max(3, Math.floor(widthTiles * TUNNEL_COIN_DENSITY * 10));
      for (let i = 0; i < coinCount; i++) {
        const tx = startTile + 1 + Math.floor((i / (coinCount - 1)) * (widthTiles - 2));
        descs.push({
          kind: "coin",
          x: tx * TILE + TILE / 2,
          y: midY,
        });
      }

      // Easter egg (secret) near tunnel far end (inside, reachable)
      if (rng() < SECRET_CHANCE) {
        const secretTile = endTile - 2;
        const mid = midY;
        descs.push({
          kind: "egg",
          x: secretTile * TILE + TILE / 2,
          y: mid,
        });
      }
    }

    // Peak coins (ensure above a solid and within reach)
    const solidList = solids();
    for (let t = leftTile + 1; t < rightTile; t++) {
      if (Math.abs(t - baseTileOffset) <= SAFE_RADIUS_TILES) continue;
      // Skip tiles inside tunnel roof span (avoid floating coins over open hole)
      if (tunnelSpan && t >= tunnelSpan.start && t < tunnelSpan.end) continue;

      const idxLocal = t - leftTile;
      const y = heights[idxLocal];
      const ly = heights[idxLocal - 1];
      const ry = heights[idxLocal + 1];
      const isPeak = y < ly && y < ry;
      if (!isPeak) continue;
      if (Math.random() >= PEAK_COIN_CHANCE) continue;

      const coinX = t * TILE + TILE / 2;
      const baseSolid = solidList.find(s =>
        coinX > s.x + 8 && coinX < s.x + s.w - 8 && s.y === y
      );
      if (!baseSolid) continue;

      const coinY = y - 44;
      if (y - coinY > MAX_REACH_ABOVE) continue; // ensure reachable

      descs.push({ kind: "coin", x: coinX, y: coinY });
    }

    return descs;
  }

  function spawnDesc(d: Desc) {
    if (d.kind === "solid") {
      return k.add([
        k.pos(d.x, d.y),
        k.anchor("topleft"),
        k.rect(d.w, d.h),
        k.area(),
        k.body({ isStatic: true }),
        k.color(110, 110, 150),
        "solid",
      ]);
    }
    if (d.kind === "egg") {
      // Secret collectible (also tagged coin so existing logic picks it up)
      return k.add([
        k.pos(d.x, d.y),
        k.anchor("center"),
        k.rect(14, 14),
        k.area(),
        k.color(255, 215, 0),
        k.outline(2, k.rgb(255, 255, 160)),
        "coin",
        "egg",
      ]);
    }
    return k.add([
      k.pos(d.x, d.y),
      k.anchor("center"),
      k.sprite("coin"),
      k.area(),
      "coin",
    ]);
  }

  function hash32(n: number) {
    n |= 0;
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
    return (n ^ (n >>> 16)) >>> 0;
  }
  function noise(x: number, salt: number) {
    const i0 = Math.floor(x);
    const i1 = i0 + 1;
    const t = x - i0;
    const f = t * t * (3 - 2 * t);
    const h0 = hash32(i0 * 73856093 ^ salt) / 0xffffffff;
    const h1 = hash32(i1 * 19349663 ^ salt) / 0xffffffff;
    return h0 + (h1 - h0) * f;
  }
  function rngSeed(seed: number) {
    let s = hash32(seed);
    return () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randInt(r: () => number, a: number, b: number) {
    return a + Math.floor(r() * (b - a + 1));
  }
}