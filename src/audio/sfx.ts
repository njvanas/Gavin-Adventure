import { k } from "../game";

let muted = false;

export function sfxMute(on: boolean) { muted = on; }
export function sfxIsMuted() { return muted; }

// Placeholder SFX using kaboom's built-in burp().
// Replace with k.play("jump"), etc., once you load assets.
export function sfxJump()       { if (!muted) k.burp(); }
export function sfxCoin()       { if (!muted) k.burp(); }
export function sfxHit()        { if (!muted) k.burp(); }
export function sfxCheckpoint() { if (!muted) k.burp(); }
export function sfxExit()       { if (!muted) k.burp(); }
