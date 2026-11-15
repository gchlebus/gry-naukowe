import { BY_ID, LESSONS } from "./lessons.mjs";
import { replay } from "./engine.mjs";
export const KEY = "pan-iksik-v1";
export function fresh() {
  return {
    v: 1,
    page: "home",
    lesson: LESSONS[0].id,
    done: [],
    steps: [],
    sound: false,
  };
}
export function parse(raw) {
  const x = JSON.parse(raw);
  if (!x || x.v !== 1) throw Error("To nie jest zapis Pana Iksika.");
  const s = fresh();
  if (BY_ID.has(x.lesson)) s.lesson = x.lesson;
  s.page = x.page === "play" ? "play" : "home";
  s.sound = x.sound === true;
  s.done = Array.isArray(x.done)
    ? [...new Set(x.done.filter((id) => BY_ID.has(id)))]
    : [];
  if (Array.isArray(x.steps)) {
    for (const a of x.steps.slice(0, 64)) {
      if (!a || typeof a !== "object") break;
      const c =
        a.type === "move"
          ? { type: "move", from: a.from, id: a.id }
          : { type: a.type };
      try {
        replay(BY_ID.get(s.lesson), [...s.steps, c]);
        s.steps.push(c);
      } catch {
        break;
      }
    }
  }
  return s;
}
