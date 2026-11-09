import type { Saved } from "./cube.ts";

// A checkpoint is a child's confirmation of their physical cube, never camera recognition.
export function confirmStage(saved: Saved): Saved {
  if (saved.confirmed.includes(saved.stage)) return saved;
  const confirmed = [...saved.confirmed, saved.stage];
  return {
    ...saved,
    confirmed,
    stage: Math.min(7, saved.stage + 1),
    step: saved.stage === 7 ? saved.step : 0,
    wins: saved.wins + (saved.stage === 7 ? 1 : 0),
  };
}
