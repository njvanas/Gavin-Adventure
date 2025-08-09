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

  // Display a small loading indicator so the screen isn't empty while
  // we fetch the level data. If the request fails we replace it with an
  // error message instead of leaving the user staring at a blank screen.
  const loadingText = k.add([k.text("Loading..."), k.pos(8, 8), k.fixed()]);

  // ---- Load Tiled map ----
  let built;
  try {
    const map = await loadTiledJSON("/levels/level1_long.json");
    built = buildFromTiled(map);
  } catch (err) {
    loadingText.text = "Failed to load level";
    console.error(err);
    return;
  }
  loadingText.destroy();

  // ---- Player ----
  const spawn = built.spawn ?? k.vec2(120, 256 - 24);
  const plr = spawnPlayer(spawn.clone());
  (plr as any).addTag?.("player");

  // ---- Run Stats ----
  const startTime = Date.now();
  let coinsCollected = 0;
  let deaths = 0;

  // ---- Camera ----
  const cam = makeSmoothCamera(() => plr.pos.clone(), {
    deadW: 140, deadH: 90, lerp: 0.18, clampMin: { x: 0, y: 0 },
  });

  k.onUpdate(() => {
    if (!isPaused()) { cam.update(); par.update(); }
  });

  // ---- UI ----
  const scoreText = k.add([k.text("0"), k.pos(8, 8), k.fixed()]);
  const heartsUI = k.add([k.text("❤❤❤"), k.pos(8, 18), k.fixed()]);
  k.onUpdate(() => {
    const h = (plr as any).hearts ?? 3;
    heartsUI.text = "❤".repeat(h) + " ".repeat(Math.max(0, 3 - h));
  });

  // ----- Collisions / rules -----
  let respawn = spawn.clone();

  plr.onCollide("coin", (c: any) => {
    if (!c.exists()) return;
    k.destroy(c);
    coinsCollected += 1;
    scoreText.text = String(coinsCollected);
    sfxCoin();
  });

  plr.onCollide("enemy", (e: any) => {
    if (plr.vel.y > 0 && plr.pos.y < e.pos.y - 4) {
      plr.jump(320);
      k.add([k.pos(e.pos.x, e.pos.y), k.rect(8, 4), k.color(220, 200, 240), k.lifespan(0.15)]);
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
    const h = (plr as any).getHearts?.() ?? 3;
    if (h <= 0) {
      deaths += 1;
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
    const payload = {
      stats: { levelId, timeMs, coins: coinsCollected, deaths } as RunStats,
      retryScene: "level1_long",
      nextScene:  "level2",
    };
    k.go("level_end", payload);
  });
}
