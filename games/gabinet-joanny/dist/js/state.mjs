import { PUZZLES, BY_ID, CHAPTERS, TYPES } from "./puzzles.mjs";
import { cleanDraft, defaultDraft } from "./engine.mjs";
import { TRACKS } from "./music.mjs";
export const KEY = "gabinet-joanny-v1";
export function freshState() {
  return {
    version: 1,
    paused: false,
    view: "home",
    currentId: PUZZLES[0].id,
    answers: {},
    progress: {},
    notes: {},
    bookmarks: [],
    filters: { chapter: "all", difficulty: "all", type: "all", status: "all" },
    sound: false,
    musicTrack: TRACKS[0].id,
    volume: 0.18,
  };
}
export function record(s, id) {
  return (
    s.progress[id] ?? {
      status: "new",
      hints: 0,
      attempts: 0,
      elapsed: 0,
      revealed: false,
      seals: 0,
    }
  );
}
export function draft(s, p) {
  return s.answers[p.id] ?? defaultDraft(p);
}
const clamp = (v, max) =>
  Number.isFinite(v) ? Math.max(0, Math.min(max, Math.floor(v))) : 0;
export function parseState(raw) {
  const x = JSON.parse(raw);
  if (!x || x.version !== 1) throw Error("To nie jest zapis Gabinetu Joanny.");
  const s = freshState();
  if (BY_ID.has(x.currentId)) s.currentId = x.currentId;
  s.view = x.view === "puzzle" ? "puzzle" : "home";
  s.paused = x.paused === true;
  for (const p of PUZZLES) {
    if (x.answers && Object.hasOwn(x.answers, p.id))
      s.answers[p.id] = cleanDraft(p, x.answers[p.id]);
    if (typeof x.notes?.[p.id] === "string")
      s.notes[p.id] = x.notes[p.id].slice(0, 5000);
    const a = x.progress?.[p.id];
    if (a && typeof a === "object") {
      const status = ["new", "solved", "read"].includes(a.status)
          ? a.status
          : "new",
        hints = clamp(a.hints, 2),
        revealed = a.revealed === true;
      s.progress[p.id] = {
        status,
        hints,
        revealed,
        attempts: clamp(a.attempts, 9999),
        elapsed: clamp(a.elapsed, 31536000000),
        seals: status === "solved" && !revealed ? 3 - hints : 0,
      };
    }
  }
  s.bookmarks = Array.isArray(x.bookmarks)
    ? [...new Set(x.bookmarks.filter((id) => BY_ID.has(id)))]
    : [];
  if (x.filters) {
    if (CHAPTERS.some((c) => c.id === x.filters.chapter))
      s.filters.chapter = x.filters.chapter;
    if (["1", "2", "3"].includes(x.filters.difficulty))
      s.filters.difficulty = x.filters.difficulty;
    if (Object.hasOwn(TYPES, x.filters.type)) s.filters.type = x.filters.type;
    if (["new", "solved", "bookmarked"].includes(x.filters.status))
      s.filters.status = x.filters.status;
  }
  s.sound = x.sound === true;
  if (TRACKS.some((t) => t.id === x.musicTrack)) s.musicTrack = x.musicTrack;
  s.volume = Number.isFinite(x.volume)
    ? Math.min(0.4, Math.max(0, x.volume))
    : 0.18;
  return s;
}
export function solvedState(s, p) {
  const r = record(s, p.id);
  return {
    ...s,
    progress: {
      ...s.progress,
      [p.id]: { ...r, status: "solved", seals: r.revealed ? 0 : 3 - r.hints },
    },
  };
}
export function summary(s) {
  const done = Object.values(s.progress).filter((r) => r.status === "solved");
  return {
    solved: done.length,
    seals: done.reduce((a, r) => a + r.seals, 0),
    read: Object.values(s.progress).filter((r) => r.status === "read").length,
    notes: Object.values(s.notes).filter(Boolean).length,
  };
}
