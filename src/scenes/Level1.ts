import { k } from "../game";
import { spawnPlayer } from "../systems/player";
import { attachHUD } from "../systems/ui";
import { buildSimpleMap } from "../systems/levelLoader";
import { level1Map } from "../data/level1";

k.scene("Level1", () => {
  // build map
  buildSimpleMap(level1Map, 16);

  // spawn player near left, above the ground
  const plr = spawnPlayer(k.vec2(40, 180));

  // HUD
  attachHUD(() => plr.getHearts());

  // simple spike damage
  plr.onCollide("spike", () => plr.damage(1));

  // jump input will be handled in player update loop

  // escape to menu
  k.onKeyPress("escape", () => k.go("LevelSelect"));
});
