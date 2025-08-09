import { k } from "./game";
import { loadAssets } from "./assets";
import level1_long from "./scenes/level1_long";
import level_end from "./scenes/level_end";

k.scene("level1_long", level1_long);
k.scene("level_end", level_end);
k.scene("level2", () => {
  k.add([k.text("Level 2 (WIP)", { size: 24 }), k.pos(120, 100)]);
});

// Ensure assets loaded once before first scene
(async () => {
  await loadAssets();
  k.go("level1_long");
})();
