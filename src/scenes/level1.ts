import { k } from "../game";
import { spawnPlayer } from "../entities/player";

export default function level1() {
  k.setGravity(1200);

  const groundY = 200;
  const spawn = k.vec2(160, groundY - 24);
  const plr = spawnPlayer(spawn.clone());

  // UI
  let score = 0;
  const scoreText = k.add([k.text("0"), k.pos(8, 8), k.fixed()]);
  const heartsText = k.add([k.text("❤❤❤"), k.pos(8, 18), k.fixed()]);

  k.onUpdate(() => {
    const hearts = (plr as any).hearts ?? 3;
    heartsText.text = "❤".repeat(hearts) + "";
  });

  // Camera follow with clamp
  k.onUpdate(() => {
    const cam = k.vec2(
      Math.max(160, plr.pos.x),
      Math.max(groundY - 110, plr.pos.y),
    );
    k.camPos(cam);
  });

  // Helpers
  const solid = (x: number, y: number, w: number, h: number, color = k.rgb(120, 80, 160)) =>
    k.add([
      k.pos(x, y),
      k.rect(w, h),
      k.area(),
      k.body({ isStatic: true }),
      k.color(color.r, color.g, color.b),
      "solid",
    ]);

  const hazard = (x: number, y: number, w: number, h: number) =>
    k.add([
      k.pos(x, y),
      k.rect(w, h),
      k.area(),
      k.body({ isStatic: true }),
      k.color(200, 70, 70),
      "hazard",
    ]);

  // Level layout
  solid(120, groundY, 420, 24);        // left floor
  hazard(540, groundY, 48, 24);        // gap hazard
  solid(588, groundY, 340, 24);        // right floor
  solid(380, groundY - 80, 64, 12);     // floating block

  // Moving platform
  const mplat = k.add([
    k.pos(520, groundY - 50),
    k.rect(60, 10),
    k.area(),
    k.body({ isStatic: true }),
    k.color(100, 100, 140),
    "solid",
    "mplatform",
  ]);
  const mStart = mplat.pos.clone();
  let t = 0;
  k.onUpdate(() => {
    t += k.dt();
    mplat.pos.x = mStart.x + Math.sin(t) * 40;
  });

  // Coins guiding jump arc
  const coin = (x: number, y: number) =>
    k.add([
      k.pos(x, y),
      k.circle(4),
      k.area(),
      k.color(255, 220, 0),
      "coin",
    ]);
  [420, 455, 490, 625].forEach((x, i) =>
    coin(x, groundY - 110 + (i % 2 ? -6 : 0)),
  );

  // Exit door
  k.add([
    k.pos(940, groundY - 24),
    k.rect(16, 24),
    k.area(),
    k.color(160, 160, 200),
    "exit",
  ]);

  // Checkpoint
  let respawn = spawn.clone();
  k.add([
    k.pos(700, groundY - 24),
    k.rect(8, 16),
    k.area(),
    k.color(80, 200, 120),
    "checkpoint",
  ]);

  // Collisions
  plr.onCollide("coin", (c) => {
    k.destroy(c);
    score += 1;
    scoreText.text = String(score);
  });

  plr.onCollide("hazard", () => {
    (plr as any).damage?.(1);
    if ((plr as any).getHearts?.() > 0) {
      k.shake(2);
    }
  });

  plr.onCollide("checkpoint", (c) => {
    respawn = c.pos.clone();
  });

  plr.onCollide("exit", () => k.go("level2"));

  // Respawn handling
  k.onUpdate(() => {
    if ((plr as any).getHearts?.() === 0) {
      k.wait(0.05, () => {
        plr.pos = respawn.clone();
        (plr as any).hearts = 3;
        plr.vel = k.vec2(0, 0);
      });
    }
  });
}
