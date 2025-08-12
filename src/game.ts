import kaboom, { KaboomCtx } from "kaboom";

export const k: KaboomCtx = kaboom({
  global: false,
  background: [24, 24, 28],   // dark background
  letterbox: true,            // keep aspect ratio
  width: 800,
  height: 600,
  // Performance optimizations
  crisp: true,                // Crisp pixel art
  pixelDensity: 1,           // Force 1:1 pixel ratio
  touchToMouse: false,       // Disable touch to mouse conversion
});

// Global config
k.setGravity(1200);

// Simple global loaders (we can add sprites/audio later)
export async function loadCommonAssets() {
  // Example placeholders:
  // await k.loadSprite("player", "assets/player.png");
  // await k.loadSound("jump", "assets/jump.wav");
}
