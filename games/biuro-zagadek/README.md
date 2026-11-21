# Biuro Zagadek

Frania i Fistaszek zapraszają do rozwiązania 18 spraw. Gra jest przeznaczona dla dzieci od około 7 lat i ich bliskich. Można grać samodzielnie albo we dwoje na jednym ekranie. Wspólna gra podpowiada, kto czyta, kto sprawdza i kiedy można zamienić się rolami. Każda sprawa ma podpowiedź.

- **Szukaj różnic** — trzy pary scen z 4, 5 i 6 różnicami.
- **Odgaduj zagadki** — trzy krótkie zadania z odpowiedzią wpisywaną samodzielnie.
- **Ułóż sudoku** — plansze 4 × 4, 6 × 6 oraz 9 × 9, z zaznaczaniem powtórek.
- **Połącz poszlaki** — trzy tabele, w których można zaznaczyć zarówno dopasowania, jak i wykluczenia.
- **Złam szyfr** — od symboli przez numery liter po przesuwanie alfabetu.
- **Dokończ wzór** — figury, rosnące odstępy i dwa przeplatające się wzory.

## Uruchomienie lokalne

Wymagania: Node.js ≥ 22.13.0 i współczesna przeglądarka. Gra jest statyczna, bez instalowania zależności i bez etapu budowania.

Z głównego katalogu repozytorium uruchom:

```bash
node hub/scripts/serve.mjs
```

Otwórz [Biuro Zagadek lokalnie](http://localhost:5180/biuro-zagadek/). Zatrzymanie serwera: **Ctrl+C**. Do samodzielnego hostowania wystarczy udostępnić katalog `dist/` w serwerze statycznym, np. `python3 -m http.server 5184 --bind 127.0.0.1 --directory dist` z katalogu gry i otworzyć http://localhost:5184.

## Testy i postępy

Testy: `node --test games/biuro-zagadek/tests/*.test.mjs` z głównego katalogu repozytorium. Spójność katalogu sprawdzisz poleceniem `npm --prefix hub run check`.

Lista rozwiązanych spraw i ustawienie trybu we dwoje są zapisywane w pamięci lokalnej przeglądarki pod kluczem `biuro-zagadek-progress-v1`. Rozpoczęte sprawy można od razu rozegrać ponownie po ich otwarciu. Dane są osobne w każdej przeglądarce i pod każdym adresem, a wyczyszczenie danych strony usuwa postęp.

Okładka Frani i Fistaszka powstała w ImageGen na potrzeby gry. Sceny do znajdowania różnic i ikona lupy zostały opracowane dla tego projektu. Gra nie potrzebuje usług, kont ani sprzętu poza urządzeniem z przeglądarką.
