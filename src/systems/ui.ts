import { k } from "../game";

export function attachHUD(getHearts: () => number) {
  const hearts = k.add([
    k.pos(12, 10),
    k.fixed(),
  ]);

  const heartIcons: any[] = [];
  for (let i = 0; i < 3; i++) {
    heartIcons.push(
      hearts.add([
        k.rect(12, 12),
        k.color(240, 90, 90),
        k.pos(i * 16, 0),
        k.outline(2),
      ])
    );
  }

  k.onUpdate(() => {
    const h = getHearts();
    heartIcons.forEach((icon, i) => {
      icon.opacity = i < h ? 1 : 0.2;
    });
  });

  // Pause/mute (basic)
  let paused = false;
  k.onKeyPress("p", () => {
    paused = !paused;
    k.debug.paused = paused;
  });
  k.onKeyPress("m", () => {
    if (k.audioCtx) {
      if (k.audioCtx.state === "suspended") {
        k.audioCtx.resume();
      } else {
        k.audioCtx.suspend();
      }
    }
  });
}
