import { k } from "../game";

k.scene("Level2", () => {
  k.add([k.text("Level 2 — Tiger (WIP)", { size: 20 }), k.pos(20, 20)]);
  k.onKeyPress("escape", () => k.go("LevelSelect"));
});
