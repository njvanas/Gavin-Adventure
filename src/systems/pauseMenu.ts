import { k } from "../game";
import { isPaused, setPaused } from "../systems/pause";

// Change if your main menu scene id differs (Title or main_menu)
const MAIN_MENU_SCENE = "Title";

let uiRoot: any = null;

export function initPauseMenu(currentSceneName: string, restartData?: any) {
  k.onKeyPress("escape", () => {
    if (isPaused()) resumeGame();
    else showMenu(currentSceneName, restartData);
  });
}

function showMenu(currentScene: string, restartData?: any) {
  if (uiRoot) return;
  setPaused(true);

  // Use a very high z value to ensure pause menu is always on top
  uiRoot = k.add([k.pos(0, 0), k.fixed(), k.z(99999), { isPauseMenu: true }]);

  const overlay = uiRoot.add([
    k.rect(k.width(), k.height()),
    k.opacity(0.55),
    k.color(0, 0, 0),
    k.fixed(),
    k.z(1),
  ]);

  const panel = uiRoot.add([
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.rect(240, 200, { radius: 10 }),
    k.color(35, 38, 55),
    k.outline(3, k.rgb(90, 100, 140)),
    k.fixed(),
    k.z(2),
  ]);

  panel.add([
    k.text("PAUSED", { size: 30 }),
    k.pos(0, -70),
    k.anchor("center"),
    k.z(3),
  ]);

  let y = -25;
  makeButton(panel, "Resume", () => resumeGame(), y); y += 55;
  makeButton(panel, "Restart", () => {
    resumeGame();
    k.go(currentScene, restartData);
  }, y); y += 55;
  makeButton(panel, "Exit to Menu", () => {
    resumeGame();
    k.go(MAIN_MENU_SCENE);
  }, y);

  // Handle resize
  // @ts-ignore
  k.onResize?.(() => {
    if (!uiRoot) return;
    overlay.width = k.width();
    overlay.height = k.height();
    panel.pos = k.vec2(k.width() / 2, k.height() / 2);
  });
}

function makeButton(parent: any, label: string, action: () => void, y: number) {
  const btn = parent.add([
    k.pos(0, y),
    k.anchor("center"),
    k.rect(170, 40, { radius: 6 }),
    k.color(60, 66, 95),
    k.area(),
    k.outline(2, k.rgb(110, 120, 160)),
    k.z(4),
    { action },
  ]);
  btn.add([
    k.text(label, { size: 18 }),
    k.anchor("center"),
    k.z(5),
  ]);

  btn.onHover(() => { btn.color = k.rgb(75, 82, 118); });
  btn.onHoverEnd(() => { btn.color = k.rgb(60, 66, 95); });
  btn.onClick(action);
}

function resumeGame() {
  if (!uiRoot) return;
  uiRoot.destroy();
  uiRoot = null;
  setPaused(false);
}