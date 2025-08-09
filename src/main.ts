import { k } from "./game";
import level1 from "./scenes/level1";

k.scene("level1", level1);
k.scene("level2", () => {
  k.add([k.text("Level 2 (WIP)", { size: 24 }), k.pos(120, 100)]);
});

k.go("level1");
