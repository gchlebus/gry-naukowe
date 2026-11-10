import { codeFeedback, allCodes, expected, lightMoves } from "./engine.mjs";
export function instruction(p) {
  switch (p.type) {
    case "code":
      return `Kod składa się z ${p.length} różnych cyfr 0–9. Może zaczynać się od zera. „Na miejscu” oznacza poprawną cyfrę na poprawnej pozycji, „poza miejscem” — poprawną cyfrę na innej pozycji. Wszystkie liczby są dokładne.`;
    case "matrix":
      return "W każdym wierszu trzeci obraz powstaje z dwóch pierwszych. Dozwolone reguły to: połączenie punktów, część wspólna lub usunięcie punktów wspólnych. Przed tą operacją pierwszy obraz może być obrócony o 0°, 90°, 180° lub 270° zgodnie z zegarem. Ta sama reguła i obrót obowiązują we wszystkich wierszach.";
    case "grid":
      return "Miejsca numerujemy od lewej. Kliknięcie pola przechodzi kolejno przez: wykluczenie ×, potwierdzenie ●, puste. Potrzebujesz jednego potwierdzenia w każdym wierszu i każdej kolumnie. Wykluczenia są Twoimi notatkami.";
    case "cipher":
      return "Używamy alfabetu A–Z bez polskich znaków. Przekroczenie końca alfabetu zawija do początku. Wielkość liter, spacje i polskie znaki w odpowiedzi nie wpływają na ocenę.";
    case "cube":
      return p.mode === "opposite"
        ? `Która ścianka znajdzie się naprzeciw ścianki ${p.front}?`
        : `Po złożeniu ścianka ${p.front} jest z przodu, a ${p.up} na górze. Która jest po prawej? Oznaczenia oglądamy od zewnątrz kostki.`;
    case "select":
      return "Wskaż wszystkie i tylko te karty, których odwrócenie jest konieczne. Reguła nie mówi, że zależność działa również w drugą stronę.";
    case "truth":
      return `Dokładnie ${p.trueCount} z czterech zdań jest prawdziwe. Pozostałe są fałszywe. Nie chodzi o to, kto jest zwykle szczery — oceniasz wyłącznie te cztery zdania.`;
    case "balance":
      return "Wszystkie podane masy dotyczą pełnych skrzyń. Jednostką odpowiedzi jest kilogram.";
    case "nonogram":
      return "Liczby podają długości kolejnych grup pełnych pól, od lewej do prawej oraz od góry do dołu. Między grupami musi być przynajmniej jedno puste pole. Klikaj: pełne → × → puste. Prawy przycisk myszy wstawia ×. Krzyżyki są notatkami, nie trzeba ich stawiać we wszystkich pustych polach.";
    case "lights":
      return "Dotknięte pole oraz istniejący sąsiedzi u góry, na dole, z lewej i z prawej zamieniają stan na przeciwny. Pola nie łączą się przez krawędzie tablicy. Wygasz wszystkie runy. Dowolne poprawne rozwiązanie jest akceptowane.";
  }
}
export function hints(p) {
  switch (p.type) {
    case "code":
      return [
        "Szukaj cyfr, które występują w kilku próbach. Każda próba ogranicza jednocześnie skład kodu i pozycje cyfr.",
        `Pierwsza cyfra kodu to ${p.secret[0]}. Pamiętaj, że cyfry nie mogą się powtarzać.`,
      ];
    case "matrix":
      return [
        "Porównaj punkt po punkcie dwa pierwsze obrazy z wynikiem. Sprawdź, co dzieje się z punktem obecnym w obu składnikach.",
        `Pierwszy obraz w każdym wierszu jest obracany o ${p.rotation * 90}°. Następnie ${p.operation === "xor" ? "punkty obecne w obu składnikach znikają, a pozostałe zostają" : p.operation === "and" ? "zostają wyłącznie punkty obecne w obu składnikach" : "zostają wszystkie punkty obecne w co najmniej jednym składniku"}.`,
      ];
    case "grid":
      return [
        "Zacznij od ograniczeń skrajnych miejsc lub sąsiedztwa. Po każdym potwierdzeniu wyklucz pozostałe miejsca w jego wierszu i kolumnie.",
        `Na pierwszym miejscu znajduje się ${p.items[p.solution[0]]}.`,
      ];
    case "cipher":
      return [
        p.method === "affine"
          ? "Między A a B jest jeden krok. Między I a N jest pięć: to ujawnia mnożnik."
          : p.method === "alternating"
            ? "Porównuj osobno pozycje nieparzyste i parzyste. W obu przykładach działają te same dwa przesunięcia."
            : p.method === "vigenere"
              ? "Podpisz pod szyfrogramem kolejne litery powtarzanego klucza LUNA. Odejmujesz klucz, nie dodajesz."
              : "Porównaj pierwszą literę przykładu z jej odpowiednikiem. Każda litera przesuwa się o tyle samo.",
        `Odczyt zaczyna się od „${p.plain.slice(0, 2)}”. ${p.explanation}`,
      ];
    case "cube":
      return [
        "Zacznij od dowolnej ścianki i wyobraź sobie jej czterech sąsiadów zagiętych do góry. Ścianki przeciwległe nigdy nie dzielą krawędzi w gotowej kostce.",
        `Możesz wyciąć taką siatkę z papieru. Z podanych odpowiedzi odpada ścianka ${p.options.find((x) => x !== p.answer)}.`,
      ];
    case "select":
      return [
        "Szukaj wyłącznie sytuacji, która obaliłaby regułę: spełniona przesłanka i niespełniony wniosek.",
        `Na pewno potrzebna jest karta „${p.cards.find((c) => c.role === "A").label}”. Drugą znajdziesz, szukając widocznego zaprzeczenia wniosku.`,
      ];
    case "truth":
      return [
        "Dwa zdania są wzajemnymi zaprzeczeniami. Dokładnie jedno z tej pary musi być prawdziwe.",
        `Zdania ${p.claims[0].speaker} i ${p.claims[2].speaker} wyczerpują całą dozwoloną liczbę prawdziwych zdań. Pozostałe dwa muszą więc być fałszywe.`,
      ];
    case "balance":
      return [
        "Dodaj trzy wyniki ważenia. Każda z trzech skrzyń pojawi się w sumie dokładnie dwa razy.",
        "Suma mas A, B i C to 30 kg. Skoro B + C = 23 kg, skrzynia A waży 7 kg.",
      ];
    case "nonogram": {
      const r = p.rows
        .map((row, i) => ({
          i,
          min: row.reduce((a, b) => a + b, 0) + Math.max(0, row.length - 1),
        }))
        .sort((a, b) => b.min - a.min)[0].i;
      return [
        `Przyjrzyj się wierszowi ${r + 1}: grupy ${p.rows[r].join(", ")} muszą zmieścić się na ${p.n} polach. Uwzględnij obowiązkowe przerwy i nakładanie skrajnych ustawień.`,
        `W wierszu ${r + 1} pełne są pola: ${p.solution
          .slice(r * p.n, r * p.n + p.n)
          .map((v, i) => (v ? i + 1 : null))
          .filter(Boolean)
          .join(", ")}. Pozostałe pola tego wiersza są puste.`,
      ];
    }
    case "lights": {
      const first = lightMoves(p.optimal, p.n)[0];
      return [
        "Dwukrotne dotknięcie tego samego pola się znosi. Kolejność przełączeń nie wpływa na wynik, więc każde pole wystarczy rozważyć raz.",
        `Od planszy początkowej istnieje rozwiązanie w ${p.minimum} przełączeniach. Jedno z najkrótszych zaczyna się od pola: wiersz ${Math.floor(first / p.n) + 1}, kolumna ${(first % p.n) + 1}. Ta wskazówka odnosi się do planszy początkowej.`,
      ];
    }
  }
}
export function answerLabel(p) {
  switch (p.type) {
    case "matrix":
      return `wariant ${"ABCD"[p.options.indexOf(p.answer)]}`;
    case "grid":
      return p.solution.map((i) => p.items[i]).join(" → ");
    case "select":
      return p.cards
        .filter((c) => c.role === "A" || c.role === "notB")
        .map((c) => c.label)
        .join(" oraz ");
    case "cube":
      return `ścianka ${p.answer}`;
    case "truth":
      return p.people[p.answer];
    case "balance":
      return p.answer + " kg";
    case "nonogram":
      return "obraz pieczęci";
    case "lights":
      return `${p.minimum} przełączeń wystarczy od początku`;
    default:
      return String(expected(p));
  }
}
export function explanation(p) {
  switch (p.type) {
    case "code": {
      let left = allCodes(p.length);
      const steps = p.clues.map((c, i) => {
        left = left.filter((code) => {
          const x = codeFeedback(code, c.guess);
          return x.exact === c.exact && x.misplaced === c.misplaced;
        });
        return `Po uwzględnieniu prób 1–${i + 1} pozostaje ${left.length} ${left.length === 1 ? "możliwość" : "możliwości"}.`;
      });
      return [
        "Rozważamy wyłącznie kody o różnych cyfrach, również te zaczynające się od zera. Każda kolejna próba usuwa wszystkie kody, które nie dają dokładnie zapisanej pary wyników.",
        ...steps,
        `Jedyny pozostały kod: ${p.secret}. Możesz sprawdzić go osobno w każdym wierszu.`,
      ];
    }
    case "matrix":
      return [
        `W każdym wierszu pierwszy obraz obrócono o ${p.rotation * 90}° zgodnie z zegarem.`,
        p.operation === "xor"
          ? "Potem wykonano różnicę symetryczną: punkt zostaje wtedy i tylko wtedy, gdy występował w dokładnie jednym z dwóch składników."
          : p.operation === "or"
            ? "Potem połączono oba zbiory punktów: wystarczy, że punkt występuje w którymkolwiek składniku."
            : "Potem wybrano część wspólną: punkt musi być obecny w obu składnikach.",
        `Tę samą operację stosujemy do dwóch obrazów w ostatnim wierszu. Otrzymujemy ${answerLabel(p)}.`,
      ];
    case "grid":
      return [
        `Kolejność od lewej: ${answerLabel(p)}.`,
        ...p.clues.map((c) => `Spełnione: ${c.text}`),
        "Po uwzględnieniu wszystkich warunków nie istnieje druga poprawna kolejność. Wykluczenia w kratkach służą notowaniu; sprawdzamy potwierdzoną kolejność.",
      ];
    case "cipher":
      return [
        p.explanation,
        `Szyfrogram ${p.cipher} odczytujemy jako ${p.plain}.`,
      ];
    case "cube":
      return p.mode === "opposite"
        ? [
            `Po złożeniu ścianki ${p.front} i ${p.answer} mają przeciwne kierunki na zewnątrz kostki. Nie dzielą więc krawędzi.`,
            `Naprzeciw ${p.front} znajduje się ${p.answer}.`,
          ]
        : [
            `Ustaw ściankę ${p.front} z przodu, a ${p.up} u góry. Zachowujemy orientację przestrzenną — odbicie lustrzane dałoby inną odpowiedź.`,
            `W tym ustawieniu prawa ściana ma oznaczenie ${p.answer}.`,
          ];
    case "select":
      return [
        `Konieczne są karty: ${answerLabel(p)}.`,
        `„${p.cards.find((c) => c.role === "A").label}” sprawdza, czy przy spełnionej przesłance na pewno zachodzi wniosek.`,
        `„${p.cards.find((c) => c.role === "notB").label}” sprawdza, czy brak wniosku nie ukrywa spełnionej przesłanki po drugiej stronie.`,
        "Pozostałe dwie karty nie mogą ujawnić naruszenia tej reguły. Z warunku „jeżeli P, to Q” nie wynika „jeżeli Q, to P”.",
      ];
    case "truth":
      return [
        "Zdania Ami i Makoto są wzajemnymi zaprzeczeniami, więc dokładnie jedno z nich jest prawdziwe. To wyczerpuje limit jednego prawdziwego zdania.",
        "Zdanie Rei musi być fałszywe. Skoro „to nie Minako” jest fałszywe, księgę przełożyła Minako.",
        "Wtedy zdanie Minako o Ami również jest fałszywe. Wszystkie warunki są spełnione.",
      ];
    case "balance":
      return [
        "17 + 23 + 20 = 60 kg to podwójna masa A + B + C. Zatem A + B + C = 30 kg.",
        "A = 30 − 23 = 7 kg, B = 30 − 20 = 10 kg, C = 30 − 17 = 13 kg.",
        "Dwie skrzynie C minus jedna A: 2 × 13 − 7 = 19 kg.",
      ];
    case "nonogram":
      return [
        "Pełny obraz pokazujemy poniżej. W każdym wierszu i w każdej kolumnie długości grup zgadzają się z liczbami przy brzegu.",
        "Przerwy między grupami zawierają co najmniej jedno puste pole. Dla tego zestawu wskazówek istnieje dokładnie jeden obraz.",
      ];
    case "lights":
      return [
        `Od planszy początkowej jedno z najkrótszych rozwiązań zawiera ${p.minimum} przełączeń.`,
        `Przełącz pola: ${lightMoves(p.optimal, p.n)
          .map((i) => `(${Math.floor(i / p.n) + 1}, ${(i % p.n) + 1})`)
          .join(", ")}. Współrzędne to (wiersz, kolumna).`,
        "Kolejność jest dowolna. Każde pole działa jak przełącznik: dwukrotne użycie go usuwa jego wpływ. Inne rozwiązania też są poprawne, jeśli wygaszają cały układ.",
      ];
  }
}
