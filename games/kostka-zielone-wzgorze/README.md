# Kostka z Zielonego Wzgórza

Polska gra dla dziecka od około 7 lat i rodzica: pomaga ułożyć **własną, fizyczną kostkę 3×3**. Rudowłosa Ania, kwitnący sad, oryginalny spokojny walczyk i rozkwitający ogród za każdy sprawdzony etap. Bez wyścigu na czas.

[Otwórz grę](https://kostka-zielone-wzgorze.gchlebus.chatgpt.site) · [Zasoby i ich pochodzenie](ASSETS.md)

## Jak się bawić

1. Przygotuj zwykłą kostkę 3×3 w sześciu kolorach: białym, żółtym, zielonym, niebieskim, czerwonym i pomarańczowym. Biały i żółty muszą być naprzeciw siebie. Nie potrzeba robota ani inteligentnej kostki.
2. Otwórz **Poznaj ruchy**: obejrzyj sześć ścianek, ćwierć obrotu, ruch odwrotny (apostrof) i pół obrotu (2). Każdy pokaz zaczyna się od ułożonej kostki. Ćwicząc w dłoniach, wykonaj ruch i jego odwrotność przed następnym pokazem.
3. Wybierz **Ułóżmy moją kostkę**. Trzymaj żółty środek u góry, biały na dole. W ustawieniach środków dopasuj cztery pozostałe kolory do swojej kostki. Zmiana środka czyści wpisywane pola.
4. Przepisz 48 ruchomych pól; sześć środków jest stałych. Patrz prosto na każdą przepisywaną ściankę, ze wskazanym sąsiadem przy jej górnej krawędzi. Dla góry jest to tył, dla dołu przód, dla boków góra. Pomoc rodzica przy pierwszym wpisywaniu jest wskazana.
5. Gra sprawdzi liczbę pól, komplet klocków, orientacje i parzystość układu. Dopiero dla możliwej fizycznie kostki obliczy osiem etapów.
6. **Zobacz ruch** odtwarza animację, nie zalicza obrotu. Patrz prosto na wskazaną ściankę jak na zegar. Obróć tylko tę warstwę prawdziwej kostki, po czym kliknij **Zrobiłam ruch**. Nie obracaj całej kostki względem początkowych środków. Kamerą modelu można swobodnie oglądać kostkę.
7. Po etapie porównaj cel i pełną siatkę z kostką w dłoniach. **Tak, etap gotowy!** dodaje kwiat oraz delikatny dźwięk i płatki. Ostatni etap świętuje ukończenie całej kostki.
8. **Cofnij ostatni ruch** najpierw podaje odwrotny obrót do wykonania w dłoniach. Gdy układy się rozjadą, można przepisać aktualną kostkę i uzyskać nową ścieżkę.

Wirtualny przykład jest osobno oznaczony — jego kolory nie opisują fizycznej kostki dziecka. Gra nie korzysta z kamery i nie rozpoznaje automatycznie ruchów; dziecko potwierdza rzeczywisty wynik. Po przerwie zachowaj fizyczną kostkę w ostatnim ustawieniu.

Osiem celów: **stokrotka → biały krzyż → białe narożniki → środkowa warstwa → żółty krzyż → żółta góra → miejsca narożników → ostatnie krawędzie**. Wskazówki tłumaczą, jaką część układamy i co sprawdzamy. Sekwencje pośrednio ruszają wcześniejsze warstwy i odtwarzają je na końcu; nie oceniaj etapu w środku sekwencji. Ruchy są dobrane do stanu kostki, a nie do rekordu najmniejszej liczby obrotów. Już ułożona kostka nie jest ponownie mieszana.

## Wymagania

- macOS, Linux lub Windows; Git oraz **Node.js co najmniej 22.13.0 z npm**. Instalację, testy i budowę sprawdzono na **Node 25.9.0**; wersja jest w `.nvmrc`.
- Współczesna przeglądarka z JavaScript i Web Workers. Animacja 3D używa WebGL; siatka kolorów pozostaje dostępna również bez WebGL.
- Internet do pierwszej instalacji pakietów. Gra nie wymaga kluczy API, konta Suno, kamery ani płatnych usług. Hosted Sites może wymagać konta właściciela ChatGPT; lokalne uruchomienie go nie wymaga.
- Utwór i ilustracja są w repozytorium. Google Fonts są opcjonalne; bez sieci działają systemowe fonty zastępcze. Gra nie instaluje service workera, więc adres hostowany wymaga sieci do wczytania.

## Uruchomienie lokalne

Z nowego katalogu:

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/kostka-zielone-wzgorze
npm ci
npm run dev
```

Jeżeli repozytorium już masz, wejdź do `games/kostka-zielone-wzgorze`, wykonaj `npm ci` i `npm run dev`.

Otwórz **http://localhost:5173** lub adres `Local` wypisany w terminalu. Przy zajętym porcie:

```bash
npm run dev -- --port 5177
```

Wtedy otwórz **http://localhost:5177**. Zatrzymanie serwera: **Ctrl+C** w terminalu. Każda gra ma własne zależności; innych gier nie trzeba instalować.

## Testy i budowanie

Z katalogu tej gry:

```bash
npm test
npm run typecheck
npm run build
npm start -- --port 8787
```

Zbudowaną wersję otwórz pod **http://localhost:8787**; zakończ przez **Ctrl+C**. `npm start` uruchamia lokalny Worker, nie publikuje gry. Budowa tworzy ignorowany katalog `dist/`.

Testy sprawdzają zgodność geometrii obrotów 3D z modelem, niemożliwe układy, zachowanie wcześniejszych warstw przez sekwencje, pełne rozwiązania 20 różnych pomieszań, już ułożoną kostkę, przyznawanie kwiatów i odczyt zapisu. Testy nie symulują fizycznego rozpoznawania kostki. Przed publikacją dodatkowo sprawdzono przepisywanie pól, walidację, animację, cofanie, odświeżenie, cały wirtualny przykład, muzykę i widok telefonu w przeglądarce.

## Postępy i dane

Postęp jest lokalny w `localStorage` pod kluczem `kostka-zielone-wzgorze-v1`. Zapis obejmuje początkowy układ, kolory środków, potwierdzony ruch i etap, kwiaty, ukończone przygody, oznaczenie przykładu oraz głośność. Nie są wysyłane dane dziecka. Otwarta, niezatwierdzona siatka kolorów jest szkicem w pamięci; po zatwierdzeniu układ jest zapisywany.

**Dla rodzica → Pobierz zapis / Wczytaj zapis** przenosi postęp jako plik JSON. Zapis przywraca wskazówki, ale nie zmienia fizycznej kostki. Inna przeglądarka, port lub adres hostowany mają osobny zapis. Wyczyszczenie danych witryny usuwa postęp; wcześniej pobierz kopię. Po odświeżeniu wracamy do ostatniego **potwierdzonego** obrotu, a nie samej obejrzanej animacji.

Muzyka jest domyślnie wyłączona. Przycisk w stopce ją włącza; można regulować głośność, wyłączyć dźwięki sukcesu, a systemowe ograniczenie ruchu wyłącza płatki i skraca animacje. Po ukryciu karty muzyka się zatrzymuje.

## Technologia i algorytm

React + TypeScript + Vinext/Vite, Three.js do animacji i `cubejs` do reprezentacji klocków. Obliczenia działają lokalnie w Web Workerze. Osobne tablice BFS dla ośmiu etapów śledzą cztery klocki i korzystają z sekwencji zachowujących wcześniejsze cele. Wskazówki i cele są autorskie, po polsku. Nie używamy zewnętrznego API rozwiązującego kostkę ani pełnego solvera Kociemby.

Import workera ma postać `?worker`, dzięki czemu Vite generuje jego przeglądarkowy adres również po transformacji komponentów przez Vinext. Konstruktor, błędy workera i limit obliczeń mają komunikaty w grze.

Podstawy metody warstw: [oficjalny poradnik Rubik’s](https://rubiks.com/solve-guide). Model: [cubejs](https://github.com/ldez/cubejs), grafika: [Three.js](https://threejs.org/). Powiadomienia licencyjne obu bibliotek są w [public/third-party-notices.txt](public/third-party-notices.txt). Nie używamy kadrów ani ścieżki dźwiękowej serialu; szczegóły ilustracji i muzyki: [ASSETS.md](ASSETS.md).

`.openai/hosting.json` zawiera identyfikator osobnego wdrożenia Sites. Nie jest potrzebny do grania lokalnego; repozytorium nie zawiera danych dostępowych do publikowania.
