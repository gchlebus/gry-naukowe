export type Operation = "add" | "subtract" | "multiply" | "divide";
export type Level = 1 | 2 | 3;
export type Product = "apple" | "cupcake" | "bow" | "berry";
export const OPERATIONS: Record<
  Operation,
  {
    name: string;
    symbol: string;
    title: string;
    subtitle: string;
    verb: string;
  }
> = {
  add: {
    name: "Dodawanie",
    symbol: "+",
    title: "Policz zakupy",
    subtitle: "Łączymy dwa koszyki",
    verb: "Ile jest razem?",
  },
  subtract: {
    name: "Odejmowanie",
    symbol: "−",
    title: "Wydaj resztę",
    subtitle: "Liczymy, ile zostaje",
    verb: "Ile monet reszty oddasz?",
  },
  multiply: {
    name: "Mnożenie",
    symbol: "×",
    title: "Pakuj zestawy",
    subtitle: "Kilka równych grup",
    verb: "Ile smakołyków jest razem?",
  },
  divide: {
    name: "Dzielenie",
    symbol: "÷",
    title: "Podziel po równo",
    subtitle: "Każdy dostaje tyle samo",
    verb: "Ile w jednym koszyczku?",
  },
};
export const LEVELS = [
  {
    id: 1 as Level,
    name: "Pierwsze kroki",
    short: "Na dobry początek",
    range: "Dodawanie i odejmowanie do 10. Równe grupy do 20.",
  },
  {
    id: 2 as Level,
    name: "Coraz śmielej",
    short: "Trochę większe zakupy",
    range: "Dodawanie i odejmowanie do 50. Mnożenie i dzielenie przez 2–5.",
  },
  {
    id: 3 as Level,
    name: "Mistrzyni sklepiku",
    short: "Cała tabliczka do odkrycia",
    range:
      "Dodawanie i odejmowanie do 100. Tabliczka mnożenia i dzielenie do 100.",
  },
];
export const PRODUCTS: Record<
  Product,
  {
    name: string;
    singular: string;
    forms: [string, string, string];
    color: string;
  }
> = {
  apple: {
    name: "Jabłuszka",
    singular: "Jabłuszko",
    forms: ["jabłuszko", "jabłuszka", "jabłuszek"],
    color: "rose",
  },
  cupcake: {
    name: "Babeczki",
    singular: "Babeczka",
    forms: ["babeczka", "babeczki", "babeczek"],
    color: "lilac",
  },
  bow: {
    name: "Kokardki",
    singular: "Kokardka",
    forms: ["kokardka", "kokardki", "kokardek"],
    color: "peach",
  },
  berry: {
    name: "Truskawki",
    singular: "Truskawka",
    forms: ["truskawka", "truskawki", "truskawek"],
    color: "sage",
  },
};
export const PONIES = [
  {
    name: "Figa",
    color: "#e5a8bd",
    mane: "#f6e7c3",
    hello: "Cześć! Mam małe zamówienie.",
  },
  {
    name: "Lawendka",
    color: "#b8abd8",
    mane: "#eeb1c2",
    hello: "Pomożesz mi przygotować niespodziankę?",
  },
  {
    name: "Iskierka",
    color: "#ebc78d",
    mane: "#c5acd7",
    hello: "Ale tu pięknie! Poproszę smakołyki.",
  },
  {
    name: "Mgiełka",
    color: "#a8c8c2",
    mane: "#f0d1c0",
    hello: "Policzmy spokojnie, razem.",
  },
  {
    name: "Różyczka",
    color: "#dba3b4",
    mane: "#ead7a7",
    hello: "Szykuję piknik dla przyjaciół!",
  },
  {
    name: "Luna",
    color: "#b0bbda",
    mane: "#ddd0ed",
    hello: "Dzisiaj każdy pomysł się liczy.",
  },
];
export function word(n: number, forms: [string, string, string]): string {
  return n === 1
    ? forms[0]
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? forms[1]
      : forms[2];
}
export type Task = {
  id: string;
  operation: Operation;
  level: Level;
  product: Product;
  a: number;
  b: number;
  answer: number;
  options: number[];
  pony: number;
  review?: boolean;
};
export function result(op: Operation, a: number, b: number): number {
  return op === "add"
    ? a + b
    : op === "subtract"
      ? a - b
      : op === "multiply"
        ? a * b
        : a / b;
}
const pool = new Map<string, [number, number][]>();
export function facts(op: Operation, level: Level): [number, number][] {
  const key = `${op}:${level}`,
    old = pool.get(key);
  if (old) return old;
  const out: [number, number][] = [];
  if (op === "add" || op === "subtract") {
    const limit = [10, 50, 100][level - 1];
    for (let a = op === "subtract" ? 1 : level === 3 ? 10 : 1; a <= limit; a++)
      for (let b = 1; b <= limit; b++)
        if (
          op === "add"
            ? a + b <= limit &&
              (level !== 2 || a + b > 10) &&
              (level !== 3 || a + b >= 20)
            : b <= a && (level === 1 || a >= 10)
        )
          out.push([a, b]);
  } else {
    const maxGroup = level === 1 ? 4 : level === 2 ? 5 : 10,
      maxEach = level === 1 ? 5 : 10;
    for (let group = 2; group <= maxGroup; group++)
      for (let each = level === 1 ? 1 : 2; each <= maxEach; each++)
        out.push(op === "multiply" ? [group, each] : [group * each, group]);
  }
  pool.set(key, out);
  return out;
}
function pick<T>(array: T[], rng: () => number): T {
  return array[
    Math.min(array.length - 1, Math.max(0, Math.floor(rng() * array.length)))
  ];
}
export function shuffle<T>(array: T[], rng: () => number = Math.random): T[] {
  const out = [...array];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.max(0, Math.floor(rng() * (i + 1))));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export function optionsFor(
  answer: number,
  rng: () => number = Math.random,
): number[] {
  const near = [
    answer - 1,
    answer + 1,
    answer - 2,
    answer + 2,
    answer - 5,
    answer + 5,
    answer - 10,
    answer + 10,
    0,
    1,
    2,
    3,
  ].filter((v) => v >= 0 && v <= 100 && v !== answer);
  return shuffle(
    [answer, ...shuffle([...new Set(near)], rng).slice(0, 3)],
    rng,
  );
}
export function makeTask(
  op: Operation,
  level: Level,
  product: Product = "apple",
  rng: () => number = Math.random,
  previous?: Task,
): Task {
  const candidates = facts(op, level).filter(
    ([a, b]) =>
      !previous ||
      previous.a !== a ||
      previous.b !== b ||
      previous.operation !== op,
  );
  const [a, b] = pick(candidates, rng),
    answer = result(op, a, b);
  return {
    id: crypto.randomUUID(),
    operation: op,
    level,
    product,
    a,
    b,
    answer,
    options: optionsFor(answer, rng),
    pony: Math.min(5, Math.floor(rng() * 6)),
  };
}
export function taskText(t: Task): string {
  const noun = PRODUCTS[t.product],
    name = PONIES[t.pony].name;
  const selectedForms: [string, string, string] = [
    noun.forms[0].replace(/a$/, "ę"),
    noun.forms[1],
    noun.forms[2],
  ];
  if (t.operation === "add")
    return `${name} wybiera ${t.a} ${word(t.a, selectedForms)}, a potem jeszcze ${t.b} ${word(t.b, selectedForms)}. Ile zapakujesz razem?`;
  if (t.operation === "subtract")
    return `${noun.singular} kosztuje ${t.b} ${word(t.b, ["monetę", "monety", "monet"])}. ${name} daje ${t.a} ${word(t.a, ["monetę", "monety", "monet"])}. Ile monet reszty oddasz?`;
  if (t.operation === "multiply")
    return `${name} zamawia ${t.a} ${word(t.a, ["koszyczek", "koszyczki", "koszyczków"])}. W każdym ma być ${t.b} ${word(t.b, noun.forms)}. Ile przygotujesz razem?`;
  return `Rozdziel ${t.a} ${word(t.a, selectedForms)} do ${t.b} ${word(t.b, ["koszyczka", "koszyczków", "koszyczków"])} po równo. Ile będzie w jednym?`;
}
export function hintText(t: Task): string {
  if (t.operation === "add")
    return "Policz pierwszy zbiór, a potem dolicz drugi. Każda kropka to jedna rzecz. Pełna ramka ma 10 kropek.";
  if (t.operation === "subtract")
    return "Odłóż tyle monet, ile kosztują zakupy. Przekreślone monety są wydane. Policz te, które zostały.";
  if (t.operation === "multiply")
    return `Masz ${t.a} równych grup. Dodawaj po ${t.b}. To te same grupy, które pokazuje mnożenie.`;
  return "Rozkładaj po jednej rzeczy do każdego koszyczka. Sprawdź, czy wszyscy dostali po równo, i policz jeden koszyczek.";
}
export function inverseText(t: Task): string {
  if (t.operation === "add") return `${t.answer} − ${t.b} = ${t.a}`;
  if (t.operation === "subtract") return `${t.answer} + ${t.b} = ${t.a}`;
  if (t.operation === "multiply") return `${t.answer} ÷ ${t.a} = ${t.b}`;
  return `${t.answer} × ${t.b} = ${t.a}`;
}
export const factKey = (t: Pick<Task, "operation" | "a" | "b">) =>
  `${t.operation}:${t.a}:${t.b}`;
export type Skill = {
  attempts: number;
  correct: number;
  firstTry: number;
  withHelp: number;
};
export type Adaptive = {
  enabled: boolean;
  levels: Record<Operation, Level>;
  history: Record<Operation, boolean[]>;
  seen: string[];
};
export function freshAdaptive(): Adaptive {
  return {
    enabled: true,
    levels: { add: 1, subtract: 1, multiply: 1, divide: 1 },
    history: { add: [], subtract: [], multiply: [], divide: [] },
    seen: [],
  };
}
export function prepareRound(p: Progress): Progress {
  return {
    ...p,
    level: p.adaptive.enabled ? p.adaptive.levels[p.operation] : p.level,
  };
}
export function adapt(a: Adaptive, t: Task, independent: boolean): Adaptive {
  if (!a.enabled || a.seen.includes(t.id)) return a;
  const seen = [...a.seen, t.id].slice(-500);
  // A matching-card round may still contain tasks from the former level.
  if (t.level !== a.levels[t.operation]) return { ...a, seen };
  let history = [...a.history[t.operation], independent].slice(-6),
    level = a.levels[t.operation];
  const struggling = history.length >= 2 && history.slice(-2).every((v) => !v);
  const ready = history.length === 6 && history.filter(Boolean).length >= 5;
  if (struggling && level > 1) {
    level = (level - 1) as Level;
    history = [];
  } else if (ready && level < 3) {
    level = (level + 1) as Level;
    history = [];
  }
  return {
    ...a,
    seen,
    levels: { ...a.levels, [t.operation]: level },
    history: { ...a.history, [t.operation]: history },
  };
}
export function easierRound(p: Progress): Progress {
  const level = Math.max(1, p.level - 1) as Level;
  return prepareRound({
    ...p,
    level,
    adaptive: {
      ...p.adaptive,
      levels: { ...p.adaptive.levels, [p.operation]: level },
      history: { ...p.adaptive.history, [p.operation]: [] },
    },
  });
}
export type Progress = {
  adaptive: Adaptive;
  version: 1;
  solved: number;
  attempts: number;
  skills: Record<string, Skill>;
  solvedIds: string[];
  review: Task[];
  operation: Operation;
  level: Level;
  product: Product;
  music: boolean;
  volume: number;
};
export const STORAGE_KEY = "sklepik-kucykow-v1";
const emptySkill = (): Skill => ({
  attempts: 0,
  correct: 0,
  firstTry: 0,
  withHelp: 0,
});
export function freshProgress(): Progress {
  return {
    adaptive: freshAdaptive(),
    version: 1,
    solved: 0,
    attempts: 0,
    skills: Object.fromEntries(
      Object.keys(OPERATIONS).flatMap((op) =>
        [1, 2, 3].map((l) => [`${op}:${l}`, emptySkill()]),
      ),
    ),
    solvedIds: [],
    review: [],
    operation: "add",
    level: 1,
    product: "apple",
    music: false,
    volume: 0.25,
  };
}
function validTask(t: unknown): t is Task {
  if (!t || typeof t !== "object") return false;
  const x = t as Task;
  return (
    typeof x.id === "string" &&
    x.id.length < 100 &&
    Object.hasOwn(OPERATIONS, x.operation) &&
    [1, 2, 3].includes(x.level) &&
    Object.hasOwn(PRODUCTS, x.product) &&
    Number.isInteger(x.a) &&
    Number.isInteger(x.b) &&
    facts(x.operation, x.level).some(([a, b]) => a === x.a && b === x.b) &&
    x.answer === result(x.operation, x.a, x.b) &&
    Number.isInteger(x.pony) &&
    x.pony >= 0 &&
    x.pony < 6 &&
    Array.isArray(x.options) &&
    x.options.length === 4 &&
    new Set(x.options).size === 4 &&
    x.options.includes(x.answer) &&
    x.options.every((n) => Number.isInteger(n) && n >= 0 && n <= 100)
  );
}
export function parseProgress(raw: string): Progress {
  const value = JSON.parse(raw),
    p = freshProgress();
  if (!value || value.version !== 1)
    throw Error("To nie jest zapis Sklepiku Kucyków.");
  const integer = (v: unknown, max = 1000000) =>
    typeof v === "number" && Number.isInteger(v) && v >= 0
      ? Math.min(v, max)
      : 0;
  for (const key of Object.keys(p.skills)) {
    const s = value.skills?.[key];
    if (!s) continue;
    const attempts = integer(s.attempts),
      correct = Math.min(attempts, integer(s.correct));
    p.skills[key] = {
      attempts,
      correct,
      firstTry: Math.min(correct, integer(s.firstTry)),
      withHelp: Math.min(correct, integer(s.withHelp)),
    };
  }
  p.solved = Object.values(p.skills).reduce((n, s) => n + s.correct, 0);
  p.attempts = Object.values(p.skills).reduce((n, s) => n + s.attempts, 0);
  p.solvedIds = Array.isArray(value.solvedIds)
    ? [
        ...new Set<string>(
          value.solvedIds.filter(
            (s: unknown) => typeof s === "string" && s.length < 100,
          ),
        ),
      ].slice(-500)
    : [];
  p.review = Array.isArray(value.review)
    ? value.review.filter(validTask).slice(-30)
    : [];
  if (Object.hasOwn(OPERATIONS, value.operation)) p.operation = value.operation;
  if ([1, 2, 3].includes(value.level)) p.level = value.level;
  if (Object.hasOwn(PRODUCTS, value.product)) p.product = value.product;
  if (value.adaptive && typeof value.adaptive === "object") {
    p.adaptive.enabled = value.adaptive.enabled !== false;
    for (const op of Object.keys(OPERATIONS) as Operation[]) {
      const l = value.adaptive.levels?.[op];
      if ([1, 2, 3].includes(l)) p.adaptive.levels[op] = l;
      const h = value.adaptive.history?.[op];
      if (Array.isArray(h))
        p.adaptive.history[op] = h
          .filter((x: unknown) => typeof x === "boolean")
          .slice(-6);
    }
    if (Array.isArray(value.adaptive.seen))
      p.adaptive.seen = value.adaptive.seen
        .filter((x: unknown) => typeof x === "string" && x.length < 100)
        .slice(-500);
  } else p.adaptive.levels[p.operation] = p.level;
  p.music = value.music === true;
  p.volume =
    typeof value.volume === "number" && Number.isFinite(value.volume)
      ? Math.min(0.6, Math.max(0, value.volume))
      : 0.25;
  return p;
}
export function recordAnswer(
  p: Progress,
  t: Task,
  answer: number,
  priorAttempts = 0,
  usedHelp = false,
): Progress {
  if (p.solvedIds.includes(t.id)) return p;
  const key = `${t.operation}:${t.level}`,
    s = p.skills[key] ?? emptySkill(),
    correct = answer === t.answer;
  let review = p.review;
  if (correct && priorAttempts === 0)
    review = review.filter((r) => factKey(r) !== factKey(t));
  else if (!correct && !review.some((r) => factKey(r) === factKey(t)))
    review = [...review, t].slice(-30);
  const skill = {
    attempts: s.attempts + 1,
    correct: s.correct + (correct ? 1 : 0),
    firstTry:
      s.firstTry + (correct && priorAttempts === 0 && !usedHelp ? 1 : 0),
    withHelp: s.withHelp + (correct && usedHelp ? 1 : 0),
  };
  return {
    ...p,
    adaptive: adapt(p.adaptive, t, correct && priorAttempts === 0 && !usedHelp),
    solved: p.solved + (correct ? 1 : 0),
    attempts: p.attempts + 1,
    skills: { ...p.skills, [key]: skill },
    review,
    solvedIds: correct ? [...p.solvedIds, t.id].slice(-500) : p.solvedIds,
  };
}
export function nextTask(
  p: Progress,
  previous?: Task,
  rng: () => number = Math.random,
): Task {
  const review = p.review.find(
    (t) =>
      t.operation === p.operation &&
      t.level === p.level &&
      (!previous || factKey(previous) !== factKey(t)),
  );
  if (review && p.solved % 3 === 2)
    return {
      ...review,
      id: crypto.randomUUID(),
      product: p.product,
      options: optionsFor(review.answer, rng),
      review: true,
    };
  return makeTask(p.operation, p.level, p.product, rng, previous);
}
export type PairCard = {
  id: string;
  kind: "expression" | "answer";
  value: string;
  task: Task;
};
export function makePairs(
  op: Operation,
  level: Level,
  product: Product,
  rng: () => number = Math.random,
): PairCard[] {
  const answers = new Set<number>(),
    selected: Task[] = [];
  for (const [a, b] of shuffle(facts(op, level), rng)) {
    const answer = result(op, a, b);
    if (answers.has(answer)) continue;
    answers.add(answer);
    const t: Task = {
      id: crypto.randomUUID(),
      operation: op,
      level,
      product,
      a,
      b,
      answer,
      options: optionsFor(answer, rng),
      pony: 0,
    };
    selected.push(t);
    if (selected.length === 4) break;
  }
  return shuffle(
    selected.flatMap((t) => [
      {
        id: `${t.id}-e`,
        kind: "expression" as const,
        value: `${t.a} ${OPERATIONS[op].symbol} ${t.b}`,
        task: t,
      },
      {
        id: `${t.id}-a`,
        kind: "answer" as const,
        value: String(t.answer),
        task: t,
      },
    ]),
    rng,
  );
}
export function isPair(a: PairCard, b: PairCard): boolean {
  return a.id !== b.id && a.kind !== b.kind && a.task.id === b.task.id;
}
export const BADGES = [
  {
    id: "first",
    name: "Pierwszy klient",
    description: "Pierwsze rozwiązane zamówienie.",
    icon: "flower",
    test: (p: Progress) => p.solved >= 1,
  },
  {
    id: "six",
    name: "Dobry dzień",
    description: "6 rozwiązanych zamówień.",
    icon: "sun",
    test: (p: Progress) => p.solved >= 6,
  },
  {
    id: "twenty",
    name: "Pomocna przyjaciółka",
    description: "20 rozwiązanych zamówień.",
    icon: "heart",
    test: (p: Progress) => p.solved >= 20,
  },
  {
    id: "all",
    name: "Cztery supermoce",
    description: "Przynajmniej jedno zadanie z każdego działania.",
    icon: "sparkles",
    test: (p: Progress) =>
      Object.keys(OPERATIONS).every((op) =>
        [1, 2, 3].some((l) => p.skills[`${op}:${l}`].correct > 0),
      ),
  },
  {
    id: "fifty",
    name: "Gwiazda sklepiku",
    description: "50 rozwiązanych zamówień.",
    icon: "star",
    test: (p: Progress) => p.solved >= 50,
  },
  {
    id: "brave",
    name: "Odważna odkrywczyni",
    description: "10 zadań na trzecim poziomie.",
    icon: "crown",
    test: (p: Progress) =>
      Object.keys(OPERATIONS).reduce(
        (n, op) => n + p.skills[`${op}:3`].correct,
        0,
      ) >= 10,
  },
];
