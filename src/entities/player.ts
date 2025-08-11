import { k } from "../game";

export type Player = ReturnType<typeof spawnPlayer>;

export function spawnPlayer(p = k.vec2(64, 0)) {
  const SPEED = 220;
  const JUMP = 420;

  let hearts = 3;

  const plr = k.add([
    k.pos(p.x, p.y - 1),
    k.anchor("center"),
    // Rectangle body (no sprite) -> no duplicate width/height
    k.rect(14, 16),
    k.area(),
    k.body({ jumpForce: JUMP }),
    k.color(230, 230, 255),
    k.opacity(1),
    "player",
    { hearts },
  ]);

  const kaboomJump = plr.jump.bind(plr);

  // Input: move
  k.onKeyDown("left",  () => plr.move(-SPEED, 0));
  k.onKeyDown("a",     () => plr.move(-SPEED, 0));
  k.onKeyDown("right", () => plr.move( SPEED, 0));
  k.onKeyDown("d",     () => plr.move( SPEED, 0));

  // Input: jump on key press (space / up / w)
  k.onKeyPress("space", () => {
    if (plr.isGrounded()) kaboomJump(JUMP);
  });
  k.onKeyPress("up", () => {
    if (plr.isGrounded()) kaboomJump(JUMP);
  });
  k.onKeyPress("w", () => {
    if (plr.isGrounded()) kaboomJump(JUMP);
  });

  // OPTIONAL: allow slight coyote time / jump buffering (uncomment if desired)
  // let coyote = 0;
  // let buffer = 0;
  // k.onUpdate(() => {
  //   coyote = plr.isGrounded() ? 0.08 : Math.max(0, coyote - k.dt());
  //   buffer = Math.max(0, buffer - k.dt());
  //   if (buffer > 0 && coyote > 0) {
  //     kaboomJump(JUMP);
  //     buffer = 0;
  //     coyote = 0;
  //   }
  // });
  // k.onKeyPress(["space","up","w"], () => { buffer = 0.1; });

  // Debug overlay
  const debugText = k.add([
    k.text("", { size: 10 }),
    k.pos(8, 28),
    k.fixed(),
    k.color(200, 200, 220),
  ]);
  k.onUpdate(() => {
    debugText.text = `grounded:${plr.isGrounded()} vy:${Math.round(plr.vel.y)}`;
  });

  // Camera follow
  k.onUpdate(() => k.camPos(plr.pos));

  // Cap fall speed
  k.onUpdate(() => { if (plr.vel.y > 900) plr.vel.y = 900; });

  function flash(duration = 0.08, low = 0.3) {
    plr.opacity = low;
    k.wait(duration, () => { if (plr.exists()) plr.opacity = 1; });
  }

  function damage(n = 1) {
    hearts = Math.max(0, hearts - n);
    (plr as any).hearts = hearts;
    flash();
    if (hearts <= 0) {
      k.wait(0.05, () => {
        plr.pos = p.clone();
        hearts = 3;
        (plr as any).hearts = hearts;
        plr.vel = k.vec2(0, 0);
        plr.opacity = 1;
      });
    }
  }

  return Object.assign(plr, { damage, getHearts: () => hearts });
}  