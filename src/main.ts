import { k, loadCommonAssets } from "./game";
import "./scenes/Title";
import "./scenes/LevelSelect";
import "./scenes/Level1";
import "./scenes/Level2";
import "./scenes/Level3";
import "./scenes/Finale";

(async () => {
  await loadCommonAssets();
  k.go("Title");
})();
