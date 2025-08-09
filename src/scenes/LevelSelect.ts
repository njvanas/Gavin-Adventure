import { k } from "../game";

function levelButton(label: string, x: number, y: number, onPress: () => void) {
  const btn = k.add([
    k.rect(160, 40),
    k.pos(x, y),
    k.color(60, 60, 90),
    k.anchor("center"),
    k.area(),
    k.outline(2, k.rgb(200, 200, 220)),
  ]);
  btn.add([k.text(label, { size: 16 }), k.anchor("center")]);

  btn.onClick(onPress);
  btn.onHoverUpdate(() => btn.color = k.rgb(80, 80, 120));
  btn.onHoverEnd(() => btn.color = k.rgb(60, 60, 90));
}

k.scene("LevelSelect", () => {
  k.add([k.text("Select a Level", { size: 24 }), k.pos(k.width()/2, 60), k.anchor("center")]);

  // For now, all unlocked. We'll wire progression later.
  levelButton("Level 1 — Flyn",  k.width()/2, 140, () => k.go("Level1"));
  levelButton("Level 2 — Tiger", k.width()/2, 200, () => k.go("Level2"));
  levelButton("Level 3 — Gizmo", k.width()/2, 260, () => k.go("Level3"));

  k.onKeyPress("escape", () => k.go("Title"));
});
