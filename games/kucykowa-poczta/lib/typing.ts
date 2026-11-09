export type Finger =
  "lp" | "lr" | "lm" | "li" | "ri" | "rm" | "rr" | "rp" | "thumb";
export const FINGERS: Record<
  Finger,
  { name: string; home: string; color: string }
> = {
  lp: { name: "Lewy mały", home: "A", color: "#dba1b6" },
  lr: { name: "Lewy serdeczny", home: "S", color: "#cfb278" },
  lm: { name: "Lewy środkowy", home: "D", color: "#93b29c" },
  li: { name: "Lewy wskazujący", home: "F", color: "#90adc9" },
  ri: { name: "Prawy wskazujący", home: "J", color: "#a89bc9" },
  rm: { name: "Prawy środkowy", home: "K", color: "#93b29c" },
  rr: { name: "Prawy serdeczny", home: "L", color: "#cfb278" },
  rp: { name: "Prawy mały", home: ";", color: "#dba1b6" },
  thumb: { name: "Kciuk", home: "Spacja", color: "#b7a59c" },
};
export const ROWS = ["qwertyuiop", "asdfghjkl;", "zxcvbnm,."];
const MAP: Record<string, Finger> = {};
for (const [finger, keys] of Object.entries({
  lp: "qaz",
  lr: "wsx",
  lm: "edc",
  li: "rfvtgb",
  ri: "yuhjnm",
  rm: "ik,",
  rr: "ol.",
  rp: "p;/",
  thumb: " ",
}))
  for (const key of keys) MAP[key] = finger as Finger;
const ACCENTS: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "x",
  ż: "z",
};
export function keyGuide(char: string) {
  const lower = char.toLocaleLowerCase("pl"),
    base = ACCENTS[lower] ?? lower,
    finger = MAP[base] ?? "rp";
  return {
    base,
    finger,
    alt: !!ACCENTS[lower],
    shift: char !== lower,
    shiftSide: (finger.startsWith("l") ? "right" : "left") as "left" | "right",
  };
}
export type Lesson = {
  id: string;
  name: string;
  place: string;
  keys: string;
  tip: string;
  texts: string[];
};
export const LESSONS: Lesson[] = [
  {
    id: "fj",
    name: "Znajdź F i J",
    place: "Brama przyjaźni",
    keys: "F J + spacja",
    tip: "Wskazujące palce odpoczywają na F i J. Wyczuj małe wypustki. Spację naciska kciuk.",
    texts: ["fff jjj fj fj jf jf", "fj jf ff jj fj jf", "fff jjj fff jjj fj"],
  },
  {
    id: "dk",
    name: "Środkowe dołączają",
    place: "Staw z liliami",
    keys: "D K + F J",
    tip: "Lewy środkowy jest na D, prawy na K. Po ruchu wróć palcami do ich domków.",
    texts: ["ddd kkk df jk fd kj", "df jk dk fj df jk", "dd kk ff jj dk fj"],
  },
  {
    id: "sl",
    name: "Serdeczne w akcji",
    place: "Aleja dzwonków",
    keys: "S L",
    tip: "Serdeczne palce mieszkają na S i L. Niech wskazujące zostaną blisko F i J.",
    texts: [
      "sss lll sd kl sl sl",
      "sl ls sd kl fj sl",
      "sss ddd fff jjj kkk lll",
    ],
  },
  {
    id: "home",
    name: "Domki wszystkich palców",
    place: "Różany domek",
    keys: "A S D F · J K L ;",
    tip: "Lewa dłoń: A S D F. Prawa: J K L ;. Na A i średniku odpoczywają małe palce.",
    texts: ["asdf jkl; asdf jkl;", "ala sala fala lala", "a s d f j k l ;"],
  },
  {
    id: "gh",
    name: "Wskazujące na spacerze",
    place: "Mostek nad rzeką",
    keys: "G H",
    tip: "Lewy wskazujący sięga z F do G, prawy z J do H. Potem wracają na F i J.",
    texts: ["fg jh gf hj gh gh", "fala gala hala", "gg hh ff jj gh fj"],
  },
  {
    id: "ru",
    name: "Pierwszy krok w górę",
    place: "Tęczowa polana",
    keys: "R U",
    tip: "Lewy wskazujący sięga do R, prawy do U. Kolory pokażą drogę do domków.",
    texts: ["fr ju rf uj ru ru", "ruda kula ruda fala", "rusa kula saga fura"],
  },
  {
    id: "ei",
    name: "Środkowe sięgają wyżej",
    place: "Ogród motyli",
    keys: "E I",
    tip: "E naciska lewy środkowy, I prawy środkowy. Ruch jest mały i spokojny.",
    texts: ["de ki ed ik ei ei", "figa daje lilie", "lila daje figi"],
  },
  {
    id: "wo",
    name: "List do przyjaciółki",
    place: "Kwiatowa poczta",
    keys: "W O",
    tip: "W to lewy serdeczny, O to prawy serdeczny. Patrz na tekst, a podpowiedź pomoże znaleźć klawisz.",
    texts: ["sw lo ws ol wo wo", "sowa daje figi", "sowa i figa"],
  },
  {
    id: "top",
    name: "Cały górny rząd",
    place: "Wieża chmur",
    keys: "Q T Y P",
    tip: "T naciska lewy wskazujący, Y prawy wskazujący. Q i P należą do małych palców.",
    texts: ["qwerty uiop qwerty uiop", "pola i pola", "tata daje listy"],
  },
  {
    id: "bottom",
    name: "Dolna ścieżka",
    place: "Łąka stokrotek",
    keys: "Z X C V B N M",
    tip: "Z: mały, X: serdeczny, C: środkowy lewej dłoni. V i B: lewy wskazujący. N i M: prawy wskazujący.",
    texts: [
      "az sx dc fv gb hn jm",
      "maly kucyk ma dom",
      "kucyk biega po polanie",
    ],
  },
  {
    id: "words",
    name: "Pony dostarcza listy",
    place: "Piknik kucyków",
    keys: "Słowa i spacje",
    tip: "Utrzymaj równy rytm. Dokładność jest ważniejsza od rekordów. Spację naciskaj kciukiem.",
    texts: [
      "figa ma kokardy i maliny",
      "maly kucyk lubi nowe listy",
      "pony i lila pakuja prezenty",
    ],
  },
  {
    id: "polish",
    name: "Polskie listy",
    place: "Gwiezdny pałacyk",
    keys: "Ą Ć Ę Ł Ń Ó Ś Ź Ż · Shift",
    tip: "Polski programisty: prawy Alt + litera (ź = Alt + X). Na Macu wybierz Polski Pro i użyj Option. Dużą literę pisz z Shiftem przeciwnej dłoni.",
    texts: [
      "Figa śle miły list.",
      "Róża ma żółtą kokardę.",
      "Łąka lśni. Źrebak tańczy.",
    ],
  },
];
export type Run = {
  text: string;
  index: number;
  attempts: number;
  errors: number;
  status: "ready" | "running" | "paused" | "done";
  startedAt: number | null;
  elapsed: number;
};
export function newRun(text: string): Run {
  return {
    text: text.normalize("NFC"),
    index: 0,
    attempts: 0,
    errors: 0,
    status: "ready",
    startedAt: null,
    elapsed: 0,
  };
}
export function elapsedAt(r: Run, now: number) {
  return (
    r.elapsed + (r.startedAt === null ? 0 : Math.max(0, now - r.startedAt))
  );
}
export function pause(r: Run, now: number): Run {
  return r.status !== "running"
    ? r
    : { ...r, status: "paused", elapsed: elapsedAt(r, now), startedAt: null };
}
export function resume(r: Run, now: number): Run {
  return r.status !== "paused"
    ? r
    : { ...r, status: "running", startedAt: now };
}
export function stroke(r: Run, char: string, now: number): Run {
  if (r.status === "paused" || r.status === "done") return r;
  const c = char.normalize("NFC");
  if ([...c].length !== 1) return r;
  const correct = c === r.text[r.index],
    index = r.index + (correct ? 1 : 0),
    startedAt = r.startedAt ?? now;
  const next: Run = {
    ...r,
    index,
    startedAt,
    status: "running",
    attempts: r.attempts + 1,
    errors: r.errors + (correct ? 0 : 1),
  };
  return index === r.text.length
    ? {
        ...next,
        status: "done",
        elapsed: elapsedAt(next, now),
        startedAt: null,
      }
    : next;
}
export function backspace(r: Run): Run {
  return r.status === "running" ? { ...r, index: Math.max(0, r.index - 1) } : r;
}
export function metrics(r: Run, now: number) {
  const ms = elapsedAt(r, now),
    accuracy = r.attempts ? ((r.attempts - r.errors) / r.attempts) * 100 : 100;
  return { ms, accuracy, wpm: r.index / 5 / (Math.max(ms, 1000) / 60000) };
}
export type RecordRun = {
  runs: number;
  stars: number;
  bestWpm: number;
  lastAccuracy: number;
  streak: number;
};
export type Progress = {
  version: 1;
  lesson: number;
  delivered: number;
  records: Record<string, RecordRun>;
};
export const STORAGE_KEY = "kucykowa-poczta-v1";
export function freshProgress(): Progress {
  return { version: 1, lesson: 0, delivered: 0, records: {} };
}
export function targetTempo(p: Progress, id: string) {
  return Math.max(
    6,
    Math.min(45, Math.round((p.records[id]?.bestWpm ?? 0) * 1.05) || 6),
  );
}
export function finish(
  p: Progress,
  r: Run,
  id: string,
  target: number,
): Progress {
  if (r.status !== "done" || !LESSONS.some((l) => l.id === id)) return p;
  const m = metrics(r, 0),
    old = p.records[id] ?? {
      runs: 0,
      stars: 0,
      bestWpm: 0,
      lastAccuracy: 0,
      streak: 0,
    },
    accurate = m.accuracy >= 95,
    stars = 1 + (accurate ? 1 : 0) + (accurate && m.wpm >= target ? 1 : 0);
  return {
    ...p,
    delivered: p.delivered + 1,
    records: {
      ...p.records,
      [id]: {
        runs: old.runs + 1,
        stars: Math.max(stars, old.stars),
        bestWpm: accurate ? Math.max(old.bestWpm, m.wpm) : old.bestWpm,
        lastAccuracy: m.accuracy,
        streak: accurate ? old.streak + 1 : 0,
      },
    },
  };
}
export function recommended(p: Progress, lesson: number) {
  return (p.records[LESSONS[lesson].id]?.streak ?? 0) >= 2
    ? Math.min(LESSONS.length - 1, lesson + 1)
    : lesson;
}
export function parseProgress(raw: string): Progress {
  const v = JSON.parse(raw);
  if (v?.version !== 1 || !v.records || typeof v.records !== "object")
    throw Error("Nieprawidłowa kopia");
  const p = freshProgress(),
    num = (n: unknown, max: number) =>
      typeof n === "number" && Number.isFinite(n)
        ? Math.max(0, Math.min(max, n))
        : 0;
  p.lesson = Math.floor(num(v.lesson, LESSONS.length - 1));
  for (const l of LESSONS) {
    const r = v.records[l.id];
    if (!r || typeof r !== "object") continue;
    const runs = Math.floor(num(r.runs, 100000));
    p.records[l.id] = {
      runs,
      stars: Math.floor(num(r.stars, 3)),
      bestWpm: num(r.bestWpm, 1000),
      lastAccuracy: num(r.lastAccuracy, 100),
      streak: Math.min(runs, Math.floor(num(r.streak, 100000))),
    };
    p.delivered += runs;
  }
  return p;
}
