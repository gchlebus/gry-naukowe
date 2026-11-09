# Ilustracja, muzyka i efekty

## Ilustracja

- Plik: `public/art/avonlea.png` (1536×1024 PNG).
- Wygenerowana 9 listopada 2026 wbudowanym narzędziem `image_gen`, tryb domyślny, `illustration-story`; bez fotografii referencyjnych, zrzutów serialu i zewnętrznych zasobów graficznych.
- Oryginalne przedstawienie Ani Shirley na ganku i sadu w Avonlea, inspirowane ciepłą kreskówką o Ani z Zielonego Wzgórza. Nie jest kadrem ani oficjalnym materiałem konkretnej adaptacji. Użytkownik nie wskazał jeszcze dokładnej wersji serialu z YouTube.
- Obraz jest kopiowany do projektu; runtime nie korzysta z katalogów twórcy ani z API generowania.

Dokładny prompt:

```text
Use case: illustration-story. Asset type: hero illustration for a gentle Polish children's educational game inspired by Anne of Green Gables animated cartoons. A warm original hand-painted 2D animation scene: Anne Shirley as a cheerful freckled red-haired young girl with two long braids, a straw hat, cream puff-sleeved blouse and simple sage-brown pinafore, seated on the wooden porch of a white farmhouse with a green gabled roof in Avonlea. A little closed notebook and spring flowers near her, an inviting apple orchard, white fence, pink blossoming trees and rolling green fields in the background. She looks at the viewer kindly with curious expressive eyes, a supportive companion for a seven-year-old learning a physical puzzle. Nostalgic cel-animation character lines with watercolor backgrounds, sunny Prince Edward Island countryside, gentle detailed storybook atmosphere, warm ivory, leaf green, soft terracotta, pink blossoms. Wide landscape composition with the girl toward the right, clear natural shapes, beautifully finished production illustration. No typography, no letters, no logos, no watermarks, no screenshots, no computer interfaces, no puzzle cubes or complicated hand gestures. 1536x1024 landscape.
```

## Muzyka

- Plik: `public/audio/ogrod-malych-odkryc.mp3`.
- Tytuł: **Zielone Wzgórze — Ogród małych odkryć**.
- Oryginalny instrumental wygenerowany 9 listopada 2026 w Suno v6 na koncie użytkownika z planem Pro. Wybrana pierwsza z dwóch wygenerowanych wersji, długość pliku **204,6 s** (około 3:25).
- Źródło na koncie: [utwór w Suno](https://suno.com/song/fdcf53ed-ba40-4159-a44a-2a082f554ddf). Nie użyto przycisku publicznego publikowania w Suno. MP3 pobrano z panelu Download, sprawdzono dekodowanie audio i odtwarzanie w grze.
- Łagodny walczyk celtycki, gitara akustyczna, flet, harfa i skrzypce. To nowa melodia, nie nagranie z serialu. Nie wymaga konta Suno ani tokenu przy graniu. Korzystanie z wygenerowanego nagrania podlega warunkom usługi Suno i prawom właściciela konta; samo umieszczenie w repozytorium nie nadaje mu osobnej licencji otwartej.
- Gra odtwarza utwór dopiero po kliknięciu, w pętli, z regulacją głośności. Wyjście z widocznej karty zatrzymuje muzykę.

Dokładny prompt Styles (pole Lyrics pozostawiono puste):

```text
Instrumental only, no vocals, no spoken words. Warm nostalgic countryside cartoon background music for a seven-year-old solving a puzzle with a red-haired storybook girl on a green-gabled farmhouse porch in Prince Edward Island. Gentle Celtic folk waltz, acoustic guitar, soft fiddle, warm piano, wooden flute, delicate harp and very light brushed percussion. 84 BPM in G major, kind curious melody, reassuring and sunlit, subtle repeating motifs for concentration, soft dynamics, about two minutes, loop-friendly ending, no dramatic builds, no loud hits. Entirely original melody.
```

## Efekty i elementy programu

- Dźwięki sukcesu: własne krótkie melodie syntezowane lokalnie przez Web Audio API, bez próbek zewnętrznych. Trzy nuty za etap i dłuższy motyw przy ukończeniu.
- Płatki, kwiaty, favicon i układ siatki: kod CSS/SVG/HTML oraz znaki tekstowe. Ograniczenie ruchu respektuje `prefers-reduced-motion`.
- Model 3D: własna geometria ścianek na podstawie współrzędnych modelu `cubejs`, renderowana przez Three.js. Zgodność obrotów wszystkich sześciu ścianek objęta testem.
- Model klocków cubejs i renderer Three.js: licencje MIT, pełne powiadomienia w `public/third-party-notices.txt`.
- Fonty Lora i DM Sans przez Google Fonts, z systemowymi zamiennikami. Nie są bundlowane w repozytorium.
- Pozostałe zależności i ich wersje: `package-lock.json`. Pliki startera Sites zachowują dołączone informacje licencyjne w `scripts/vite/` i `vendor/`.
