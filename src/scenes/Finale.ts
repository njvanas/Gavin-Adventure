import { k } from "../game";

k.scene("Finale", () => {
  k.add([k.text("All pets rescued! 💖", { size: 24 }), k.pos(k.width()/2, k.height()/2), k.anchor("center")]);
  k.onKeyPress("escape", () => k.go("Title"));
});
