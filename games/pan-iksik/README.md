# Pan Iksik — Przygoda z niewiadomą

Gra dla dzieci od około 7 lat, najlepiej początkowo z rodzicem. Pomaga zrozumieć, jak przekształcać proste równania, aby po lewej stronie zostało samo **x**. Zawiera 30 przygód w pięciu rozdziałach. Pierwsze zadania wymagają tylko dodawania i odejmowania; późniejsze wprowadzają mnożenie i dzielenie.

## Czego uczy

- `x` oznacza nieznaną liczbę, a znak `=` — równość wartości obu stron.
- Przeniesienie `+8` na drugą stronę wynika z **odjęcia 8 po obu stronach**. Gra najpierw pokazuje to działanie, a dopiero po potwierdzeniu przenosi składnik ze zmienionym znakiem.
- Zamiana całych stron zachowuje znaki składników.
- Liczby można łączyć z liczbami, a składniki z x — ze składnikami z x.
- `2x` oznacza `2 × x`. Dzielenie **całych obu stron** jest osobnym działaniem, innym niż przenoszenie składnika.
- Wynik sprawdzamy, podstawiając go w początkowym równaniu.

W pięciu rozdziałach są: dodawanie, odejmowanie (także `85 − x = 79`), x po prawej stronie i dłuższe wyrażenia, grupki Iksików (`2x + 4 = 18`), wreszcie x po obu stronach. Wszystkie zadania mają jedno rozwiązanie będące nieujemną liczbą całkowitą. Niektóre możliwe przekształcenia tworzą ujemne składniki; podpowiedzi wskazują łagodną drogę, a przy odejmowanym x początkowo unikają ujemnych wyników pośrednich.

Zadania liczbowe ze zdjęcia użytkownika wykorzystano jako punkt wyjścia; historia, ilustracje i interfejs są własne. Zdjęcie nie jest częścią aplikacji.

## Jak grać

1. Wybierz **Ruszamy z Iksikiem** albo przygodę z mapy. Wszystkie 30 zadań jest dostępnych od razu.
2. Kliknij dostępny składnik. Na komputerze możesz też przeciągnąć go **za małą strzałkę** na drugą stronę równania. Dotykanie przycisków wystarcza na telefonie.
3. Przeczytaj zaplanowane działanie i potwierdź **Zrób to po obu stronach**. Możesz anulować lub później cofnąć ruch.
4. Skorzystaj z **Zamień strony**, **Połącz składniki** lub **Podziel obie strony**, jeśli są dostępne.
5. Gdy po lewej zostanie samo x, oblicz prawą stronę i wpisz odpowiedź. Gra pokaże sprawdzenie w oryginalnym równaniu.

Pan Iksik podpowiada kolejny ruch i potrafi go podświetlić. Za każdą rozwiązaną przygodę dostajesz jedną gwiazdkę; powtórzenie nie dodaje kolejnej. Podpowiedzi, cofanie i pomyłki nie odbierają gwiazdek. Przy błędnej odpowiedzi gra pokazuje wartości obu stron po podstawieniu proponowanego x. Nie ma limitu czasu.

Przycisk **♫** włącza opcjonalny, krótki dźwięk sukcesu. Domyślnie jest wyłączony. Efekty wizualne respektują systemowe ustawienie ograniczenia ruchu. Klawiatura: Tab wybiera przyciski, Enter lub spacja je uruchamia. Wartość x można wpisać i zatwierdzić Enterem.

## Wymagania

- Node.js **22.13.0 lub nowszy**, z npm; sprawdzono na **25.9.0**.
- Git do pobrania repozytorium.
- Współczesna przeglądarka obsługująca moduły JavaScript, `structuredClone`, `dialog` i localStorage. Dźwięk wymaga Web Audio.
- macOS, Linux lub Windows z Node.js. Gra działa też w przeglądarce telefonu po opublikowaniu na hostingu.

Nie ma zależności npm, kont, płatnych integracji, zewnętrznych fontów ani backendu. Wszystkie zasoby są lokalne; po pobraniu repozytorium do gry na lokalnym serwerze nie jest potrzebny internet.

## Uruchomienie lokalne

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/pan-iksik
npm run dev
```

Jeżeli repozytorium już masz, przejdź do `games/pan-iksik` i wykonaj `npm run dev`. Instalacja pakietów nie jest wymagana. Możesz wykonać `npm ci`, ale aplikacja nie ma bibliotek do pobrania.

Otwórz **http://localhost:5181**. Serwer nasłuchuje tylko pod `127.0.0.1`. Zatrzymanie: **Ctrl+C**.

Inny port, jeśli domyślny jest zajęty:

```bash
npm run dev -- --port 5182
```

Wtedy otwórz **http://localhost:5182**. Nie otwieraj pliku `index.html` dwuklikiem (`file://`) — moduły wymagają HTTP.

## Testy i publikacja

```bash
npm test
npm run check
```

Osiem testów sprawdza kompletność 30 zadań, rozwiązania, zachowanie równości przez każdy oferowany ruch na zalecanych trasach, przenoszenie z przeciwnym znakiem, odejmowane x, dzielenie obu stron, grupowanie oraz walidację odpowiedzi i zapisu. Kontrola `check` sprawdza składnię wszystkich modułów i kompletność zasobów.

Nie ma kroku budowania. Śledzony w Git katalog **`dist/`** zawiera gotową stronę. Można udostępnić go na dowolnym hostingu statycznym serwującym `.mjs` jako JavaScript. `npm start` uruchamia ten sam lokalny serwer. `.openai/hosting.json` służy do publikacji Sites; lokalna gra go nie wymaga.

W przeglądarce Brave sprawdzono klikanie i klawiaturę, błędny i poprawny wynik, podstawienie, gwiazdki, podpowiedź, cofanie, przejście do kolejnej przygody, mapę oraz zachowanie postępów po odświeżeniu. Ręcznie rozwiązano zadania 1, 9, 16, 21 i 30, obejmujące wszystkie rozdziały. Układ sprawdzono również w emulowanym widoku 390 × 844 px; nie jest to test na fizycznym telefonie. Przeciąganie jest dodatkiem do pełnej obsługi kliknięciami i klawiaturą.

## Postępy i przenoszenie zapisu

localStorage, klucz **`pan-iksik-v1`**: ukończone przygody, ostatnie zadanie, wykonane kroki i ustawienie dźwięku. Każdy adres, port, profil przeglądarki i urządzenie ma osobny zapis. Nic nie jest wysyłane na serwer ani synchronizowane między urządzeniami. Historia bieżącego zadania ma limit 64 ruchów; można cofać kroki lub zacząć zadanie od nowa. Po odświeżeniu można ponownie potwierdzić wynik ukończonego zadania, bez dodatkowej gwiazdki.

W **Jak grać? → Pobierz zapis JSON** pobierzesz kopię. **Wczytaj zapis** zastępuje bieżące dane, więc przed importem warto pobrać kopię. Niepoprawny plik lub wersja jest odrzucana; nieprawidłowe kroki historii nie są wykonywane. Usunięcie danych strony w przeglądarce kasuje postępy. Przy problemie z localStorage gra pokazuje komunikat i pozwala korzystać z kopii JSON.

Nie dodawaj zapisów graczy do repozytorium; katalog `outputs/` jest ignorowany.

## Pliki

- `dist/js/lessons.mjs` — 30 autorskich przygód i pięć rozdziałów.
- `dist/js/engine.mjs` — dokładny model równania, dozwolone operacje, podpowiadana droga i sprawdzanie wartości.
- `dist/js/app.mjs` — interfejs, kroki, mapy, podpowiedzi, eksport i import.
- `dist/js/state.mjs` — walidowany zapis, odtwarzany przez operacje modelu.
- `dist/js/art.mjs` — autorski Pan Iksik i miasteczko w SVG; `dist/favicon.svg` — własna ikona.
- `dist/styles.css` — responsywna oprawa i efekty; sygnał sukcesu jest syntezowany w Web Audio.

Projekt nie używa cudzych ilustracji, muzyki, logo ani pakietów. Korzysta z fontów systemowych. Nie wymaga robota, Suno ani konta ChatGPT do lokalnej gry.
