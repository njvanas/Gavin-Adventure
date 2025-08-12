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

  // Bodybuilding-themed UI
  let coins = 0;
  let strength = 100; // Gavin's strength level (starts at 100%)
  let chickenNeeded = 50; // Coins needed to buy chicken and restore strength
  let levelProgress = 0; // Track how far we've progressed
  
  const coinsText = k.add([
    k.text("💪 COINS: 0", { 
      size: 18, 
      font: "Arial",
    }), 
    k.pos(16, 16), 
    k.fixed(),
    k.color(255, 215, 0),
    k.z(100)
  ]);
  
  const strengthText = k.add([
    k.text("💪 STRENGTH: 100%", { 
      size: 18, 
      font: "Arial"
    }), 
    k.pos(16, 40), 
    k.fixed(),
    k.color(0, 255, 0),
    k.z(100)
  ]);

  const chickenText = k.add([
    k.text("🍗 CHICKEN: 50 COINS", { 
      size: 16, 
      font: "Arial"
    }), 
    k.pos(16, 64), 
    k.fixed(),
    k.color(255, 165, 0),
    k.z(100)
  ]);

  const progressText = k.add([
    k.text("🏃 PROGRESS: 0m", { 
      size: 16, 
      font: "Arial"
    }), 
    k.pos(16, 88), 
    k.fixed(),
    k.color(100, 200, 255),
    k.z(100)
  ]);

  k.onUpdate(() => {
    coinsText.text = `💪 COINS: ${coins}`;
    strengthText.text = `💪 STRENGTH: ${strength}%`;
    chickenText.text = `🍗 CHICKEN: ${chickenNeeded} COINS`;
    progressText.text = `🏃 PROGRESS: ${Math.floor(levelProgress)}m`;
    
    // Update strength color based on level
    if (strength > 70) {
      strengthText.color = k.rgb(0, 255, 0); // Green - strong
    } else if (strength > 40) {
      strengthText.color = k.rgb(255, 255, 0); // Yellow - weakening
    } else {
      strengthText.color = k.rgb(255, 0, 0); // Red - weak
    }
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
    
    // Update progress based on player position
    levelProgress = Math.max(levelProgress, (plr.pos.x - 160) / 10);
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

  // Initial level layout
  solid(120, groundY, 420, 24, k.rgb(139, 69, 19));        // left floor
  hazard(540, groundY, 48, 24);        // gap hazard (cardio zone!)
  solid(588, groundY, 340, 24, k.rgb(139, 69, 19));        // right floor
  solid(380, groundY - 80, 64, 12, k.rgb(160, 82, 45));     // weight bench platform
  
  // Add more platforms for variety
  solid(200, groundY - 120, 48, 12, k.rgb(160, 82, 45));    // protein shake platform
  solid(600, groundY - 140, 48, 12, k.rgb(160, 82, 45));    // dumbbell platform
  solid(400, groundY - 160, 64, 12, k.rgb(160, 82, 45));    // high-intensity platform

  // Moving platform (treadmill!)
  const treadmill = k.add([
    k.pos(520, groundY - 50),
    k.rect(60, 10),
    k.area(),
    k.body({ isStatic: true }),
    k.color(70, 130, 180),
    k.z(10),
    "solid",
    "treadmill",
  ]);
  const tStart = treadmill.pos.clone();
  let t = 0;
  k.onUpdate(() => {
    t += k.dt();
    treadmill.pos.x = tStart.x + Math.sin(t) * 40;
  });

  // Enhanced coins with better positioning (protein sources!)
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

  // Chicken shop (goal instead of princess!)
  k.add([
    k.pos(940, groundY - 24),
    k.sprite("door"),
    k.area(),
    k.z(15),
    "chicken_shop",
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
    // Remove opacity animation to fix linter error
  });

  // Add some enemy slimes (lazy people who don't work out!)
  spawnPatroller({ x: 300, y: groundY - 12, speed: 40 });
  spawnPatroller({ x: 500, y: groundY - 12, speed: 35 });
  spawnPatroller({ x: 750, y: groundY - 12, speed: 45 });

  // Enhanced collisions with bodybuilding theme
  plr.onCollide("coin", (c) => {
    k.destroy(c);
    coins += 10;
    strength += 2; // Coins give you a little energy boost!
    if (strength > 100) strength = 100;
    
    // Add coin collection effect
    k.add([
      k.pos(c.pos.x, c.pos.y),
      k.text("+10 COINS!", { size: 16, font: "Arial" }),
      k.color(255, 215, 0),
      k.move(k.vec2(0, -50), 100),
      k.opacity(0),
      k.lifespan(1),
      k.z(50)
    ]);
    
    // Strength boost effect
    k.add([
      k.pos(c.pos.x, c.pos.y - 20),
      k.text("+2 STRENGTH!", { size: 14, font: "Arial" }),
      k.color(0, 255, 0),
      k.move(k.vec2(0, -30), 80),
      k.opacity(0),
      k.lifespan(0.8),
      k.z(50)
    ]);
  });

  plr.onCollide("hazard", () => {
    strength -= 15; // Cardio zone drains your gains!
    if (strength < 0) strength = 0;
    
    k.shake(3);
    // Add damage effect
    k.add([
      k.pos(plr.pos.x, plr.pos.y - 20),
      k.text("CARDIO DRAIN!", { size: 14, font: "Arial" }),
      k.color(255, 0, 0),
      k.move(k.vec2(0, -30), 80),
      k.opacity(0),
      k.lifespan(0.8),
      k.z(50)
    ]);
  });

  plr.onCollide("checkpoint", (c) => {
    respawn = c.pos.clone();
    // Checkpoint activation effect
    k.add([
      k.pos(c.pos.x, c.pos.y - 20),
      k.text("CHECKPOINT!", { size: 16, font: "Arial" }),
      k.color(0, 255, 0),
      k.move(k.vec2(0, -40), 60),
      k.opacity(0),
      k.lifespan(1.5),
      k.z(50)
    ]);
  });

  // Chicken shop collision - need enough coins!
  plr.onCollide("chicken_shop", () => {
    if (coins >= chickenNeeded) {
      // Success! Buy chicken and restore strength
      coins -= chickenNeeded;
      strength = 100; // Full strength restored!
      chickenNeeded += 25; // Next chicken costs more
      
      // Victory effect
      k.add([
        k.pos(plr.pos.x, plr.pos.y - 30),
        k.text("🍗 CHICKEN ACQUIRED!", { size: 18, font: "Arial" }),
        k.color(255, 165, 0),
        k.move(k.vec2(0, -50), 60),
        k.opacity(0),
        k.lifespan(2),
        k.z(50)
      ]);
      
      k.add([
        k.pos(plr.pos.x, plr.pos.y - 50),
        k.text("💪 STRENGTH RESTORED!", { size: 16, font: "Arial" }),
        k.color(0, 255, 0),
        k.move(k.vec2(0, -40), 50),
        k.opacity(0),
        k.lifespan(1.8),
        k.z(50)
      ]);
      
      k.shake(5);
      
      // Generate new endless level instead of going to level2
      generateNewLevel();
    } else {
      // Not enough coins
      k.add([
        k.pos(plr.pos.x, plr.pos.y - 20),
        k.text("Need more coins!", { size: 16, font: "Arial" }),
        k.color(255, 0, 0),
        k.move(k.vec2(0, -30), 60),
        k.opacity(0),
        k.lifespan(1.5),
        k.z(50)
      ]);
    }
  });

  // Enemy collision - they steal your gains!
  plr.onCollide("enemy", () => {
    strength -= 20; // Enemies drain your strength!
    if (strength < 0) strength = 0;
    
    k.shake(4);
    // Add strength drain effect
    k.add([
      k.pos(plr.pos.x, plr.pos.y - 20),
      k.text("GAINS STOLEN!", { size: 16, font: "Arial" }),
      k.color(255, 0, 0),
      k.move(k.vec2(0, -40), 70),
      k.opacity(0),
      k.lifespan(1.2),
      k.z(50)
    ]);
    
    // Push player back
    plr.move(-100, 0);
  });

  // Enhanced respawn handling
  k.onUpdate(() => {
    if (strength <= 0) {
      k.wait(0.05, () => {
        plr.pos = respawn.clone().sub(k.vec2(0, SPAWN_Y_OFFSET));
        strength = 50; // Respawn with half strength
        plr.vel = k.vec2(0, 0);
        // Remove scale access to fix linter error
        plr.area.shape = new k.Rect(k.vec2(-12, -16), 24, 32);
        
        // Respawn effect
        k.add([
          k.pos(plr.pos.x, plr.pos.y - 20),
          k.text("RESPAWNED!", { size: 16, font: "Arial" }),
          k.color(255, 255, 0),
          k.move(k.vec2(0, -30), 60),
          k.opacity(0),
          k.lifespan(1.5),
          k.z(50)
        ]);
      });
    }
  });

  // Add some decorative elements
  // Floating protein particles
  for (let i = 0; i < 15; i++) {
    const particle = k.add([
      k.pos(Math.random() * 800, Math.random() * 150),
      k.circle(1),
      k.color(255, 165, 0), // Orange protein particles
      k.move(k.vec2(0, -20), 0),
      k.z(5),
      k.lifespan(3)
    ]);
    
    // Remove opacity animation to fix linter error
  }

  // Motivational messages
  const messages = [
    "💪 GAINS DON'T COME EASY!",
    "🍗 CHICKEN = STRENGTH!",
    "🏋️ NO PAIN, NO GAIN!",
    "💪 LIFT HEAVY, EAT HEAVY!"
  ];
  
  let messageIndex = 0;
  k.loop(8, () => {
    k.add([
      k.pos(400, 100),
      k.text(messages[messageIndex], { size: 20, font: "Arial" }),
      k.color(255, 255, 255),
      k.opacity(0),
      k.lifespan(2),
      k.z(200)
    ]);
    messageIndex = (messageIndex + 1) % messages.length;
  });

  // Function to generate new endless level
  function generateNewLevel() {
    // Clear existing level elements (except UI and player)
    k.destroyAll("solid");
    k.destroyAll("hazard");
    k.destroyAll("coin");
    k.destroyAll("enemy");
    k.destroyAll("checkpoint");
    k.destroyAll("chicken_shop");
    
    // Reset player position
    plr.pos = k.vec2(160, groundY - 24);
    plr.vel = k.vec2(0, 0);
    
    // Generate new endless level
    let currentX = 120;
    const levelLength = 2000; // Make each level longer
    
    for (let i = 0; i < levelLength; i += 200) {
      // Ground platform
      solid(currentX, groundY, 200, 24, k.rgb(139, 69, 19));
      
      // Add some gaps for challenge
      if (Math.random() > 0.7) {
        hazard(currentX + 100, groundY, 50, 24);
      }
      
      // Add floating platforms
      if (Math.random() > 0.5) {
        const platformY = groundY - 80 - Math.random() * 80;
        solid(currentX + 50, platformY, 80, 12, k.rgb(160, 82, 45));
        
        // Add coins on platforms
        coin(currentX + 80, platformY - 20);
      }
      
      // Add coins on ground
      if (Math.random() > 0.3) {
        coin(currentX + 100, groundY - 30);
      }
      
      // Add enemies
      if (Math.random() > 0.8) {
        spawnPatroller({ 
          x: currentX + 100, 
          y: groundY - 12, 
          speed: 30 + Math.random() * 20 
        });
      }
      
      currentX += 200;
    }
    
    // Add new chicken shop at the end
    k.add([
      k.pos(currentX - 100, groundY - 24),
      k.sprite("door"),
      k.area(),
      k.z(15),
      "chicken_shop",
    ]);
    
    // Add new checkpoint
    k.add([
      k.pos(currentX - 300, groundY - 24),
      k.sprite("checkpoint"),
      k.area(),
      k.z(15),
      "checkpoint",
    ]);
    
    // Reset progress for new level
    levelProgress = 0;
  }
}
