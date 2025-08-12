import { k } from "./game";
import { loadAssets } from "./assets";
import Title from "./scenes/Title";
import level1 from "./scenes/level1";
import level_end from "./scenes/level_end";

k.scene("Title", Title);
k.scene("level1", level1);
k.scene("level_end", level_end);
k.scene("level2", () => {
  k.add([k.text("Level 2 - More Chicken!", { size: 24 }), k.pos(120, 100)]);
});

// Ensure assets loaded once before first scene
(async () => {
  await loadAssets();
  k.go("Title");
})();
