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

  const terrainText = k.add([
    k.text("🌍 TERRAIN: 0 chunks", { 
      size: 16, 
      font: "Arial"
    }), 
    k.pos(16, 112), 
    k.fixed(),
    k.color(34, 139, 34),
    k.z(100)
  ]);

  const fpsText = k.add([
    k.text("⚡ FPS: 60", { 
      size: 16, 
      font: "Arial"
    }), 
    k.pos(16, 136), 
    k.fixed(),
    k.color(255, 255, 0),
    k.z(100)
  ]);

  // Initial UI update - will be called after terrainChunks is defined

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

  // Optimize terrain chunk management - only update every few frames to reduce stuttering
  let frameCount = 0;
  k.onUpdate(() => {
    frameCount++;
    // Only manage terrain chunks every 10 frames to reduce stuttering
    if (frameCount % 10 === 0) {
      manageTerrainChunks();
    }
    
    // Only update UI every 5 frames to reduce stuttering
    if (frameCount % 5 === 0) {
      updateUI();
    }
  });

  // Separate UI update function for better performance
  function updateUI() {
    coinsText.text = `💪 COINS: ${coins}`;
    strengthText.text = `💪 STRENGTH: ${strength}%`;
    chickenText.text = `🍗 CHICKEN: ${chickenNeeded} COINS`;
    progressText.text = `🏃 PROGRESS: ${Math.floor(levelProgress)}m`;
    terrainText.text = `🌍 TERRAIN: ${terrainChunks.size} chunks`;
    
    // Update FPS display
    const currentFPS = Math.round(1 / k.dt());
    fpsText.text = `⚡ FPS: ${currentFPS}`;
    
    // Update strength color based on level
    if (strength > 70) {
      strengthText.color = k.rgb(0, 255, 0); // Green - strong
    } else if (strength > 40) {
      strengthText.color = k.rgb(255, 255, 0); // Yellow - weakening
    } else {
      strengthText.color = k.rgb(255, 0, 0); // Red - weak
    }
  }

  // Infinite Terrain System
  const CHUNK_SIZE = 600; // Increased from 400 to 600 for more spacing between platforms
  const RENDER_DISTANCE = 2; // Reduced from 3 to 2 for better performance
  const terrainChunks = new Map<number, TerrainChunk>(); // chunkIndex -> TerrainChunk
  
  interface TerrainChunk {
    index: number;
    startX: number;
    endX: number;
    platforms: any[];
    coins: any[];
    enemies: any[];
    checkpoints: any[];
    chickenShops: any[];
    hazards: any[];
    isHydrated: boolean;
  }

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

  // Enhanced coins with better positioning (protein sources!)
  const coin = (x: number, y: number) =>
    k.add([
      k.pos(x, y),
      k.sprite("coin"),
      k.area(),
      k.z(20),
      "coin",
      // Add a simple animation to make coins more visible
      k.rotate(0),
    ]);

  // Simple coin rotation animation
  k.onUpdate(() => {
    k.get("coin").forEach(coin => {
      coin.rotate += 1;
    });
  });

  // Terrain chunk management
  function manageTerrainChunks() {
    const playerChunkIndex = Math.floor(plr.pos.x / CHUNK_SIZE);
    
    // Hydrate new chunks ahead
    for (let i = playerChunkIndex; i <= playerChunkIndex + RENDER_DISTANCE; i++) {
      if (!terrainChunks.has(i)) {
        hydrateChunk(i);
      }
    }
    
    // Dehydrate old chunks behind
    for (const [index, chunk] of terrainChunks.entries()) {
      if (index < playerChunkIndex - RENDER_DISTANCE) {
        dehydrateChunk(index);
      }
    }
  }

  function hydrateChunk(chunkIndex: number) {
    if (terrainChunks.has(chunkIndex)) return; // Already hydrated
    
    const startX = chunkIndex * CHUNK_SIZE;
    const endX = startX + CHUNK_SIZE;
    
    const chunk: TerrainChunk = {
      index: chunkIndex,
      startX,
      endX,
      platforms: [],
      coins: [],
      enemies: [],
      checkpoints: [],
      chickenShops: [],
      hazards: [],
      isHydrated: true
    };
    
    // Generate terrain for this chunk
    generateChunkTerrain(chunk);
    
    terrainChunks.set(chunkIndex, chunk);
  }

  function dehydrateChunk(chunkIndex: number) {
    const chunk = terrainChunks.get(chunkIndex);
    if (!chunk) return;
    
    // Batch destroy all game objects in this chunk for better performance
    const allObjects = [
      ...chunk.platforms,
      ...chunk.coins,
      ...chunk.enemies,
      ...chunk.checkpoints,
      ...chunk.chickenShops,
      ...chunk.hazards
    ];
    
    // Destroy all objects at once
    allObjects.forEach(obj => {
      if (obj && obj.exists && obj.exists()) {
        k.destroy(obj);
      }
    });
    
    // Clear arrays
    chunk.platforms = [];
    chunk.coins = [];
    chunk.enemies = [];
    chunk.checkpoints = [];
    chunk.chickenShops = [];
    chunk.hazards = [];
    chunk.isHydrated = false;
    
    // Remove from map
    terrainChunks.delete(chunkIndex);
  }

  function generateChunkTerrain(chunk: TerrainChunk) {
    const { startX, endX } = chunk;
    
    // Generate ground platforms - simplified for better performance
    let currentX = startX;
    while (currentX < endX) {
      const platformWidth = 150 + Math.random() * 150; // Reduced variation for better performance
      const platformEnd = Math.min(currentX + platformWidth, endX);
      
      // Ground platform
      const platform = solid(currentX, groundY, platformEnd - currentX, 24, k.rgb(139, 69, 19));
      chunk.platforms.push(platform);
      
      // Add gaps for challenge (but not too many) - much less frequent
      if (Math.random() > 0.95 && currentX + platformWidth < endX - 100) { // Reduced from 0.9 to 0.95 (very rare)
        const gapWidth = 30 + Math.random() * 30; // Further reduced max gap width
        const hazardObj = hazard(currentX + platformWidth, groundY, gapWidth, 24);
        chunk.hazards.push(hazardObj);
        currentX += gapWidth;
      }
      
      currentX = platformEnd;
    }
    
    // Generate floating platforms - make them reachable by jumping
    for (let i = 0; i < Math.random() * 2; i++) { // Reduced to 0-2 platforms (much cleaner)
      const x = startX + Math.random() * (endX - startX - 100);
      // Adjust height to be easily reachable by jumping (max jump height is around 120-150 pixels)
      const y = groundY - 40 - Math.random() * 30; // Range: 40-70 pixels above ground (much more reachable)
      const width = 60 + Math.random() * 80;
      
      const platform = solid(x, y, width, 12, k.rgb(160, 82, 45));
      chunk.platforms.push(platform);
      
      // Add coins on platforms
      if (Math.random() > 0.3) {
        const coinObj = coin(x + width/2, y - 20);
        chunk.coins.push(coinObj);
      }
    }
    
    // Generate coins on ground
    for (let i = 0; i < Math.random() * 2; i++) { // Reduced to 0-2 coins (less cluttered)
      const x = startX + Math.random() * (endX - startX - 50);
      const coinObj = coin(x, groundY - 30);
      chunk.coins.push(coinObj);
    }
    
    // Generate enemies
    for (let i = 0; i < Math.random() * 1; i++) { // Reduced to 0-1 enemies (much less overwhelming)
      const x = startX + Math.random() * (endX - startX - 50);
      const enemy = spawnPatroller({ 
        x, 
        y: groundY - 12, 
        speed: 30 + Math.random() * 20 
      });
      chunk.enemies.push(enemy);
    }
    
    // Add checkpoint (every few chunks)
    if (chunk.index % 3 === 0) {
      const checkpoint = k.add([
        k.pos(startX + 200, groundY - 24),
        k.sprite("checkpoint"),
        k.area(),
        k.z(15),
        "checkpoint",
      ]);
      chunk.checkpoints.push(checkpoint);
    }
    
    // Add chicken shop (every few chunks)
    if (chunk.index % 5 === 0 && chunk.index > 0) {
      const chickenShop = k.add([
        k.pos(startX + 300, groundY - 24),
        k.sprite("door"),
        k.area(),
        k.z(15),
        "chicken_shop",
      ]);
      chunk.chickenShops.push(chickenShop);
    }
  }

  // Initialize first few chunks
  for (let i = 0; i <= RENDER_DISTANCE; i++) {
    hydrateChunk(i);
  }

  // Now that terrainChunks is defined, we can call updateUI
  updateUI();

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
    // Find which chunk this checkpoint belongs to
    for (const chunk of terrainChunks.values()) {
      if (chunk.checkpoints.includes(c)) {
        // Set respawn to this checkpoint
        respawn = c.pos.clone();
        break;
      }
    }
    
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
      
      // Progress continues infinitely - no need to generate new level
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

  // Enhanced enemy collision with stomping mechanics
  plr.onCollide("enemy", (enemy) => {
    // Check if player is falling and above the enemy (stomping)
    if (plr.vel.y > 0 && plr.pos.y < enemy.pos.y - 8) {
      // STOMP! Kill the enemy and get a boost
      k.destroy(enemy);
      strength += 5; // Stomping enemies gives you strength!
      if (strength > 100) strength = 100;
      
      // Bounce effect
      plr.vel.y = -300;
      
      // Stomp effect
      k.add([
        k.pos(plr.pos.x, plr.pos.y - 20),
        k.text("STOMP!", { size: 18, font: "Arial" }),
        k.color(255, 255, 0),
        k.move(k.vec2(0, -40), 60),
        k.opacity(0),
        k.lifespan(1.2),
        k.z(50)
      ]);
      
      // Strength boost effect
      k.add([
        k.pos(plr.pos.x, plr.pos.y - 40),
        k.text("+5 STRENGTH!", { size: 16, font: "Arial" }),
        k.color(0, 255, 0),
        k.move(k.vec2(0, -30), 50),
        k.opacity(0),
        k.lifespan(1),
        k.z(50)
      ]);
      
      k.shake(2);
      
      // Remove enemy from chunk tracking
      for (const chunk of terrainChunks.values()) {
        const enemyIndex = chunk.enemies.indexOf(enemy);
        if (enemyIndex !== -1) {
          chunk.enemies.splice(enemyIndex, 1);
          break;
        }
      }
    } else {
      // Side collision - enemy steals your gains
      strength -= 20;
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
    }
  });

  // Enhanced respawn handling
  let respawn = spawn.clone();
  k.onUpdate(() => {
    if (strength <= 0) {
      k.wait(0.05, () => {
        plr.pos = respawn.clone().sub(k.vec2(0, SPAWN_Y_OFFSET));
        strength = 50; // Respawn with half strength
        plr.vel = k.vec2(0, 0);
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
  // Floating protein particles - reduced for cleaner look
  for (let i = 0; i < 8; i++) { // Reduced from 15 to 8 particles
    const particle = k.add([
      k.pos(Math.random() * 800, Math.random() * 150),
      k.circle(1),
      k.color(255, 165, 0), // Orange protein particles
      k.move(k.vec2(0, -20), 0),
      k.z(5),
      k.lifespan(3)
    ]);
  }

  // Motivational messages
  const messages = [
    "💪 GAINS DON'T COME EASY!",
    "🍗 CHICKEN = STRENGTH!",
    "🏋️ NO PAIN, NO GAIN!",
    "💪 LIFT HEAVY, EAT HEAVY!",
    "🌍 INFINITE TERRAIN!",
    "🏃 NEVER STOP RUNNING!"
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
}
