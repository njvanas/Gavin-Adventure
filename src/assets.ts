import { k } from "./game";

export const SPRITES = {
  player:       { url: "/sprites/player.png",      sliceX: 8, sliceY: 1, anims: { idle:{from:0,to:1,speed:6,loop:true}, run:{from:2,to:5,speed:12,loop:true}, jump:6, fall:7, hurt:6 } },
  enemy_slime:  { url: "/sprites/enemy_slime.png", sliceX: 4, sliceY: 1, anims: { walk:{from:0,to:3,speed:8,loop:true} } },
  coin:         { url: "/sprites/coin.png",        sliceX: 6, sliceY: 1, anims: { spin:{from:0,to:5,speed:12,loop:true} } },
  checkpoint:   { url: "/sprites/checkpoint.png",  sliceX: 2, sliceY: 1, anims: { idle:{from:0,to:1,speed:4,loop:true} } },
  door:         { url: "/sprites/door.png",        sliceX: 1, sliceY: 1, anims: { idle:0 } },
};

export const SOUNDS = {
  jump: "/audio/jump.ogg",
  coin: "/audio/coin.ogg",
  hit: "/audio/hit.ogg",
  checkpoint: "/audio/checkpoint.ogg",
  exit: "/audio/exit.ogg",
  bg_level1: "/audio/bg_level1.ogg",
};

let loaded = false;

function tinyDataURL(hex = "#fff"): string {
  const c = document.createElement("canvas");
  c.width = 2; c.height = 2;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = hex; ctx.fillRect(0, 0, 2, 2);
  return c.toDataURL();
}

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

export async function loadAssets() {
  if (loaded) return;

  // Sprites
  for (const [name, cfg] of Object.entries(SPRITES)) {
    const ok = await urlExists((cfg as any).url);
    const source = ok ? (cfg as any).url : tinyDataURL("#bbb");
    await k.loadSprite(name, source, {
      sliceX: (cfg as any).sliceX,
      sliceY: (cfg as any).sliceY,
      anims:  (cfg as any).anims,
    });
  }

  // Sounds
  for (const [name, url] of Object.entries(SOUNDS)) {
    try { await k.loadSound(name, url as string); } catch { /* ignore */ }
  }

  loaded = true;
}
