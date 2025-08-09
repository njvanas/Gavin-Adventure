import { k } from "./game";
import level1_long from "./scenes/level1_long";
import level_end from "./scenes/level_end";

k.scene("level1_long", level1_long);
k.scene("level_end", level_end);

// Minimal menu (stub)
k.scene("menu", () => {
  k.add([
    k.text("Menu\n[Enter] Play Level 1", { size: 18, width: 300, align: "center" }),
    k.pos(160, 100),
    k.anchor("center"),
  ]);
  k.onKeyPress("enter", () => k.go("level1_long"));
});

// Keep level2 if you already had it; otherwise stub:
k.scene("level2", () => {
  k.add([k.text("Level 2 (WIP)", { size: 24 }), k.pos(120, 100)]);
});

// Boot into long level (or menu if you prefer)
k.go("level1_long");
