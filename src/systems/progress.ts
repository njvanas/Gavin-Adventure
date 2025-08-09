export type RunStats = {
  levelId: string;
  timeMs: number;
  coins: number;
  deaths: number;
};

const KEY_PREFIX = "kb_progress:";

export function bestKey(levelId: string) {
  return `${KEY_PREFIX}${levelId}:best`;
}

export function loadBest(levelId: string): RunStats | null {
  try {
    const raw = localStorage.getItem(bestKey(levelId));
    return raw ? (JSON.parse(raw) as RunStats) : null;
  } catch {
    return null;
  }
}

export function saveBest(stats: RunStats) {
  const prev = loadBest(stats.levelId);
  const better =
    !prev ||
    stats.timeMs < prev.timeMs ||
    (stats.timeMs === prev.timeMs && stats.deaths < prev.deaths) ||
    (stats.timeMs === prev.timeMs && stats.deaths === prev.deaths && stats.coins > prev.coins);
  if (better) {
    localStorage.setItem(bestKey(stats.levelId), JSON.stringify(stats));
  }
}

