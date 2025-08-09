import { k } from "../game";
import { solid, hazard, coin, checkpoint, exitDoor, movingPlatform, collapsingPlatform } from "./kit";
import { spawnPatroller } from "../entities/enemy";
import type { Vec2 } from "kaboom";

export type TiledLayer = {
  name: string;
  type: "tilelayer" | "objectgroup";
  width?: number;
  height?: number;
  data?: number[];
  objects?: TiledObject[];
};

export type TiledObject = {
  name: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties?: TiledProperty[];
};

export type TiledProperty = {
  name: string;
  type: string;
  value: any;
};

export type TiledMap = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: TiledLayer[];
};

// Helper to fetch / import a JSON Tiled map
export async function loadTiledJSON(url: string): Promise<TiledMap> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load map JSON: ${url}`);
  return res.json();
}

// We'll align everything to the same 32px tile grid used in the game.
const TILE = 32;

function propsToDict(props?: TiledProperty[]) {
  const out: Record<string, any> = {};
  (props || []).forEach(p => {
    out[p.name] = p.value;
  });
  return out;
}

function placeTileGrid(layer: TiledLayer, place: (x: number, y: number) => void) {
  const { width = 0, height = 0, data = [] } = layer;
  for (let ty = 0; ty < height; ty++) {
    for (let tx = 0; tx < width; tx++) {
      const idx = ty * width + tx;
      const gid = data[idx] || 0;
      if (gid !== 0) {
        const x = tx * TILE;
        const y = ty * TILE;
        place(x, y);
      }
    }
  }
}

export type BuiltMapRefs = {
  spawn: Vec2 | null;
};

export function buildFromTiled(map: TiledMap): BuiltMapRefs {
  let spawn: Vec2 | null = null;

  // Tile layers
  const solids = map.layers.find(l => l.name === "solids" && l.type === "tilelayer");
  const hazards = map.layers.find(l => l.name === "hazards" && l.type === "tilelayer");

  if (solids) {
    placeTileGrid(solids, (x, y) => solid(x, y, TILE, TILE));
  }
  if (hazards) {
    placeTileGrid(hazards, (x, y) => hazard(x, y, TILE, TILE));
  }

  // Object layers
  const coins = map.layers.find(l => l.name === "coins" && l.type === "objectgroup");
  coins?.objects?.forEach(o => {
    coin(o.x, o.y);
  });

  const entities = map.layers.find(l => l.name === "entities" && l.type === "objectgroup");
  entities?.objects?.forEach(o => {
    const p = propsToDict(o.properties);
    switch (o.type) {
      case "enemy":
        spawnPatroller({
          x: o.x,
          y: o.y - 12,
          speed: Number(p.speed ?? 60),
          width: Number(p.width ?? 14),
          height: Number(p.height ?? 12),
          leftFirst: Boolean(p.leftFirst ?? true),
        });
        break;
      case "checkpoint":
        checkpoint(o.x, o.y - 16);
        break;
      case "exit":
        exitDoor(o.x, o.y - 24);
        break;
      case "movingPlatform":
        movingPlatform(
          o.x,
          o.y,
          Number(p.w ?? o.width ?? 60),
          Number(p.h ?? o.height ?? 10),
          Number(p.amp ?? 40),
          Number(p.speed ?? 1.0),
        );
        break;
      case "collapsingPlatform":
        collapsingPlatform(
          o.x,
          o.y,
          Number(p.w ?? o.width ?? 48),
          Number(p.h ?? o.height ?? 10),
          Number(p.delay ?? 0.6),
          Number(p.respawn ?? 2.0),
        );
        break;
    }
  });

  const markers = map.layers.find(l => l.name === "markers" && l.type === "objectgroup");
  markers?.objects?.forEach(o => {
    if (o.name === "spawn") {
      spawn = k.vec2(o.x, o.y - 24);
    }
  });

  return { spawn };
}
