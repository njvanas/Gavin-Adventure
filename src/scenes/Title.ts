import { k } from "../game";

export default function Title() {
  // Add background
  k.add([
    k.pos(0, 0),
    k.rect(800, 600),
    k.color(20, 20, 40),
    k.fixed(),
    k.z(-100)
  ]);

  // Title text
  k.add([
    k.text("GAVIN'S QUEST", { 
      size: 48, 
      font: "Arial",
    }), 
    k.pos(400, 150), 
    k.anchor("center"),
    k.fixed(),
    k.color(255, 215, 0),
    k.z(100)
  ]);

  k.add([
    k.text("CHICKEN FOR GAINS!", { 
      size: 32, 
      font: "Arial",
    }), 
    k.pos(400, 200), 
    k.anchor("center"),
    k.fixed(),
    k.color(255, 165, 0),
    k.z(100)
  ]);

  // Subtitle
  k.add([
    k.text("A Bodybuilding Adventure", { 
      size: 20, 
      font: "Arial",
    }), 
    k.pos(400, 250), 
    k.anchor("center"),
    k.fixed(),
    k.color(200, 200, 200),
    k.z(100)
  ]);

  // Instructions
  k.add([
    k.text("💪 Collect coins to buy chicken!", { 
      size: 18, 
      font: "Arial",
    }), 
    k.pos(400, 320), 
    k.anchor("center"),
    k.fixed(),
    k.color(0, 255, 0),
    k.z(100)
  ]);

  k.add([
    k.text("🏋️ Avoid enemies - they steal your gains!", { 
      size: 18, 
      font: "Arial",
    }), 
    k.pos(400, 350), 
    k.anchor("center"),
    k.fixed(),
    k.color(255, 100, 100),
    k.z(100)
  ]);

  k.add([
    k.text("🍗 Reach the chicken shop to level up!", { 
      size: 18, 
      font: "Arial",
    }), 
    k.pos(400, 380), 
    k.anchor("center"),
    k.fixed(),
    k.color(255, 165, 0),
    k.z(100)
  ]);

  // Controls
  k.add([
    k.text("CONTROLS:", { 
      size: 20, 
      font: "Arial",
    }), 
    k.pos(400, 420), 
    k.anchor("center"),
    k.fixed(),
    k.color(255, 255, 255),
    k.z(100)
  ]);

  k.add([
    k.text("WASD/Arrows: Move | Space: Jump | F: Flex", { 
      size: 16, 
      font: "Arial",
    }), 
    k.pos(400, 450), 
    k.anchor("center"),
    k.fixed(),
    k.color(180, 180, 180),
    k.z(100)
  ]);

  // Start button
  const startBtn = k.add([
    k.text("START WORKOUT!", { 
      size: 24, 
      font: "Arial",
    }), 
    k.pos(400, 520), 
    k.anchor("center"),
    k.area(),
    k.fixed(),
    k.color(0, 255, 0),
    k.scale(1, 1),
    k.z(100)
  ]);

  // Button hover effect
  startBtn.onHover(() => {
    startBtn.color = k.rgb(255, 255, 0);
    startBtn.scale = k.vec2(1.1, 1.1);
  });

  startBtn.onHoverEnd(() => {
    startBtn.color = k.rgb(0, 255, 0);
    startBtn.scale = k.vec2(1, 1);
  });

  // Click to start
  startBtn.onClick(() => {
    k.go("level1");
  });

  // Floating protein particles
  for (let i = 0; i < 20; i++) {
    const particle = k.add([
      k.pos(Math.random() * 800, Math.random() * 600),
      k.circle(2),
      k.color(255, 165, 0),
      k.opacity(0.6),
      k.move(k.vec2(0, -30), 0),
      k.z(50),
      k.lifespan(4)
    ]);
    
    particle.onUpdate(() => {
      particle.opacity = 0.6 + Math.sin(k.time() * 2 + i) * 0.4;
    });
  }

  // Motivational messages
  const messages = [
    "💪 NO PAIN, NO GAIN!",
    "🍗 CHICKEN = STRENGTH!",
    "🏋️ LIFT HEAVY, EAT HEAVY!",
    "💪 GAINS DON'T COME EASY!",
    "🍗 PROTEIN IS POWER!",
    "🏋️ STRENGTH IS EARNED!"
  ];
  
  let messageIndex = 0;
  k.loop(6, () => {
    k.add([
      k.pos(400, 100),
      k.text(messages[messageIndex], { size: 18, font: "Arial" }),
      k.color(255, 255, 255),
      k.opacity(0),
      k.lifespan(3),
      k.z(200)
    ]);
    messageIndex = (messageIndex + 1) % messages.length;
  });

  // Click anywhere to start
  k.onClick(() => {
    k.go("level1");
  });
}