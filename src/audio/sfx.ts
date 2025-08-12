import { k } from "../game";

// --- Add this at the top ---
export const HAS_SOUND = new Set<string>();

// --- Load your sounds somewhere at startup (e.g. in game.ts or a loader module) ---
// Example (ensure these lines run before any sfx is played):
k.loadSound("coin", "sounds/coin.mp3");        HAS_SOUND.add("coin");
k.loadSound("jump", "sounds/jump.mp3");        HAS_SOUND.add("jump");
k.loadSound("hit", "sounds/hit.mp3");          HAS_SOUND.add("hit");
k.loadSound("checkpoint", "sounds/checkpoint.mp3"); HAS_SOUND.add("checkpoint");
k.loadSound("exit", "sounds/exit.mp3");        HAS_SOUND.add("exit");

// --- SFX logic ---
let muted = false;
let sfxVol = 1.0; // 0..1

export function sfxMute(on: boolean) { muted = on; }
export function sfxIsMuted() { return muted; }
export function setSfxVolume(v: number) { sfxVol = Math.max(0, Math.min(1, v)); }
export function getSfxVolume() { return sfxVol; }

function play(name: string) {
  if (muted) return;
  if (!HAS_SOUND.has(name)) return;
  k.play(name, { volume: sfxVol });
}

export function sfxJump()       { play("jump"); }
export function sfxCoin()       { play("coin"); }
export function sfxHit()        { play("hit"); }
export function sfxCheckpoint() { play("checkpoint"); }
export function sfxExit()       { play("exit"); }