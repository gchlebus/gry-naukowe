# Gabinet Joanny — Prywatne Archiwum Logiki

Osobista gra dla Joanny Bukowskiej-Chlebus: elegancki, wieczorny gabinet z **32 autorskimi łamigłówkami dla dorosłych**. Klimat Harry’ego Pottera i Snape’a łączy się z Czarodziejką z Księżyca, Super Pig oraz nadzwyczaj poważną sprawą kartofli.

Gra ćwiczy dedukcję, rozpoznawanie reguł, logikę warunkową, wyobraźnię przestrzenną i pracę z hipotezami. Zadania inspirowane są gatunkiem logicznych łamigłówek; nie pochodzą z testów Mensy i nie służą do pomiaru IQ.

## Jak grać

- Wybierz dowolne akta. Wszystkie 32 zadania są dostępne od początku; filtry pozwalają wybrać rozdział, rodzaj, trudność i status.
- Cztery rozdziały po osiem zagadek: **Gabinet Snape’a**, **Archiwum Księżyca**, **Misja Super Pig**, **Sprawa wielkiej bulwy**.
- Trzy poziomy: **Rozgrzewka**, **Wymagające**, **Mistrzowskie**. Poziom wybierasz samodzielnie.
- Dziesięć rodzin: zamki z cyframi, matryce, tabele dedukcji, szyfry, siatki sześcianu, logika warunkowa, nonogramy, przełączniki run, zdania i prawda, równowaga.
- Każde zadanie zawiera zasady, potrzebne przesłanki, dwie stopniowe podpowiedzi i uzasadnienie odpowiedzi. Nie wymaga znajomości fabuł wymienionych serii.
- Za samodzielne rozwiązanie dostajesz trzy pieczęcie. Każda podpowiedź odejmuje jedną. Odkrycie uzasadnienia przed odpowiedzią pozwala ćwiczyć dalej, z zerem pieczęci za te akta. Próby i czas nie obniżają wyniku.
- Zegar mierzy czas pracy nad otwartym zadaniem. Można go zatrzymać; ukrycie karty również zatrzymuje naliczanie. Nie ma limitu czasu.
- Notatki zapisują się automatycznie, a zakładki pozwalają odłożyć akta na później. Przy planszach działają strzałki, Enter i spacja.
- Przycisk **Włącz melodię** uruchamia spokojną, autorską kompozycję syntezowaną w przeglądarce. Głośność jest w oknie **O grze**. Domyślnie dźwięk jest wyłączony.

## Wymagania

- Node.js **22.13.0 lub nowszy**, z npm. Sprawdzono na **Node.js 25.9.0**.
- Git do pobrania repozytorium.
- Aktualna przeglądarka obsługująca moduły JavaScript, `dialog`, localStorage i Web Audio, np. Chrome, Safari, Firefox lub Edge.
- macOS, Linux lub Windows z Node.js. Polecenia poniżej można wykonać w Terminalu lub PowerShellu.

Gra nie ma zależności npm ani backendu. Do samej gry nie są potrzebne konto ChatGPT, Sites, Suno, klucze API ani dodatkowy sprzęt. Opcjonalne kroje pisma pobierają się z Google Fonts; bez sieci przeglądarka użyje fontów systemowych.

## Uruchomienie lokalne

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/gabinet-joanny
npm run dev
```

Jeżeli masz już repozytorium, przejdź do katalogu `games/gabinet-joanny` i wykonaj tylko ostatnie polecenie. **Instalacja pakietów nie jest wymagana**. `npm ci` jest obsługiwane przez dołączony lockfile, ale nie pobiera bibliotek aplikacji.

Otwórz **http://localhost:5179**. Zatrzymanie serwera: **Ctrl+C**. Serwer nasłuchuje wyłącznie lokalnie pod `127.0.0.1`.

Jeżeli port jest zajęty:

```bash
npm run dev -- --port 5180
```

Wtedy otwórz **http://localhost:5180**. Nie otwieraj `index.html` przez dwuklik (`file://`): moduły JavaScript wymagają serwera HTTP.

## Testy i publikacja

```bash
npm test
npm run check
```

Testy używają wbudowanego runnera Node.js. Sprawdzają między innymi jednoznaczność kodów, dedukcji, nonogramów i matryc, składanie siatek w sześcian, poprawność szyfrów, minimalne rozwiązania przełączników, logikę odpowiedzi oraz odtwarzanie i walidację zapisów. `check` sprawdza składnię modułów i kompletność zasobów.

**Nie ma kroku budowania.** Katalog `dist/` zawiera gotowy, śledzony w Git kod strony i zasoby. Można opublikować go na dowolnym hostingu statycznym obsługującym moduły `.mjs` jako JavaScript. Lokalnie gotową wersję uruchamia także:

```bash
npm start
```

Manifest `.openai/hosting.json` wskazuje `dist/` dla publikacji Sites; nie jest potrzebny do uruchomienia lokalnego.

Katalog zagadek jest przygotowany statycznie, aby otwieranie gry nie uruchamiało solverów. Po zmianach w `scripts/puzzle-source.mjs` odśwież dane i uruchom testy:

```bash
npm run generate
npm test
```

Generator jest deterministyczny. Nie edytuj ręcznie wygenerowanego `dist/js/puzzles.mjs`.

## Postępy i dane

Zapis jest lokalny dla konkretnego adresu i przeglądarki, pod kluczem **`gabinet-joanny-v1`** w localStorage. Obejmuje odpowiedzi robocze, rozwiązane akta, użyte podpowiedzi, czas pracy, notatki, zakładki i ustawienia. Gra niczego nie wysyła do serwera aplikacji i nie synchronizuje danych między urządzeniami. Inny port, domena lub przeglądarka ma osobny zapis.

W **O grze → Pobierz zapis JSON** możesz zachować kopię. **Wczytaj zapis** odtwarza dane z pliku i zastępuje aktualne postępy, dlatego wcześniej warto pobrać bieżącą kopię. Nieprawidłowy plik jest odrzucany bez zmiany zapisu. Wyczyszczenie danych strony w przeglądarce usuwa lokalne postępy. Jeśli przeglądarka blokuje zapis, gra pokazuje komunikat i można korzystać z kopii JSON.

Pliki kopii graczy nie należą do repozytorium. `outputs/` jest ignorowane przez Git.

## Sprawdzona wersja

- 13 testów automatycznych oraz kontrola składni i zasobów.
- W przeglądarce: poprawne i błędne odpowiedzi, po jednym przykładzie każdej z dziesięciu rodzin, podpowiedzi, uzasadnienie, pieczęcie, notatki, zakładki i powrót po odświeżeniu.
- Pobranie JSON, odtworzenie pobranej kopii oraz odrzucenie nieprawidłowego pliku.
- Włączenie i wyłączenie melodii, obsługa klawiatury oraz responsywny układ przy szerokości 390 px. To kontrola emulowanego widoku, nie test na fizycznym telefonie.

## Kod i zasoby

HTML, CSS i JavaScript w modułach ES; oryginalna oprawa SVG/CSS, ilustracja wygenerowana do projektu, muzyka Web Audio. Pochodzenie ilustracji, dokładny prompt i informacje o inspiracjach znajdują się w [ASSETS.md](ASSETS.md).

Projekt jest fanowską, osobistą grą; nie jest oficjalną produkcją właścicieli wymienionych światów. Zagadki i wypowiedzi profesora są autorskie. Nie używa filmowych kadrów, nagrań z seriali ani skopiowanych testów.
