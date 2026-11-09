# Atelier Lalek

Kreatywny salon dla dziecka od około 7 lat: cztery lalki, fryzury, opcjonalne farbowanie, kosmetyki widoczne bezpośrednio na twarzy, dziesięć paznokci, ubrania, buty i album własnych pomysłów. Bez punktów, limitu czasu i zakupów.

[Otwórz grę](https://atelier-lalek.gchlebus.chatgpt.site) · [Grafika i dźwięki](ASSETS.md)

## Jak się bawić

- **Zmień lalkę**: Mila, Nina, Lena lub Pola. Każda ma własne zapisane wybory; przełączanie nie kasuje stylizacji innych lalek.
- **Włosy**: osiem fryzur, szczotka, lokówka, karbownica i prostownica. Szczotka czesze i usuwa odstające kosmyki; pozostałe narzędzia zmieniają wzór pasm. Fryzura i tekstura są niezależne. Farbowanie jest opcjonalne: przekreślone kółeczko przywraca naturalny kolor danej lalki. Dostępne są gotowe kolory i własny wybór koloru.
- **Makijaż**: cienie do powiek, szminka, róż do policzków, puder, brwi i rzęsy. Wybierz kosmetyk, a potem kolor. Kosmetyk od razu pojawia się na odpowiedniej części twarzy. Można dodać blask do cieni, zmyć jeden kosmetyk albo cały makijaż.
- **Paznokcie**: lakier na obu dłoniach, również kciukach, oraz gładkie wykończenie, kropeczki lub gwiazdki. Jest też powrót do naturalnych paznokci.
- **Garderoba**: sześć sukienek, cztery góry, cztery doły, pięć rodzajów butów i pięć dodatków. Ubrania i buty można kolorować. Sukienka zastępuje komplet góra–dół; wybór góry lub dołu przełącza na taki komplet. Dodatek zdejmuje się ponownym kliknięciem.
- Klikaj wybory **lub przeciągaj je na lalkę**. Mały uchwyt ze strzałkami jest wygodny do przeciągania, szczególnie na ekranie dotykowym. Dotyczy to też gotowych kolorów. Przeciągnięcie poza lalkę nie nakłada zmiany.
- **Cała lalka / Twarz / Włosy / Dłonie** zmieniają zbliżenie. Makijaż i paznokcie automatycznie pokazują odpowiednie zbliżenie. Na telefonie lalka i przewijana paleta pozostają jednocześnie widoczne.
- **Cofnij / Ponów** odzyskuje zmiany, usunięte elementy albumu oraz poprzednią stylizację po użyciu „Zacznij od nowa”. Historia bieżącej sesji obejmuje do 40 zmian.
- **Zapisz stylizację** dodaje nazwany pomysł do albumu z 24 miejscami. Album przechowuje osobne kopie wyglądu. Można je ponownie wczytać i rozwijać.
- **Pobierz obrazek** zapisuje PNG 1040×1520 z całą lalką, niezależnie od aktualnego zbliżenia. Przycisk aparatu w nagłówku zapisuje stylizację, nie otwiera fizycznej kamery.

Dźwięki są opcjonalne i początkowo wyłączone. Włącza się je w stopce. Animacje narzędzi i ozdobne gwiazdki respektują systemowe ograniczenie ruchu.

## Wymagania

- macOS, Windows lub Linux, Git oraz **Node.js co najmniej 22.13.0 z npm**. Instalację i sprawdzanie wykonano na **Node 25.9.0**; wersja jest w `.nvmrc`.
- Współczesna przeglądarka z JavaScript, SVG i Pointer Events. Pobieranie PNG wymaga Canvas i możliwości pobierania plików.
- Internet do pierwszej instalacji pakietów. Gra nie wymaga aparatu, zdjęć dziecka, kont lalek ani kluczy API. Lokalna wersja nie wymaga ChatGPT ani dostępu do Sites. Adres hostowany zachowuje ustawienia dostępu właściciela Sites.
- Fonty z Google Fonts są opcjonalne; bez nich działają fonty systemowe. Grafika i dźwięki powstają lokalnie w programie. Gra nie instaluje service workera; adres hostowany wymaga sieci do wczytania.

## Uruchomienie lokalne

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/atelier-lalek
npm ci
npm run dev
```

Otwórz **http://localhost:5173** lub adres `Local` pokazany w terminalu. Jeżeli repozytorium już masz, wejdź do `games/atelier-lalek`, uruchom `npm ci`, a potem `npm run dev`.

Przy zajętym porcie:

```bash
npm run dev -- --port 5178
```

Wtedy otwórz **http://localhost:5178**. Serwer zatrzymasz przez **Ctrl+C** w terminalu. Nie trzeba instalować innych gier w repozytorium.

## Testy i budowanie

Z katalogu tej gry:

```bash
npm test
npm run typecheck
npm run build
npm start -- --port 8788
```

Zbudowana wersja działa pod **http://localhost:8788**. `npm start` uruchamia lokalny Worker; nie publikuje gry. Zatrzymanie: **Ctrl+C**. Wynik budowy znajduje się w ignorowanym `dist/`.

Testy obejmują niezależność lalek, zachowanie wyglądu po serializacji, niezmienność kopii w albumie, cofanie/ponawianie i reset, odczyt uszkodzonych danych, limit albumu oraz limit historii. W przeglądarce sprawdzono widoczne kosmetyki, dziesięć pomalowanych paznokci, narzędzia i przeciąganie, garderobę, przełączanie lalek, album, odświeżenie, pobrany pełny PNG oraz układ 390×844. Automatyczne testy logiki nie oceniają artystycznego wyglądu ilustracji.

## Postępy i dane

Stan jest w `localStorage` pod kluczem **`atelier-lalek-v1`**. Obejmuje cztery lalki i ich stylizacje, wybraną lalkę, album oraz ustawienie dźwięków. Historia cofania nie jest utrwalana po zamknięciu/odświeżeniu gry. Nazwy i wyglądy lalek nie są wysyłane przez aplikację na serwer.

Inna przeglądarka, port lub adres hostowany ma osobny zapis. Czyszczenie danych witryny usuwa lokalny album. **Pobrane PNG zachowaj poza grą** — są przenośnymi obrazkami, nie plikami służącymi do odtworzenia edytowalnej stylizacji. Gra nie ma importu stylizacji między urządzeniami. Przy zablokowanym zapisie pojawia się komunikat.

## Technologia i pliki

React + TypeScript + Vinext/Vite, własna warstwowa ilustracja SVG. Dzięki wektorom kosmetyki i kolory zmieniają dokładne fragmenty postaci, a przybliżanie i eksport nie wymagają generowania kolejnych obrazów ani kontaktu z usługą AI.

- `lib/salon.ts` — katalog wyborów, wygląd, album, walidacja zapisu i historia zmian.
- `components/doll.tsx` — postać, fryzury, ubrania, dłonie i kosmetyki.
- `components/catalog-art.tsx` — miniatury garderoby i narzędzi.
- `app/page.tsx` — salon, palety, przeciąganie, album i eksport.
- `app/globals.css` — wygląd salonu, zbliżenia i układ telefonu.
- `ASSETS.md` — pochodzenie ilustracji, ikon, fontów i dźwięków.

`.openai/hosting.json` identyfikuje osobne wdrożenie Sites. Gra lokalna działa bez danych dostępowych do publikowania. W repozytorium nie ma haseł ani tokenów.
