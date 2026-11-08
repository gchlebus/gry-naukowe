export type Action = "forward" | "left" | "right" | "quack" | "wait";
export type Block = {
  id: string;
  type: Action | "repeat" | "flower" | "clear";
  count?: number;
  children?: Block[];
};
export type World = {
  x: number;
  y: number;
  dir: number;
  quacks: number;
  moves: number;
  turns: number;
  flowers: string[];
  trail: string[];
  bump: boolean;
  collected: string[];
  checkpoint: number;
  hasKey: boolean;
};
export type Lesson = {
  id: number;
  title: string;
  concept: string;
  intro: string;
  hint: string;
  start: [number, number, number];
  goal: [number, number];
  rocks: string[];
  flowers: string[];
  quacks?: number;
  loop?: boolean;
  condition?: boolean;
  turns?: number;
  theme?: "orchard" | "lagoon" | "night";
  treasures?: string[];
  checkpoints?: string[];
  key?: string;
  gates?: string[];
  maxMoves?: number;
  maxBlocks?: number;
  finishDir?: number;
  clearCondition?: boolean;
  starter?: Block[];
};
export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Pierwsza wyprawa",
    concept: "Kolejność poleceń",
    intro: "Gwiazdka czeka! Ułóż kroki, żeby Kaczka do niej dotarła.",
    hint: "Kaczka patrzy w prawo. Od gwiazdki dzielą ją trzy kratki. Dodaj trzy klocki „Idź do przodu”.",
    start: [1, 4, 1],
    goal: [4, 4],
    rocks: [],
    flowers: [],
  },
  {
    id: 2,
    title: "Za rogiem",
    concept: "Skręcanie",
    intro: "Ścieżka skręca. Obróć Kaczkę i znajdź gwiazdkę.",
    hint: "Idź dwa razy do przodu, skręć w lewo, potem znowu dwa razy do przodu. Lewo liczymy tak, jak patrzy Kaczka.",
    start: [1, 4, 1],
    goal: [3, 2],
    rocks: [],
    flowers: [],
  },
  {
    id: 3,
    title: "Kamyk na drodze",
    concept: "Szukanie rozwiązania",
    intro: "Ojej, kamyk! Zaplanuj drogę, która go ominie.",
    hint: "Przejdź górą: lewo, przód, prawo, trzy kroki, prawo, przód. Pomyłka to wskazówka — możesz poprawić program.",
    start: [1, 4, 1],
    goal: [4, 4],
    rocks: ["3,4"],
    flowers: [],
  },
  {
    id: 4,
    title: "Kacze powitanie",
    concept: "Różne polecenia",
    intro: "Dojdź do gwiazdki i powiedz „kwa” dokładnie dwa razy!",
    hint: "Potrzebujesz dwóch kroków i dwóch klocków „Powiedz kwa!”. Dźwięki możesz dodać przed spacerem albo po nim.",
    start: [1, 4, 1],
    goal: [3, 4],
    rocks: [],
    flowers: [],
    quacks: 2,
  },
  {
    id: 5,
    title: "Jeszcze raz!",
    concept: "Pętle",
    intro: "Cztery kroki? Zapakuj je w jeden klocek „Powtórz”.",
    hint: "Dodaj „Powtórz”, ustaw 4 razy i kliknij „Idź do przodu”. Klocek trafi do środka pętli. Potem kliknij „Gotowe”.",
    start: [0, 3, 1],
    goal: [4, 3],
    rocks: [],
    flowers: [],
    loop: true,
  },
  {
    id: 6,
    title: "Dookoła ogródka",
    concept: "Pętla z kilkoma klockami",
    intro:
      "Obejdź mały kwadrat i wróć na gwiazdkę. Zrób cztery skręty w pętli.",
    hint: "Powtórz 4 razy: idź do przodu, skręć w lewo. Kaczka wróci na początek. Zgadnij, w którą stronę będzie patrzeć!",
    start: [2, 3, 1],
    goal: [2, 3],
    rocks: [],
    flowers: [],
    loop: true,
    turns: 4,
  },
  {
    id: 7,
    title: "Kwiatowe „kwa!”",
    concept: "Warunki",
    intro:
      "Idź do gwiazdki. Jeśli stoisz na kwiatku, powiedz „kwa”! Są dwa kwiatki.",
    hint: "W pętli 4 razy: „Idź do przodu”, a potem „Jeśli kwiatek” z „Powiedz kwa!” w środku. Warunek sprawdza kratkę pod Kaczką.",
    start: [0, 3, 1],
    goal: [4, 3],
    rocks: [],
    flowers: ["1,3", "3,3"],
    quacks: 2,
    condition: true,
  },
  {
    id: 8,
    title: "Wielka przygoda",
    concept: "Twój własny plan",
    intro: "Omiń kamyki, zbierz gwiazdkę i zakończ wyprawę jednym „kwa”!",
    hint: "Jedna z dróg: dwa kroki, lewo, dwa kroki, prawo, dwa kroki, kwa! Spróbuj użyć pętli do par kroków.",
    start: [0, 4, 1],
    goal: [4, 2],
    rocks: ["3,4", "3,3"],
    flowers: ["2,2"],
    quacks: 1,
  },
];
export const CHAPTERS = [
  {
    title: "Pierwsze kroki",
    range: "01–08",
    from: 1,
    to: 8,
    description: "Poznaj klocki i Kaczkę",
  },
  {
    title: "Owocowe wyprawy",
    range: "09–14",
    from: 9,
    to: 14,
    description: "Zbieraj, planuj i naprawiaj",
  },
  {
    title: "Kacze wyzwania",
    range: "15–20",
    from: 15,
    to: 20,
    description: "Furtki, warunki i wielki finał",
  },
];
function starter(...types: Action[]): Block[] {
  return types.map((type, i) => ({ id: `starter-${i}`, type }));
}
LESSONS.push(
  {
    id: 9,
    title: "Wiśniowy piknik",
    concept: "Zbieranie skarbów",
    intro:
      "Zbierz wszystkie trzy wisienki i dojdź do gwiazdki. Wisienkę zbierasz, gdy na nią wejdziesz.",
    hint: "Dwa kroki w prawo, skręt w lewo, dwa kroki w górę. Potem skręt w prawo i dwa kroki do gwiazdki. Po drodze zbierzesz trzy wisienki.",
    start: [0, 4, 1],
    goal: [4, 2],
    rocks: [],
    flowers: [],
    treasures: ["1,4", "2,4", "2,2"],
    theme: "orchard",
  },
  {
    id: 10,
    title: "Kacza poczta",
    concept: "Przystanki po kolei",
    intro:
      "Dostarcz pocztę: odwiedź przystanek 1, potem 2, a na końcu gwiazdkę.",
    hint: "Kaczka patrzy w górę. Dwa kroki do przystanku 1, w prawo i dwa kroki do 2. Potem w lewo i dwa kroki do celu.",
    start: [1, 5, 0],
    goal: [3, 1],
    rocks: ["2,2"],
    flowers: [],
    checkpoints: ["1,3", "3,3"],
    theme: "lagoon",
  },
  {
    id: 11,
    title: "Detektyw klocków",
    concept: "Napraw gotowy program",
    intro:
      "Ktoś pomylił jeden skręt! Uruchom gotowy program po jednym kroku i napraw go.",
    hint: "Po dwóch krokach Kaczka powinna skręcić w lewo, a nie w prawo. Usuń zły skręt, dodaj lewy na końcu i przesuń go strzałkami na trzecie miejsce.",
    start: [1, 4, 1],
    goal: [3, 2],
    rocks: [],
    flowers: [],
    starter: starter("forward", "forward", "right", "forward", "forward"),
    theme: "orchard",
  },
  {
    id: 12,
    title: "Spójrz na księżyc",
    concept: "Kierunek ma znaczenie",
    intro:
      "Dojdź do gwiazdki i zakończ spacer, patrząc w górę, na księżyc. Samo dojście to nie wszystko!",
    hint: "Dwa kroki do przodu i jeden skręt w lewo. Mała zielona strzałka pokaże, że Kaczka patrzy w górę.",
    start: [1, 4, 1],
    goal: [3, 4],
    rocks: [],
    flowers: [],
    finishDir: 0,
    theme: "night",
  },
  {
    id: 13,
    title: "Mały program, długa droga",
    concept: "Najwyżej 5 klocków",
    intro:
      "Dojdź do gwiazdki, używając najwyżej 5 klocków. Klocki w środku pętli też się liczą!",
    hint: "Powtórz 3 razy krok do przodu, skręć w lewo i znów powtórz 3 razy krok. Dwie pętle, dwa kroki i skręt: razem 5 klocków.",
    start: [0, 5, 1],
    goal: [3, 2],
    rocks: ["4,5", "4,4"],
    flowers: [],
    maxBlocks: 5,
    loop: true,
    theme: "orchard",
  },
  {
    id: 14,
    title: "Kwiatowa orkiestra",
    concept: "Pętla w warunku",
    intro:
      "Na każdym z dwóch kwiatków powiedz „kwa” dwa razy, a potem dojdź do gwiazdki. Razem cztery „kwa”!",
    hint: "Powtórz 4 razy: krok, a potem „Jeśli kwiatek”. Do warunku włóż pętlę z dwoma „kwa”: „Powtórz 2 razy” i jeden klocek „Powiedz kwa!”.",
    start: [0, 3, 1],
    goal: [4, 3],
    rocks: [],
    flowers: ["1,3", "3,3"],
    quacks: 4,
    condition: true,
    theme: "orchard",
  },
  {
    id: 15,
    title: "Tajemnicza furtka",
    concept: "Klucz otwiera drogę",
    intro:
      "Najpierw zbierz złoty klucz. Otworzy furtkę, przez którą możesz przejść do gwiazdki.",
    hint: "Skręć w lewo, krok, w prawo, krok: masz klucz! W prawo, krok, w lewo. Teraz cztery kroki przez otwartą furtkę do celu.",
    start: [0, 4, 1],
    goal: [5, 4],
    rocks: ["2,3"],
    flowers: [],
    key: "1,3",
    gates: ["3,4"],
    theme: "lagoon",
  },
  {
    id: 16,
    title: "Kaczka patrzy przed siebie",
    concept: "Nowy warunek",
    intro:
      "Użyj „Jeśli wolna droga”, żeby dojść do gwiazdki i zatrzymać się przed kamykiem.",
    hint: "Powtórz 6 razy: „Jeśli wolna droga”, a w jego środku „Idź do przodu”. Kaczka zrobi trzy kroki. Potem warunek nie pozwoli jej wejść na kamyk.",
    start: [0, 3, 1],
    goal: [3, 3],
    rocks: ["4,3"],
    flowers: [],
    clearCondition: true,
    loop: true,
    theme: "lagoon",
  },
  {
    id: 17,
    title: "Nocny listonosz",
    concept: "Trzy przystanki",
    intro:
      "Odwiedź latarenki 1, 2 i 3 w tej kolejności. Potem odszukaj gwiazdkę.",
    hint: "Krok w górę do 1, w prawo dwa kroki do 2, w lewo dwa kroki do 3. Potem jeszcze w lewo i dwa kroki do gwiazdki.",
    start: [1, 5, 0],
    goal: [1, 2],
    rocks: ["2,3"],
    flowers: [],
    checkpoints: ["1,4", "3,4", "3,2"],
    theme: "night",
  },
  {
    id: 18,
    title: "Zagubiony obrót",
    concept: "Napraw pętlę",
    intro:
      "Kaczka miała obejść kwadrat i wrócić na gwiazdkę, patrząc w prawo. W pętli brakuje jednego powtórzenia!",
    hint: "Zmień liczbę powtórzeń z 3 na 4. W każdym powtórzeniu Kaczka robi krok i obraca się w prawo.",
    start: [2, 2, 1],
    goal: [2, 2],
    rocks: [],
    flowers: [],
    loop: true,
    turns: 4,
    finishDir: 1,
    starter: [
      {
        id: "starter-loop",
        type: "repeat",
        count: 3,
        children: starter("forward", "right"),
      },
    ],
    theme: "night",
  },
  {
    id: 19,
    title: "Piknik bez objazdów",
    concept: "Najwyżej 8 kroków",
    intro:
      "Zbierz trzy wisienki i dojdź do gwiazdki. Masz najwyżej 8 kroków. Skręty nie zużywają kroków.",
    hint: "Dwa kroki w prawo, trzy w górę, dwa w prawo i jeden w górę. Na każdym zakręcie obróć Kaczkę. To dokładnie osiem kroków!",
    start: [0, 5, 1],
    goal: [4, 1],
    rocks: ["3,5", "3,4"],
    flowers: [],
    treasures: ["2,5", "2,2", "4,2"],
    maxMoves: 8,
    theme: "orchard",
  },
  {
    id: 20,
    title: "Wielka nocna ekspedycja",
    concept: "Połącz swoje pomysły",
    intro:
      "Zbierz klucz i obie wisienki, przejdź furtkę, odwiedź punkty 1 i 2. Na końcu dojdź do gwiazdki i powiedz „kwa” raz. Użyj „Jeśli wolna droga”.",
    hint: "Dwa kroki w prawo po klucz, w lewo i trzy kroki przez furtkę do 1. W prawo i dwa kroki do 2. W lewo, a potem powtórz 4 razy: „Jeśli wolna droga” → krok. Na koniec jedno „kwa”.",
    start: [0, 5, 1],
    goal: [4, 0],
    rocks: ["1,3", "3,4"],
    flowers: [],
    key: "2,5",
    gates: ["2,3"],
    treasures: ["3,2", "4,1"],
    checkpoints: ["2,2", "4,2"],
    quacks: 1,
    clearCondition: true,
    theme: "night",
  },
);
export function starterProgram(l: Lesson): Block[] {
  return validateProgram(l.starter ?? []);
}
export function validCompleted(value: unknown): number[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (v): v is number =>
              typeof v === "number" && LESSONS.some((l) => l.id === v),
          ),
        ),
      ]
    : [];
}
export function chapterFor(id: number): number {
  const index = CHAPTERS.findIndex((c) => id >= c.from && id <= c.to);
  return index < 0 ? 0 : index;
}
export function blockedAt(w: World, l: Lesson, x: number, y: number): boolean {
  return (
    x < 0 ||
    x > 5 ||
    y < 0 ||
    y > 5 ||
    l.rocks.includes(`${x},${y}`) ||
    (!w.hasKey && (l.gates ?? []).includes(`${x},${y}`))
  );
}
export function conditionHolds(
  w: World,
  l: Lesson,
  kind: "flower" | "clear" = "flower",
): boolean {
  if (kind === "flower") return l.flowers.includes(`${w.x},${w.y}`);
  const [dx, dy] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ][w.dir];
  return !blockedAt(w, l, w.x + dx, w.y + dy);
}
export const FREE: Lesson = {
  id: 0,
  title: "Twój kaczy świat",
  concept: "Swobodna zabawa",
  intro: "Co dziś wymyślicie? Ułóż własny spacer, koncert albo taniec.",
  hint: "Nie ma jednego rozwiązania. Spróbuj pętli ze skrętami i „kwa!”. Potem zamieńcie się z rodzicem rolami.",
  start: [2, 3, 1],
  goal: [5, 1],
  rocks: [],
  flowers: ["1,1", "4,4"],
};
export function initialWorld(l: Lesson): World {
  return {
    x: l.start[0],
    y: l.start[1],
    dir: l.start[2],
    quacks: 0,
    moves: 0,
    turns: 0,
    flowers: [],
    trail: [`${l.start[0]},${l.start[1]}`],
    bump: false,
    collected: [],
    checkpoint: 0,
    hasKey: false,
  };
}
export function hasBlock(bs: Block[], type: Block["type"]): boolean {
  return bs.some((b) => b.type === type || hasBlock(b.children ?? [], type));
}
export function countBlocks(bs: Block[]): number {
  return bs.reduce((n, b) => n + 1 + countBlocks(b.children ?? []), 0);
}
export function validateProgram(value: unknown, depth = 0): Block[] {
  if (!Array.isArray(value) || depth > 3 || value.length > 40)
    throw Error("Program jest za duży albo ma niepoprawny format.");
  const out: Block[] = value.map((v) => {
    if (
      !v ||
      typeof v !== "object" ||
      ![
        "forward",
        "left",
        "right",
        "quack",
        "wait",
        "repeat",
        "flower",
        "clear",
      ].includes(v.type)
    )
      throw Error("Nie rozpoznaję jednego z klocków.");
    const b: Block = { id: crypto.randomUUID(), type: v.type };
    if (b.type === "repeat") {
      if (!Number.isInteger(v.count) || v.count < 2 || v.count > 8)
        throw Error("Pętla może mieć od 2 do 8 powtórzeń.");
      b.count = v.count;
    }
    if (b.type === "repeat" || b.type === "flower" || b.type === "clear")
      b.children = validateProgram(v.children ?? [], depth + 1);
    return b;
  });
  if (countBlocks(out) > 60)
    throw Error("W programie może być najwyżej 60 klocków.");
  return out;
}
export type Instruction = {
  id: string;
  type: Action | "check";
  skip?: number;
  condition?: "flower" | "clear";
};
export function compile(bs: Block[]): Instruction[] {
  const out: Instruction[] = [];
  function visit(list: Block[]) {
    for (const b of list) {
      if (b.type === "repeat") {
        for (let i = 0; i < (b.count ?? 2); i++) visit(b.children ?? []);
      } else if (b.type === "flower" || b.type === "clear") {
        const check: Instruction = {
          id: b.id,
          type: "check",
          condition: b.type,
        };
        out.push(check);
        const start = out.length;
        visit(b.children ?? []);
        check.skip = out.length - start;
      } else out.push({ id: b.id, type: b.type });
      if (out.length > 256)
        throw Error(
          "To długa wyprawa! Skróć program do 256 wykonywanych poleceń.",
        );
    }
  }
  visit(bs);
  return out;
}
export function advance(w: World, action: Action, l: Lesson): World {
  const n = {
    ...w,
    bump: false,
    trail: [...w.trail],
    flowers: [...w.flowers],
    collected: [...w.collected],
  };
  if (action === "left") {
    n.dir = (w.dir + 3) % 4;
    n.turns++;
  }
  if (action === "right") {
    n.dir = (w.dir + 1) % 4;
    n.turns++;
  }
  if (action === "quack") {
    n.quacks++;
    const key = `${w.x},${w.y}`;
    if (l.flowers.includes(key) && !n.flowers.includes(key))
      n.flowers.push(key);
  }
  if (action === "forward") {
    const [dx, dy] = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ][w.dir];
    const x = w.x + dx,
      y = w.y + dy;
    if (blockedAt(w, l, x, y)) n.bump = true;
    else {
      n.x = x;
      n.y = y;
      n.moves++;
      const tile = `${x},${y}`;
      n.trail.push(tile);
      if (l.treasures?.includes(tile) && !n.collected.includes(tile))
        n.collected.push(tile);
      if (l.key === tile) n.hasKey = true;
      if (l.checkpoints?.[n.checkpoint] === tile) n.checkpoint++;
    }
  }
  return n;
}
export function resultFor(
  w: World,
  l: Lesson,
  bs: Block[],
): { success: boolean; message: string } {
  if (w.bump)
    return {
      success: false,
      message: "Tu jest przeszkoda. Popraw trasę i spróbuj ponownie.",
    };
  if (l.maxBlocks !== undefined && countBlocks(bs) > l.maxBlocks)
    return {
      success: false,
      message: `Spróbuj krótszego zapisu: najwyżej ${l.maxBlocks} klocków, razem z tymi w pętlach. Teraz jest ${countBlocks(bs)}.`,
    };
  if (l.maxMoves !== undefined && w.moves > l.maxMoves)
    return {
      success: false,
      message: `To za duży objazd! Potrzeba najwyżej ${l.maxMoves} kroków, a było ${w.moves}. Spróbuj krótszej trasy.`,
    };
  if (l.treasures && w.collected.length !== l.treasures.length)
    return {
      success: false,
      message: `Jeszcze wisienki! Masz ${w.collected.length} z ${l.treasures.length}. Zbierz wszystkie przed końcem wyprawy.`,
    };
  if (l.key && !w.hasKey)
    return {
      success: false,
      message:
        "Zabierz złoty klucz. Otworzy furtkę i jest potrzebny do ukończenia przygody.",
    };
  if (l.checkpoints && w.checkpoint !== l.checkpoints.length)
    return {
      success: false,
      message: `Odwiedź teraz punkt ${w.checkpoint + 1}. Ponumerowane punkty odwiedzamy po kolei.`,
    };
  if (l.clearCondition && !hasBlock(bs, "clear"))
    return {
      success: false,
      message:
        "Dodaj klocek „Jeśli wolna droga”, żeby Kaczka sprawdzała drogę przed sobą.",
    };
  if (l.id === 0)
    return {
      success: false,
      message:
        "Piękny pomysł! Zmień klocki i sprawdź, co wydarzy się tym razem.",
    };
  if (w.x !== l.goal[0] || w.y !== l.goal[1])
    return {
      success: false,
      message:
        "Jeszcze kawałek do gwiazdki. Popatrz, gdzie Kaczka skończyła, i popraw swój plan.",
    };
  if (l.finishDir !== undefined && w.dir !== l.finishDir)
    return {
      success: false,
      message: `Jesteś na miejscu! Na koniec obróć Kaczkę ${["w górę", "w prawo", "w dół", "w lewo"][l.finishDir]}. Nie musisz robić następnego kroku.`,
    };
  if (l.quacks !== undefined && w.quacks !== l.quacks)
    return {
      success: false,
      message: `Jesteś na miejscu! Potrzeba dokładnie ${l.quacks} „kwa” w całym programie. Było: ${w.quacks}.`,
    };
  if (l.loop && !hasBlock(bs, "repeat"))
    return {
      success: false,
      message: "Udało się dojść! Teraz zapisz pomysł klockiem „Powtórz”.",
    };
  if (l.turns && w.turns < l.turns)
    return {
      success: false,
      message: "Obejdź ogródek — potrzebujesz co najmniej czterech skrętów.",
    };
  if (
    l.condition &&
    (!hasBlock(bs, "flower") || w.flowers.length !== l.flowers.length)
  )
    return {
      success: false,
      message: "Powiedz „kwa” na obu kwiatkach. Pomoże klocek „Jeśli kwiatek”.",
    };
  return {
    success: true,
    message: "Brawo! Twój program zadziałał. Gwiazdka jest Twoja!",
  };
}
export function pythonProgram(bs: Block[]): string {
  compile(bs);
  if (hasBlock(bs, "flower"))
    throw Error(
      "Kwiatki są częścią gry. Usuń „Jeśli kwiatek”, aby przygotować program dla robota.",
    );
  if (hasBlock(bs, "clear"))
    throw Error(
      "„Jeśli wolna droga” sprawdza planszę gry. Usuń ten warunek, aby przygotować program dla robota.",
    );
  return PYTHON_TEMPLATE.replace(
    "__PROGRAM__",
    JSON.stringify(JSON.stringify(bs)),
  );
}
const PYTHON_TEMPLATE = `#!/usr/bin/env python3
# Kaczy Kod / Microduck. API Pollen Robotics sprawdzone 07.11.2026.
# Uruchom NA ROBOCIE: python3 kaczy-program.py (proba bez ruchu)
# Ruch: sudo python3 kaczy-program.py --run
# Przed --run wlacz chodzenie przyciskiem Start na padzie.
# Krok ~8 cm, skret ~90 stopni: ruch czasowy, bez pozycjonowania.
# Ctrl+C = robot.stop. Silniki pozostaja wlaczone.
# https://github.com/pollen-robotics/microduck/blob/main/duck-ipc-proto/src/lib.rs
import argparse, json, math, signal, socket, time
PROGRAM = json.loads(__PROGRAM__)

def flatten(blocks):
    for b in blocks:
        if b['type'] == 'repeat':
            for _ in range(b['count']): yield from flatten(b.get('children', []))
        else: yield b['type']

class Duck:
    def __init__(self, path):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(3)
        self.sock.connect(path)
        self.reader = self.sock.makefile('rb')
        self.seq = 0
    def send(self, method, params=None, notify=False):
        msg = {'jsonrpc': '2.0', 'method': method, 'params': params or {}}
        if not notify:
            self.seq += 1
            msg['id'] = self.seq
        self.sock.sendall((json.dumps(msg) + '\\n').encode())
        if notify: return
        while True:
            line = self.reader.readline()
            if not line: raise RuntimeError('Robot rozlaczyl polaczenie')
            reply = json.loads(line)
            if reply.get('id') != self.seq: continue
            if 'error' in reply: raise RuntimeError(str(reply['error']))
            result = reply.get('result', {})
            if isinstance(result, dict) and result.get('accepted') is False:
                raise RuntimeError(result.get('reason', 'Robot odmowil'))
            return result
    def move(self, vx=0, yaw=0, seconds=1):
        end = time.monotonic() + seconds
        while time.monotonic() < end:
            self.send('robot.move', {'vx': vx, 'vy': 0, 'vyaw': yaw}, notify=True)
            time.sleep(0.05)
        self.send('robot.stop')

def main():
    parser = argparse.ArgumentParser(description='Program z Kaczego Kodu')
    parser.add_argument('--run', action='store_true', help='wykonaj na prawdziwym robocie')
    parser.add_argument('--socket', default='/run/robotd.sock')
    args = parser.parse_args()
    actions = list(flatten(PROGRAM))
    if len(actions) > 256: raise ValueError('Za dlugi program')
    print('Program:', ', '.join(actions))
    if not args.run:
        print('Proba zakonczona. Nie wyslano polecen. Ruch wymaga --run.')
        return
    def interrupted(*_): raise KeyboardInterrupt
    signal.signal(signal.SIGTERM, interrupted)
    duck = Duck(args.socket)
    try:
        duck.send('hello', {'api_version': 1})
        duck.send('robot.stop')
        for action in actions:
            print('Klocek:', action, flush=True)
            if action == 'forward': duck.move(vx=0.08)
            elif action == 'left': duck.move(yaw=0.5, seconds=math.pi)
            elif action == 'right': duck.move(yaw=-0.5, seconds=math.pi)
            elif action == 'quack':
                duck.send('robot.sound', {'tag': 'chirp'})
                time.sleep(0.7)
            elif action == 'wait': time.sleep(1)
    finally:
        try: duck.send('robot.stop')
        finally: duck.sock.close()

if __name__ == '__main__':
    try: main()
    except KeyboardInterrupt: print('Zatrzymano program.')
`;
