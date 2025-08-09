import { k } from "../game";

k.scene("Level3", () => {
  k.add([k.text("Level 3 — Gizmo (WIP)", { size: 20 }), k.pos(20, 20)]);
  k.onKeyPress("escape", () => k.go("LevelSelect"));
});
