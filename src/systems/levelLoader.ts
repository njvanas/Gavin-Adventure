import { k } from "../game";

// Very simple legend for now:
// # = solid ground block
// ^ = spikes (damage)
// . = empty
export function buildSimpleMap(map: string[], tileSize = 16) {
  const solids: any[] = [];
  const spikes: any[] = [];

  map.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const world = k.vec2(x * tileSize, y * tileSize);
      if (ch === "#") {
        solids.push(k.add([
          k.pos(world.x + tileSize / 2, world.y + tileSize / 2),
          k.rect(tileSize, tileSize),
          k.color(80, 80, 110),
          k.anchor("center"),
          k.area(),
          k.body({ isStatic: true }),
          "ground",
        ]));
      } else if (ch === "^") {
        spikes.push(k.add([
          k.pos(world.x + tileSize / 2, world.y + tileSize / 2),
          k.rect(tileSize, tileSize),
          k.color(200, 80, 80),
          k.anchor("center"),
          k.area(),
          "spike",
        ]));
      }
    });
  });

  // world bounds for camera
  const width = (map[0]?.length ?? 0) * tileSize;
  const height = map.length * tileSize;
  k.onUpdate(() => {
    const pos = k.camPos();
    k.camPos(k.vec2(
      k.clamp(pos.x, 120, width - 120),
      k.clamp(pos.y, 90, height - 90)
    ));
  });

  return { solids, spikes, width, height };
}
