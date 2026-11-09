import Cube from "cubejs/lib/cube.js";
export { Cube };
export const FACES = ["U", "R", "F", "D", "L", "B"] as const;
export type Face = (typeof FACES)[number];
export const COLORS = {
  w: { name: "biały", label: "B", hex: "#fff9e8" },
  y: { name: "żółty", label: "Ż", hex: "#efce52" },
  g: { name: "zielony", label: "Z", hex: "#59a18a" },
  b: { name: "niebieski", label: "N", hex: "#699ec9" },
  r: { name: "czerwony", label: "C", hex: "#d77978" },
  o: { name: "pomarańczowy", label: "P", hex: "#e8a45d" },
};
export type Color = keyof typeof COLORS;
export type Centers = Record<Face, Color>;
export const DEFAULT_CENTERS: Centers = {
  U: "y",
  R: "o",
  F: "g",
  D: "w",
  L: "r",
  B: "b",
};
export const FACE_NAMES: Record<Face, string> = {
  U: "Góra",
  R: "Prawa",
  F: "Przód",
  D: "Dół",
  L: "Lewa",
  B: "Tył",
};
export const FACE_TOP: Record<Face, Face> = {
  U: "B",
  R: "U",
  F: "U",
  D: "F",
  L: "U",
  B: "U",
};
export const SOLVED = FACES.map((f) => f.repeat(9)).join("");
export function blankNet(centers: Centers): string[] {
  return FACES.flatMap((f) =>
    Array.from({ length: 9 }, (_, i) => (i === 4 ? centers[f] : "")),
  );
}
export function colored(state: string, centers: Centers): Color[] {
  return [...state].map((f) => centers[f as Face]);
}
export function tokens(s: string): string[] {
  if (!s.trim()) return [];
  const out = s.trim().split(/\s+/);
  if (out.some((m) => !/^([URFDLB])(['2]?)$/.test(m)))
    throw Error("Nieprawidłowy ruch.");
  return out;
}
export function inverse(s: string): string {
  return tokens(s)
    .reverse()
    .map((m) => (m.length === 1 ? m + "'" : m.endsWith("2") ? m : m[0]))
    .join(" ");
}
export function apply(state: string, algorithm: string): string {
  return Cube.fromString(state).move(tokens(algorithm).join(" ")).asString();
}
function parity(p: number[]): number {
  let n = 0;
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) n++;
  return n % 2;
}
export function validateState(state: string): string | null {
  if (state.length !== 54 || [...state].some((x) => !FACES.includes(x as Face)))
    return "Wpisz wszystkie 54 pola.";
  if (
    FACES.some(
      (f, i) =>
        state[i * 9 + 4] !== f ||
        [...state].filter((x) => x === f).length !== 9,
    )
  )
    return "Każdy kolor musi mieć 9 pól, a środek określa kolor ścianki.";
  try {
    const c = Cube.fromString(state);
    const perm = (a: number[], n: number) =>
      a.length === n &&
      new Set(a).size === n &&
      a.every((x) => Number.isInteger(x) && x >= 0 && x < n);
    if (!perm(c.cp, 8) || !perm(c.ep, 12) || c.asString() !== state)
      return "Nie zgadzają się kolory jednego z klocków. Sprawdź narożniki i krawędzie oraz górną krawędź każdej przepisanej ścianki.";
    if (c.co.reduce((a, b) => a + b, 0) % 3 !== 0)
      return "Ten układ ma skręcony narożnik. Sprawdź wpisane kolory; jeśli są zgodne, narożnik mógł zostać przekręcony ręcznie.";
    if (c.eo.reduce((a, b) => a + b, 0) % 2 !== 0)
      return "Ten układ ma odwróconą krawędź. Sprawdź kolory; takiego układu nie uzyskamy samymi obrotami.";
    if (parity(c.cp) !== parity(c.ep))
      return "Dwa klocki są zamienione w niemożliwy sposób. Sprawdź przepisaną siatkę albo czy kostka nie była rozbierana.";
    return null;
  } catch {
    return "Sprawdź kolory przy narożnikach i krawędziach.";
  }
}
export function netToState(
  net: string[],
  centers: Centers,
): { state?: string; error?: string } {
  if (
    new Set(Object.values(centers)).size !== 6 ||
    centers.U !== "y" ||
    centers.D !== "w"
  )
    return {
      error: "Ustaw sześć różnych środków: żółty u góry, biały na dole.",
    };
  if (net.length !== 54 || net.some((c) => !Object.hasOwn(COLORS, c)))
    return { error: "Jeszcze nie wszystkie pola są pokolorowane." };
  const reverse = Object.fromEntries(FACES.map((f) => [centers[f], f]));
  const state = net.map((c) => reverse[c]).join("");
  const error = validateState(state);
  return error ? { error } : { state };
}
export type Sticker = {
  index: number;
  face: Face;
  position: [number, number, number];
  normal: [number, number, number];
};
export function stickerGeometry(): Sticker[] {
  return FACES.flatMap((face, f) =>
    Array.from({ length: 9 }, (_, i) => {
      const r = Math.floor(i / 3),
        c = i % 3;
      const p: Record<Face, [number, number, number]> = {
        U: [c - 1, 1, r - 1],
        D: [c - 1, -1, 1 - r],
        F: [c - 1, 1 - r, 1],
        B: [1 - c, 1 - r, -1],
        R: [1, 1 - r, 1 - c],
        L: [-1, 1 - r, c - 1],
      };
      const n: Record<Face, [number, number, number]> = {
        U: [0, 1, 0],
        D: [0, -1, 0],
        F: [0, 0, 1],
        B: [0, 0, -1],
        R: [1, 0, 0],
        L: [-1, 0, 0],
      };
      return { index: f * 9 + i, face, position: p[face], normal: n[face] };
    }),
  );
}
export const NORMALS: Record<Face, [number, number, number]> = {
  U: [0, 1, 0],
  R: [1, 0, 0],
  F: [0, 0, 1],
  D: [0, -1, 0],
  L: [-1, 0, 0],
  B: [0, 0, -1],
};
export function moveText(move: string, centers: Centers) {
  const face = move[0] as Face;
  return {
    face,
    name: (
      {
        U: "Górna",
        R: "Prawa",
        F: "Przednia",
        D: "Dolna",
        L: "Lewa",
        B: "Tylna",
      } as Record<Face, string>
    )[face],
    color: COLORS[centers[face]].name,
    turn: move.endsWith("2") ? 2 : move.endsWith("'") ? -1 : 1,
    direction: move.endsWith("2")
      ? "pół obrotu"
      : move.endsWith("'")
        ? "w lewo, przeciwnie do wskazówek zegara"
        : "w prawo, jak wskazówki zegara",
  };
}
export type Saved = {
  version: 1;
  centers: Centers;
  net: string[];
  state: string;
  stage: number;
  step: number;
  confirmed: number[];
  started: boolean;
  example: boolean;
  wins: number;
  music: number;
  volume: number;
};
export const STORAGE_KEY = "kostka-zielone-wzgorze-v1";
export function freshSaved(): Saved {
  return {
    version: 1,
    centers: { ...DEFAULT_CENTERS },
    net: blankNet(DEFAULT_CENTERS),
    state: SOLVED,
    stage: 0,
    step: 0,
    confirmed: [],
    started: false,
    example: false,
    wins: 0,
    music: 0,
    volume: 0.2,
  };
}
export function parseSaved(raw: string): Saved {
  const v = JSON.parse(raw),
    s = freshSaved();
  if (v?.version !== 1) throw Error("Nieprawidłowy zapis");
  if (
    v.centers &&
    FACES.every((f) => Object.hasOwn(COLORS, v.centers[f])) &&
    new Set(FACES.map((f) => v.centers[f])).size === 6 &&
    v.centers.U === "y" &&
    v.centers.D === "w"
  )
    s.centers = { ...v.centers };
  if (
    Array.isArray(v.net) &&
    v.net.length === 54 &&
    v.net.every(
      (c: unknown) =>
        c === "" || (typeof c === "string" && Object.hasOwn(COLORS, c)),
    )
  )
    s.net = [...v.net];
  if (typeof v.state === "string" && !validateState(v.state)) s.state = v.state;
  else if (v.started) throw Error("Uszkodzony stan kostki");
  s.stage = Number.isInteger(v.stage) ? Math.max(0, Math.min(7, v.stage)) : 0;
  s.step = Number.isInteger(v.step) ? Math.max(0, Math.min(500, v.step)) : 0;
  s.confirmed = Array.isArray(v.confirmed)
    ? [
        ...new Set<number>(
          v.confirmed.filter(
            (n: unknown) =>
              Number.isInteger(n) && Number(n) >= 0 && Number(n) < 8,
          ),
        ),
      ]
    : [];
  s.started = v.started === true;
  s.example = v.example === true;
  s.wins = Number.isInteger(v.wins) ? Math.max(0, Math.min(100000, v.wins)) : 0;
  s.music = v.music === 1 ? 1 : 0;
  s.volume =
    typeof v.volume === "number" && Number.isFinite(v.volume)
      ? Math.max(0, Math.min(0.6, v.volume))
      : 0.2;
  return s;
}
