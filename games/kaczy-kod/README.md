# Kaczy Kod

Polska aplikacja do wspólnej nauki programowania z dzieckiem od 7 lat. Dwadzieścia przygód, edytor klocków z pętlami i warunkami, animowana plansza, odtwarzanie krok po kroku, polski lektor przeglądarkowy, lokalny zapis i pliki do przenoszenia programów. Lektor zależy od głosów dostępnych w systemie.

## Uruchomienie lokalne (macOS i Linux)

Komendy poniżej wykonuj w katalogu `games/kaczy-kod/`.

Wymagania:

- **Node.js z npm** — sprawdzono na 25.9.0, przypiętym w `.nvmrc`. Do samej aplikacji wymagany jest Node.js co najmniej 22.13; testy uruchamiają TypeScript bezpośrednio i wymagają co najmniej 23.6. Dla powtarzalnego środowiska użyj wersji z `.nvmrc`.
- **Python 3** dostępny jako `python3` — potrzebny do pełnego zestawu testów oraz programów eksportowanych dla robota. Sama gra w przeglądarce go nie wymaga.
- Przeglądarka internetowa. Nie potrzebujesz konta ChatGPT, wtyczek Codex/Sites, kluczy API ani Microducka.

Po sklonowaniu repozytorium, z jego głównego katalogu:

```bash
cd games/kaczy-kod
npm ci
npm run dev
```

Jeśli używasz `nvm`, przed `npm ci` możesz wykonać `nvm install` i `nvm use`; oba polecenia odczytują `.nvmrc` z katalogu gry.

Otwórz **http://localhost:5173** lub adres `Local` podany w Terminalu. Pozostaw Terminal otwarty podczas zabawy. Aby zatrzymać serwer, naciśnij **Ctrl+C**.

### Testy

Z katalogu gry, po instalacji zależności:

```bash
npm test
npx tsc --noEmit
```

Testy obejmują rozwiązania wszystkich 20 poziomów, logikę planszy, zachowanie postępów i eksport Pythona. Test komunikacji korzysta z lokalnej atrapy robota przez gniazdo Unix i jest przeznaczony dla macOS/Linux; nie wymaga fizycznego sprzętu.

### Zbudowana wersja lokalna

```bash
npm run build
npm start
```

`npm start` uruchamia zbudowaną aplikację przez lokalny serwer Wrangler; otwórz wypisany przez niego adres `Local` (zwykle **http://127.0.0.1:8787**). Zatrzymanie: **Ctrl+C**. Nie jest wymagane logowanie do Cloudflare ani wdrożenie do internetu.

Plik `.openai/hosting.json` i pliki integracji Sites pochodzą z oryginalnej publikacji gry. Są częścią konfiguracji budowania; instalacja i lokalne uruchomienie działają z repozytorium bez narzędzi Sites. Wysłanie kodu do GitHuba nie publikuje automatycznie nowej wersji strony.

Technologia: React 19, TypeScript, Vinext/Vite, SVG. Bez kont dziecka, reklam, backendu z danymi osobowymi i zależności od modelu AI. Postępy i programy są przechowywane w localStorage tej przeglądarki i domeny. Pobieranie/wczytywanie JSON służy do kopii i przenoszenia między urządzeniami. Wyczyszczenie danych strony usuwa postępy.

## Pierwsza zabawa (10–15 minut)

1. Otwórz przygodę „Pierwsza wyprawa”.
2. Dziecko wybiera trzy klocki „Idź do przodu”.
3. Zapytaj, gdzie znajdzie się Kaczka, i kliknijcie Start.
4. Użyjcie „Po jednym”, żeby przyjrzeć się kolejnym krokom.
5. Następnym razem wybierzcie skręcanie; pętle pojawiają się w przygodzie 5, warunek w 7.

## Rozdziały i nowe zagadki

- **1–8 — Pierwsze kroki:** oryginalne przygody, bez zmiany identyfikatorów i rozwiązań.
- **9–14 — Owocowe wyprawy:** zbieranie wisienek, ponumerowane przystanki, naprawianie gotowego programu, końcowy kierunek, limit klocków i zagnieżdżone pętle.
- **15–20 — Kacze wyzwania:** klucz otwierający furtkę, warunek „Jeśli wolna droga”, nocna trasa, naprawianie pętli, limit kroków i finał łączący różne cele.

Każdy poziom ma podpowiedź i test potwierdzający pełne rozwiązanie. Wisienki i klucz zbierają się po wejściu na kratkę. Przystanki liczą się wyłącznie w kolejności ich numerów. Zamknięta furtka zatrzymuje ruch, a zebrany klucz otwiera wszystkie furtki poziomu. Warunek wolnej drogi sprawdza kratkę bezpośrednio przed Kaczką, uwzględniając granice planszy, kamienie i zamknięte furtki. Budżet kroków liczy tylko przebyte kratki; budżet klocków liczy również klocki wewnątrz pętli.

Poziomy 11 i 18 zaczynają się gotowym, błędnym programem. „Przywróć zagadkę” wczytuje go ponownie. Dotychczasowe gwiazdki i programy zachowują klucz zapisu `kaczy-kod-v1`; aktualizacja rozszerza akceptowane identyfikatory do 20 i nie zeruje postępów.

## Prawdziwy Microduck

Plansza jest grą 2D, nie symulatorem fizyki MuJoCo. Aplikacja **nie łączy się bezpośrednio z robotem**. W „Nasz Microduck” są instrukcje i eksport samodzielnego programu Python. Eksport korzysta z udokumentowanego JSON-RPC na gnieździe `/run/robotd.sock` i uruchamia się na robocie. Sprawdzono składnię, próbę bez ruchu i rozmowę z atrapą serwera; brak testu na fizycznym robocie. Dostarczony firmware musi udostępniać SSH, Python 3 i opisany interfejs.

Po oficjalnej konfiguracji robota rodzic:

```bash
brew install pierre-rouanet/tools/duckctl
duckctl scan
```

W aplikacji pobierz `kaczy-program.py`. W folderze pliku, wstaw nazwę konkretnego robota:

```bash
duckctl --name TWOJA-KACZKA scp kaczy-program.py :/tmp/
duckctl --name TWOJA-KACZKA ssh
```

Na robocie najpierw próba bez ruchu:

```bash
python3 /tmp/kaczy-program.py
```

Następnie na płaskiej wolnej podłodze, pod nadzorem dorosłego, włącz chodzenie przyciskiem Start na padzie i wykonaj:

```bash
sudo python3 /tmp/kaczy-program.py --run
```

Program nie włącza silników ani polityk, nie zmienia konfiguracji i nie instaluje oprogramowania robota. Wysyła intencje ruchu 20 razy na sekundę. Krok oznacza 0,08 m/s przez 1 s; skręt 0,5 rad/s przez π s. To przybliżenia czasowe. Odległości i skręty zależą od podłoża i polityki, a robot nie zna granic planszy ani jej kamyków. Klocki „Jeśli kwiatek” i „Jeśli wolna droga” są wyłącznie do gry i blokują eksport sprzętowy. Skarby, przystanki, klucze, furtki i granice planszy istnieją tylko w grze.

Ctrl+C/SIGTERM przerywa skrypt i podejmuje próbę `robot.stop` w `finally`. Po ukończeniu i przy błędzie też wysyłane jest `robot.stop`. Zatrzymanie zeruje prędkość i **nie odłącza momentu silników**. Awaria procesu lub połączenia może uniemożliwić wysłanie stop; robot ma własny mechanizm wygaszania intencji. Nie traktuj skryptu jako wyłącznika awaryjnego. Pierwsze uruchomienie na dostarczonym robocie wymaga weryfikacji firmware i rzeczywistego działania przez dorosłego.

## Zweryfikowane źródła (7 listopada 2026)

- [Microduck — producent](https://pollen-robotics.com/microduck/)
- [duckctl: instalacja na macOS, scan, scp, SSH](https://github.com/pollen-robotics/microduck/blob/main/docs/robot/duckctl.md)
- [Protokół: MoveParams, robot.move, robot.stop, robot.sound](https://github.com/pollen-robotics/microduck/blob/main/duck-ipc-proto/src/lib.rs)
- [Oficjalny klient robotctl: gniazdo, ramkowanie JSON, quack](https://github.com/pollen-robotics/microduck/blob/main/robotctl/src/main.rs)
- [Oficjalny symulator fizyki (osobny projekt Pollen)](https://huggingface.co/spaces/pollen-robotics/microduck-simulator)

Kod ilustracji ogródka i maskotki powstał dla tej aplikacji. To niezależna pracownia edukacyjna, nie oficjalny produkt Pollen Robotics.
