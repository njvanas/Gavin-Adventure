import { k } from "../game";
import { spawnPlayer, SPAWN_Y_OFFSET } from "../entities/player";
import { solid, hazard, coin, checkpoint, exitDoor, movingPlatform, collapsingPlatform } from "../level/kit";
import { spawnPatroller } from "../entities/enemy";
import { isPaused, setPaused } from "../systems/pause";
import { makeSmoothCamera } from "../systems/camera";
import { makeParallax } from "../systems/parallax";
import { sfxCoin, sfxHit, sfxCheckpoint, sfxExit } from "../audio/sfx";
import type { RunStats } from "../systems/progress";

export default function level1_long() {
  k.setGravity(1200);

  // Build parallax first so it sits behind world
  const par = makeParallax();

  const levelId = "level1_long";

  // ---- WORLD SCALE ----
  // Each "screen" ~ 320px wide. We'll build ~15 screens long (~4800px).
  const groundY = 200;
  const screenW = 320;
  const startX = 120;

  // Player
  const spawn = k.vec2(startX, groundY - 24);
  const plr = spawnPlayer(spawn.clone());
  (plr as any).addTag?.("player"); // in case your player adds tags; tolerated if missing

  // ---- Run Stats ----
  const startTime = Date.now();
  let coinsCollected = 0;
  let deaths = 0;

  // UI
  let respawn = spawn.clone();
  const scoreText = k.add([k.text("0"), k.pos(8, 8), k.fixed()]);
  const heartsUI = k.add([k.text("❤❤❤"), k.pos(8, 18), k.fixed()]);

  // Hearts text updater
  k.onUpdate(() => {
    const h = (plr as any).hearts ?? 3;
    heartsUI.text = "❤".repeat(h) + " ".repeat(Math.max(0, 3 - h));
  });

  // ----- Pause Overlay -----
  const overlay = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(0, 0, 0),
    k.fixed(),
    k.opacity(0),
    { visible: false },
  ]);

  const pauseText = k.add([
    k.text("Paused\n[ESC] Resume   [M] Mute SFX", { size: 16, width: 280, align: "center" }),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.color(220, 220, 240),
    k.fixed(),
    k.opacity(0),
  ]);

  function showPauseUI(show: boolean) {
    overlay.opacity = show ? 0.35 : 0;
    (overlay as any).visible = show;
    pauseText.opacity = show ? 1 : 0;
  }

  function togglePause() {
    const p = !isPaused();
    setPaused(p);
    showPauseUI(p);
  }

  k.onKeyPress("escape", togglePause);

  // Optional: quick mute toggle while paused
  import("../audio/sfx").then(({ sfxMute, sfxIsMuted }) => {
    k.onKeyPress("m", () => {
      if (!isPaused()) return;
      sfxMute(!sfxIsMuted());
      pauseText.text = `Paused\n[ESC] Resume   [M] Mute SFX: ${sfxIsMuted() ? "ON" : "OFF"}`;
    });
  });

  // Smooth camera targeting the player
  const cam = makeSmoothCamera(() => plr.pos.clone(), {
    deadW: 140,
    deadH: 90,
    lerp: 0.18,
    clampMin: { x: 0, y: 0 },
  });

  // Camera & parallax updater
  k.onUpdate(() => {
    if (!isPaused()) {
      cam.update();
      par.update();
    }
  });

  // --- SECTION HELPERS ---
  const ground = (sx: number, tiles: number) => solid(sx, groundY, tiles * 32, 24);
  const pit = (sx: number, tiles: number) => hazard(sx, groundY, tiles * 32, 24);

  // ====== SECTION 1: Tutorial Grounds (1 screen) ======
  ground(0, 10);
  coin(startX + 40, groundY - 40);

  // Small 1-tile hop
  pit(10 * 32, 1);
  ground(11 * 32, 4);

  // ====== SECTION 2: Floating Coin Path (~1.5 screens) ======
  ground(15 * 32, 10);
  solid(16 * 32 + 24, groundY - 60, 60, 10);
  coin(16 * 32 + 54, groundY - 80);
  coin(17 * 32 + 20, groundY - 48);
  coin(18 * 32 + 10, groundY - 64);

  // First hazard pit
  pit(25 * 32, 2);
  ground(27 * 32, 5);

  // ====== SECTION 3: Staggered Platforms (~1.5 screens) ======
  solid(28 * 32 + 0, groundY - 40, 50, 10);
  solid(29 * 32 + 10, groundY - 70, 60, 10);
  solid(30 * 32 + 12, groundY - 100, 70, 10);
  coin(30 * 32 + 52, groundY - 120);
  ground(32 * 32, 8);

  // ====== SECTION 4: Double Hazard Gaps (1 screen) ======
  pit(40 * 32, 2);
  ground(42 * 32, 2);
  pit(44 * 32, 2);
  ground(46 * 32, 6);
  coin(42 * 32 + 24, groundY - 70);

  // ====== SECTION 5: Moving Platform #1 (~1.5 screens) ======
  pit(52 * 32, 4);
  movingPlatform(54 * 32, groundY - 40, 70, 10, 60, 0.9);
  coin(55 * 32, groundY - 80);
  ground(56 * 32, 7);

  // ====== SECTION 6: Checkpoint Cliff (1 screen) ======
  solid(63 * 32, groundY - 32, 48, 10);
  checkpoint(63 * 32 + 12, groundY - 48);
  ground(64 * 32, 6);

  // ====== SECTION 7: Vertical Climb (~1.5 screens) ======
  solid(66 * 32, groundY - 60, 60, 10);
  solid(67 * 32 + 40, groundY - 90, 60, 10);
  solid(68 * 32 + 80, groundY - 120, 60, 10);
  coin(68 * 32 + 110, groundY - 140);
  ground(70 * 32, 6);

  // ====== SECTION 8: Collapsing Platforms (~1.5 screens) ======
  pit(76 * 32, 5);
  collapsingPlatform(77 * 32, groundY - 40, 60, 10);
  collapsingPlatform(79 * 32 + 10, groundY - 60, 60, 10);
  coin(78 * 32 + 20, groundY - 90);
  ground(81 * 32, 6);

  // ====== SECTION 9: Hazard Gauntlet (~2 screens) ======
  pit(87 * 32, 3); // wide pit with moving platform
  movingPlatform(88 * 32, groundY - 50, 70, 10, 80, 1.1);
  ground(90 * 32, 2);
  pit(92 * 32, 1);
  ground(93 * 32, 2);
  pit(95 * 32, 1);
  ground(96 * 32, 8);
  coin(94 * 32, groundY - 70);
  coin(96 * 32 + 40, groundY - 70);

  // ====== SECTION 10: Victory Run (~2 screens) ======
  ground(104 * 32, 10);
  coin(105 * 32, groundY - 48);
  coin(106 * 32, groundY - 56);
  const door = exitDoor(113 * 32 + 24, groundY - 24);

  // ===== ENEMIES: placements =====
  const e1 = spawnPatroller({ x: 18 * 32 + 40, y: groundY - 24, speed: 60, leftFirst: true });
  const e2 = spawnPatroller({ x: 33 * 32 + 40, y: groundY - 24, speed: 70, leftFirst: false });
  const e3 = spawnPatroller({ x: 47 * 32 + 30, y: groundY - 24, speed: 65, leftFirst: true });
  const e4 = spawnPatroller({ x: 97 * 32 + 50, y: groundY - 24, speed: 80, leftFirst: false });

  // ----- Collisions / rules -----
  plr.onCollide("coin", (c: any) => {
    if (!c.exists()) return;
    k.destroy(c);
    coinsCollected += 1;
    scoreText.text = String(coinsCollected);
    sfxCoin();
  });

  // Stomp vs. damage
  plr.onCollide("enemy", (e: any) => {
    // Stomp if player is falling and above the enemy's center
    if (plr.vel.y > 0 && plr.pos.y < e.pos.y - 4) {
      // Bounce the player and destroy enemy
      plr.jump(320);               // gentle bounce; doesn't overwrite plr.jump
      // Small "poof" effect (placeholder)
      k.add([k.pos(e.pos.x, e.pos.y), k.rect(8, 4), k.color(220, 200, 240), k.lifespan(0.15)]);
      k.destroy(e);
    } else {
      // Side hit: damage player
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

  // Basic respawn when hearts hit 0 (track deaths)
  k.onUpdate(() => {
    const hearts = (plr as any).getHearts?.() ?? 3;
    if (hearts <= 0) {
      deaths += 1;
      k.wait(0.05, () => {
        plr.pos = respawn.clone().sub(k.vec2(0, SPAWN_Y_OFFSET));
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
      nextScene: "level2",
    };
    k.go("level_end", payload);
  });
}
