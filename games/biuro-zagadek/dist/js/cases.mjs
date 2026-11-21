export const folders = [
  {
    id: "roznice", name: "Szukaj różnic", icon: "⌕", tone: "gold",
    summary: "Porównajcie dwa rysunki i zaznaczcie, co się zmieniło.",
    roles: ["Wybierz fragment i opisz, co widzisz.", "Sprawdź ten sam fragment na drugim obrazku."],
    cases: [
      { title: "Zdjęcia z biura", level: "Na rozgrzewkę", scene: "office" },
      { title: "Pocztówka z portu", level: "Krok dalej", scene: "port" },
      { title: "Noc na dachu", level: "Wyzwanie", scene: "roof" },
    ],
  },
  {
    id: "zagadki", name: "Odgaduj zagadki", icon: "?", tone: "rose",
    summary: "Przeczytajcie zagadkę na głos i wpiszcie swoją odpowiedź.",
    roles: ["Przeczytaj zagadkę na głos.", "Zaproponuj odpowiedź i wyjaśnij swój pomysł."],
    cases: [
      {
        title: "Gość na chodniku", level: "Na rozgrzewkę",
        prompt: "W słoneczny dzień idę z tobą po chodniku. Robię to, co ty, choć nie mam ani nóg, ani rąk. Znikam, kiedy gaśnie światło. Kim jestem?",
        answers: ["cień", "mój cień", "twój cień"],
        hint: "Stań na słońcu i pomachaj ręką. Co porusza się razem z tobą na ziemi?",
        explanation: "To cień. Twoje ciało zatrzymuje światło, a na chodniku widać jego kształt.",
      },
      {
        title: "Wiadomość ze wzgórza", level: "Krok dalej",
        prompt: "Powtarzam twoje słowa, chociaż nie mam ust. Łatwiej mnie usłyszeć w górach albo w pustej hali. Kim jestem?",
        answers: ["echo", "odgłos echa"],
        hint: "Zawołaj w wyobraźni «halo!» w wielkiej jaskini. Co wróci po chwili?",
        explanation: "To echo. Dźwięk odbija się na przykład od skały i wraca do twoich uszu.",
      },
      {
        title: "Dwa kapelusze za mało?", level: "Wyzwanie",
        prompt: "Do biura weszły dwie mamy i dwie córki. Każda osoba miała jeden kapelusz. W sumie były trzy kapelusze. Ile osób weszło do biura?",
        answers: ["trzy", "trzy osoby", "3", "3 osoby"],
        hint: "Czy ta sama osoba może być jednocześnie mamą i córką?",
        explanation: "Weszły trzy osoby. Babcia jest mamą, wnuczka jest córką, a środkowa osoba jest i mamą, i córką.",
      },
    ],
  },
  {
    id: "sudoku", name: "Ułóż sudoku", icon: "⊞", tone: "mint",
    summary: "Wypełnijcie kwadraty od miniaturowego 4 × 4 po klasyczne 9 × 9.",
    roles: ["Wybierz pole i skreśl w myślach liczby z jego wiersza i kolumny.", "Sprawdź blok i powiedz, która liczba jeszcze pasuje."],
    cases: [
      { title: "Miniaturowe akta", level: "4 × 4", rows: ["1004", "0402", "2040", "4001"], box: [2, 2] },
      { title: "Szafka z sześcioma szufladami", level: "6 × 6", rows: ["100406", "050020", "034060", "060234", "040012", "610305"], box: [2, 3] },
      { title: "Kwadrat szefa biura", level: "9 × 9", rows: ["530070000", "600195000", "098000060", "800060003", "400803001", "700020006", "060000280", "000419005", "000080079"], box: [3, 3] },
    ],
  },
  {
    id: "dedukcja", name: "Połącz poszlaki", icon: "≡", tone: "lilac",
    summary: "Z zeznań świadków ustalcie, kto co zabrał albo gdzie był.",
    roles: ["Czytaj jedną poszlakę naraz.", "Zaznacz w tabeli, co pasuje, a co można wykluczyć."],
    cases: [
      {
        title: "Kto ma klucz?", level: "Na rozgrzewkę",
        prompt: "Frania, Fistaszek i Pikuś wzięli po jednej rzeczy. Przypisz każdemu jego przedmiot.",
        people: ["Frania", "Fistaszek", "Pikuś"], objects: ["Klucz", "Lupa", "Mapa"], solution: [2, 0, 1],
        clues: ["Frania wzięła mapę.", "Fistaszek nie ma lupy."],
        hint: "Zaznacz mapę przy Frani i skreśl tę kolumnę u pozostałych.",
        explanation: "Po mapie dla Frani zostają klucz i lupa. Fistaszek nie ma lupy, więc ma klucz. Lupa należy do Pikusia.",
      },
      {
        title: "Przystanki kurierów", level: "Krok dalej",
        prompt: "Każdy kurier odwiedził inne miejsce. Odtwórzcie ich trasy ze wskazówek.",
        people: ["Frania", "Fistaszek", "Pikuś"], objects: ["Port", "Kino", "Park"], solution: [1, 0, 2],
        clues: ["Frania nie była w porcie.", "Pikuś nie był w kinie ani w porcie.", "Fistaszek nie był w kinie."],
        hint: "Które z trzech miejsc zostaje Pikusiowi po przeczytaniu drugiej poszlaki?",
        explanation: "Pikuś był w parku. Frania nie była w porcie, więc była w kinie. Port zostaje Fistaszkowi.",
      },
      {
        title: "Paczki na bal", level: "Wyzwanie",
        prompt: "Czworo gości przyniosło po jednym innym przedmiocie. Dopasujcie przedmioty do gości.",
        people: ["Frania", "Fistaszek", "Pikuś", "Rózia"], objects: ["Maska", "Trąbka", "Wstążka", "Balon"], solution: [2, 3, 1, 0],
        clues: ["Pikuś zabrał przedmiot, który wydaje dźwięk.", "Frania nie miała maski ani balonu.", "Rózia nie przyniosła balonu."],
        hint: "Najpierw znajdź instrument. Które dwa przedmioty odpadają potem u Frani?",
        explanation: "Pikuś miał trąbkę. Frani zostaje wstążka. Rózia nie miała balonu, więc miała maskę, a Fistaszek przyniósł balon.",
      },
    ],
  },
  {
    id: "szyfry", name: "Złam szyfr", icon: "#", tone: "gold",
    summary: "Odczytajcie zakodowane wiadomości i znajdźcie hasło.",
    roles: ["Odczytuj po jednym znaku tajnej wiadomości.", "Znajdź jego odpowiednik w kluczu i wpisz hasło."],
    cases: [
      {
        title: "Kartka z pieczątkami", level: "Na rozgrzewkę",
        prompt: "Każdy symbol odpowiada jednej literze. Użyj klucza i przeczytaj wiadomość.",
        code: "● ◆ ▲ ◆", key: [["▲", "P"], ["●", "M"], ["◆", "A"], ["■", "K"]],
        answers: ["mapa"], hint: "Pierwsza pieczątka to kółko. W kluczu kółko oznacza M.",
        explanation: "Kółko, romb, trójkąt i romb dają kolejno M, A, P i A. Hasło to MAPA.",
      },
      {
        title: "Telegram z kina", level: "Krok dalej",
        prompt: "W tym telegramie liczby wskazują miejsca liter w podanym alfabecie. Odczytajcie słowo.",
        code: "11  9  14  15", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        answers: ["kino"], hint: "Litera na miejscu 11 to K. Znajdź teraz literę numer 9.",
        explanation: "Litery na miejscach 11, 9, 14 i 15 to K, I, N i O.",
      },
      {
        title: "Przesunięte litery", level: "Wyzwanie",
        prompt: "Każda litera hasła została zastąpiona następną w alfabecie. Cofnijcie każdą literę o jedno miejsce. Przed A stoi Z.",
        code: " A B H B E L B ", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        answers: ["zagadka"], hint: "Cofając A otrzymasz Z. Następna litera, B, zamienia się w A.",
        explanation: "Po cofnięciu każdej litery o jedno miejsce wychodzi ZAGADKA.",
      },
    ],
  },
  {
    id: "sekwencje", name: "Dokończ wzór", icon: "◇", tone: "rose",
    summary: "Rozpoznajcie zasadę i wybierzcie kolejny element.",
    roles: ["Powiedz, jaki fragment się powtarza lub co się zmienia.", "Sprawdź zasadę od początku i wybierz kolejny element."],
    cases: [
      {
        title: "Ślady na podłodze", level: "Na rozgrzewkę",
        prompt: "Jaki ślad będzie następny, jeśli układ dalej się powtarza?",
        sequence: ["★", "●", "●", "★", "●", "●"], options: ["●", "▲", "★"], answer: "★",
        hint: "Podziel ślady na dwie grupy po trzy.",
        explanation: "Powtarza się gwiazda i po niej dwa kółka. Kolejną trójkę zaczyna gwiazda.",
      },
      {
        title: "Numery skrytek", level: "Krok dalej",
        prompt: "Frania dopisuje kolejne numery według jednej zasady. Który będzie następny?",
        sequence: ["2", "4", "7", "11", "16"], options: ["20", "21", "22", "24"], answer: "22",
        hint: "Sprawdź, ile wynoszą kolejne skoki między liczbami. Pierwszy skok to +2.",
        explanation: "Skoki to kolejno +2, +3, +4 i +5. Następny skok to +6, a 16 + 6 = 22.",
      },
      {
        title: "Lampiony na moście", level: "Wyzwanie",
        prompt: "Na moście przeplatają się dwa wzory. Co będzie na następnym miejscu?",
        sequence: ["▲", "1", "●", "2", "▲", "3", "●"], options: ["▲", "2", "4", "●"], answer: "4",
        hint: "Odczytaj same liczby, pomijając figury. Jaka liczba powinna być po 3?",
        explanation: "Na miejscach nieparzystych są na przemian trójkąty i kółka. Na parzystych rosną liczby: 1, 2, 3, 4.",
      },
    ],
  },
];

export function normalizeAnswer(value) {
  return value.toLocaleLowerCase("pl")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ł", "l")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}
