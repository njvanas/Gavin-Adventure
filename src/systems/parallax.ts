import { k } from "../game";
import { isPaused } from "./pause";

type LayerPair = [any, any];

function makeLayer(factor: number, color: [number, number, number]): LayerPair {
  const w = k.width() * 3;
  const h = k.height();

  const a = k.add([
    k.rect(w, h),
    k.pos(0, 0),
    k.color(...color),
    k.fixed(),
    { factor },
  ]);
  const b = k.add([
    k.rect(w, h),
    k.pos(w, 0),
    k.color(...color),
    k.fixed(),
    { factor, _wrap: true },
  ]);

  return [a, b];
}

export function makeParallax() {
  const far  = makeLayer(0.30, [25, 30, 55]);
  const mid  = makeLayer(0.55, [40, 46, 74]);
  const near = makeLayer(0.85, [58, 64, 102]);

  const gradient = k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.fixed(),
    k.color(255, 255, 255),
    k.opacity(0.05),
  ]);

  function resize() {
    const h = k.height();
    [...far, ...mid, ...near].forEach(l => { l.height = h; });
    gradient.width = k.width();
    gradient.height = h;
  }
  // Optional resize hook
  // @ts-ignore
  k.onResize?.(resize);
  resize();

  function scrollLayer(pair: LayerPair, targetX: number) {
    const w = pair[0].width;
    const off = (-targetX * pair[0].factor) % w;
    pair[0].pos.x = off;
    pair[1].pos.x = off + w;
  }

  function update(targetPos: { x: number; y: number }) {
    if (isPaused()) return;
    scrollLayer(far, targetPos.x);
    scrollLayer(mid, targetPos.x);
    scrollLayer(near, targetPos.x);
  }

  return { update };
}