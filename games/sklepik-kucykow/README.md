# Sklepik Kucyków

Polska gra matematyczna do wspólnej zabawy z dzieckiem od około 7 lat. Pomagamy sześciu autorskim kucykom w małym sklepiku: liczymy zakupy, wydajemy resztę, pakujemy równe zestawy i dzielimy towary po równo. Zadania są losowane, więc można grać wielokrotnie.

[Otwórz grę online](https://sklepik-kucykow.gchlebus.chatgpt.site) — wersja Sites jest prywatna dla właściciela. Uruchomienie lokalne poniżej nie wymaga logowania, konta ChatGPT ani Suno.

## Co jest w grze

- Cztery działania w codziennych sytuacjach; cztery towary i sześć przyjaciółek.
- Wybór jednej z czterech odpowiedzi albo wpisanie liczby i Enter.
- Obrazkowe podpowiedzi: ramki po 10 kropek, przekreślanie wydanych monet, równe grupy i rozkładanie po jednej rzeczy do koszyczków.
- Po sukcesie działanie odwrotne do sprawdzenia wyniku. Po pomyłce można próbować dalej; trudniejsze fakty wracają co trzecie rozwiązane zadanie, jeśli pasują do wybranego działania/poziomu i nie są właśnie poprzednim zadaniem.
- „Karty w pary”: cztery widoczne działania i cztery wyniki, z jedną jednoznaczną parą dla każdego działania. To dopasowywanie, bez potrzeby zapamiętywania zakrytych kart.
- Sześć odznak, mały cel po sześć obliczeń i sugestia przerwy. Bez licznika czasu, kar i blokowania poziomów.
- Panel rodzica z liczbą prób i poprawnych odpowiedzi, eksportem i importem postępów.
- Lektor polski zależny od głosów przeglądarki/systemu. Muzyka z Suno i delikatne dźwięki sukcesu.

## Poziomy

| Poziom | Dodawanie i odejmowanie | Mnożenie i dzielenie |
| --- | --- | --- |
| 1. Pierwsze kroki | Liczby i wyniki do 10, bez liczb ujemnych | 2–4 grupy po 1–5 rzeczy; do 20 |
| 2. Coraz śmielej | Do 50; dodawanie z wynikiem ponad 10 | 2–5 grup po 2–10 rzeczy; do 50 |
| 3. Mistrzyni sklepiku | Do 100; większe liczby | Tabliczka 2–10 × 2–10 i działania odwrotne do 100 |

Dzielenie zawsze daje wynik całkowity; nie ma dzielenia przez zero. W odejmowaniu pojawia się także wynik zero. Domyślnie działa **automatyczny dobór**, osobno dla każdego działania. 5 samodzielnych pierwszych odpowiedzi w oknie 6 zadań podnosi poziom o jeden. Dwie kolejne trudności (błąd przy pierwszej próbie lub użycie obrazków) obniżają poziom o jeden; ten sam identyfikator zadania jest obserwowany tylko raz. Historia zeruje się po zmianie poziomu. Trudność zmienia się od kolejnego zamówienia lub nowego rozdania kart, a ukończone zadanie zostaje na ekranie do sprawdzenia. Starsze karty z rozdania nie zmieniają kalibracji nowego poziomu.

Każdy poziom można też wybrać ręcznie, co wyłącza automat. Przycisk nad poziomami włącza go ponownie i przywraca zapamiętany poziom dla danego działania. Po dwóch błędnych próbach można wybrać prostsze zadanie. Przy pierwszym wczytaniu starszego zapisu gwiazdki i statystyki zostają zachowane, automat startuje od dotychczas wybranego poziomu dla bieżącego działania i od 1 dla pozostałych. Zacznijcie od 5–10 minut, pytając „Pokaż swój sposób” i pozwalając liczyć na palcach lub obrazkach.

## Wymagania

- macOS lub Linux, Git oraz Node.js z npm. Sprawdzono Node **25.9.0**; wersja jest w `.nvmrc` (`nvm use`, jeśli korzystasz z nvm). Minimum narzędzi to Node 22.13, ale sprawdzoną wersją jest 25.9.0.
- Aktualna przeglądarka z JavaScript; sprawdzono Brave/Chromium, widoki komputerowy i mobilny.
- Internet przy pierwszym `npm ci`. W grze zewnętrznie ładowane są jedynie opcjonalne kroje Google Fonts; przy braku sieci działa font systemowy.
- Robot, Python, baza danych i konto Suno nie są potrzebne do gry. Utwór jest już dołączony jako MP3.

## Uruchomienie lokalne

Pierwszy raz:

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/sklepik-kucykow
npm ci
npm run dev
```

Otwórz **http://127.0.0.1:5173/** lub adres `Local` wypisany w Terminalu (inny port, jeśli 5173 jest zajęty). Aby zatrzymać serwer, naciśnij **Ctrl+C** w tym Terminalu.

Kolejne uruchomienia: wejdź do `games/sklepik-kucykow` i wykonaj `npm run dev`. Nie trzeba instalować innych gier z repozytorium.

## Muzyka

Kliknij nutkę „Muzyka” w prawym górnym rogu. Obok jest strzałka z regulacją głośności i osobnym przełącznikiem dźwięków odpowiedzi. Muzyka nie włącza się automatycznie: po przeładowaniu strony trzeba kliknąć ponownie. Schowanie karty/okna zatrzymuje muzykę; można wznowić ją nutką. Przy czytaniu zamówienia przez lektora muzyka jest ściszana.

Motyw **„Sklepik Kucyków — spokojne liczenie”** powstał w Suno na koncie właściciela, na jego prośbę. [Utwór źródłowy](https://suno.com/song/6ccd159a-45d8-48e1-b282-917b11644a26). MP3 trwa około 2:08 i jest zapętlony. Szczegóły pochodzenia oraz prompty grafiki i muzyki: [ASSETS.md](ASSETS.md).

## Postępy i dane

Postępy zapisują się automatycznie w `localStorage`, klucz `sklepik-kucykow-v1`. Nie zbieramy imienia ani konta dziecka i nie wysyłamy wyników na serwer. W panelu „Dla rodzica” wybierz **Zapisz postępy**, żeby pobrać JSON; na innym urządzeniu wybierz **Wczytaj kopię**. Import zastępuje lokalne wyniki wybraną kopią i sprawdza jej format.

Różne adresy (`localhost`, `127.0.0.1`, wersja online) i przeglądarki mają osobne zapisy. Tryb prywatny/czyszczenie danych może je usunąć. Zrób kopię przed czyszczeniem. Zapis obejmuje ukończone zadania, statystyki, odznaki, kolejkę powtórek i wybór działania/poziomu; rozpoczęte zamówienie oraz rozdanie kart zaczynają się od nowa po odświeżeniu.

Jedno poprawnie zakończone zadanie daje jedną gwiazdkę. Ponowne kliknięcia ukończonego zadania nie zwiększają wyniku. „Samodzielnie” oznacza poprawną pierwszą odpowiedź bez otwierania obrazków (także gdy potem je schowano). To wskazówka dla rodzica, nie ocena dziecka.

## Testy i budowanie

Z katalogu gry:

```bash
npm test
npm run typecheck
npm run build
npm start
```

`npm test` uruchamia testy silnika na wbudowanym runnerze Node: zakresy wszystkich działań/poziomów, poprawność odpowiedzi, zero, całkowite dzielenie, jednoznaczność kart, punktacja, powtórki i walidacja kopii postępów. `typecheck` sprawdza TypeScript. `build` tworzy klienta i Worker w `dist/` przez Vinext/Vite. `npm start` uruchamia zbudowaną grę lokalnie przez Wrangler; otwórz adres wypisany przez polecenie (zwykle **http://127.0.0.1:8787/**). Zatrzymanie: **Ctrl+C**.

Nie potrzeba konta Cloudflare do lokalnej zabawy ani lokalnego sprawdzenia buildu. `.openai/hosting.json` identyfikuje opcjonalny hosting Sites; nie zawiera sekretów. Nie dodawaj do repozytorium `node_modules`, `dist`, `.wrangler`, kopii postępów ani tokenów.

## Technologia i inspiracje

React + TypeScript + Vinext/Vite: działa w przeglądarce, obsługuje klawiaturę i dotyk, bez instalacji aplikacji na urządzeniu dziecka. Silnik zadań jest oddzielony w `lib/math.ts`, a interfejs w `app/page.tsx`.

Inspiracją są ogólne zasady opisane przez twórców Kart Grabowskiego: uczenie przez zabawę, reprezentacje graficzne liczb, własne tempo, stopniowanie zakresu i powiązanie działań odwrotnych:

- [Dodawanie i odejmowanie — pytania i odpowiedzi](https://kartygrabowskiego.pl/blog/najczesciej-zadawane-pytania-o-karty-grabowskiego-dodawanie-i-odejmowanie)
- [Tabliczka mnożenia — pytania i odpowiedzi](https://kartygrabowskiego.pl/blog/najczesciej-zadawane-pytania-o-karty-tabliczka-mnozenia)

To samodzielna gra z autorskimi zasadami i zadaniami, bez kopiowania komercyjnych kart, ich ilustracji lub instrukcji. Nie jest oficjalnym produktem Kart Grabowskiego ani marki My Little Pony.
