import { Cube, validateState, inverse, tokens } from "./cube.ts";
export type StagePlan = {
  id: number;
  title: string;
  moves: string[];
  start: string;
  end: string;
};
export const STAGES = [
  {
    title: "Stokrotka w ogrodzie",
    short: "Stokrotka",
    goal: "Cztery białe płatki otaczają żółty środek u góry.",
    why: "Krawędź ma dwa kolory. Szukamy czterech krawędzi z białym polem.",
  },
  {
    title: "Biały krzyż",
    short: "Biały krzyż",
    goal: "Biały krzyż jest na dole, a boczne kolory jego ramion pasują do środków.",
    why: "Biały krzyż to nie tylko białe pola: każdy bok ramienia też ma swój domek.",
  },
  {
    title: "Pierwsze piętro domku",
    short: "Białe narożniki",
    goal: "Cały biały dół jest ułożony. Dolne rzędy wszystkich boków pasują do środków.",
    why: "Narożnik ma trzy kolory. Trafia między trzy środki w tych samych kolorach.",
  },
  {
    title: "Kolorowe okiennice",
    short: "Środkowa warstwa",
    goal: "Dwa dolne rzędy każdego boku są ułożone.",
    why: "Teraz wstawiamy krawędzie bez żółtego koloru. Krótkie sekwencje na chwilę ruszają dół, ale na końcu go odtwarzają.",
  },
  {
    title: "Żółty słoneczny krzyż",
    short: "Żółty krzyż",
    goal: "Żółte krawędzie tworzą krzyż u góry. Ich boki mogą jeszcze nie pasować.",
    why: "Najpierw obracamy żółte pola ku górze. Miejscami klocków zajmiemy się później.",
  },
  {
    title: "Słońce nad Avonlea",
    short: "Żółta góra",
    goal: "Cała górna ścianka jest żółta. Dwie dolne warstwy nadal są ułożone.",
    why: "Powtarzalny wzór ustawia narożniki. Nie zatrzymuj się w połowie sekwencji: wtedy gotowe części mogą chwilowo wyglądać na pomieszane.",
  },
  {
    title: "Narożniki wracają do domu",
    short: "Miejsca narożników",
    goal: "Wszystkie narożniki pasują kolorami do trzech sąsiednich środków.",
    why: "Kolor na górze nie wystarcza. Sprawdzamy też dwa boki każdego narożnika.",
  },
  {
    title: "Święto na Zielonym Wzgórzu",
    short: "Ostatnie krawędzie",
    goal: "Każda ścianka ma jeden kolor. Kostka jest ułożona!",
    why: "Przesuwamy ostatnie krawędzie, zachowując ułożone narożniki. To ostatnia prosta.",
  },
];
const eq = (p: number[], o: number[], ids: number[]) =>
  ids.every((i) => p[i] === i && o[i] === 0);
export function stageDone(c: Cube, n: number): boolean {
  const cross = eq(c.ep, c.eo, [4, 5, 6, 7]),
    layer = cross && eq(c.cp, c.co, [4, 5, 6, 7]),
    middle = layer && eq(c.ep, c.eo, [8, 9, 10, 11]),
    yellowCross = middle && [0, 1, 2, 3].every((i) => c.eo[i] === 0),
    yellow = yellowCross && [0, 1, 2, 3].every((i) => c.co[i] === 0),
    corners = yellow && eq(c.cp, c.co, [0, 1, 2, 3]);
  return n === 0
    ? [0, 1, 2, 3].every((i) => c.ep[i] >= 4 && c.ep[i] <= 7 && c.eo[i] === 0)
    : n === 1
      ? cross
      : n === 2
        ? layer
        : n === 3
          ? middle
          : n === 4
            ? yellowCross
            : n === 5
              ? yellow
              : n === 6
                ? corners
                : c.isSolved();
}
const U = ["U", "U2", "U'"];
function yaw(alg: string, n: number) {
  const ring = "FRBL";
  return tokens(alg)
    .map((m) =>
      ring.includes(m[0]) ? ring[(ring.indexOf(m[0]) + n) % 4] + m.slice(1) : m,
    )
    .join(" ");
}
function around(alg: string) {
  return [0, 1, 2, 3].flatMap((n) => {
    const a = yaw(alg, n);
    return [a, inverse(a)];
  });
}
const ALL = "URFDLB".split("").flatMap((f) => [f, f + "2", f + "'"]);
const CORNERS = [
  ...U,
  ..."RFLB"
    .split("")
    .flatMap((f) => U.flatMap((u) => [`${f} ${u} ${f}'`, `${f}' ${u} ${f}`])),
];
const MIDDLE = [...U, ...around("U R U' R' U' F' U F")];
const EO = [...U, ...around("F R U R' U' F'")];
const CO = [...U, ...around("R U R' U R U2 R'")];
const CP = [...U, ...around("R U R' U' R' F R2 U' R' U' R U R' F'")];
const EP = around("R U' R U R U R U' R' U' R2");
export const GENERATORS = [ALL, ALL, CORNERS, MIDDLE, EO, CO, CP, EP];
function perms(xs: number[]): number[][] {
  return xs.length === 1
    ? [xs]
    : xs.flatMap((v, i) =>
        perms(xs.filter((_, j) => j !== i)).map((p) => [v, ...p]),
      );
}
const configs = [
  { kind: "edge", ids: [4, 5, 6, 7], roots: perms([0, 1, 2, 3]) },
  { kind: "edge", ids: [4, 5, 6, 7], roots: [[4, 5, 6, 7]] },
  { kind: "corner", ids: [4, 5, 6, 7], roots: [[4, 5, 6, 7]] },
  { kind: "edge", ids: [8, 9, 10, 11], roots: [[8, 9, 10, 11]] },
  { kind: "edge", ids: [0, 1, 2, 3], roots: perms([0, 1, 2, 3]) },
  { kind: "corner", ids: [0, 1, 2, 3], roots: perms([0, 1, 2, 3]) },
  { kind: "corner", ids: [0, 1, 2, 3], roots: [[0, 1, 2, 3]] },
  { kind: "edge", ids: [0, 1, 2, 3], roots: [[0, 1, 2, 3]] },
];
const SIZE = 24 ** 4;
type Table = { parent: Int32Array; action: Int8Array };
const tables = new Map<number, Table>();
function encode(v: number[]) {
  return v[0] + 24 * v[1] + 576 * v[2] + 13824 * v[3];
}
function key(c: Cube, n: number) {
  const cfg = configs[n],
    corner = cfg.kind === "corner",
    p = corner ? c.cp : c.ep,
    o = corner ? c.co : c.eo,
    b = corner ? 3 : 2;
  return encode(
    cfg.ids.map((id) => {
      const pos = p.indexOf(id);
      return pos * b + o[pos];
    }),
  );
}
export function buildTable(n: number): Table {
  const cached = tables.get(n);
  if (cached) return cached;
  const cfg = configs[n],
    corner = cfg.kind === "corner",
    b = corner ? 3 : 2,
    parent = new Int32Array(SIZE).fill(-1),
    action = new Int8Array(SIZE).fill(-1),
    queue = new Int32Array(SIZE);
  let head = 0,
    tail = 0;
  for (const positions of cfg.roots) {
    const code = encode(positions.map((p) => p * b));
    parent[code] = code;
    queue[tail++] = code;
  }
  const maps = GENERATORS[n].map((a) => {
    const cube = new Cube().move(a),
      p = corner ? cube.cp : cube.ep,
      o = corner ? cube.co : cube.eo;
    const map = new Uint8Array(24);
    for (let dest = 0; dest < p.length; dest++)
      for (let ori = 0; ori < b; ori++)
        map[p[dest] * b + ori] = dest * b + ((ori + o[dest]) % b);
    return map;
  });
  while (head < tail) {
    const code = queue[head++],
      a = code % 24,
      bv = Math.floor(code / 24) % 24,
      c = Math.floor(code / 576) % 24,
      d = Math.floor(code / 13824);
    for (let m = 0; m < maps.length; m++) {
      const map = maps[m],
        next = map[a] + 24 * map[bv] + 576 * map[c] + 13824 * map[d];
      if (parent[next] !== -1) continue;
      parent[next] = code;
      action[next] = m;
      queue[tail++] = next;
    }
  }
  const table = { parent, action };
  tables.set(n, table);
  return table;
}
export function solveStages(
  state: string,
  progress?: (n: number) => void,
): StagePlan[] {
  const error = validateState(state);
  if (error) throw Error(error);
  const c = Cube.fromString(state),
    plans: StagePlan[] = [];
  // A finished cube must stay finished, rather than being opened into a daisy.
  const already = c.isSolved();
  for (let n = 0; n < 8; n++) {
    progress?.(n);
    const start = c.asString(),
      moves: string[] = [];
    if (!already && !stageDone(c, n)) {
      const table = buildTable(n);
      let k = key(c, n),
        safety = 0;
      if (table.parent[k] === -1)
        throw Error(`Nie udało się znaleźć etapu ${n + 1}. Sprawdź siatkę.`);
      while (table.parent[k] !== k) {
        if (++safety > 100) throw Error("Przekroczono długość etapu.");
        const a = inverse(GENERATORS[n][table.action[k]]);
        moves.push(...tokens(a));
        c.move(a);
        k = table.parent[k];
      }
      if (!stageDone(c, n)) throw Error(`Nie zgadza się wynik etapu ${n + 1}.`);
    }
    plans.push({
      id: n,
      title: STAGES[n].title,
      moves,
      start,
      end: c.asString(),
    });
  }
  if (!c.isSolved()) throw Error("Końcowy stan nie jest ułożony.");
  return plans;
}
