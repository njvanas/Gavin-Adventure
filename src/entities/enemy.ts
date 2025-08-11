import { k } from "../game";
import { isPaused } from "../systems/pause";

export type PatrollerOptions = {
  x: number;
  y: number;
  speed?: number;   // px/s
  width?: number;
  height?: number;
  leftFirst?: boolean;
};

export function spawnPatroller(opts: PatrollerOptions) {
  const {
    x, y,
    speed = 60,
    width = 14,
    height = 12,
    leftFirst = true,
  } = opts;

const e = k.add([
    k.pos(x, y),
    k.sprite("enemy_slime"),
    k.area(),
    k.body(),
    k.anchor("center"),
    "enemy",
    { dir: 1, speed: 50 },
  ]);
  try { (e as any).play("walk"); } catch {}

  // Move & simple edge safety
  k.onUpdate(() => {
    if (!e.exists() || isPaused()) return;

    // Horizontal patrol
    e.move((e as any).dir * (e as any).speed, 0);
    (e as any).flipX = (e as any).dir > 0;

    // If not grounded for a bit while moving horizontally, reverse.
    if (!e.isGrounded()) {
      (e as any).edgeTimer += k.dt();
      if ((e as any).edgeTimer > 0.12) {
        (e as any).dir *= -1;
        (e as any).edgeTimer = 0;
        // small nudge back to platform
        e.move((e as any).dir * 10, 0);
      }
    } else {
      (e as any).edgeTimer = 0;
    }
  });

  // Flip on hitting walls/solids
  e.onCollide("solid", () => {
    (e as any).dir *= -1;
  });

  return e;
}

