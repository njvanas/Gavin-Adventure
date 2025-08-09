import { k } from "../game";
import type { Vec2 } from "kaboom";

export type CamOpts = {
  deadW?: number; // dead-zone width
  deadH?: number; // dead-zone height
  lerp?: number;  // 0..1 (smaller = smoother)
  clampMin?: { x: number; y: number };
};

export function makeSmoothCamera(targetGetter: () => Vec2, opts: CamOpts = {}) {
  const deadW = opts.deadW ?? 140;
  const deadH = opts.deadH ?? 90;
  const lerpF = opts.lerp ?? 0.15;
  const clampMin = opts.clampMin ?? { x: 0, y: 0 };

  // Internal desired camera pos
  let desired = k.vec2(0, 0);

  function update() {
    const t = targetGetter();
    // Current cam center
    const cam = k.camPos();

    // Dead-zone box centered on cam
    const left   = cam.x - deadW / 2;
    const right  = cam.x + deadW / 2;
    const top    = cam.y - deadH / 2;
    const bottom = cam.y + deadH / 2;

    // If target outside the box, shift desired center
    desired = cam.clone();
    if (t.x < left)   desired.x = t.x + deadW / 2;
    if (t.x > right)  desired.x = t.x - deadW / 2;
    if (t.y < top)    desired.y = t.y + deadH / 2;
    if (t.y > bottom) desired.y = t.y - deadH / 2;

    // Clamp desired
    desired.x = Math.max(clampMin.x, desired.x);
    desired.y = Math.max(clampMin.y, desired.y);

    // Lerp toward desired
    const nx = cam.x + (desired.x - cam.x) * lerpF;
    const ny = cam.y + (desired.y - cam.y) * lerpF;
    k.camPos(k.vec2(nx, ny));
  }

  return { update };
}

