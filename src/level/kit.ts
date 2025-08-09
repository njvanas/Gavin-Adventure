import { k } from "../game";

export type Solid = ReturnType<typeof solid>;
const PURPLE = k.rgb(80, 76, 120);
const RED = k.rgb(200, 70, 70);
const GOLD = k.rgb(255, 220, 0);
const GREEN = k.rgb(80, 200, 120);
const DOOR = k.rgb(140, 140, 170);

export function solid(x: number, y: number, w: number, h: number, color = PURPLE) {
  return k.add([
    k.pos(x, y),
    k.rect(w, h),
    k.area(),
    k.body({ isStatic: true }),
    k.color(color.r, color.g, color.b),
    "solid",
  ]);
}

export function hazard(x: number, y: number, w: number, h: number) {
  return k.add([
    k.pos(x, y),
    k.rect(w, h),
    k.area(),
    k.body({ isStatic: true }),
    k.color(RED.r, RED.g, RED.b),
    "hazard",
  ]);
}

export function coin(x: number, y: number) {
  return k.add([
    k.pos(x, y),
    k.circle(4),
    k.area(),
    k.color(GOLD.r, GOLD.g, GOLD.b),
    "coin",
  ]);
}

export function checkpoint(x: number, y: number) {
  return k.add([
    k.pos(x, y),
    k.rect(8, 16),
    k.area(),
    k.color(GREEN.r, GREEN.g, GREEN.b),
    "checkpoint",
  ]);
}

export function exitDoor(x: number, y: number) {
  return k.add([
    k.pos(x, y),
    k.rect(16, 24),
    k.area(),
    k.color(DOOR.r, DOOR.g, DOOR.b),
    "exit",
  ]);
}

// Simple horizontal moving platform (back-and-forth)
export function movingPlatform(x: number, y: number, w = 60, h = 10, amp = 40, speed = 1.0) {
  const p = k.add([
    k.pos(x, y),
    k.rect(w, h),
    k.area(),
    k.body({ isStatic: true }),
    k.color(100, 100, 140),
    "mplatform",
    { t: 0, amp, speed },
  ]);
  k.onUpdate(() => {
    p.t += k.dt() * p.speed;
    p.move(Math.sin(p.t) * p.amp, 0);
  });
  return p;
}

// Collapsing platform: shakes, falls, respawns
export function collapsingPlatform(x: number, y: number, w = 48, h = 10, delay = 0.6, respawn = 2.0) {
  const make = () =>
    k.add([
      k.pos(x, y),
      k.rect(w, h),
      k.area(),
      k.body({ isStatic: true }),
      k.color(120, 100, 120),
      "cplatform",
      { armed: true },
    ]);

  let plat = make();

  // When player grounds on it, start collapse
  k.onCollide("player", "cplatform", (plr: any, cp: any) => {
    if (!cp.armed) return;
    cp.armed = false;
    // tiny shake
    const start = cp.pos.clone();
    let t = 0;
    const shake = k.onUpdate(() => {
      t += k.dt();
      cp.pos.x = start.x + Math.sin(t * 50) * 1.5;
    });
    k.wait(delay, () => {
      shake.cancel();
      // drop
      cp.use(k.body({ isStatic: false }));
      cp.gravityScale = 2;
      k.wait(respawn, () => {
        k.destroy(cp);
        plat = make();
      });
    });
  });

  return plat;
}
