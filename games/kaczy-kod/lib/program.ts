export type Action = "forward" | "left" | "right" | "quack" | "wait";
export type Condition = "clear" | "flower" | "notGoal";
export type Block = {
  id: string;
  type:
    | Action
    | "repeat"
    | "flower"
    | "clear"
    | "while"
    | "ifelse"
    | "define"
    | "call";
  count?: number;
  children?: Block[];
  otherwise?: Block[];
  condition?: Condition;
  name?: string;
};
export type World = {
  x: number;
  y: number;
  dir: number;
  angle: number;
  functionCalls: number;
  thenCount: number;
  elseCount: number;
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
  whileRequired?: boolean;
  ifElseRequired?: boolean;
  functionRequired?: boolean;
  minCalls?: number;
  bothBranches?: boolean;
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
CHAPTERS.push(
  {
    title: "Pętle i decyzje",
    range: "21–27",
    from: 21,
    to: 27,
    description: "Dopóki, jeśli i inaczej",
  },
  {
    title: "Moje funkcje",
    range: "28–32",
    from: 28,
    to: 32,
    description: "Napisz swój przepis i użyj go ponownie",
  },
);
let presetId = 0;
function sample(type: Block["type"], data: Partial<Block> = {}): Block {
  return { id: `flow-${presetId++}`, type, ...data };
}
LESSONS.push(
  {
    id: 21,
    title: "Dopóki droga wolna",
    concept: "Pierwsza pętla while",
    intro:
      "Nie licz kroków. Idź do przodu DOPÓKI droga jest wolna. Kamyk pomoże Kaczce zatrzymać się na gwiazdce.",
    hint: "Dodaj „Dopóki”, wybierz „wolna droga” i włóż do środka jeden krok do przodu. Warunek sprawdza się przed każdym krokiem.",
    start: [0, 3, 1],
    goal: [4, 3],
    rocks: ["5,3"],
    flowers: [],
    whileRequired: true,
    theme: "lagoon",
  },
  {
    id: 22,
    title: "Przystanek: gwiazdka",
    concept: "Warunek kończy pętlę",
    intro:
      "Idź DOPÓKI nie stoisz na gwiazdce. Za nią nadal jest wolna droga, więc wybierz inny warunek!",
    hint: "W pętli „Dopóki” zmień warunek na „nie ma mnie na gwiazdce”. Do środka włóż krok. Kaczka sprawdza warunek także wtedy, gdy właśnie dotarła do celu.",
    start: [1, 4, 0],
    goal: [1, 1],
    rocks: [],
    flowers: [],
    whileRequired: true,
    theme: "night",
  },
  {
    id: 23,
    title: "Spacer z odliczaniem kwa",
    concept: "Kilka poleceń w while",
    intro:
      "Dopóki droga jest wolna: zrób krok i powiedz „kwa”. Na gwiazdce powinny zabrzmieć łącznie cztery „kwa”.",
    hint: "W „Dopóki: wolna droga” umieść dwa klocki: krok i „Powiedz kwa!”. Kamyk stoi tuż za gwiazdką.",
    start: [0, 3, 1],
    goal: [4, 3],
    rocks: ["5,3"],
    flowers: [],
    whileRequired: true,
    quacks: 4,
    theme: "orchard",
  },
  {
    id: 24,
    title: "Pętla, która stoi w miejscu",
    concept: "Napraw while",
    intro:
      "Gotowa pętla mówi „kwa”, ale Kaczka się nie rusza. Dlaczego droga nigdy się nie zmienia? Napraw środek pętli.",
    hint: "Samo „kwa” nie zmienia drogi przed Kaczką. Usuń ten klocek i do środka pętli dodaj krok do przodu. Po trzech krokach warunek będzie fałszywy.",
    start: [0, 3, 1],
    goal: [3, 3],
    rocks: ["4,3"],
    flowers: [],
    whileRequired: true,
    starter: [
      sample("while", { condition: "clear", children: [sample("quack")] }),
    ],
    theme: "lagoon",
  },
  {
    id: 25,
    title: "Kwiatek czy odpoczynek?",
    concept: "Pierwsze if/else",
    intro:
      "Po każdym kroku wybierz: JEŚLI stoisz na kwiatku, powiedz „kwa”, INACZEJ poczekaj. Dotrzyj do gwiazdki z dwoma „kwa”.",
    hint: "Powtórz 4 razy: krok, a potem „Jeśli / inaczej” z warunkiem „stoję na kwiatku”. Do gałęzi „jeśli” włóż „kwa”, a do „inaczej” — „Poczekaj”.",
    start: [0, 3, 1],
    goal: [4, 3],
    rocks: [],
    flowers: ["1,3", "3,3"],
    quacks: 2,
    ifElseRequired: true,
    bothBranches: true,
    theme: "orchard",
  },
  {
    id: 26,
    title: "Dwie odpowiedzi na kamyk",
    concept: "Decyzja zmienia trasę",
    intro:
      "Sześć razy podejmij decyzję: JEŚLI droga wolna — krok, INACZEJ — skręć w lewo. Dokąd dojdzie Kaczka?",
    hint: "Do „Powtórz 6 razy” włóż „Jeśli / inaczej: wolna droga”. W pierwszej gałęzi umieść krok, w drugiej skręt w lewo. Kamyk zmieni kierunek wyprawy.",
    start: [1, 4, 1],
    goal: [2, 0],
    rocks: ["3,4"],
    flowers: [],
    ifElseRequired: true,
    bothBranches: true,
    theme: "lagoon",
  },
  {
    id: 27,
    title: "Dopóki z decyzją w środku",
    concept: "while razem z if/else",
    intro:
      "DOPÓKI nie ma Cię na gwiazdce: JEŚLI droga jest wolna, idź, INACZEJ skręć w lewo. Nie musisz liczyć kroków ani skrętów!",
    hint: "Pętla „Dopóki: nie ma mnie na gwiazdce” zawiera „Jeśli / inaczej: wolna droga”. W „jeśli” daj krok, w „inaczej” — lewo.",
    start: [0, 4, 1],
    goal: [2, 1],
    rocks: ["3,4"],
    flowers: [],
    whileRequired: true,
    ifElseRequired: true,
    bothBranches: true,
    theme: "night",
  },
  {
    id: 28,
    title: "Moja pierwsza funkcja",
    concept: "Nazwij własny przepis",
    intro:
      "Stwórz funkcję, np. „powitanie”, która mówi „kwa” dwa razy. Potem użyj jej dwa razy. Usłyszysz cztery „kwa”!",
    hint: "„Stwórz funkcję” to przepis. Wpisz nazwę i dodaj do środka dwa „kwa”. Kliknij „Wróć na koniec programu”, a potem dwa razy „Użyj funkcji”. Sam przepis niczego nie wykonuje.",
    start: [2, 3, 1],
    goal: [2, 3],
    rocks: [],
    flowers: [],
    functionRequired: true,
    minCalls: 2,
    quacks: 4,
    theme: "orchard",
  },
  {
    id: 29,
    title: "Schodki z jednego przepisu",
    concept: "Użyj funkcji kilka razy",
    intro:
      "Wypełnij funkcję „schodek”: krok, lewo, krok, prawo. Trzy wywołania tej samej funkcji zaprowadzą Kaczkę do celu.",
    hint: "Kliknij „Dodaj do środka” pod definicją schodka. Dodaj krok, lewo, krok, prawo. Trzy wywołania już czekają pod spodem. Zmień przepis w jednym miejscu — wszystkie wywołania skorzystają ze zmiany.",
    start: [0, 5, 1],
    goal: [3, 2],
    rocks: [],
    flowers: [],
    functionRequired: true,
    minCalls: 3,
    starter: [
      sample("define", { name: "schodek", children: [] }),
      sample("call", { name: "schodek" }),
      sample("call", { name: "schodek" }),
      sample("call", { name: "schodek" }),
    ],
    theme: "lagoon",
  },
  {
    id: 30,
    title: "Napraw raz, użyj dwa razy",
    concept: "Popraw definicję funkcji",
    intro:
      "Funkcja „schodek” ma zły pierwszy skręt. Popraw ją w jednym miejscu, a oba wywołania zaczną działać prawidłowo.",
    hint: "W definicji zamień pierwszy skręt w prawo na lewy. Gotowy schodek ma kolejność: krok, lewo, krok, prawo. Nie trzeba zmieniać dwóch wywołań na dole.",
    start: [1, 4, 1],
    goal: [3, 2],
    rocks: [],
    flowers: [],
    functionRequired: true,
    minCalls: 2,
    starter: [
      sample("define", {
        name: "schodek",
        children: starter("forward", "right", "forward", "right"),
      }),
      sample("call", { name: "schodek" }),
      sample("call", { name: "schodek" }),
    ],
    theme: "orchard",
  },
  {
    id: 31,
    title: "Przepis na długi spacer",
    concept: "Funkcja z while",
    intro:
      "Napisz funkcję „spacer”: dopóki droga wolna, idź. Użyj jej, skręć w lewo i użyj ponownie. Ten sam przepis zadziała w innym kierunku!",
    hint: "Do definicji spaceru włóż „Dopóki: wolna droga”, a do tej pętli — krok. Pod definicją są już: wywołanie, skręt w lewo i drugie wywołanie.",
    start: [0, 5, 1],
    goal: [5, 0],
    rocks: [],
    flowers: [],
    functionRequired: true,
    minCalls: 2,
    whileRequired: true,
    starter: [
      sample("define", { name: "spacer", children: [] }),
      sample("call", { name: "spacer" }),
      sample("left"),
      sample("call", { name: "spacer" }),
    ],
    theme: "night",
  },
  {
    id: 32,
    title: "Mistrzyni kaczych przepisów",
    concept: "Funkcja, while i if/else",
    intro:
      "Połącz pomysły! Własna funkcja ma iść po wolnej drodze lub skręcać w lewo przy kamyku. Na dwóch kwiatkach powiedz „kwa”. Wywołuj funkcję DOPÓKI nie dojdziesz do gwiazdki.",
    hint: "Funkcja zawiera „Jeśli / inaczej: wolna droga”. W „jeśli”: krok i „Jeśli kwiatek” z „kwa”. W „inaczej”: lewo. Pod definicją dodaj „Dopóki: nie ma mnie na gwiazdce”, a do pętli wywołanie funkcji.",
    start: [0, 5, 1],
    goal: [2, 1],
    rocks: ["3,5"],
    flowers: ["1,5", "2,3"],
    functionRequired: true,
    minCalls: 3,
    whileRequired: true,
    ifElseRequired: true,
    bothBranches: true,
    condition: true,
    quacks: 2,
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
  kind: Condition = "flower",
): boolean {
  if (kind === "notGoal") return w.x !== l.goal[0] || w.y !== l.goal[1];
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
    angle: l.start[2] * 90,
    functionCalls: 0,
    thenCount: 0,
    elseCount: 0,
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
export function childBlocks(b: Block): Block[] {
  return [...(b.children ?? []), ...(b.otherwise ?? [])];
}
export function hasBlock(bs: Block[], type: Block["type"]): boolean {
  return bs.some((b) => b.type === type || hasBlock(childBlocks(b), type));
}
export function countBlocks(bs: Block[]): number {
  return bs.reduce((sum, b) => sum + 1 + countBlocks(childBlocks(b)), 0);
}
const RESERVED_NAMES = new Set(
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield krok w_lewo w_prawo kwa czekaj wolna_droga na_kwiatku nie_na_gwiazdce".split(
    " ",
  ),
);
function validName(name: unknown): string {
  if (
    typeof name !== "string" ||
    !/^\p{L}[\p{L}\p{N}_]{0,23}$/u.test(name) ||
    RESERVED_NAMES.has(name)
  )
    throw Error(
      "Nazwij funkcję literami, np. taniec albo dwa_kroki (do 24 znaków). Bez spacji.",
    );
  return name;
}
export function validateProgram(value: unknown, depth = 0): Block[] {
  if (!Array.isArray(value) || depth > 4 || value.length > 60)
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
        "while",
        "ifelse",
        "define",
        "call",
      ].includes(v.type)
    )
      throw Error("Nie rozpoznaję jednego z klocków.");
    const b: Block = { id: crypto.randomUUID(), type: v.type };
    if (b.type === "repeat") {
      if (!Number.isInteger(v.count) || v.count < 2 || v.count > 8)
        throw Error("Pętla może mieć od 2 do 8 powtórzeń.");
      b.count = v.count;
    }
    if (b.type === "while" || b.type === "ifelse") {
      if (!["clear", "flower", "notGoal"].includes(v.condition))
        throw Error(
          "Wybierz warunek: wolna droga, kwiatek albo przed gwiazdką.",
        );
      b.condition = v.condition;
    }
    if (b.type === "define" || b.type === "call") b.name = validName(v.name);
    if (
      ["repeat", "flower", "clear", "while", "ifelse", "define"].includes(
        b.type,
      )
    )
      b.children = validateProgram(v.children ?? [], depth + 1);
    if (b.type === "ifelse")
      b.otherwise = validateProgram(v.otherwise ?? [], depth + 1);
    if (b.type === "define" && depth !== 0)
      throw Error(
        "Definicję funkcji ustaw na głównym poziomie programu. Wywołanie możesz włożyć do pętli.",
      );
    return b;
  });
  if (countBlocks(out) > 60)
    throw Error("W programie może być najwyżej 60 klocków.");
  return out;
}
export type Instruction = {
  id: string;
  type: Action | "check" | "jump" | "mark";
  skip?: number;
  condition?: Condition;
  to?: number;
  loop?: boolean;
  branch?: boolean;
};
export function compile(bs: Block[]): Instruction[] {
  const definitions = new Map<string, Block>();
  function inspect(list: Block[], depth = 0) {
    for (const b of list) {
      if (b.type === "define") {
        if (depth !== 0)
          throw Error("Definicja funkcji musi być na głównym poziomie.");
        const name = validName(b.name);
        if (definitions.has(name))
          throw Error(
            `Dwie funkcje mają nazwę „${name}”. Nadaj im różne nazwy.`,
          );
        definitions.set(name, b);
      }
      inspect(childBlocks(b), depth + 1);
    }
  }
  inspect(bs);
  // Check unused recipes too: a misspelt call or recursion should never be hidden.
  const checked = new Set<string>();
  function checkCalls(list: Block[], stack: string[] = []) {
    for (const b of list) {
      if (b.type === "call") {
        const name = validName(b.name),
          definition = definitions.get(name);
        if (!definition)
          throw Error(`Najpierw stwórz funkcję „${name}”, a potem jej użyj.`);
        if (stack.includes(name))
          throw Error(
            "Funkcja woła samą siebie! Użyj kroków lub innej funkcji zamiast takiego zapętlenia.",
          );
        if (!checked.has(name)) {
          checkCalls(definition.children ?? [], [...stack, name]);
          checked.add(name);
        }
      } else if (b.type !== "define") checkCalls(childBlocks(b), stack);
    }
  }
  checkCalls(bs);
  for (const [name, definition] of definitions)
    if (!checked.has(name)) {
      checkCalls(definition.children ?? [], [name]);
      checked.add(name);
    }
  const out: Instruction[] = [];
  function emit(list: Block[]) {
    for (const b of list) {
      if (b.type === "define") continue;
      if (b.type === "repeat") {
        for (let i = 0; i < (b.count ?? 2); i++) emit(b.children ?? []);
      } else if (b.type === "call") {
        out.push({ id: b.id, type: "mark" });
        emit(definitions.get(b.name!)!.children ?? []);
      } else if (["flower", "clear", "while", "ifelse"].includes(b.type)) {
        const start = out.length,
          condition: Condition =
            b.type === "flower"
              ? "flower"
              : b.type === "clear"
                ? "clear"
                : (b.condition ?? "clear");
        const check: Instruction = {
          id: b.id,
          type: "check",
          condition,
          loop: b.type === "while",
          branch: b.type === "ifelse",
        };
        out.push(check);
        emit(b.children ?? []);
        if (b.type === "while") {
          out.push({ id: b.id, type: "jump", to: start });
          check.skip = out.length - start - 1;
        } else if (b.type === "ifelse") {
          const jump: Instruction = { id: b.id, type: "jump" };
          out.push(jump);
          check.skip = out.length - start - 1;
          emit(b.otherwise ?? []);
          jump.to = out.length;
        } else check.skip = out.length - start - 1;
      } else out.push({ id: b.id, type: b.type as Action });
      if (out.length > 256)
        throw Error(
          "To długa wyprawa! Skróć program do 256 wykonywanych poleceń.",
        );
    }
  }
  emit(bs);
  return out;
}
export type Execution = {
  code: Instruction[];
  pc: number;
  steps: number;
  loops: Map<number, Set<string>>;
};
export function createExecution(bs: Block[]): Execution {
  return { code: compile(bs), pc: 0, steps: 0, loops: new Map() };
}
export function stepExecution(
  ex: Execution,
  w: World,
  l: Lesson,
): {
  world: World;
  id: string | null;
  type: Instruction["type"] | null;
  done: boolean;
} {
  const index = ex.pc,
    ins = ex.code[index];
  if (!ins) return { world: w, id: null, type: null, done: true };
  if (++ex.steps > 512)
    throw Error(
      "Bardzo długa pętla! Zatrzymaliśmy program po 512 krokach. Sprawdź, co zmienia warunek while.",
    );
  ex.pc++;
  let next = w;
  if (ins.type === "check") {
    const yes = conditionHolds(w, l, ins.condition);
    if (ins.branch)
      next = {
        ...w,
        thenCount: w.thenCount + (yes ? 1 : 0),
        elseCount: w.elseCount + (yes ? 0 : 1),
      };
    if (ins.loop) {
      if (!yes) ex.loops.delete(index);
      else {
        const signature = `${w.x},${w.y},${w.dir},${w.hasKey}`;
        const seen = ex.loops.get(index) ?? new Set<string>();
        if (seen.has(signature))
          throw Error(
            "Pętla while kręci się w kółko! Kaczka wróciła do tego samego miejsca i kierunku. Dodaj polecenie, które zmieni warunek.",
          );
        seen.add(signature);
        ex.loops.set(index, seen);
      }
    }
    if (!yes) ex.pc += ins.skip ?? 0;
  } else if (ins.type === "jump") ex.pc = ins.to!;
  else if (ins.type === "mark")
    next = { ...w, functionCalls: w.functionCalls + 1 };
  else next = advance(w, ins.type, l);
  return {
    world: next,
    id: ins.id,
    type: ins.type,
    done: ex.pc >= ex.code.length || next.bump,
  };
}
export function learningCode(bs: Block[]): string {
  compile(bs);
  const lines: string[] = [
    "# Python do nauki — polecenia dotyczą planszy gry.",
  ];
  const conditionNames = {
    clear: "wolna_droga()",
    flower: "na_kwiatku()",
    notGoal: "nie_na_gwiazdce()",
  };
  const actionNames = {
    forward: "krok()",
    left: "w_lewo()",
    right: "w_prawo()",
    quack: "kwa()",
    wait: "czekaj()",
  };
  function write(list: Block[], depth = 0) {
    const indent = "    ".repeat(depth);
    if (!list.length) {
      lines.push(indent + "pass");
      return;
    }
    for (const b of list) {
      if (b.type === "define") {
        lines.push(indent + `def ${b.name}():`);
        write(b.children ?? [], depth + 1);
        lines.push("");
      } else if (b.type === "call") lines.push(indent + `${b.name}()`);
      else if (b.type === "repeat") {
        lines.push(indent + `for _ in range(${b.count ?? 2}):`);
        write(b.children ?? [], depth + 1);
      } else if (b.type === "while") {
        lines.push(indent + `while ${conditionNames[b.condition ?? "clear"]}:`);
        write(b.children ?? [], depth + 1);
      } else if (b.type === "ifelse") {
        lines.push(indent + `if ${conditionNames[b.condition ?? "flower"]}:`);
        write(b.children ?? [], depth + 1);
        lines.push(indent + "else:");
        write(b.otherwise ?? [], depth + 1);
      } else if (b.type === "flower" || b.type === "clear") {
        lines.push(indent + `if ${conditionNames[b.type]}:`);
        write(b.children ?? [], depth + 1);
      } else lines.push(indent + actionNames[b.type]);
    }
  }
  write(bs.filter((b) => b.type === "define"));
  lines.push("# Start programu");
  write(bs.filter((b) => b.type !== "define"));
  return lines.join("\n");
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
    n.angle -= 90;
    n.turns++;
  }
  if (action === "right") {
    n.dir = (w.dir + 1) % 4;
    n.angle += 90;
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
  if (l.whileRequired && !hasBlock(bs, "while"))
    return {
      success: false,
      message:
        "Użyj pętli „Dopóki” (while). Ona sprawdza warunek przed każdym powtórzeniem.",
    };
  if (l.ifElseRequired && !hasBlock(bs, "ifelse"))
    return {
      success: false,
      message:
        "Dodaj klocek „Jeśli / inaczej” (if/else) i wybierz polecenia dla obu odpowiedzi.",
    };
  if (
    l.functionRequired &&
    (!hasBlock(bs, "define") || w.functionCalls < (l.minCalls ?? 1))
  )
    return {
      success: false,
      message: `Stwórz własną funkcję i użyj jej co najmniej ${l.minCalls ?? 1} razy.`,
    };
  if (l.bothBranches && (!w.thenCount || !w.elseCount))
    return {
      success: false,
      message:
        "W tej przygodzie sprawdź obie odpowiedzi: „jeśli” oraz „inaczej”.",
    };
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
  const compiled = compile(bs);
  if (hasBlock(bs, "while") || hasBlock(bs, "ifelse"))
    throw Error(
      "Warunki while i if/else korzystają z planszy gry. Tego programu nie można wysłać do robota.",
    );
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
    JSON.stringify(
      JSON.stringify(
        compiled
          .filter((i) =>
            ["forward", "left", "right", "quack", "wait"].includes(i.type),
          )
          .map((i) => ({ type: i.type })),
      ),
    ),
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
