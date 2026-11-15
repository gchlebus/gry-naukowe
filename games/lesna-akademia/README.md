# Leśna Akademia — Misja: kartkówka

**[Otwórz grę](https://lesna-akademia.gchlebus.chatgpt.site)** · [Wszystkie gry](https://gry-naukowe.gchlebus.chatgpt.site)

Spokojna gra powtórkowa dla dziecka od około 7 lat, początkowo z rodzicem. Dziewięć tematów odpowiada przekazanej liście materiału. Lisek Listek prowadzi przez krótkie rundy bez limitu czasu. Każdy temat można wybrać osobno; nie ma blokad poziomów.

## Materiał

| Dział | Temat | Ćwiczenie |
| --- | --- | --- |
| A | Budowa listu | Pięć części listu: miejscowość i data, zwrot do adresata, treść, pożegnanie, podpis. Wybierz kafelek i miejsce; na komputerze można też przeciągać. |
| A | Przepisywanie | Dwanaście autorskich tekstów. Sprawdzanie polskich znaków, wielkich liter i interpunkcji; wskazanie zmian, braków i nadmiarowych znaków. |
| A | Warstwy lasu | Dopasowywanie nazw do czterech prawdziwych zdjęć i pytania o korony drzew, podszyt, runo leśne oraz ściółkę. |
| A | Liczba i część mowy | Rzeczowniki i czasowniki, liczba pojedyncza i mnoga, zmiana formy wyrazu. Obie części mowy pojawiają się od pierwszej rundy. |
| A | Rośliny uprawne | Rozpoznawanie rzepaku, owsa, ziemniaków i pszenicy na prawdziwych fotografiach; wybór nazwy albo właściwego zdjęcia. |
| B | Symetria | Odbijanie wzorów na siatce 6 × 6 względem pionowej i poziomej osi; wybór osi figur, także brak osi i figury z wieloma osiami. |
| B | Zadania z treścią | Dwanaście historii. Dziecko zapisuje działanie z wynikiem oraz odpowiedź zdaniem. |
| B | Pieniądze | Układanie kwoty z monet 1 zł, 2 zł i 5 zł, sumowanie portmonetki i obliczanie reszty. Liczymy pełne złote. |
| B | Rachunki | Dodawanie i odejmowanie do 100. Pierwsze cztery przykłady to `63 + 9`, `73 − 6`, `78 − 35`, `43 + 24`; potem zadania generowane. Wyjaśnienia pokazują rozbijanie liczb. |

Dział A jest opisany datą **17 listopada**. W notatce działu B dzień tygodnia i data są sprzeczne: **19.10.2026 to poniedziałek**, natomiast **19.11.2026 to czwartek**. Do potwierdzenia daty przez rodzica gra pokazuje dla B tylko „Matematyka”. Nie ogranicza to dostępu do żadnych zadań.

## Jak grać

- **Wybrany temat:** trening pięciu zadań. **Krótka powtórka A/B:** po jednym zadaniu z każdego tematu działu.
- **Trening:** przycisk „Sprawdź” wyjaśnia pomyłkę, pozwala poprawiać i daje listek po poprawnym rozwiązaniu. „Przypomnij zasadę” otwiera pomoc. „Nie wiem — pokaż mi” odsłania rozwiązanie bez listka. Wskazówki i poprawki nie zerują zebranych listków.
- **Próbna kartkówka A:** 12 zadań, w tym cztery rośliny. **Próbna kartkówka B:** 8 zadań. Nie ma podpowiedzi; wynik, listki i wyjaśnienia pojawiają się dopiero w podsumowaniu. Można pominąć zadanie. Pusta odpowiedź nie jest zapisywana jako rozwiązanie.
- **Podsumowanie:** wynik samodzielnych pierwszych odpowiedzi, rozwiązania wszystkich zadań i przyciski do tematów wartych powtórzenia.

Trudność kolejnych zadań treningowych dopasowuje się automatycznie w obrębie trzech poziomów: dwa kolejne samodzielne sukcesy podnoszą poziom o jeden, zadanie wymagające podpowiedzi, poprawki lub odsłonięcia obniża go o jeden. Próbna kartkówka ma stały poziom 2. Nie każdy format ma trzy różne warianty trudności — budowa listu i cztery podstawowe rośliny pozostają tym samym materiałem.

Temat jest oznaczony jako **utrwalony**, gdy co najmniej cztery z ostatnich pięciu zadań rozwiązano poprawnie za pierwszym razem i bez pomocy. To wskaźnik do planowania powtórki, nie szkolna ocena.

Przepisywanie porównuje tekst po normalizacji Unicode i zwykłych odstępów; wielkość liter i znaki przestankowe są istotne. Działania zapisujemy z `=` i wynikiem. Sprawdzanie odpowiedzi zdaniem dopuszcza różny szyk, ale wymaga liczby zapisanej cyframi, jednostki, jeśli jest potrzebna, słowa związanego z pytaniem oraz poprawnego początku i zakończenia. Jest to prosta kontrola, nie pełna analiza języka; rodzic powinien sprawdzić poprawność całego zdania. Warto powtórzyć zapis także ręcznie w zeszycie.

Klawiatura: **Tab** wybiera element, **Enter** lub **spacja** uruchamia przycisk. W polu wielowierszowym Enter tworzy nową linię; do sprawdzenia użyj przycisku. Do wszystkich zadań wystarczają kliknięcia lub dotknięcia. Przy dopasowywaniu wybierz kafelek, a potem miejsce; kliknięcie wypełnionego miejsca odkłada kafelek. Dźwięk sukcesu jest opcjonalny, domyślnie wyłączony. Animacje respektują systemowe ograniczenie ruchu.

## Wymagania i instalacja

Node.js **22.13.0 lub nowszy**, z npm; sprawdzono na **25.9.0**. Współczesna przeglądarka z modułami JavaScript, `structuredClone`, `dialog` i localStorage. Dźwięk wymaga Web Audio. macOS, Linux lub Windows z Node.js.

Projekt nie ma zależności. **Nie trzeba wykonywać `npm install`.** `npm ci` jest opcjonalne i nie pobiera bibliotek. Lokalna gra nie wymaga konta ChatGPT, Sites, robota ani Suno. Wszystkie zasoby są lokalne.

## Uruchomienie lokalne

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/lesna-akademia
npm run dev
```

Jeśli repozytorium jest już pobrane, wystarczy przejść do katalogu gry i wykonać ostatnią komendę. Otwórz **http://localhost:5183**. Serwer nasłuchuje tylko na `127.0.0.1`. Zatrzymanie: **Ctrl+C**.

Inny port:

```bash
npm run dev -- --port 5184
```

Wtedy otwórz **http://localhost:5184**. Nie otwieraj `index.html` przez `file://`, ponieważ moduły wymagają HTTP. Link „Wszystkie gry” prowadzi do opublikowanego katalogu; każdą grę można uruchomić niezależnie lokalnie.

## Testy i publikacja

```bash
npm test
npm run check
```

Jedenaście testów obejmuje wszystkie 14 formatów zadań i trzy poziomy, rachunki w zakresie 0–100, podane cztery przykłady, polskie znaki i wyrównywanie błędów przepisywania, dopasowania, odbicia na kratkach, rzeczywistą geometrię osi figur, działania i odpowiedzi zdaniem, pieniądze, cztery rośliny, przeplatanie gramatyki, adaptację oraz walidację zapisu. `check` sprawdza składnię wszystkich modułów, zasoby oraz kompletność atrybucji i sumy SHA-256 ośmiu pobranych fotografii.

Nie ma kroku budowania. **`dist/` jest kompletną stroną statyczną śledzoną w Git.** Hosting musi serwować `.mjs` jako JavaScript. `npm start` uruchamia ten sam lokalny serwer. `.openai/hosting.json` zawiera tożsamość publikacji Sites i nie jest potrzebny do lokalnej zabawy.

Ręcznie sprawdzono w Brave: zadanie z każdego z dziewięciu tematów, poprawianie błędu polskiej litery, układanie listu i lasu kliknięciami, pomoc z ilustracjami roślin, zapis odpowiedzi zdaniem, monety, odbicie na siatce, wybór osi oraz całą próbną kartkówkę B (jedna poprawna odpowiedź i siedem pominięć), jej odroczone ocenianie i podsumowanie. Układ strony głównej i listu obejrzano w emulacji **390 × 844 px**; to nie test na fizycznym telefonie. Przeciąganie jest dodatkową metodą i nie było osobnym testem ręcznym.

Po podmianie ilustracji na fotografie dodatkowo sprawdzono w Brave: cztery zdjęcia roślin i wybór poprawnej odpowiedzi, pomoc z nazwami i atrybucjami, pytania ze zdjęciami lasu, dopasowanie wszystkich czterech nazw warstw oraz poprawne ocenienie. Zdjęcia lasu i pomoc obejrzano także w emulacji 390 × 844 px.

## Postępy i dane

localStorage, klucz **`lesna-akademia-v1`**: listki, ostatnie pięć wyników na temat, liczba ukończonych zadań, poziom trudności i ustawienie dźwięku. Gra nie wysyła odpowiedzi na serwer.

W treningu postęp zapisuje się po rozstrzygnięciu zadania. W próbnej kartkówce wyniki zapisują się dopiero w podsumowaniu. **Bieżąca runda i wpisywane odpowiedzi są tylko w pamięci karty.** Odświeżenie, zamknięcie albo powrót na mapę kończą niedokończoną rundę; wcześniejsze zapisane wyniki zostają. Każdy adres, port, profil i urządzenie ma osobny zapis.

Menu **Dla rodzica → Pobierz zapis JSON** pozwala zrobić kopię. **Wczytaj zapis** zastępuje bieżące postępy. Niepoprawna wersja lub zbyt duży plik są odrzucane, a wartości są walidowane i ograniczane. Usunięcie danych strony usuwa zapis. Przy zablokowanej pamięci gra nadal działa i pokazuje komunikat. Nie dodawaj zapisów dziecka do repozytorium.

## Pliki i materiały

- `dist/js/data.mjs` — tematy, teksty, słowa, rośliny, figury i zadania tekstowe.
- `dist/js/logic.mjs` — generowanie zadań, ocenianie, adaptacja i zapis.
- `dist/js/app.mjs` — interfejs i przebieg rund.
- `dist/art/` — dekoracyjny lisek SVG; nie służy do rozpoznawania roślin ani warstw lasu.
- `dist/photos/` — osiem prawdziwych fotografii z Wikimedia Commons, zapisanych lokalnie.
- `dist/js/photos.mjs` — autorzy, źródła, licencje, adresy pobranych plików i sumy SHA-256 fotografii.
- `dist/styles.css` — responsywny wygląd i efekty sukcesu.

Treści ćwiczeń, dekoracyjny lisek i krótkie dźwięki są autorskie. Fotografie mają osobnych autorów i licencje: pełna lista znajduje się w [SOURCES.md](SOURCES.md), a rozwijane podpisy są też dostępne przy zdjęciach oraz w menu „Dla rodzica”. Nie wygenerowano zdjęć ani nie dorysowano cech roślin. Pliki zachowują pobraną zawartość; CSS dopasowuje cały kadr bez rozciągania. Cztery fotografie lasu pochodzą z różnych miejsc i pokazują przykłady warstw, nie jeden wspólny przekrój. Na zdjęciu ziemniaka są liście i kwiaty; bulw pod ziemią nie widać. Odmiany roślin i struktura lasów mogą się różnić. Zdjęcia ani skany podręcznika nie są częścią gry.
