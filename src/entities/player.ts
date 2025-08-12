import { k } from "../game";

export type Player = ReturnType<typeof spawnPlayer>;

export function spawnPlayer(p = k.vec2(64, 0), useStickman = false) {
  const SPEED = 220;
  const JUMP = 420;

  let hearts = 3;
  let ducking = false;

  const plr = k.add([
    k.pos(p.x, p.y - 1),
    k.anchor("center"),
    k.sprite("player"),
    k.area({ shape: new k.Rect(k.vec2(-12, -16), 24, 32) }),
    k.body({ jumpForce: JUMP }),
    k.rect(24, 32),
    k.color(255, 255, 255),
    k.opacity(useStickman ? 0 : 1),
    "player",
    { hearts },
  ]);

  // Play idle animation by default
  try { (plr as any).play("idle"); } catch {}

  // Input
  const moveLeft = () => { 
    if (!ducking) {
      plr.move(-SPEED, 0);
      try { (plr as any).play("run"); } catch {}
      (plr as any).flipX = true;
    }
  };
  const moveRight = () => { 
    if (!ducking) {
      plr.move(SPEED, 0);
      try { (plr as any).play("run"); } catch {}
      (plr as any).flipX = false;
    }
  };
  k.onKeyDown("left", moveLeft);
  k.onKeyDown("a", moveLeft);
  k.onKeyDown("right", moveRight);
  k.onKeyDown("d", moveRight);

  // Stop animation when not moving
  k.onUpdate(() => {
    if (Math.abs(plr.vel.x) < 5 && plr.isGrounded() && !ducking) {
      try { (plr as any).play("idle"); } catch {}
    }
  });

  for (const key of ["space", "up", "w"]) {
    k.onKeyPress(key, () => {
      if (ducking) return;
      if (plr.isGrounded()) {
        plr.jump(JUMP);
        try { (plr as any).play("jump"); } catch {}
      }
    });
  }

  // Duck controls
  function setDuck(on: boolean) {
    if (ducking === on) return;
    ducking = on;
    if (on) {
      plr.scale.y = 0.7;
      plr.area.shape = new k.Rect(k.vec2(-12, -8), 24, 24);
    } else {
      plr.scale.y = 1;
      plr.area.shape = new k.Rect(k.vec2(-12, -16), 24, 32);
    }
  }
  k.onKeyDown("down", () => setDuck(true));
  k.onKeyDown("s", () => setDuck(true));
  k.onKeyRelease("down", () => setDuck(false));
  k.onKeyRelease("s", () => setDuck(false));

  // Cap fall speed
  plr.onUpdate(() => { 
    if (plr.vel.y > 900) plr.vel.y = 900;
    if (plr.vel.y > 5 && !plr.isGrounded()) {
      try { (plr as any).play("fall"); } catch {}
    }
  });

  function flash(duration = 0.08, low = 0.3) {
    plr.opacity = low;
    k.wait(duration, () => { if (plr.exists()) plr.opacity = useStickman ? 0 : 1; });
  }

  function damage(n = 1) {
    hearts = Math.max(0, hearts - n);
    (plr as any).hearts = hearts;
    flash();
    try { (plr as any).play("hurt"); } catch {}
    if (hearts <= 0) {
      k.wait(0.05, () => {
        plr.pos = p.clone();
        hearts = 3;
        (plr as any).hearts = hearts;
        plr.vel = k.vec2(0, 0);
        plr.opacity = useStickman ? 0 : 1;
        plr.scale.y = 1;
        plr.area.shape = new k.Rect(k.vec2(-12, -16), 24, 32);
      });
    }
  }

  return Object.assign(plr, { damage, getHearts: () => hearts });
}