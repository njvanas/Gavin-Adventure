import { k } from "./game";

export const SPRITES = {
  player: {
    url: "/sprites/player.png",
    sliceX: 8,
    sliceY: 1,
    anims: {
      idle: { from: 0, to: 1, speed: 6, loop: true },
      run:  { from: 2, to: 5, speed: 12, loop: true },
      jump: 6,
      fall: 7,
      hurt: 6, // reuse jump for now
    },
    // if your sprite faces right by default, we’ll flipX for left movement
  },
  enemy_slime: {
    url: "/sprites/enemy_slime.png",
    sliceX: 4,
    sliceY: 1,
    anims: {
      walk: { from: 0, to: 3, speed: 8, loop: true },
    },
  },
  coin: {
    url: "/sprites/coin.png",
    sliceX: 6,
    sliceY: 1,
    anims: {
      spin: { from: 0, to: 5, speed: 12, loop: true },
    },
  },
  checkpoint: {
    url: "/sprites/checkpoint.png",
    sliceX: 2,
    sliceY: 1,
    anims: { idle: { from: 0, to: 1, speed: 4, loop: true } },
  },
  door: {
    url: "/sprites/door.png",
    sliceX: 1,
    sliceY: 1,
    anims: { idle: 0 },
  },
};

let loaded = false;

export async function loadAssets() {
  if (loaded) return;
  // Load each sprite; tolerate missing files during early prototyping.
  await Promise.all(
    Object.entries(SPRITES).map(async ([name, cfg]) => {
      try {
        await k.loadSprite(name, cfg.url, {
          sliceX: (cfg as any).sliceX,
          sliceY: (cfg as any).sliceY,
          anims:  (cfg as any).anims,
        });
      } catch (e) {
        // Fallback: create a 1×1 white sprite if the file is missing
        console.warn(`[assets] Failed to load ${name} from ${cfg.url}, using fallback`, e);
        if (!k.getSprite(name)) {
          const canvas = document.createElement("canvas");
          canvas.width = 2; canvas.height = 2;
          const ctx = canvas.getContext("2d")!;
          ctx.fillStyle = "#fff"; ctx.fillRect(0,0,2,2);
          await k.loadSprite(name, canvas.toDataURL());
        }
      }
    })
  );
  loaded = true;
}
