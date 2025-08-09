import { k } from "../game";
import { spawnPlayer } from "../entities/player";
import { solid, hazard, coin, checkpoint, exitDoor, movingPlatform, collapsingPlatform } from "../level/kit";

export default function level1_long() {
  k.setGravity(1200);

  // ---- WORLD SCALE ----
  // Each "screen" ~ 320px wide. We'll build ~15 screens long (~4800px).
  const groundY = 200;
  const screenW = 320;
  const startX = 120;

  // Player
  const spawn = k.vec2(startX, groundY - 24);
  const plr = spawnPlayer(spawn.clone());
  (plr as any).addTag?.("player"); // in case your player adds tags; tolerated if missing

  // UI
  let score = 0;
  let respawn = spawn.clone();
  const scoreText = k.add([k.text("0"), k.pos(8, 8), k.fixed()]);
  const heartsUI = k.add([k.text("❤❤❤"), k.pos(8, 18), k.fixed()]);

  // Hearts text updater
  k.onUpdate(() => {
    const h = (plr as any).hearts ?? 3;
    heartsUI.text = "❤".repeat(h) + " ".repeat(Math.max(0, 3 - h));
  });

  // Camera follow + gentle clamp
  k.onUpdate(() => {
    const target = k.vec2(Math.max(160, plr.pos.x), Math.max(90, plr.pos.y));
    k.camPos(target);
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

  // Patroller placeholder area (enemy can be added later)

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

  // ----- Collisions / rules -----
  plr.onCollide("coin", (c: any) => { k.destroy(c); score += 1; scoreText.text = String(score); });

  plr.onCollide("hazard", () => {
    (plr as any).damage?.(1);
    k.shake(2);
  });

  plr.onCollide("checkpoint", (f: any) => {
    respawn = f.pos.clone();
  });

  // Basic respawn when hearts hit 0
  k.onUpdate(() => {
    const hearts = (plr as any).getHearts?.() ?? 3;
    if (hearts <= 0) {
      k.wait(0.05, () => {
        plr.pos = respawn.clone();
        (plr as any).hearts = 3;
        plr.vel = k.vec2(0, 0);
      });
    }
  });

  plr.onCollide("exit", () => k.go("level2"));
}
