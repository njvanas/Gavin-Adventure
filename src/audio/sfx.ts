import { k } from "../game";
import { HAS_SOUND } from "../assets";

let muted = false;
let sfxVol = 1.0; // 0..1

export function sfxMute(on: boolean) { muted = on; }
export function sfxIsMuted() { return muted; }
export function setSfxVolume(v: number) { sfxVol = Math.max(0, Math.min(1, v)); }
export function getSfxVolume() { return sfxVol; }

function play(name: string) {
  if (muted) return;
  if (!HAS_SOUND.has(name)) return; // nothing loaded -> no-op
  try { k.play(name, { volume: sfxVol }); } catch { /* ignore */ }
}

export function sfxJump()       { play("jump"); }
export function sfxCoin()       { play("coin"); }
export function sfxHit()        { play("hit"); }
export function sfxCheckpoint() { play("checkpoint"); }
export function sfxExit()       { play("exit"); }

