# Nasza Kraina Gier — strona startowa

**[Otwórz stronę główną](https://gry-naukowe.gchlebus.chatgpt.site)**

Rodzinny katalog gier: kafelki z ilustracjami, filtry tematyczne, powrót do ostatnio otwieranej gry oraz menu do przechodzenia między grami. Gry dla dorosłych są oznaczone osobno.

## Uruchomienie lokalne

Wymagany Node.js **22.13.0 lub nowszy** (sprawdzono na 25.9.0). Projekt nie ma zależności i nie wymaga `npm install`.

```bash
cd hub
npm run dev
```

Otwórz **http://localhost:5180**. Serwer działa tylko na tym komputerze. Zatrzymanie: **Ctrl+C**. Inny port: `PORT=5181 npm run dev`.

Kafelek Biura Zagadek otwiera grę bezpośrednio na serwerze katalogu. Pozostałe kafelki i menu prowadzą do opublikowanych adresów. Każda gra ma własną instrukcję w `games/<nazwa>/README.md`.

## Jak to działa

- `dist/` to kompletna strona HTML/CSS/JavaScript bez procesu budowania. Linki do gier działają również bez JavaScriptu.
- `catalog.json` jest wspólnym katalogiem nazw, opisów, kategorii, ilustracji i adresów gier.
- `scripts/sync.mjs` generuje `dist/index.html`, nawigację `app/game-navigation.tsx` i CSS gier React oraz blok nawigacji i `collection.css` gier statycznych. Uruchamiaj go z całego repozytorium, ponieważ aktualizuje także `../games/`.
- Menu jest obecne także przy uruchomieniu pojedynczej gry lokalnie. Nie zmienia zasad gry, muzyki ani zapisów.
- Ostatnio kliknięta w katalogu gra jest zapamiętywana wyłącznie w lokalnej pamięci przeglądarki. Katalog nie synchronizuje postępów między urządzeniami lub adresami gier. Zablokowanie pamięci nie blokuje wyboru gry.

## Aktualizacja katalogu i nawigacji

```bash
cd hub
npm run sync
npm run check
```

`check` sprawdza spójność wszystkich wygenerowanych plików, unikalność identyfikatorów, adresy HTTPS, obecność ilustracji i składnię JavaScriptu strony. Publikując katalog w Sites, dołącz `games/biuro-zagadek/dist/` do paczki jako `dist/biuro-zagadek/`. Dzięki temu gra jest dostępna pod adresem kafelka i korzysta z tych samych ustawień dostępu co katalog. Zaktualizowane menu pozostałych gier trafia na ich strony przy publikacji tych gier.

Dodając grę, utwórz jej niezależny projekt w `games/`, dodaj własną instrukcję, wpis w głównym README oraz wpis w `catalog.json`. Umieść ilustrację w `dist/art/` i uruchom `sync`. Nowa kategoria wymaga też dopisania przycisku kategorii w generatorze. Generator obsługuje obecne układy React `app/layout.tsx` oraz gry statyczne `dist/index.html` z linkiem pomijania nawigacji; dla innej technologii dodaj odpowiedni sposób osadzenia tego samego paska.

## Ilustracje i prywatność

Nowe ilustracje kaczki, poczty i atelier oraz ikona katalogu są autorskimi SVG zapisanymi bezpośrednio w kodzie. Pan Iksik pochodzi z własnej ilustracji tej gry. Miniatury sklepiku, Zielonego Wzgórza i gabinetu są pomniejszonymi kopiami istniejących grafik kolekcji; ich pochodzenie opisują odpowiednie projekty. Miniatura Biura Zagadek pochodzi z wygenerowanej ilustracji z Franią i Fistaszkiem. Nie dodano zewnętrznych fontów, śledzenia ani nowych plików muzycznych.
