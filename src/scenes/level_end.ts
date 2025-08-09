import { k } from "../game";
import type { RunStats } from "../systems/progress";
import { loadBest, saveBest } from "../systems/progress";

export type LevelEndData = {
  stats: RunStats;
  nextScene?: string; // e.g., "level2"
  retryScene?: string; // e.g., "level1_long"
};

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  const cs = Math.floor((ms % 1000) / 10)
    .toString()
    .padStart(2, "0");
  return `${mm}:${ss}.${cs}`;
}

export default function level_end(data?: LevelEndData) {
  const stats = data?.stats!;
  const bestBefore = loadBest(stats.levelId);
  saveBest(stats);
  const bestAfter = loadBest(stats.levelId) || stats;

  const panel = k.add([
    k.rect(280, 160),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.color(24, 24, 36),
    k.outline(2, k.rgb(120, 120, 160)),
    k.fixed(),
    k.z(10),
  ]);

  k.add([
    k.text("Level Complete!", { size: 18 }),
    k.pos(panel.pos.x, panel.pos.y - 64),
    k.anchor("center"),
    k.color(220, 220, 240),
    k.fixed(),
    k.z(11),
  ]);

  k.add([
    k.text(
      `This run:\nTime   ${fmt(stats.timeMs)}\nCoins  ${stats.coins}\nDeaths ${stats.deaths}`,
      { size: 14 }
    ),
    k.pos(panel.pos.x - 120, panel.pos.y - 34),
    k.color(210, 210, 230),
    k.fixed(),
    k.z(11),
  ]);

  k.add([
    k.text(
      `Best:\nTime   ${fmt(bestAfter.timeMs)}\nCoins  ${bestAfter.coins}\nDeaths ${bestAfter.deaths}`,
      { size: 14 }
    ),
    k.pos(panel.pos.x + 20, panel.pos.y - 34),
    k.color(180, 220, 180),
    k.fixed(),
    k.z(11),
  ]);

  const btn = (
    label: string,
    x: number,
    y: number,
    onClick: () => void
  ) => {
    const b = k.add([
      k.text(label, { size: 14 }),
      k.pos(panel.pos.x + x, panel.pos.y + y),
      k.anchor("center"),
      k.color(230, 230, 240),
      k.area(),
      k.fixed(),
      k.z(11),
      { onClick },
    ]);
    b.onClick(() => onClick());
    b.onHoverUpdate(() => (b.scale = k.vec2(1.05, 1.05)));
    b.onHoverEnd(() => (b.scale = k.vec2(1, 1)));
    return b;
  };

  btn("Retry [R]", -80, 50, () => k.go(data?.retryScene || "level1_long"));
  btn("Next  [N]", 0, 50, () => k.go(data?.nextScene || "level2"));
  btn("Menu  [M]", 80, 50, () => k.go("menu"));

  k.onKeyPress("r", () => k.go(data?.retryScene || "level1_long"));
  k.onKeyPress("n", () => k.go(data?.nextScene || "level2"));
  k.onKeyPress("m", () => k.go("menu"));
}

