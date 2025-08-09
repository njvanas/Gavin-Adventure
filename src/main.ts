import { k } from "./game";
import level1 from "./scenes/level1";
import level1_long from "./scenes/level1_long";

k.scene("level1", level1);
k.scene("level1_long", level1_long);
k.scene("level2", () => {
  k.add([k.text("Level 2 (WIP)", { size: 24 }), k.pos(120, 100)]);
});

// Boot into the long level by default for now
k.go("level1_long");
