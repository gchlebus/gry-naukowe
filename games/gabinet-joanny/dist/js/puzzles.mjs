// Generated deterministically by npm run generate. Edit scripts/puzzle-source.mjs.
export const CHAPTERS = [
  {
    "id": "snape",
    "roman": "I",
    "title": "Gabinet Snape’a",
    "subtitle": "Eliksiry, dyscyplina i nieoczywiste wnioski.",
    "world": "Harry Potter",
    "icon": "flask",
    "color": "#42665b"
  },
  {
    "id": "moon",
    "roman": "II",
    "title": "Archiwum Księżyca",
    "subtitle": "Matryce, konstelacje i światło ukryte w regułach.",
    "world": "Czarodziejka z Księżyca",
    "icon": "moon",
    "color": "#8d7ea4"
  },
  {
    "id": "pig",
    "roman": "III",
    "title": "Misja Super Pig",
    "subtitle": "Odwaga jest cenna. Dobra dedukcja także.",
    "world": "Super Pig",
    "icon": "pig",
    "color": "#bc8594"
  },
  {
    "id": "potato",
    "roman": "IV",
    "title": "Sprawa wielkiej bulwy",
    "subtitle": "Kartofle. Tajemnice. Nadzwyczaj poważne akta.",
    "world": "Kolekcja osobista",
    "icon": "potato",
    "color": "#a48b61"
  }
];

export const TYPES = {
  "code": "Zamek szyfrowy",
  "matrix": "Matryca",
  "grid": "Dedukcja",
  "cipher": "Szyfr",
  "cube": "Wyobraźnia przestrzenna",
  "select": "Logika warunkowa",
  "nonogram": "Nonogram",
  "lights": "Układ przełączeń",
  "truth": "Zdania i prawda",
  "balance": "Równowaga"
};

export const PUZZLES = [
  {
    "chapter": "snape",
    "id": "s-code",
    "title": "Szafka z podwójnym dnem",
    "type": "code",
    "difficulty": 1,
    "length": 3,
    "secret": "407",
    "clues": [
      {
        "guess": "517",
        "exact": 1,
        "misplaced": 0
      },
      {
        "guess": "203",
        "exact": 1,
        "misplaced": 0
      },
      {
        "guess": "156",
        "exact": 0,
        "misplaced": 0
      },
      {
        "guess": "482",
        "exact": 1,
        "misplaced": 0
      }
    ],
    "story": "Na biurku profesora leży zapis prób otwarcia szafki. Odtwórz kod, zanim wróci z pracowni.",
    "number": 1,
    "estimate": "4–8 min"
  },
  {
    "chapter": "snape",
    "id": "s-matrix",
    "title": "Osad w retorcie",
    "type": "matrix",
    "difficulty": 1,
    "rows": [
      [
        124,
        326,
        314
      ],
      [
        46,
        114,
        92
      ],
      [
        195,
        428,
        367
      ]
    ],
    "operation": "xor",
    "rotation": 0,
    "answer": 367,
    "options": [
      414,
      195,
      70,
      367
    ],
    "story": "Snape zostawił dziewięć szkiców osadu. Ostatnia próbka została wyczyszczona. Który obraz pasuje do pustego pola?",
    "number": 2,
    "estimate": "4–8 min"
  },
  {
    "chapter": "snape",
    "id": "s-grid",
    "title": "Pięć fiolek przed północą",
    "type": "grid",
    "difficulty": 2,
    "items": [
      "Opal",
      "Onyks",
      "Ametyst",
      "Nefryt",
      "Rubin"
    ],
    "solution": [
      3,
      1,
      4,
      0,
      2
    ],
    "clues": [
      {
        "kind": "before",
        "a": 3,
        "b": 0,
        "text": "Element „Nefryt” jest na lewo od „Opal”, ale niekoniecznie obok."
      },
      {
        "kind": "before",
        "a": 1,
        "b": 4,
        "text": "Element „Onyks” jest na lewo od „Rubin”, ale niekoniecznie obok."
      },
      {
        "kind": "edge",
        "a": 3,
        "text": "Element „Nefryt” zajmuje jedno z dwóch skrajnych miejsc."
      },
      {
        "kind": "next",
        "a": 1,
        "b": 4,
        "text": "Element „Onyks” jest bezpośrednio na lewo od „Rubin”."
      },
      {
        "kind": "before",
        "a": 0,
        "b": 2,
        "text": "Element „Opal” jest na lewo od „Ametyst”, ale niekoniecznie obok."
      },
      {
        "kind": "before",
        "a": 1,
        "b": 0,
        "text": "Element „Onyks” jest na lewo od „Opal”, ale niekoniecznie obok."
      }
    ],
    "story": "Pięć fiolek stoi w jednym rzędzie. Etykiety odpadły, ale notatki profesora pozwalają odtworzyć kolejność.",
    "number": 3,
    "estimate": "8–15 min"
  },
  {
    "chapter": "snape",
    "id": "s-cipher",
    "title": "Margines profesora",
    "type": "cipher",
    "difficulty": 1,
    "method": "caesar",
    "key": 7,
    "plain": "PATRONUS",
    "cipher": "WHAYVUBZ",
    "example": "DOM → KVT",
    "explanation": "Każdą literę przesunięto o 7 miejsc do przodu. Aby odczytać wiadomość, cofnij ją o 7, zawijając koniec alfabetu.",
    "story": "Krótka wiadomość na marginesie księgi została zaszyfrowana tą samą regułą co przykład. Odczytaj ją.",
    "number": 4,
    "estimate": "4–8 min"
  },
  {
    "chapter": "snape",
    "id": "s-cube",
    "title": "Złożona pieczęć",
    "type": "cube",
    "difficulty": 2,
    "net": [
      {
        "id": "A",
        "x": 1,
        "y": 0
      },
      {
        "id": "B",
        "x": 0,
        "y": 1
      },
      {
        "id": "C",
        "x": 1,
        "y": 1
      },
      {
        "id": "D",
        "x": 2,
        "y": 1
      },
      {
        "id": "E",
        "x": 1,
        "y": 2
      },
      {
        "id": "F",
        "x": 1,
        "y": 3
      }
    ],
    "mode": "opposite",
    "front": "B",
    "up": null,
    "answer": "D",
    "options": [
      "A",
      "C",
      "D",
      "E"
    ],
    "story": "Papierową pieczęć należy złożyć w sześcian. Wszystkie oznaczenia są na zewnętrznych stronach.",
    "number": 5,
    "estimate": "8–15 min"
  },
  {
    "chapter": "snape",
    "id": "s-select",
    "title": "Warunek konieczny",
    "type": "select",
    "difficulty": 2,
    "rule": "Jeżeli na stronie fiolki jest trójkąt, to po drugiej stronie widnieje liczba nieparzysta.",
    "cards": [
      {
        "id": "0",
        "label": "Trójkąt",
        "icon": "triangle",
        "role": "A"
      },
      {
        "id": "1",
        "label": "Koło",
        "icon": "circle",
        "role": "notA"
      },
      {
        "id": "2",
        "label": "7",
        "role": "B"
      },
      {
        "id": "3",
        "label": "4",
        "role": "notB"
      }
    ],
    "story": "Każda karta przedstawia jedną fiolkę: z jednej strony ma symbol, a z drugiej liczbę. Które karty trzeba odwrócić, żeby na pewno sprawdzić regułę?",
    "number": 6,
    "estimate": "8–15 min"
  },
  {
    "chapter": "snape",
    "id": "s-nonogram",
    "title": "Kraty w pracowni",
    "type": "nonogram",
    "difficulty": 2,
    "n": 7,
    "solution": [
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      0,
      0
    ],
    "rows": [
      [
        3
      ],
      [
        1,
        1
      ],
      [
        1,
        1
      ],
      [
        7
      ],
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ],
      [
        3
      ]
    ],
    "cols": [
      [
        3
      ],
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ],
      [
        1,
        4
      ],
      [
        1,
        1,
        1
      ],
      [
        1,
        1,
        1
      ],
      [
        3
      ]
    ],
    "story": "Na żelaznej kracie zakodowano pieczęć dostępu. Liczby przy wierszach i kolumnach opisują grupy zamalowanych pól.",
    "number": 7,
    "estimate": "8–15 min"
  },
  {
    "chapter": "snape",
    "id": "s-lights",
    "title": "Ostatnia iskra",
    "type": "lights",
    "difficulty": 3,
    "n": 4,
    "start": 58259,
    "optimal": 7472,
    "minimum": 6,
    "story": "Profesor chce, aby po wyjściu wszystkie runy były wygaszone. Każde dotknięcie zmienia wybraną runę oraz jej sąsiadów w pionie i poziomie.",
    "number": 8,
    "estimate": "12–25 min"
  },
  {
    "chapter": "moon",
    "id": "m-code",
    "title": "Szkatułka Luny",
    "type": "code",
    "difficulty": 3,
    "length": 4,
    "secret": "0816",
    "clues": [
      {
        "guess": "2603",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "0264",
        "exact": 1,
        "misplaced": 1
      },
      {
        "guess": "0154",
        "exact": 1,
        "misplaced": 1
      },
      {
        "guess": "6398",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "7102",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "1482",
        "exact": 0,
        "misplaced": 2
      }
    ],
    "story": "W księżycowym archiwum znaleziono szkatułkę. Zero może wystąpić na początku kodu, a żadna cyfra się nie powtarza.",
    "number": 9,
    "estimate": "12–25 min"
  },
  {
    "chapter": "moon",
    "id": "m-matrix",
    "title": "Konstelacja bez nazwy",
    "type": "matrix",
    "difficulty": 3,
    "rows": [
      [
        133,
        322,
        78
      ],
      [
        111,
        435,
        20
      ],
      [
        360,
        376,
        443
      ]
    ],
    "operation": "xor",
    "rotation": 1,
    "answer": 443,
    "options": [
      396,
      354,
      267,
      443
    ],
    "story": "Trzy rzędy obserwacji opisują tę samą operację na konstelacjach. Jeden ze składników może być obrócony o ćwierć obrotu.",
    "number": 10,
    "estimate": "12–25 min"
  },
  {
    "chapter": "moon",
    "id": "m-grid",
    "title": "Rada pięciu planet",
    "type": "grid",
    "difficulty": 2,
    "items": [
      "Księżyc",
      "Merkury",
      "Mars",
      "Jowisz",
      "Wenus"
    ],
    "solution": [
      2,
      4,
      1,
      3,
      0
    ],
    "clues": [
      {
        "kind": "before",
        "a": 2,
        "b": 0,
        "text": "Element „Mars” jest na lewo od „Księżyc”, ale niekoniecznie obok."
      },
      {
        "kind": "edge",
        "a": 0,
        "text": "Element „Księżyc” zajmuje jedno z dwóch skrajnych miejsc."
      },
      {
        "kind": "before",
        "a": 2,
        "b": 4,
        "text": "Element „Mars” jest na lewo od „Wenus”, ale niekoniecznie obok."
      },
      {
        "kind": "notnext",
        "a": 2,
        "b": 3,
        "text": "„Mars” i „Jowisz” nie sąsiadują ze sobą."
      },
      {
        "kind": "notpos",
        "a": 1,
        "n": 1,
        "text": "Element „Merkury” nie zajmuje miejsca 2."
      },
      {
        "kind": "distance",
        "a": 2,
        "b": 1,
        "n": 2,
        "text": "Odległość między „Mars” a „Merkury” wynosi 2 pozycje (różnica numerów miejsc)."
      }
    ],
    "story": "Pięć ksiąg związanych z Czarodziejką z Księżyca trzeba odłożyć na pięć miejsc. Do rozwiązania wystarczą poniższe notatki.",
    "number": 11,
    "estimate": "8–15 min"
  },
  {
    "chapter": "moon",
    "id": "m-cipher",
    "title": "List w srebrnej kopercie",
    "type": "cipher",
    "difficulty": 2,
    "method": "vigenere",
    "key": "LUNA",
    "plain": "KSIEZYC",
    "cipher": "VMVEKSP",
    "example": "Klucz: LUNA. A=0, B=1, …, Z=25.",
    "explanation": "Zapisz pod szyfrogramem powtarzany klucz LUNALUN. Od każdej litery odejmij wartość litery klucza, modulo 26.",
    "story": "W tym szyfrze do kolejnych liter dodawano wartości powtarzanego klucza LUNA. Odtwórz słowo sprzed szyfrowania.",
    "number": 12,
    "estimate": "8–15 min"
  },
  {
    "chapter": "moon",
    "id": "m-cube",
    "title": "Sześć stron srebrnej kostki",
    "type": "cube",
    "difficulty": 3,
    "net": [
      {
        "id": "A",
        "x": 0,
        "y": 1
      },
      {
        "id": "B",
        "x": 1,
        "y": 1
      },
      {
        "id": "C",
        "x": 2,
        "y": 1
      },
      {
        "id": "D",
        "x": 3,
        "y": 1
      },
      {
        "id": "E",
        "x": 1,
        "y": 0
      },
      {
        "id": "F",
        "x": 1,
        "y": 2
      }
    ],
    "mode": "right",
    "front": "B",
    "up": "E",
    "answer": "C",
    "options": [
      "A",
      "C",
      "D",
      "F"
    ],
    "story": "Złóż w myślach siatkę. Potem obróć całą kostkę zgodnie z podanym ustawieniem. Nie wolno jej odbijać w lustrze.",
    "number": 13,
    "estimate": "12–25 min"
  },
  {
    "chapter": "moon",
    "id": "m-select",
    "title": "Jedna prawdziwa notatka",
    "type": "truth",
    "difficulty": 2,
    "people": [
      "Ami",
      "Rei",
      "Makoto",
      "Minako"
    ],
    "claims": [
      {
        "speaker": "Ami",
        "target": 1,
        "negative": false,
        "text": "Księgę przełożyła Rei."
      },
      {
        "speaker": "Rei",
        "target": 3,
        "negative": true,
        "text": "Księgi nie przełożyła Minako."
      },
      {
        "speaker": "Makoto",
        "target": 1,
        "negative": true,
        "text": "Księgi nie przełożyła Rei."
      },
      {
        "speaker": "Minako",
        "target": 0,
        "negative": false,
        "text": "Księgę przełożyła Ami."
      }
    ],
    "trueCount": 1,
    "answer": 3,
    "story": "Jedna z czterech osób przełożyła księgę w archiwum. Dokładnie jedno z poniższych zdań jest prawdziwe. Kto przełożył księgę? Nie zakładaj niczego o prawdomówności konkretnych osób.",
    "number": 14,
    "estimate": "8–15 min"
  },
  {
    "chapter": "moon",
    "id": "m-nonogram",
    "title": "Ślad na tarczy Księżyca",
    "type": "nonogram",
    "difficulty": 2,
    "n": 8,
    "solution": [
      0,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      0
    ],
    "rows": [
      [
        3
      ],
      [
        2
      ],
      [
        2
      ],
      [
        2
      ],
      [
        2
      ],
      [
        2
      ],
      [
        3
      ],
      [
        4
      ]
    ],
    "cols": [
      [
        2
      ],
      [
        4
      ],
      [
        2,
        2
      ],
      [
        2,
        2
      ],
      [
        1,
        2
      ],
      [
        1,
        1
      ],
      [
        1
      ],
      []
    ],
    "story": "Wypełnij obraz zapisany na tarczy archiwalnej. Puste pola między grupami są tak samo ważne jak pola zamalowane.",
    "number": 15,
    "estimate": "8–15 min"
  },
  {
    "chapter": "moon",
    "id": "m-lights",
    "title": "Zaćmienie w obserwatorium",
    "type": "lights",
    "difficulty": 2,
    "n": 3,
    "start": 511,
    "optimal": 341,
    "minimum": 5,
    "story": "W obserwatorium pozostały aktywne sygnały. Wygasz całą tablicę, przełączając krzyże złożone z pola i jego sąsiadów.",
    "number": 16,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-code",
    "title": "Depozyt odwagi",
    "type": "code",
    "difficulty": 2,
    "length": 4,
    "secret": "5824",
    "clues": [
      {
        "guess": "2683",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "3928",
        "exact": 1,
        "misplaced": 1
      },
      {
        "guess": "4915",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "9840",
        "exact": 1,
        "misplaced": 1
      },
      {
        "guess": "4927",
        "exact": 1,
        "misplaced": 1
      },
      {
        "guess": "5470",
        "exact": 1,
        "misplaced": 1
      }
    ],
    "story": "Super Pig potrzebuje dostępu do depozytu. Pozostały tylko dokładne wyniki wcześniejszych prób kodu.",
    "number": 17,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-matrix",
    "title": "Radar Super Pig",
    "type": "matrix",
    "difficulty": 2,
    "rows": [
      [
        137,
        320,
        354
      ],
      [
        144,
        340,
        342
      ],
      [
        188,
        96,
        122
      ]
    ],
    "operation": "or",
    "rotation": 2,
    "answer": 122,
    "options": [
      131,
      122,
      434,
      365
    ],
    "story": "Radar łączy odczyty według jednej reguły. Odtwórz brakujący odczyt, uwzględniając możliwy obrót pierwszego składnika.",
    "number": 18,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-grid",
    "title": "Pięć przesyłek specjalnych",
    "type": "grid",
    "difficulty": 2,
    "items": [
      "Perła",
      "Kompas",
      "Peleryna",
      "Okulary",
      "Przekąska"
    ],
    "solution": [
      1,
      4,
      0,
      2,
      3
    ],
    "clues": [
      {
        "kind": "before",
        "a": 0,
        "b": 2,
        "text": "Element „Perła” jest na lewo od „Peleryna”, ale niekoniecznie obok."
      },
      {
        "kind": "next",
        "a": 0,
        "b": 2,
        "text": "Element „Perła” jest bezpośrednio na lewo od „Peleryna”."
      },
      {
        "kind": "distance",
        "a": 0,
        "b": 1,
        "n": 2,
        "text": "Odległość między „Perła” a „Kompas” wynosi 2 pozycje (różnica numerów miejsc)."
      },
      {
        "kind": "notnext",
        "a": 1,
        "b": 3,
        "text": "„Kompas” i „Okulary” nie sąsiadują ze sobą."
      },
      {
        "kind": "before",
        "a": 2,
        "b": 3,
        "text": "Element „Peleryna” jest na lewo od „Okulary”, ale niekoniecznie obok."
      },
      {
        "kind": "before",
        "a": 4,
        "b": 0,
        "text": "Element „Przekąska” jest na lewo od „Perła”, ale niekoniecznie obok."
      }
    ],
    "story": "Przesyłki do tajnej bazy ustawiono w jednym rzędzie. Notatnik kuriera opisuje ich położenie, lecz żadnej paczki nie oznaczono numerem.",
    "number": 19,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-cipher",
    "title": "Nadawca: Super Pig",
    "type": "cipher",
    "difficulty": 2,
    "method": "alternating",
    "key": null,
    "plain": "ODWAGA",
    "cipher": "RBZYJY",
    "example": "ALA → DJD; KOT → NMW.",
    "explanation": "Na pozycjach 1, 3, 5 litery przesunięto o 3 do przodu; na 2, 4, 6 o 2 do tyłu. Przy odczycie stosuj ruchy odwrotne.",
    "story": "Wiadomość korzysta z dwóch naprzemiennych przesunięć alfabetu. Pierwsza litera zawsze korzysta z tej samej reguły co trzecia.",
    "number": 20,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-cube",
    "title": "Pudełko z tajnej bazy",
    "type": "cube",
    "difficulty": 2,
    "net": [
      {
        "id": "A",
        "x": 1,
        "y": 0
      },
      {
        "id": "B",
        "x": 0,
        "y": 1
      },
      {
        "id": "C",
        "x": 1,
        "y": 1
      },
      {
        "id": "D",
        "x": 2,
        "y": 1
      },
      {
        "id": "E",
        "x": 1,
        "y": 2
      },
      {
        "id": "F",
        "x": 1,
        "y": 3
      }
    ],
    "mode": "right",
    "front": "C",
    "up": "A",
    "answer": "D",
    "options": [
      "B",
      "D",
      "E",
      "F"
    ],
    "story": "Sześcienne pudełko ma sześć różnych pieczęci. Przenieś oznaczenia z siatki na właściwe strony pudełka.",
    "number": 21,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-select",
    "title": "Paczki z perłą",
    "type": "select",
    "difficulty": 2,
    "rule": "Jeżeli paczka ma czerwoną pieczęć, to w środku jest perła.",
    "cards": [
      {
        "id": "0",
        "label": "Czerwona pieczęć",
        "icon": "redseal",
        "role": "A"
      },
      {
        "id": "1",
        "label": "Niebieska pieczęć",
        "icon": "blueseal",
        "role": "notA"
      },
      {
        "id": "2",
        "label": "Perła",
        "icon": "pearl",
        "role": "B"
      },
      {
        "id": "3",
        "label": "Kamyk",
        "icon": "stone",
        "role": "notB"
      }
    ],
    "story": "Na kartach widać albo pieczęć paczki, albo jej zawartość. Po drugiej stronie jest brakująca informacja. Które trzeba sprawdzić?",
    "number": 22,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-nonogram",
    "title": "Pieczęć z różowej teczki",
    "type": "nonogram",
    "difficulty": 2,
    "n": 8,
    "solution": [
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      0,
      0
    ],
    "rows": [
      [
        2,
        2
      ],
      [
        3,
        3
      ],
      [
        6
      ],
      [
        6
      ],
      [
        8
      ],
      [
        2,
        2,
        2
      ],
      [
        6
      ],
      [
        4
      ]
    ],
    "cols": [
      [
        2,
        2
      ],
      [
        7
      ],
      [
        4,
        2
      ],
      [
        6
      ],
      [
        6
      ],
      [
        4,
        2
      ],
      [
        7
      ],
      [
        2,
        2
      ]
    ],
    "story": "Dokument z bazy Super Pig ma uszkodzony znak identyfikacyjny. Odtwórz go wyłącznie na podstawie liczb.",
    "number": 23,
    "estimate": "8–15 min"
  },
  {
    "chapter": "pig",
    "id": "p-lights",
    "title": "Dyskretna ewakuacja",
    "type": "lights",
    "difficulty": 3,
    "n": 4,
    "start": 28235,
    "optimal": 1656,
    "minimum": 6,
    "story": "Wyłącz sygnały w bazie. Jedno przełączenie zmienia stan pola i sąsiadów, także tych, które już były wygaszone.",
    "number": 24,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-code",
    "title": "Zamek do piwnicy",
    "type": "code",
    "difficulty": 3,
    "length": 4,
    "secret": "9031",
    "clues": [
      {
        "guess": "6192",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "1407",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "0859",
        "exact": 0,
        "misplaced": 2
      },
      {
        "guess": "4098",
        "exact": 1,
        "misplaced": 1
      },
      {
        "guess": "7624",
        "exact": 0,
        "misplaced": 0
      },
      {
        "guess": "6503",
        "exact": 0,
        "misplaced": 2
      }
    ],
    "story": "Zapas kartofli zabezpieczono czterocyfrowym zamkiem. Ustal kod. To zadanie o wnioskowaniu, nie o sile drzwi.",
    "number": 25,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-matrix",
    "title": "Arkusz bulwologiczny",
    "type": "matrix",
    "difficulty": 3,
    "rows": [
      [
        143,
        177,
        161
      ],
      [
        420,
        397,
        5
      ],
      [
        185,
        316,
        48
      ]
    ],
    "operation": "and",
    "rotation": 3,
    "answer": 48,
    "options": [
      96,
      170,
      499,
      48
    ],
    "story": "Instytut Kartofla bada układy oczek. Dwie pierwsze linie pokazują regułę stosowaną w trzeciej.",
    "number": 26,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-grid",
    "title": "Tajne menu degustacyjne",
    "type": "grid",
    "difficulty": 3,
    "items": [
      "Placki",
      "Gnocchi",
      "Kopytka",
      "Puree",
      "Frytki",
      "Kluski"
    ],
    "solution": [
      3,
      0,
      5,
      1,
      4,
      2
    ],
    "clues": [
      {
        "kind": "before",
        "a": 1,
        "b": 2,
        "text": "Element „Gnocchi” jest na lewo od „Kopytka”, ale niekoniecznie obok."
      },
      {
        "kind": "before",
        "a": 5,
        "b": 4,
        "text": "Element „Kluski” jest na lewo od „Frytki”, ale niekoniecznie obok."
      },
      {
        "kind": "before",
        "a": 3,
        "b": 0,
        "text": "Element „Puree” jest na lewo od „Placki”, ale niekoniecznie obok."
      },
      {
        "kind": "before",
        "a": 0,
        "b": 2,
        "text": "Element „Placki” jest na lewo od „Kopytka”, ale niekoniecznie obok."
      },
      {
        "kind": "next",
        "a": 3,
        "b": 0,
        "text": "Element „Puree” jest bezpośrednio na lewo od „Placki”."
      },
      {
        "kind": "distance",
        "a": 3,
        "b": 5,
        "n": 2,
        "text": "Odległość między „Puree” a „Kluski” wynosi 2 pozycje (różnica numerów miejsc)."
      },
      {
        "kind": "before",
        "a": 0,
        "b": 1,
        "text": "Element „Placki” jest na lewo od „Gnocchi”, ale niekoniecznie obok."
      },
      {
        "kind": "distance",
        "a": 2,
        "b": 5,
        "n": 3,
        "text": "Odległość między „Kopytka” a „Kluski” wynosi 3 pozycje (różnica numerów miejsc)."
      },
      {
        "kind": "distance",
        "a": 5,
        "b": 4,
        "n": 2,
        "text": "Odległość między „Kluski” a „Frytki” wynosi 2 pozycje (różnica numerów miejsc)."
      }
    ],
    "story": "Na sześciu miejscach czeka sześć kartoflanych propozycji. Ustal pełną kolejność degustacji. Tak, to bardzo poważna sprawa.",
    "number": 27,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-cipher",
    "title": "Archiwum Bulwa",
    "type": "cipher",
    "difficulty": 3,
    "method": "affine",
    "key": null,
    "plain": "BULWA",
    "cipher": "NELOI",
    "example": "A → I, B → N, C → S. A=0, …, Z=25.",
    "explanation": "Kodowanie opisuje y = 5x + 8 modulo 26. Odwrotnością liczby 5 modulo 26 jest 21, więc odczyt to x = 21(y − 8) modulo 26.",
    "story": "Każdą literę zamieniono według reguły y = ax + b modulo 26, z tymi samymi a i b. Ustal ją z przykładów i odczytaj hasło.",
    "number": 28,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-cube",
    "title": "Sześcian chłodnej piwnicy",
    "type": "cube",
    "difficulty": 3,
    "net": [
      {
        "id": "A",
        "x": 0,
        "y": 1
      },
      {
        "id": "B",
        "x": 1,
        "y": 1
      },
      {
        "id": "C",
        "x": 2,
        "y": 1
      },
      {
        "id": "D",
        "x": 3,
        "y": 1
      },
      {
        "id": "E",
        "x": 1,
        "y": 0
      },
      {
        "id": "F",
        "x": 1,
        "y": 2
      }
    ],
    "mode": "right",
    "front": "C",
    "up": "F",
    "answer": "B",
    "options": [
      "A",
      "B",
      "D",
      "E"
    ],
    "story": "Nawet skrzynia kartofli może wymagać wyobraźni przestrzennej. Złóż siatkę i ustaw kostkę zgodnie z instrukcją.",
    "number": 29,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-select",
    "title": "Waga sprawiedliwości",
    "type": "balance",
    "difficulty": 1,
    "equations": [
      {
        "a": "A",
        "b": "B",
        "total": 17
      },
      {
        "a": "B",
        "b": "C",
        "total": 23
      },
      {
        "a": "A",
        "b": "C",
        "total": 20
      }
    ],
    "weights": {
      "A": 7,
      "B": 10,
      "C": 13
    },
    "answer": 19,
    "story": "Pełne skrzynie tego samego rodzaju ważą zawsze tyle samo. Zważono trzy pary. O ile kilogramów dwie skrzynie C są cięższe od jednej skrzyni A?",
    "number": 30,
    "estimate": "4–8 min"
  },
  {
    "chapter": "potato",
    "id": "k-nonogram",
    "title": "Podziemny znak jakości",
    "type": "nonogram",
    "difficulty": 3,
    "n": 8,
    "solution": [
      0,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0
    ],
    "rows": [
      [
        4
      ],
      [
        2,
        2
      ],
      [
        1,
        1
      ],
      [
        2,
        2
      ],
      [
        2,
        2
      ],
      [
        5
      ],
      [
        2
      ],
      [
        1
      ]
    ],
    "cols": [
      [
        3
      ],
      [
        2,
        2
      ],
      [
        1,
        2
      ],
      [
        1,
        2
      ],
      [
        2,
        3
      ],
      [
        5
      ],
      [
        3
      ],
      []
    ],
    "story": "W archiwum ziemniaczanej doskonałości przechowuje się jeden ostatni znak. Zamaluj właściwe pola i odtwórz pieczęć.",
    "number": 31,
    "estimate": "12–25 min"
  },
  {
    "chapter": "potato",
    "id": "k-lights",
    "title": "Spokój w piwnicy",
    "type": "lights",
    "difficulty": 3,
    "n": 4,
    "start": 40078,
    "optimal": 2357,
    "minimum": 6,
    "story": "Wszystko policzone. Teraz wygasz runy i zamknij piwnicę. Nagrodą jest porządek we wszechświecie. Oraz kartofle.",
    "number": 32,
    "estimate": "12–25 min"
  }
];

export const PROFESSOR_NOTES = [
  "Dobra hipoteza to dopiero początek. Teraz trzeba ją sprawdzić.",
  "Przypadek bywa użyteczny. Jako podejrzany.",
  "Proszę nie mylić możliwości z koniecznością.",
  "Jeżeli dwa wnioski sobie przeczą, przynajmniej jeden z nich wymaga poprawki.",
  "Pani Joanno, proszę zaufać przesłankom. Mają mniej kaprysów niż składniki eliksiru.",
  "Najbardziej eleganckie rozwiązanie zwykle zostawia po sobie najmniej założeń.",
  "Kartofle nie są sprzeczne z powagą nauki. Zła dedukcja — owszem.",
  "Wynik bez uzasadnienia jest tylko ozdobną liczbą."
];
export const BY_ID = new Map(PUZZLES.map(p => [p.id,p]));
