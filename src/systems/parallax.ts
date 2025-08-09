import { k } from "../game";
import { isPaused } from "./pause";

export type Layer = ReturnType<typeof makeLayer>;

function makeLayer(factor: number, color: [number, number, number]) {
  const rect = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(color[0], color[1], color[2]),
    k.fixed(),      // we'll override positions per frame
    { factor },
  ]);
  return rect;
}

export function makeParallax() {
  // Colors are placeholders; replace later with sprites
  const far  = makeLayer(0.30, [24, 28, 48]);   // deep blue
  const mid  = makeLayer(0.60, [36, 42, 72]);   // mid blue
  const near = makeLayer(0.90, [48, 54, 96]);   // near blue

  function resizeToScreen() {
    [far, mid, near].forEach((l: any) => {
      l.width = k.width();
      l.height = k.height();
    });
  }

  // Refit on resize (if your Kaboom setup emits this; otherwise safe no-op)
  // @ts-ignore
  k.onResize?.(resizeToScreen);
  resizeToScreen();

  function update() {
    if (isPaused()) return;
    const cam = k.camPos();
    // Parallax scroll: offset backgrounds opposite cam movement
    (far as any).pos = k.vec2(Math.floor(-cam.x * 0.30), Math.floor(-cam.y * 0.10));
    (mid as any).pos = k.vec2(Math.floor(-cam.x * 0.60), Math.floor(-cam.y * 0.20));
    (near as any).pos = k.vec2(Math.floor(-cam.x * 0.90), Math.floor(-cam.y * 0.30));
  }

  return { update };
}

