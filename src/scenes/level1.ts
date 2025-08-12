import { k } from "../game";
import { spawnPlayer, SPAWN_Y_OFFSET } from "../entities/player";
import { spawnPatroller } from "../entities/enemy";

export default function level1() {
  k.setGravity(1200);

  const groundY = 200;
  const spawn = k.vec2(160, groundY - 24);
  const plr = spawnPlayer(spawn.clone());

  // Add beautiful background
  k.add([
    k.pos(0, 0),
    k.sprite("background"),
    k.fixed(),
    k.z(-100)
  ]);

  // UI with modern styling
  let score = 0;
  const scoreText = k.add([
    k.text("Score: 0", { 
      size: 16, 
      font: "Arial"
    }), 
    k.pos(16, 16), 
    k.fixed(),
    k.color(255, 255, 255),
    k.z(100)
  ]);
  
  const heartsText = k.add([
    k.text("❤❤❤", { 
      size: 20, 
      font: "Arial"
    }), 
    k.pos(16, 40), 
    k.fixed(),
    k.color(255, 100, 100),
    k.z(100)
  ]);

  k.onUpdate(() => {
    const hearts = (plr as any).hearts ?? 3;
    heartsText.text = "❤".repeat(hearts);
    scoreText.text = `Score: ${score}`;
  });

  // Camera follow with smooth movement
  k.onUpdate(() => {
    const targetCam = k.vec2(
      Math.max(160, plr.pos.x),
      Math.max(groundY - 110, plr.pos.y),
    );
    const currentCam = k.camPos();
    const smoothCam = currentCam.lerp(targetCam, k.dt() * 3);
    k.camPos(smoothCam);
  });

  // Modern platform helpers with better colors
  const solid = (x: number, y: number, w: number, h: number, color = k.rgb(139, 69, 19)) =>
    k.add([
      k.pos(x, y),
      k.rect(w, h),
      k.area(),
      k.body({ isStatic: true }),
      k.color(color.r, color.g, color.b),
      k.z(10),
      "solid",
    ]);

  const hazard = (x: number, y: number, w: number, h: number) =>
    k.add([
      k.pos(x, y),
      k.rect(w, h),
      k.area(),
      k.body({ isStatic: true }),
      k.color(220, 20, 60),
      k.z(10),
      "hazard",
    ]);

  // Enhanced level layout with better spacing and more platforms
  solid(120, groundY, 420, 24, k.rgb(139, 69, 19));        // left floor
  hazard(540, groundY, 48, 24);        // gap hazard
  solid(588, groundY, 340, 24, k.rgb(139, 69, 19));        // right floor
  solid(380, groundY - 80, 64, 12, k.rgb(160, 82, 45));     // floating block
  
  // Add more platforms for variety
  solid(200, groundY - 120, 48, 12, k.rgb(160, 82, 45));    // left floating platform
  solid(600, groundY - 140, 48, 12, k.rgb(160, 82, 45));    // right floating platform
  solid(400, groundY - 160, 64, 12, k.rgb(160, 82, 45));    // high platform

  // Moving platform with better visuals
  const mplat = k.add([
    k.pos(520, groundY - 50),
    k.rect(60, 10),
    k.area(),
    k.body({ isStatic: true }),
    k.color(70, 130, 180),
    k.z(10),
    "solid",
    "mplatform",
  ]);
  const mStart = mplat.pos.clone();
  let t = 0;
  k.onUpdate(() => {
    t += k.dt();
    mplat.pos.x = mStart.x + Math.sin(t) * 40;
  });

  // Enhanced coins with better positioning
  const coin = (x: number, y: number) =>
    k.add([
      k.pos(x, y),
      k.sprite("coin"),
      k.area(),
      k.z(20),
      "coin",
    ]);
  
  // Better coin placement for jump arc and exploration
  [420, 455, 490, 625].forEach((x, i) =>
    coin(x, groundY - 110 + (i % 2 ? -6 : 0)),
  );
  
  // Add more coins on platforms
  [220, 620, 420].forEach((x, i) =>
    coin(x, groundY - 130 + (i % 2 ? -10 : 0)),
  );

  // Modern exit door
  k.add([
    k.pos(940, groundY - 24),
    k.sprite("door"),
    k.area(),
    k.z(15),
    "exit",
  ]);

  // Enhanced checkpoint with visual feedback
  let respawn = spawn.clone();
  const checkpoint = k.add([
    k.pos(700, groundY - 24),
    k.sprite("checkpoint"),
    k.area(),
    k.z(15),
    "checkpoint",
  ]);

  // Checkpoint glow effect
  let checkpointGlow = 0;
  k.onUpdate(() => {
    checkpointGlow += k.dt() * 3;
    checkpoint.opacity = 0.7 + Math.sin(checkpointGlow) * 0.3;
  });

  // Add some enemy slimes to make the level more challenging
  spawnPatroller({ x: 300, y: groundY - 12, speed: 40 });
  spawnPatroller({ x: 500, y: groundY - 12, speed: 35 });
  spawnPatroller({ x: 750, y: groundY - 12, speed: 45 });

  // Enhanced collisions with better feedback
  plr.onCollide("coin", (c) => {
    k.destroy(c);
    score += 10;
    // Add coin collection effect
    k.add([
      k.pos(c.pos.x, c.pos.y),
      k.text("+10", { size: 16, font: "Arial" }),
      k.color(255, 215, 0),
      k.move(k.vec2(0, -50), 100),
      k.fade(0, 1),
      k.lifespan(1),
      k.z(50)
    ]);
  });

  plr.onCollide("hazard", () => {
    (plr as any).damage?.(1);
    if ((plr as any).getHearts?.() > 0) {
      k.shake(3);
      // Add damage effect
      k.add([
        k.pos(plr.pos.x, plr.pos.y - 20),
        k.text("OUCH!", { size: 14, font: "Arial" }),
        k.color(255, 0, 0),
        k.move(k.vec2(0, -30), 80),
        k.fade(0, 1),
        k.lifespan(0.8),
        k.z(50)
      ]);
    }
  });

  plr.onCollide("checkpoint", (c) => {
    respawn = c.pos.clone();
    // Checkpoint activation effect
    k.add([
      k.pos(c.pos.x, c.pos.y - 20),
      k.text("CHECKPOINT!", { size: 16, font: "Arial" }),
      k.color(0, 255, 0),
      k.move(k.vec2(0, -40), 60),
      k.fade(0, 1),
      k.lifespan(1.5),
      k.z(50)
    ]);
  });

  plr.onCollide("exit", () => k.go("level2"));

  // Enhanced respawn handling
  k.onUpdate(() => {
    if ((plr as any).getHearts?.() === 0) {
      k.wait(0.05, () => {
        plr.pos = respawn.clone().sub(k.vec2(0, SPAWN_Y_OFFSET));
        (plr as any).hearts = 3;
        plr.vel = k.vec2(0, 0);
        plr.scale.y = 1;
        plr.area.shape = new k.Rect(k.vec2(-12, -16), 24, 32);
      });
    }
  });

  // Add some decorative elements
  // Floating particles
  for (let i = 0; i < 15; i++) {
    const particle = k.add([
      k.pos(Math.random() * 800, Math.random() * 150),
      k.circle(1),
      k.color(255, 255, 255, 0.6),
      k.move(k.vec2(0, -20), 0),
      k.z(5),
      k.lifespan(3)
    ]);
    
    particle.onUpdate(() => {
      particle.opacity = 0.6 + Math.sin(k.time() * 2 + i) * 0.4;
    });
  }
}
