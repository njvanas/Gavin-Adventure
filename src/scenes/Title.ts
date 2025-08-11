import { k } from "../game";

k.scene("Title", () => {
  k.add([
    k.text("Ants Adventure", { size: 40 }),
    k.pos(k.width() / 2, k.height() / 2 - 60),
    k.anchor("center"),
  ]);

  const start = k.add([
    k.text("Press Enter to Start", { size: 18 }),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.area(),
  ]);

  k.onKeyPress("enter", () => k.go("level1_long"));
  start.onClick(() => k.go("level1_long"));

  k.add([
    k.text("Esc in‑game opens Pause Menu", { size: 12 }),
    k.pos(k.width() / 2, k.height() / 2 + 50),
    k.anchor("center"),
  ]);
});