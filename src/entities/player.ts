import { k } from "../game";

export type Player = ReturnType<typeof spawnPlayer>;

export function spawnPlayer(p = k.vec2(64, 0), useStickman = true) {
  const SPEED = 220;
  const JUMP = 420;

  let hearts = 3;
  let ducking = false;

  const plr = k.add([
    k.pos(p.x, p.y - 1),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(-7, -16), 14, 32) }),
    k.body({ jumpForce: JUMP }),
    k.rect(14, 32),
    k.color(230, 230, 255),
    k.opacity(useStickman ? 0 : 1),
    "player",
    { hearts },
  ]);

  // Stickman parts
  let torso: any, head: any, leftArm: any, rightArm: any, leftLeg: any, rightLeg: any;
  let parts: any[] = [];

  if (useStickman) {
    function part(tag: string, ox: number, oy: number, comps: any[]) {
      const obj = k.add([
        k.pos(plr.pos.x + ox, plr.pos.y + oy),
        k.anchor("center"),
        k.scale(1),
        ...comps,
        tag,
        { ox, oy },
      ]);
      parts.push(obj);
      return obj;
    }

    torso = part("torso", 0, -6, [k.rect(6, 22, { radius: 3 }), k.color(50, 50, 50), k.z(1)]);
    head = part("head", 0, -22, [k.rect(14, 14, { radius: 7 }), k.color(230, 230, 230), k.z(2)]);
    leftArm = part("leftArm", -5, -12, [k.rect(4, 16, { radius: 2 }), k.color(40, 40, 40), k.z(1)]);
    rightArm = part("rightArm", 5, -12, [k.rect(4, 16, { radius: 2 }), k.color(40, 40, 40), k.z(1)]);
    leftLeg = part("leftLeg", -4, 6, [k.rect(4, 18, { radius: 2 }), k.color(40, 40, 40), k.z(0)]);
    rightLeg = part("rightLeg", 4, 6, [k.rect(4, 18, { radius: 2 }), k.color(40, 40, 40), k.z(0)]);

    (plr as any)._animT = 0;

    plr.onUpdate(() => {
      if (!torso?.exists()) return; // parts destroyed (scene change)

      // Follow player
      for (const prt of parts) {
        if (!prt.exists()) continue;
        prt.pos.x = plr.pos.x + prt.ox;
        prt.pos.y = plr.pos.y + prt.oy;
      }

      const grounded = plr.isGrounded();
      const moving = Math.abs(plr.vel.x) > 5 && grounded && !ducking;
      (plr as any)._animT += k.dt() * (moving ? 10 : 4);
      const t = (plr as any)._animT;
      const swing = moving ? Math.sin(t) : 0;

      if (ducking) {
        // Duck pose
        torso.scale.y = 0.6;
        torso.pos.y = plr.pos.y - 2;
        head.pos.y = plr.pos.y - 12;
        leftArm.angle = 70;
        rightArm.angle = -70;
        leftLeg.angle = 40;
        rightLeg.angle = -40;
      } else {
        torso.scale.y = 1;
        torso.pos.y = plr.pos.y - 6;
        head.pos.y = plr.pos.y - 22 + (moving ? Math.sin(t * 2) * 1.5 : 0);
        const legAmp = moving ? 28 : 0;
        const armAmp = moving ? 32 : 0;
        leftLeg.angle = swing * legAmp;
        rightLeg.angle = -swing * legAmp;
        leftArm.angle = -swing * armAmp;
        rightArm.angle = swing * armAmp;
      }

      // Flip direction
      const dir = plr.vel.x < -5 ? -1 : plr.vel.x > 5 ? 1 : 0;
      if (dir) {
        for (const prt of parts) if (prt.exists()) prt.scale.x = dir;
      }
    });
  }

  // Input
  const moveLeft = () => { if (!ducking) plr.move(-SPEED, 0); };
  const moveRight = () => { if (!ducking) plr.move(SPEED, 0); };
  k.onKeyDown("left", moveLeft);
  k.onKeyDown("a", moveLeft);
  k.onKeyDown("right", moveRight);
  k.onKeyDown("d", moveRight);

  for (const key of ["space", "up", "w"]) {
    k.onKeyPress(key, () => {
      if (ducking) return;
      if (plr.isGrounded()) plr.jump(JUMP);
    });
  }

  // Duck controls
  function setDuck(on: boolean) {
    if (ducking === on) return;
    ducking = on;
    // Optional: adjust collider height (kept same for simplicity)
  }
  k.onKeyDown("down", () => setDuck(true));
  k.onKeyDown("s", () => setDuck(true));
  k.onKeyRelease("down", () => setDuck(false));
  k.onKeyRelease("s", () => setDuck(false));

  // Cap fall speed
  plr.onUpdate(() => { if (plr.vel.y > 900) plr.vel.y = 900; });

  function flash(duration = 0.08, low = 0.3) {
    plr.opacity = low;
    k.wait(duration, () => { if (plr.exists()) plr.opacity = useStickman ? 0 : 1; });
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
        plr.opacity = useStickman ? 0 : 1;
      });
    }
  }

  return Object.assign(plr, { damage, getHearts: () => hearts });
}