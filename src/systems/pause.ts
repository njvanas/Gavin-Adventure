export const Pause = {
  value: false,
};

export function isPaused() {
  return Pause.value;
}

export function setPaused(p: boolean) {
  Pause.value = p;
}
