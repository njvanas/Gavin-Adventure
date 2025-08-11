import { k } from "./game";

/**
 * Edit URLs later when you add real art. The generator will create
 * colored placeholder sheets for any missing file automatically.
 */
export const SPRITES = {
  player:       { url: "/sprites/player.png",      sliceX: 8, sliceY: 1, frameW: 16, frameH: 16,
                  anims: { idle:{from:0,to:1,speed:6,loop:true}, run:{from:2,to:5,speed:12,loop:true}, jump:6, fall:7, hurt:6 } },
  enemy_slime:  { url: "/sprites/enemy_slime.png", sliceX: 4, sliceY: 1, frameW: 14, frameH: 12,
                  anims: { walk:{from:0,to:3,speed:8,loop:true} } },
  coin:         { url: "/sprites/coin.png",        sliceX: 6, sliceY: 1, frameW: 10, frameH: 10,
                  anims: { spin:{from:0,to:5,speed:12,loop:true} } },
  checkpoint:   { url: "/sprites/checkpoint.png",  sliceX: 2, sliceY: 1, frameW: 8,  frameH: 16,
                  anims: { idle:{from:0,to:1,speed:4,loop:true} } },
  door:         { url: "/sprites/door.png",        sliceX: 1, sliceY: 1, frameW: 16, frameH: 24,
                  anims: { idle:0 } },
} as const;

export const SOUNDS = {
  jump: "/audio/jump.ogg",
  coin: "/audio/coin.ogg",
  hit: "/audio/hit.ogg",
  checkpoint: "/audio/checkpoint.ogg",
  exit: "/audio/exit.ogg",
  bg_level1: "/audio/bg_level1.ogg",
};

const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
// (This is a ~0.01s silent PCM WAV)

// Helper to check if a URL returns audio content
async function urlHasAudio(url: string): Promise<boolean> {
  try {
    // Prefer HEAD to avoid downloading; fallback to GET if HEAD not allowed.
    let res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return false;
    const ct = res.headers.get("content-type") || "";
    if (ct.startsWith("audio/")) return true;

    // Some dev servers don't set content-type on HEAD; do a light GET and sniff
    res = await fetch(url, { method: "GET" });
    if (!res.ok) return false;
    const ct2 = res.headers.get("content-type") || "";
    return ct2.startsWith("audio/");
  } catch {
    return false;
  }
}

let loaded = false;

/** Probe an image URL without throwing. */
async function urlExists(url: string): Promise<boolean> {
  try {
    await new Promise<void>((res, rej) => {
      const img = new Image();
      img.onload = () => res();
      img.onerror = () => rej(new Error("img error"));
      img.src = url;
    });
    return true;
  } catch { return false; }
}

/** Generate a sprite sheet canvas (sliceX × sliceY) with distinct frame colors & a subtle grid. */
function makePlaceholderSheet(
  sliceX: number,
  sliceY: number,
  frameW = 16,
  frameH = 16,
  baseHue = 210, // vary per sprite if you want
): string {
  const w = sliceX * frameW;
  const h = sliceY * frameH;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;

  // Draw frames
  let hue = baseHue;
  for (let y = 0; y < sliceY; y++) {
    for (let x = 0; x < sliceX; x++) {
      hue = (hue + 23) % 360;
      ctx.fillStyle = `hsl(${hue} 40% 55%)`;
      ctx.fillRect(x * frameW, y * frameH, frameW, frameH);

      // inner accent
      ctx.fillStyle = `hsl(${(hue + 180) % 360} 50% 65%)`;
      ctx.fillRect(x * frameW + 2, y * frameH + 2, frameW - 4, frameH - 4);

      // grid lines
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      ctx.strokeRect(x * frameW + 0.5, y * frameH + 0.5, frameW - 1, frameH - 1);
    }
  }
  return c.toDataURL("image/png");
}

export async function loadAssets() {
  if (loaded) return;

  // ---- Sprites: probe -> load real or generated sheet ----
  for (const [name, cfg] of Object.entries(SPRITES)) {
    const { url, sliceX, sliceY, frameW, frameH, anims } = cfg as any;

    let source = url as string;
    const ok = await urlExists(url);
    if (!ok) {
      // Choose a base hue per sprite name so they differ
      const hueSeed = Math.abs(
        Array.from(name).reduce((a, ch) => a + ch.charCodeAt(0), 0)
      ) % 360;
      source = makePlaceholderSheet(sliceX, sliceY, frameW, frameH, hueSeed);
      console.warn(`[assets] Missing ${name} at ${url}. Using generated placeholder sheet.`);
    }

    await k.loadSprite(name, source, { sliceX, sliceY, anims });
  }

  // ---- Sounds (NEW robust loader) ----
  for (const [name, url] of Object.entries(SOUNDS)) {
    let src: string = url as string;
    const ok = await urlHasAudio(src);
    if (!ok) {
      console.warn(`[assets] Sound not found or not audio: ${name} (${url}). Using silent placeholder.`);
      src = SILENT_WAV_DATA_URI;
    }
    try {
      await k.loadSound(name, src);
    } catch (e) {
      // Final fallback: force silent data URI
      try { await k.loadSound(name, SILENT_WAV_DATA_URI); }
      catch { console.warn(`[assets] Failed to register sound ${name}`, e); }
    }
  }

  loaded = true;
}

