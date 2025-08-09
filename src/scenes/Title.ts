import { k } from "../game";

k.scene("Title", () => {
  k.add([
    k.text("Ants Adventure", { size: 32 }),
    k.pos(k.width() / 2, k.height() / 2 - 40),
    k.anchor("center"),
  ]);

  k.add([
    k.text("Press Enter to Start", { size: 16 }),
    k.pos(k.width() / 2, k.height() / 2 + 10),
    k.anchor("center"),
  ]);

  k.onKeyPress("enter", () => k.go("LevelSelect"));
});
