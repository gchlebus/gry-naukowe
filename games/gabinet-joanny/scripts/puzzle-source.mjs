import {
  allCodes,
  codeFeedback,
  codeCandidates,
  orderHolds,
  orderSolutions,
  nonogramClues,
  matrixResult,
  matrixPossibleAnswers,
  cubeAnswer,
  toggleLight,
  shortestLights,
  popcount,
  crypt,
} from "../dist/js/engine.mjs";
export const CHAPTERS = [
  {
    id: "snape",
    roman: "I",
    title: "Gabinet Snape’a",
    subtitle: "Eliksiry, dyscyplina i nieoczywiste wnioski.",
    world: "Harry Potter",
    icon: "flask",
    color: "#42665b",
  },
  {
    id: "moon",
    roman: "II",
    title: "Archiwum Księżyca",
    subtitle: "Matryce, konstelacje i światło ukryte w regułach.",
    world: "Czarodziejka z Księżyca",
    icon: "moon",
    color: "#8d7ea4",
  },
  {
    id: "pig",
    roman: "III",
    title: "Misja Super Pig",
    subtitle: "Odwaga jest cenna. Dobra dedukcja także.",
    world: "Super Pig",
    icon: "pig",
    color: "#bc8594",
  },
  {
    id: "potato",
    roman: "IV",
    title: "Sprawa wielkiej bulwy",
    subtitle: "Kartofle. Tajemnice. Nadzwyczaj poważne akta.",
    world: "Kolekcja osobista",
    icon: "potato",
    color: "#a48b61",
  },
];
export const TYPES = {
  code: "Zamek szyfrowy",
  matrix: "Matryca",
  grid: "Dedukcja",
  cipher: "Szyfr",
  cube: "Wyobraźnia przestrzenna",
  select: "Logika warunkowa",
  nonogram: "Nonogram",
  lights: "Układ przełączeń",
  truth: "Zdania i prawda",
  balance: "Równowaga",
};
const names = ["A", "B", "C", "D", "E", "F"];
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function code(secret, seed) {
  const random = rng(seed);
  let remaining = allCodes(secret.length),
    clues = [];
  for (let k = 0; k < 15 && remaining.length > 1; k++) {
    let best = null,
      bestLeft = Infinity;
    for (let j = 0; j < 65; j++) {
      const guess = allCodeCache(secret.length)[
        Math.floor(random() * allCodeCache(secret.length).length)
      ];
      if (guess === secret || clues.some((c) => c.guess === guess)) continue;
      const f = codeFeedback(secret, guess);
      if (f.exact > 1 || f.exact + f.misplaced > 2) continue;
      const left = remaining.filter((s) => {
        const q = codeFeedback(s, guess);
        return q.exact === f.exact && q.misplaced === f.misplaced;
      });
      const target = Math.max(
          k < 3 ? 3 : 1,
          Math.round(remaining.length * 0.2),
        ),
        score = Math.abs(left.length - target);
      if (
        left.length > 0 &&
        left.length < remaining.length &&
        score < bestLeft
      ) {
        best = { guess, ...f, left };
        bestLeft = score;
      }
    }
    if (!best) break;
    remaining = best.left;
    clues.push({
      guess: best.guess,
      exact: best.exact,
      misplaced: best.misplaced,
    });
  }
  if (remaining.length !== 1) throw Error("Niejednoznaczny kod");
  return { length: secret.length, secret, clues };
}
const codes = new Map();
function allCodeCache(n) {
  if (!codes.has(n)) codes.set(n, allCodes(n));
  return codes.get(n);
}
function clueText(c, items) {
  const a = `„${items[c.a]}”`,
    b = `„${items[c.b]}”`,
    d = `„${items[c.c]}”`;
  switch (c.kind) {
    case "before":
      return `Element ${a} jest na lewo od ${b}, ale niekoniecznie obok.`;
    case "next":
      return `Element ${a} jest bezpośrednio na lewo od ${b}.`;
    case "distance":
      return `Odległość między ${a} a ${b} wynosi ${c.n} pozycje (różnica numerów miejsc).`;
    case "notpos":
      return `Element ${a} nie zajmuje miejsca ${c.n + 1}.`;
    case "pos":
      return `Element ${a} zajmuje miejsce ${c.n + 1}.`;
    case "edge":
      return `Element ${a} zajmuje jedno z dwóch skrajnych miejsc.`;
    case "notedge":
      return `Element ${a} nie zajmuje żadnego ze skrajnych miejsc.`;
    case "between":
      return `Element ${b} leży gdzieś między ${a} a ${d}; kolejność skrajnych elementów może być dowolna.`;
    case "notnext":
      return `${a} i ${b} nie sąsiadują ze sobą.`;
  }
}
function ordering(items, solution, seed) {
  const n = items.length,
    random = rng(seed),
    candidates = [];
  for (let a = 0; a < n; a++) {
    for (const kind of ["edge", "notedge"]) {
      const c = { kind, a };
      if (orderHolds(solution, c)) candidates.push(c);
    }
    for (let b = 0; b < n; b++)
      if (a !== b) {
        for (const kind of ["before", "next", "notnext"]) {
          const c = { kind, a, b };
          if (orderHolds(solution, c)) candidates.push(c);
        }
        for (const distance of [2, 3]) {
          const c = { kind: "distance", a, b, n: distance };
          if (orderHolds(solution, c)) candidates.push(c);
        }
      }
    for (let pos = 0; pos < n; pos++) {
      const c = { kind: "notpos", a, n: pos };
      if (orderHolds(solution, c)) candidates.push(c);
    }
  }
  let remaining = orderSolutions({ items, clues: [] }),
    clues = [];
  while (remaining.length > 1 && clues.length < 14) {
    const possible = candidates
      .filter((c) => !clues.includes(c))
      .map((c) => ({
        c,
        left: remaining.filter((order) => orderHolds(order, c)),
        tie: random(),
      }))
      .filter((x) => x.left.length < remaining.length)
      .sort(
        (a, b) =>
          Math.abs(a.left.length - Math.max(1, remaining.length * 0.45)) -
            Math.abs(b.left.length - Math.max(1, remaining.length * 0.45)) ||
          a.tie - b.tie,
      );
    const take = possible[0];
    if (!take) break;
    clues.push(take.c);
    remaining = take.left;
  }
  if (remaining.length !== 1) throw Error("Niejednoznaczna dedukcja");
  return {
    items,
    solution,
    clues: clues.map((c) => ({ ...c, text: clueText(c, items) })),
  };
}
function matrix(operation, rotation, seed) {
  const random = rng(seed);
  for (let k = 0; k < 1000; k++) {
    const rows = Array.from({ length: 3 }, () => {
      const a = 1 + Math.floor(random() * 510),
        b = 1 + Math.floor(random() * 510);
      return [a, b, matrixResult(a, b, operation, rotation)];
    });
    const answer = rows[2][2];
    if (popcount(answer) < 2 || popcount(answer) > 7) continue;
    const unique = matrixPossibleAnswers({ rows });
    if (unique.length !== 1 || unique[0] !== answer) continue;
    const wrong = new Set();
    while (wrong.size < 3) {
      const x = Math.floor(random() * 512);
      if (x !== answer && popcount(x) >= 2 && popcount(x) <= 7) wrong.add(x);
    }
    const options = [...wrong];
    options.splice(seed % 4, 0, answer);
    return { rows, operation, rotation, answer, options };
  }
  throw Error("Nie udało się utworzyć matrycy");
}
function nonogram(lines) {
  const n = lines.length,
    solution = lines.flatMap((s) => [...s].map(Number));
  return { n, solution, ...nonogramClues(solution, n) };
}
function cube(netPoints, mode, front, up) {
  const net = netPoints.map(([x, y], i) => ({ id: names[i], x, y })),
    p = { net, mode, front, up };
  p.answer = cubeAnswer(p);
  p.options = [
    p.answer,
    ...names.filter((n) => n !== p.answer && n !== front && n !== up),
  ]
    .slice(0, 4)
    .sort();
  return p;
}
function lights(n, presses) {
  let start = 0;
  for (const i of presses) start = toggleLight(n, start, i);
  const optimal = shortestLights(n, start);
  return { n, start, optimal, minimum: popcount(optimal) };
}
function cipher(method, key, plain, example, explanation) {
  return {
    method,
    key,
    plain,
    cipher: crypt(plain, method, key),
    example,
    explanation,
  };
}
function selection(rule, cards) {
  return { rule, cards: cards.map((c, i) => ({ id: String(i), ...c })) };
}
const crossNet = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [1, 2],
  [1, 3],
];
const beltNet = [
  [0, 1],
  [1, 1],
  [2, 1],
  [3, 1],
  [1, 0],
  [1, 2],
];
const specs = [
  [
    "snape",
    "s-code",
    "Szafka z podwójnym dnem",
    "code",
    1,
    code("407", 11),
    "Na biurku profesora leży zapis prób otwarcia szafki. Odtwórz kod, zanim wróci z pracowni.",
  ],
  [
    "snape",
    "s-matrix",
    "Osad w retorcie",
    "matrix",
    1,
    matrix("xor", 0, 15),
    "Snape zostawił dziewięć szkiców osadu. Ostatnia próbka została wyczyszczona. Który obraz pasuje do pustego pola?",
  ],
  [
    "snape",
    "s-grid",
    "Pięć fiolek przed północą",
    "grid",
    2,
    ordering(
      ["Opal", "Onyks", "Ametyst", "Nefryt", "Rubin"],
      [3, 1, 4, 0, 2],
      21,
    ),
    "Pięć fiolek stoi w jednym rzędzie. Etykiety odpadły, ale notatki profesora pozwalają odtworzyć kolejność.",
  ],
  [
    "snape",
    "s-cipher",
    "Margines profesora",
    "cipher",
    1,
    cipher(
      "caesar",
      7,
      "PATRONUS",
      "DOM → KVT",
      "Każdą literę przesunięto o 7 miejsc do przodu. Aby odczytać wiadomość, cofnij ją o 7, zawijając koniec alfabetu.",
    ),
    "Krótka wiadomość na marginesie księgi została zaszyfrowana tą samą regułą co przykład. Odczytaj ją.",
  ],
  [
    "snape",
    "s-cube",
    "Złożona pieczęć",
    "cube",
    2,
    cube(crossNet, "opposite", "B", null),
    "Papierową pieczęć należy złożyć w sześcian. Wszystkie oznaczenia są na zewnętrznych stronach.",
  ],
  [
    "snape",
    "s-select",
    "Warunek konieczny",
    "select",
    2,
    selection(
      "Jeżeli na stronie fiolki jest trójkąt, to po drugiej stronie widnieje liczba nieparzysta.",
      [
        { label: "Trójkąt", icon: "triangle", role: "A" },
        { label: "Koło", icon: "circle", role: "notA" },
        { label: "7", role: "B" },
        { label: "4", role: "notB" },
      ],
    ),
    "Każda karta przedstawia jedną fiolkę: z jednej strony ma symbol, a z drugiej liczbę. Które karty trzeba odwrócić, żeby na pewno sprawdzić regułę?",
  ],
  [
    "snape",
    "s-nonogram",
    "Kraty w pracowni",
    "nonogram",
    2,
    nonogram([
      "0011100",
      "0100010",
      "1000001",
      "1111111",
      "1001001",
      "0101010",
      "0011100",
    ]),
    "Na żelaznej kracie zakodowano pieczęć dostępu. Liczby przy wierszach i kolumnach opisują grupy zamalowanych pól.",
  ],
  [
    "snape",
    "s-lights",
    "Ostatnia iskra",
    "lights",
    3,
    lights(4, [1, 2, 5, 7, 10, 12, 13, 14]),
    "Profesor chce, aby po wyjściu wszystkie runy były wygaszone. Każde dotknięcie zmienia wybraną runę oraz jej sąsiadów w pionie i poziomie.",
  ],
  [
    "moon",
    "m-code",
    "Szkatułka Luny",
    "code",
    3,
    code("0816", 51),
    "W księżycowym archiwum znaleziono szkatułkę. Zero może wystąpić na początku kodu, a żadna cyfra się nie powtarza.",
  ],
  [
    "moon",
    "m-matrix",
    "Konstelacja bez nazwy",
    "matrix",
    3,
    matrix("xor", 1, 59),
    "Trzy rzędy obserwacji opisują tę samą operację na konstelacjach. Jeden ze składników może być obrócony o ćwierć obrotu.",
  ],
  [
    "moon",
    "m-grid",
    "Rada pięciu planet",
    "grid",
    2,
    ordering(
      ["Księżyc", "Merkury", "Mars", "Jowisz", "Wenus"],
      [2, 4, 1, 3, 0],
      67,
    ),
    "Pięć ksiąg związanych z Czarodziejką z Księżyca trzeba odłożyć na pięć miejsc. Do rozwiązania wystarczą poniższe notatki.",
  ],
  [
    "moon",
    "m-cipher",
    "List w srebrnej kopercie",
    "cipher",
    2,
    cipher(
      "vigenere",
      "LUNA",
      "KSIEZYC",
      "Klucz: LUNA. A=0, B=1, …, Z=25.",
      "Zapisz pod szyfrogramem powtarzany klucz LUNALUN. Od każdej litery odejmij wartość litery klucza, modulo 26.",
    ),
    "W tym szyfrze do kolejnych liter dodawano wartości powtarzanego klucza LUNA. Odtwórz słowo sprzed szyfrowania.",
  ],
  [
    "moon",
    "m-cube",
    "Sześć stron srebrnej kostki",
    "cube",
    3,
    cube(beltNet, "right", "B", "E"),
    "Złóż w myślach siatkę. Potem obróć całą kostkę zgodnie z podanym ustawieniem. Nie wolno jej odbijać w lustrze.",
  ],
  [
    "moon",
    "m-select",
    "Jedna prawdziwa notatka",
    "truth",
    2,
    {
      people: ["Ami", "Rei", "Makoto", "Minako"],
      claims: [
        {
          speaker: "Ami",
          target: 1,
          negative: false,
          text: "Księgę przełożyła Rei.",
        },
        {
          speaker: "Rei",
          target: 3,
          negative: true,
          text: "Księgi nie przełożyła Minako.",
        },
        {
          speaker: "Makoto",
          target: 1,
          negative: true,
          text: "Księgi nie przełożyła Rei.",
        },
        {
          speaker: "Minako",
          target: 0,
          negative: false,
          text: "Księgę przełożyła Ami.",
        },
      ],
      trueCount: 1,
      answer: 3,
    },
    "Jedna z czterech osób przełożyła księgę w archiwum. Dokładnie jedno z poniższych zdań jest prawdziwe. Kto przełożył księgę? Nie zakładaj niczego o prawdomówności konkretnych osób.",
  ],
  [
    "moon",
    "m-nonogram",
    "Ślad na tarczy Księżyca",
    "nonogram",
    2,
    nonogram([
      "00011100",
      "00110000",
      "01100000",
      "11000000",
      "11000000",
      "01100000",
      "00111000",
      "00011110",
    ]),
    "Wypełnij obraz zapisany na tarczy archiwalnej. Puste pola między grupami są tak samo ważne jak pola zamalowane.",
  ],
  [
    "moon",
    "m-lights",
    "Zaćmienie w obserwatorium",
    "lights",
    2,
    lights(3, [0, 2, 4, 6, 8]),
    "W obserwatorium pozostały aktywne sygnały. Wygasz całą tablicę, przełączając krzyże złożone z pola i jego sąsiadów.",
  ],
  [
    "pig",
    "p-code",
    "Depozyt odwagi",
    "code",
    2,
    code("5824", 73),
    "Super Pig potrzebuje dostępu do depozytu. Pozostały tylko dokładne wyniki wcześniejszych prób kodu.",
  ],
  [
    "pig",
    "p-matrix",
    "Radar Super Pig",
    "matrix",
    2,
    matrix("or", 2, 81),
    "Radar łączy odczyty według jednej reguły. Odtwórz brakujący odczyt, uwzględniając możliwy obrót pierwszego składnika.",
  ],
  [
    "pig",
    "p-grid",
    "Pięć przesyłek specjalnych",
    "grid",
    2,
    ordering(
      ["Perła", "Kompas", "Peleryna", "Okulary", "Przekąska"],
      [1, 4, 0, 2, 3],
      91,
    ),
    "Przesyłki do tajnej bazy ustawiono w jednym rzędzie. Notatnik kuriera opisuje ich położenie, lecz żadnej paczki nie oznaczono numerem.",
  ],
  [
    "pig",
    "p-cipher",
    "Nadawca: Super Pig",
    "cipher",
    2,
    cipher(
      "alternating",
      null,
      "ODWAGA",
      "ALA → DJD; KOT → NMW.",
      "Na pozycjach 1, 3, 5 litery przesunięto o 3 do przodu; na 2, 4, 6 o 2 do tyłu. Przy odczycie stosuj ruchy odwrotne.",
    ),
    "Wiadomość korzysta z dwóch naprzemiennych przesunięć alfabetu. Pierwsza litera zawsze korzysta z tej samej reguły co trzecia.",
  ],
  [
    "pig",
    "p-cube",
    "Pudełko z tajnej bazy",
    "cube",
    2,
    cube(crossNet, "right", "C", "A"),
    "Sześcienne pudełko ma sześć różnych pieczęci. Przenieś oznaczenia z siatki na właściwe strony pudełka.",
  ],
  [
    "pig",
    "p-select",
    "Paczki z perłą",
    "select",
    2,
    selection("Jeżeli paczka ma czerwoną pieczęć, to w środku jest perła.", [
      { label: "Czerwona pieczęć", icon: "redseal", role: "A" },
      { label: "Niebieska pieczęć", icon: "blueseal", role: "notA" },
      { label: "Perła", icon: "pearl", role: "B" },
      { label: "Kamyk", icon: "stone", role: "notB" },
    ]),
    "Na kartach widać albo pieczęć paczki, albo jej zawartość. Po drugiej stronie jest brakująca informacja. Które trzeba sprawdzić?",
  ],
  [
    "pig",
    "p-nonogram",
    "Pieczęć z różowej teczki",
    "nonogram",
    2,
    nonogram([
      "11000011",
      "11100111",
      "01111110",
      "01111110",
      "11111111",
      "11011011",
      "01111110",
      "00111100",
    ]),
    "Dokument z bazy Super Pig ma uszkodzony znak identyfikacyjny. Odtwórz go wyłącznie na podstawie liczb.",
  ],
  [
    "pig",
    "p-lights",
    "Dyskretna ewakuacja",
    "lights",
    3,
    lights(4, [2, 3, 4, 7, 8, 9, 10, 12, 14, 15]),
    "Wyłącz sygnały w bazie. Jedno przełączenie zmienia stan pola i sąsiadów, także tych, które już były wygaszone.",
  ],
  [
    "potato",
    "k-code",
    "Zamek do piwnicy",
    "code",
    3,
    code("9031", 103),
    "Zapas kartofli zabezpieczono czterocyfrowym zamkiem. Ustal kod. To zadanie o wnioskowaniu, nie o sile drzwi.",
  ],
  [
    "potato",
    "k-matrix",
    "Arkusz bulwologiczny",
    "matrix",
    3,
    matrix("and", 3, 111),
    "Instytut Kartofla bada układy oczek. Dwie pierwsze linie pokazują regułę stosowaną w trzeciej.",
  ],
  [
    "potato",
    "k-grid",
    "Tajne menu degustacyjne",
    "grid",
    3,
    ordering(
      ["Placki", "Gnocchi", "Kopytka", "Puree", "Frytki", "Kluski"],
      [3, 0, 5, 1, 4, 2],
      129,
    ),
    "Na sześciu miejscach czeka sześć kartoflanych propozycji. Ustal pełną kolejność degustacji. Tak, to bardzo poważna sprawa.",
  ],
  [
    "potato",
    "k-cipher",
    "Archiwum Bulwa",
    "cipher",
    3,
    cipher(
      "affine",
      null,
      "BULWA",
      "A → I, B → N, C → S. A=0, …, Z=25.",
      "Kodowanie opisuje y = 5x + 8 modulo 26. Odwrotnością liczby 5 modulo 26 jest 21, więc odczyt to x = 21(y − 8) modulo 26.",
    ),
    "Każdą literę zamieniono według reguły y = ax + b modulo 26, z tymi samymi a i b. Ustal ją z przykładów i odczytaj hasło.",
  ],
  [
    "potato",
    "k-cube",
    "Sześcian chłodnej piwnicy",
    "cube",
    3,
    cube(beltNet, "right", "C", "F"),
    "Nawet skrzynia kartofli może wymagać wyobraźni przestrzennej. Złóż siatkę i ustaw kostkę zgodnie z instrukcją.",
  ],
  [
    "potato",
    "k-select",
    "Waga sprawiedliwości",
    "balance",
    1,
    {
      equations: [
        { a: "A", b: "B", total: 17 },
        { a: "B", b: "C", total: 23 },
        { a: "A", b: "C", total: 20 },
      ],
      weights: { A: 7, B: 10, C: 13 },
      answer: 19,
    },
    "Pełne skrzynie tego samego rodzaju ważą zawsze tyle samo. Zważono trzy pary. O ile kilogramów dwie skrzynie C są cięższe od jednej skrzyni A?",
  ],
  [
    "potato",
    "k-nonogram",
    "Podziemny znak jakości",
    "nonogram",
    3,
    nonogram([
      "01111000",
      "11001100",
      "10000100",
      "11000110",
      "01100110",
      "00111110",
      "00011000",
      "00001000",
    ]),
    "W archiwum ziemniaczanej doskonałości przechowuje się jeden ostatni znak. Zamaluj właściwe pola i odtwórz pieczęć.",
  ],
  [
    "potato",
    "k-lights",
    "Spokój w piwnicy",
    "lights",
    3,
    lights(4, [0, 1, 3, 5, 6, 9, 11, 12]),
    "Wszystko policzone. Teraz wygasz runy i zamknij piwnicę. Nagrodą jest porządek we wszechświecie. Oraz kartofle.",
  ],
];
export const PUZZLES = specs.map(
  ([chapter, id, title, type, difficulty, data, story], i) => ({
    chapter,
    id,
    title,
    type,
    difficulty,
    ...data,
    story,
    number: i + 1,
    estimate:
      difficulty === 1
        ? "4–8 min"
        : difficulty === 2
          ? "8–15 min"
          : "12–25 min",
  }),
);
export const BY_ID = new Map(PUZZLES.map((p) => [p.id, p]));
export const PROFESSOR_NOTES = [
  "Dobra hipoteza to dopiero początek. Teraz trzeba ją sprawdzić.",
  "Przypadek bywa użyteczny. Jako podejrzany.",
  "Proszę nie mylić możliwości z koniecznością.",
  "Jeżeli dwa wnioski sobie przeczą, przynajmniej jeden z nich wymaga poprawki.",
  "Pani Joanno, proszę zaufać przesłankom. Mają mniej kaprysów niż składniki eliksiru.",
  "Najbardziej eleganckie rozwiązanie zwykle zostawia po sobie najmniej założeń.",
  "Kartofle nie są sprzeczne z powagą nauki. Zła dedukcja — owszem.",
  "Wynik bez uzasadnienia jest tylko ozdobną liczbą.",
];
