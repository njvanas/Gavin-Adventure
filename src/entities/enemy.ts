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

  const enemy = k.add([
    k.pos(x, y),
    k.area(),
    k.body(),
    k.anchor("center"),
    k.rect(width, height),
    k.color(160, 70, 160),
    "enemy",
    {
      dir: leftFirst ? -1 : 1,
      speed,
      edgeTimer: 0, // detects leaving ground
    },
  ]);

  // Move & simple edge safety
  k.onUpdate(() => {
    if (!enemy.exists() || isPaused()) return;

    // Horizontal patrol
    enemy.move((enemy as any).dir * (enemy as any).speed, 0);

    // If not grounded for a bit while moving horizontally, reverse.
    if (!enemy.isGrounded()) {
      (enemy as any).edgeTimer += k.dt();
      if ((enemy as any).edgeTimer > 0.12) {
        (enemy as any).dir *= -1;
        (enemy as any).edgeTimer = 0;
        // small nudge back to platform
        enemy.move((enemy as any).dir * 10, 0);
      }
    } else {
      (enemy as any).edgeTimer = 0;
    }
  });

  // Flip on hitting walls/solids
  enemy.onCollide("solid", () => {
    (enemy as any).dir *= -1;
  });

  return enemy;
}

