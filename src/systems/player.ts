import { k } from "../game";

export type Player = ReturnType<typeof spawnPlayer>;

export function spawnPlayer(p = k.vec2(64, 0)) {
  const SPEED = 220;
  const JUMP = 420;

  let hearts = 3;

  const plr = k.add([
    k.pos(p.x, p.y - 1),
    k.anchor("center"),
    k.rect(14, 16),
    k.area(),
    k.body({ jumpForce: JUMP }),   // default jump force
    k.color(230, 230, 255),
    k.opacity(1),                  // for flash()
    { hearts },
  ]);

  // Save the original Kaboom jump function so we can call it safely
  const kaboomJump = plr.jump.bind(plr);

  const debugText = k.add([
    k.text("", { size: 10 }),
    k.pos(8, 28),
    k.fixed(),
    k.color(200, 200, 220),
  ]);

  k.onUpdate(() => {
    debugText.text = [
      `grounded: ${plr.isGrounded()}`,
      `vy: ${Math.round(plr.vel.y)}`,
      `pos: ${Math.round(plr.pos.x)},${Math.round(plr.pos.y)}`
    ].join("  ");
  });

  // camera follows
  k.onUpdate(() => {
    k.camPos(k.vec2(plr.pos.x, plr.pos.y));
  });

  // Horizontal input
  k.onKeyDown("left",  () => plr.move(-SPEED, 0));
  k.onKeyDown("a",     () => plr.move(-SPEED, 0));
  k.onKeyDown("right", () => plr.move( SPEED, 0));
  k.onKeyDown("d",     () => plr.move( SPEED, 0));

  // Jump (use saved kaboomJump, don't overwrite plr.jump)
  k.onKeyPress("space", () => { if (plr.isGrounded()) kaboomJump(JUMP); });
  k.onKeyPress("up",    () => { if (plr.isGrounded()) kaboomJump(JUMP); });
  k.onKeyPress("w",     () => { if (plr.isGrounded()) kaboomJump(JUMP); });

  // expose a helper WITHOUT clobbering plr.jump
  function doJump() {
    if (plr.isGrounded()) kaboomJump(JUMP);
  }

  // simple visual flash helper
  function flash(duration = 0.08, low = 0.3) {
    plr.opacity = low;
    k.wait(duration, () => { plr.opacity = 1; });
  }

  // cap fall speed a bit
  k.onUpdate(() => {
    if (plr.vel.y > 900) plr.vel.y = 900;
  });

  // simple damage API
  function damage(n = 1) {
    hearts = Math.max(0, hearts - n);
    (plr as any).hearts = hearts;
    flash(); // visual feedback

    if (hearts <= 0) {
      // respawn quick and reset hearts
      k.wait(0.05, () => {
        plr.pos = p.clone();
        hearts = 3;
        (plr as any).hearts = hearts;
        plr.vel = k.vec2(0, 0);
        plr.opacity = 1;
      });
    }
  }

  // Note: we DO NOT include `jump:` here, to avoid overriding Kaboom's method.
  return Object.assign(plr, { damage, getHearts: () => hearts, doJump });
}
