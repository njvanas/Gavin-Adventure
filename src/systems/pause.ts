export let paused = false;

export function isPaused() {
  return paused;
}

export function setPaused(v: boolean) {
  paused = v;
}

export function togglePaused() {
  setPaused(!paused);
}