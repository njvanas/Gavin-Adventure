import { k } from "../game";
import type { Vec2, Key } from "kaboom";

export type Player = ReturnType<typeof spawnPlayer>;

// Y offset so the player starts slightly above the spawn point and
// drops down onto the platform instead of appearing inside it.
export const SPAWN_Y_OFFSET = 24;

export function spawnPlayer(p: Vec2 = k.vec2(64, 0)) {
  const SPEED = 220;
  const JUMP = 420;
  const COYOTE = 0.10;
  const BUFFER = 0.08;

  let hearts = 3;
  let coyoteLeft = 0;
  let bufferLeft = 0;
  let jumping = false;
  let iFrames = 0;

  const plr = k.add([
    // Start above the provided position so gravity can settle the
    // character naturally on the platform.
    k.pos(p.x, p.y - SPAWN_Y_OFFSET),
    k.anchor("center"),
    k.rect(14, 16),
    k.area(),
    k.body({ jumpForce: JUMP }),
    k.color(230, 230, 255),
    k.opacity(1),
    { hearts },
  ]);

  // Preserve original Kaboom jump
  const kaboomJump = plr.jump.bind(plr);

  // Debug text
  const debug = k.add([
    k.text("", { size: 10 }),
    k.pos(8, 28),
    k.fixed(),
    k.color(200, 200, 220),
  ]);

  // Update loop for timers & debug
  k.onUpdate(() => {
    coyoteLeft = plr.isGrounded() ? COYOTE : Math.max(0, coyoteLeft - k.dt());

    if (bufferLeft > 0 && coyoteLeft > 0) {
      kaboomJump(JUMP);
      bufferLeft = 0;
      jumping = true;
    } else if (bufferLeft > 0) {
      bufferLeft = Math.max(0, bufferLeft - k.dt());
    }

    if (plr.vel.y > 900) plr.vel.y = 900;
    if (iFrames > 0) iFrames = Math.max(0, iFrames - k.dt());
    if (plr.isGrounded()) jumping = false;

    debug.text = `grounded: ${plr.isGrounded()}  vy: ${Math.round(plr.vel.y)}  pos: ${Math.round(plr.pos.x)},${Math.round(plr.pos.y)}`;
  });

  // Camera follow (scene clamps as needed)
  k.onUpdate(() => k.camPos(k.vec2(plr.pos.x, plr.pos.y)));

  // Horizontal movement
  k.onKeyDown("left", () => plr.move(-SPEED, 0));
  k.onKeyDown("a", () => plr.move(-SPEED, 0));
  k.onKeyDown("right", () => plr.move(SPEED, 0));
  k.onKeyDown("d", () => plr.move(SPEED, 0));

  // Jump input with buffer
  const JUMP_KEYS: Key[] = ["space", "w", "up"];
  const queueJump = () => { bufferLeft = BUFFER; };
  JUMP_KEYS.forEach((key) => k.onKeyPress(key, queueJump));

  // Variable jump height
  JUMP_KEYS.forEach((key) => {
    k.onKeyRelease(key, () => {
      if (jumping && plr.vel.y < 0) plr.vel.y *= 0.45;
      jumping = false;
    });
  });

  function flash(duration = 0.08, low = 0.3) {
    plr.opacity = low;
    k.wait(duration, () => { plr.opacity = 1; });
  }

  function damage(n = 1) {
    if (iFrames > 0) return;
    hearts = Math.max(0, hearts - n);
    (plr as any).hearts = hearts;
    iFrames = 0.8;
    flash();
  }

  function doJump() {
    if (plr.isGrounded()) kaboomJump(JUMP);
  }

  return Object.assign(plr, {
    damage,
    getHearts: () => hearts,
    doJump,
  });
}
