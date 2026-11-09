# Kucykowa Poczta

Polska gra do nauki pisania na klawiaturze dla dziecka od około 7 lat. Figa dostarcza listy: każda poprawna literka przesuwa kucyka do skrzynki. Ćwiczymy prawidłowe palce, dokładność i płynne tempo. Autorskie kucyki i ilustracje SVG; nie jest to oficjalna gra My Little Pony.

[Otwórz grę](https://kucykowa-poczta.gchlebus.chatgpt.site) — hosting Sites jest prywatny dla właściciela. Wersja lokalna nie wymaga logowania ani kont ChatGPT/Suno.

## Jak grać

1. Wybierz trasę; zacznij od F i J. Kliknij „Jak ułożyć palce?” — lewa dłoń spoczywa na A S D F, prawa na J K L ;. Wskazujące wyczuwają wypustki F/J, kciuki spację.
2. Kliknij pole pod listem. Kolorowy klawisz i rysunek dłoni pokazują następny palec. Po ruchu wróć do domku. Gra ustawia widok tak, żeby przy pisaniu było widać mapę klawiatury.
3. Pisz dokładnie pokazany tekst, ze spacjami. Zegar startuje po pierwszym znaku (także pomyłce). Błąd nie przesuwa kursora: naciśnij właściwy znak. Backspace cofa poprawnie wpisany znak, zachowując historię pomyłek.
4. „Przerwa” lub Escape zatrzymuje czas. Utrata fokusu pola, pomoc i zmiana karty także robią pauzę. Wróć przez „Wznów”. Zmiana trasy zaczyna nowy list.
5. Za ukończenie listu jest gwiazdka; druga za ≥95% dokładności, trzecia za tempo przy tej samej dokładności. Po dwóch kolejnych dokładnych listach gra proponuje kolejną trasę. Każda trasa jest też dostępna ręcznie.

Zacznijcie od kilku minut; pozwól dziecku poznawać palce bez presji. Rodzic może sprawdzić ułożenie dłoni. Zwykła przeglądarka **nie widzi, którym palcem naciśnięto klawisz** — mapa jest wskazówką, nie pomiarem techniki.

## 12 tras, 36 krótkich tekstów

F/J → D/K → S/L → A i średnik → G/H → R/U → E/I → W/O → reszta górnego rzędu → dolny rząd → krótkie słowa → zdania z polskimi znakami i Shiftem. Wczesne ćwiczenia używają wyłącznie już wprowadzonych klawiszy. Losowany wariant nowego listu różni się od poprzedniego, jeśli to możliwe.

## Wymagania

- Komputer z **fizyczną klawiaturą QWERTY**; do nauki palców ekranowa klawiatura telefonu nie zastępuje fizycznej. Układ polski programisty na Windows/Linux lub **Polski Pro** na macOS.
- Node.js z npm: sprawdzono **25.9.0**, zapisane w `.nvmrc`; minimum narzędzi 22.13. Git do pobrania repozytorium.
- Aktualna przeglądarka z JavaScript; sprawdzono Brave/Chromium. Widok telefonu jest responsywny, ale do pełnych ćwiczeń zalecana jest klawiatura fizyczna.
- Internet do instalacji zależności. Google Fonts są opcjonalne: bez sieci używany jest font systemowy. Muzyka jest dołączona lokalnie; konto Suno nie jest potrzebne do odtwarzania.

## Uruchomienie lokalne

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/kucykowa-poczta
npm ci
npm run dev
```

Otwórz **http://127.0.0.1:5173/** albo adres `Local` wypisany w Terminalu. Jeśli jednocześnie działa inna gra, użyj osobnego portu:

```bash
npm run dev -- --port 5175
```

Zatrzymanie: **Ctrl+C** w Terminalu. Kolejne uruchomienie wymaga tylko `npm run dev` w katalogu tej gry. Nie trzeba instalować innych gier.

## Wyniki i motywator

- **Czas:** od pierwszego naciśniętego znaku do ukończenia listu, pomniejszony o pauzy. Nie ma limitu czasu ani przegranej za wolne pisanie.
- **Dokładność:** liczba poprawnych naciśnięć / wszystkie naciśnięcia znaków × 100%. Błędny znak jest liczony także po późniejszym poprawieniu; Backspace nie zeruje błędów. Przytrzymany klawisz, skróty i klawisze funkcyjne nie dodają znaków. Wklejanie i upuszczanie tekstu są blokowane.
- **Tempo:** przepisane znaki (włącznie ze spacjami) / 5 / aktywne minuty. Dla pomiarów krótszych niż sekunda przyjmujemy sekundę, żeby nie dzielić przez zero. To umowne słowa/min, a nie liczba rzeczywistych słów.
- **Własny cel:** na początek 6 słów/min; później około 5% ponad własnym dokładnym rekordem tej trasy, ograniczone do 6–45 słów/min. Rekord zapisuje się wyłącznie przy ≥95% dokładności. Cel ustalany jest na początku listu i nie przesuwa się w trakcie.
- Gwiazdki to najlepszy wynik trasy, a licznik listów obejmuje każde ukończenie. Jeden list jest zapisywany raz, gdy osiągnie koniec.

## Polskie znaki i palce

Prawy Alt + A/C/E/L/N/O/S/Z daje ą/ć/ę/ł/ń/ó/ś/ż; **ź to prawy Alt + X**. Na Macu w układzie Polski Pro odpowiada temu Option. Duże litery wymagają Shifta małym palcem przeciwnej dłoni. Jeśli układ systemowy jest inny, wybierz właściwy układ w ustawieniach systemu.

Mapa pokazuje zarówno bazowy klawisz litery, jak i potrzebny Shift/Alt. Wprowadzanie tekstu normalizuje Unicode do NFC. Materiały do układu palców: [TypingClub — Typing Jungle Teacher Handbook](https://typingclub.typingclub.com/m/edclubdocs/media/pdf/typing-jungle-handbook.pdf). Teksty, grafika i zasady tej gry są własne.

## Muzyka

Dwa NOWE motywy instrumentalne powstały w Suno v6 na prośbę właściciela konta:

- **Listy przez łąkę**, około 2:13 — [utwór źródłowy](https://suno.com/song/77b43af5-c361-4ccd-89b2-90115df4e925).
- **Gwiezdne listy**, około 2:33 — [utwór źródłowy](https://suno.com/song/3e1aaf57-13ca-4d92-926a-ad3eee242910).

Kliknij nutkę u góry. W panelu „Melodie w podróży” wybierz utwór i głośność; po zmianie utworu naciśnij nutkę ponownie. Po zakończeniu utworu zostaje wybrany kolejny; odtwarzanie wznawiasz nutką. Ukrycie strony zatrzymuje muzykę. Domyślnie jest wyłączona. [Pochodzenie i prompty](ASSETS.md).

## Postępy i prywatność

Zapis w `localStorage`, klucz `kucykowa-poczta-v1`: ukończone listy, rekordy, gwiazdki i wybrana trasa. Rozpoczęty list nie jest zachowywany po odświeżeniu. Nie zbieramy imienia dziecka, nie zapisujemy dowolnych wpisywanych tekstów i nie wysyłamy wyników na serwer. Muzyka i teksty ćwiczeń są częścią aplikacji.

Panel „Dla rodzica” → **Zapisz postępy** pobiera JSON; **Wczytaj kopię** przenosi wyniki na inne urządzenie i zastępuje lokalny zapis. Import sprawdza wersję i ogranicza wartości statystyk. Różne przeglądarki i adresy mają osobne wyniki; przed czyszczeniem danych zapisz kopię.

## Testy i budowanie

W katalogu gry:

```bash
npm test
npm run typecheck
npm run build
npm start
```

Testy sprawdzają zegar i pauzy, dokładność, Backspace, polskie znaki, nagrody i rekordy, progresję, mapę palców, stopniowe wprowadzanie klawiszy oraz walidację zapisu. TypeScript jest sprawdzany osobno. Build Vinext/Vite powstaje w `dist/`; `npm start` uruchamia go lokalnie przez Wrangler (zwykle **http://127.0.0.1:8787/**, patrz Terminal). Zatrzymanie: **Ctrl+C**. Lokalna gra i build nie wymagają konta Cloudflare ani Sites.

React/TypeScript + Vinext/Vite, czysty silnik w `lib/typing.ts`, interfejs w `app/page.tsx`. `.openai/hosting.json` identyfikuje opcjonalny hosting i nie zawiera sekretów. Nie commituj `node_modules`, `dist`, `.wrangler`, tokenów ani kopii wyników dziecka.
