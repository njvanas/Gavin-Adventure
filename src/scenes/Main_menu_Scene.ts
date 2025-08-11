import { k } from "../game";
import { isPaused, setPaused } from "./pause";

const MAIN_MENU_SCENE = "main_menu"; // change if different

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

  uiRoot = k.add([
    k.pos(0, 0),
    k.fixed(),
    { isPauseMenu: true },
  ]);

  // dark overlay
  uiRoot.add([
    k.rect(k.width(), k.height()),
    k.opacity(0.55),
    k.color(0, 0, 0),
    k.fixed(),
  ]);

  const panel = uiRoot.add([
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.rect(220, 180, { radius: 8 }),
    k.color(35, 38, 55),
    k.outline(2, k.rgb(90, 100, 140)),
    k.fixed(),
  ]);

  panel.add([
    k.text("PAUSED", { size: 28 }),
    k.pos(0, -60),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  let y = -20;
  addButton(panel, "Resume", () => resumeGame(), y); y += 50;
  addButton(panel, "Restart", () => {
    resumeGame();
    k.go(currentScene, restartData);
  }, y); y += 50;
  addButton(panel, "Exit to Menu", () => {
    resumeGame();
    k.go(MAIN_MENU_SCENE);
  }, y);

  // resize support
  // @ts-ignore
  k.onResize?.(() => {
    if (!uiRoot) return;
    panel.pos = k.vec2(k.width() / 2, k.height() / 2);
    uiRoot.children[0].width = k.width();
    uiRoot.children[0].height = k.height();
  });
}

function addButton(parent: any, label: string, action: () => void, y: number) {
  const btn = parent.add([
    k.pos(0, y),
    k.anchor("center"),
    k.rect(160, 36, { radius: 6 }),
    k.color(60, 66, 95),
    k.area(),
    k.outline(2, k.rgb(110, 120, 160)),
    { action },
  ]);
  btn.add([
    k.text(label, { size: 16 }),
    k.anchor("center"),
    k.color(255, 255, 255),
  ]);

  btn.onHover(() => {
    btn.color = k.rgb(75, 82, 118);
  });
  btn.onHoverEnd(() => {
    btn.color = k.rgb(60, 66, 95);
  });
  btn.onClick(() => action());
}

function resumeGame() {
  if (!uiRoot) return;
  uiRoot.destroy();
  uiRoot = null;
  setPaused(false);
}