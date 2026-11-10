# Zasoby Gabinetu Joanny

## Ilustracja gabinetu

- Plik używany przez grę: [dist/art/gabinet.png](dist/art/gabinet.png), 1536 × 1024 px.
- Utworzona 10 listopada 2026 r. wbudowanym narzędziem **image_gen** (tryb built-in, generowanie nowej ilustracji bez obrazów referencyjnych; bez fallback CLI/API).
- Oryginalna fanowska interpretacja książkowego Snape’a w nocnej bibliotece, z księżycową broszą, figurką Super Pig i kartoflami. Nie jest kadrem z filmu lub serialu ani fotografią aktora.
- Obraz został skopiowany do projektu i jest śledzony w Git; gra nie odwołuje się do zewnętrznej ścieżki generatora.

Dokładny prompt:

```text
Use case: illustration-story. Asset type: cinematic editorial illustration for an elegant adult logic-puzzle game dedicated to a woman who adores Severus Snape, Harry Potter, Sailor Moon and Super Pig. Primary subject: a striking original book-character portrayal of Severus Snape, a pale, lean, long straight black-haired wizard with an angular face, dark penetrating eyes and a reserved, subtly amused expression, wearing a beautifully tailored black high-collared robe. He stands on the right half behind a dark wooden desk in a secluded stone potions library at night. His elegant hands rest beside an open old book, glass emerald potion bottles, a brass crescent moon instrument, and a very small charming pink Super Pig superhero figurine with a red cape and dark round glasses beside two humble potatoes. Through a tall Gothic window behind him, a glowing full moon and distant castle spires. A small five-jewel crescent brooch on the desk evokes Sailor Moon. Style: sophisticated painterly fantasy book-cover art, fine brushwork, subtle film grain, realistically proportioned adult, not a photograph or actor likeness, luxurious dark academia mood. Palette: deep emerald and ink black, warm antique brass, parchment, silver moonlight. Composition: wide 1536x1024 landscape, waist-up wizard clearly visible on right, atmospheric shadowy library on left with negative space; excellent detail in face, hands and glass. Quiet, intriguing, a little romantic, restrained, beautiful. No text, no letters, no logos, no watermark, no interface, no graphic symbols that look like writing. Entirely original illustration, no screenshots or film stills.
```

## Ikony, plansze i typografia

Ikony interfejsu, favicon, znaki pieczęci i plansze są własnym SVG, HTML lub CSS. Diagramy zagadek nie są pobranymi obrazami. Opcjonalne fonty Manrope i Cormorant Garamond są pobierane przez arkusz Google Fonts; dostępne są pod licencją SIL Open Font License 1.1. Licencje: [Manrope](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt), [Cormorant Garamond](https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt). Gdy usługa jest niedostępna, działają fonty systemowe.

## Muzyka

Pięć instrumentalnych kompozycji powstało w Suno v6 na koncie użytkownika 10 listopada 2026 r. Gra odtwarza je przez oficjalny odtwarzacz Share → Embed. Dokładne prompty i linki do wszystkich źródeł: [MUSIC.md](MUSIC.md). Nie pobrano gotowych plików audio: eksport w Suno pozostawał na etapie „Preparing…”. Nie użyto oryginalnych tematów z filmów lub seriali. Korzystanie z nagrań podlega warunkom Suno; dokumentacja nie nadaje im osobnej licencji otwartej. Krótki autorski akord sukcesu jest syntezowany przez Web Audio w `dist/js/app.mjs`.

## Treść i inspiracje

32 łamigłówki, ich podpowiedzi, uzasadnienia i wypowiedzi profesora napisano do tej gry. Wypowiedzi nie są cytatami z książek lub filmów. Reguły oparte są na znanych gatunkach zagadek logicznych, z własnymi danymi; nie skopiowano zadań ani oprawy Mensy.

Motywy fabularne wybrano na życzenie użytkownika: Harry Potter / Severus Snape, Czarodziejka z Księżyca oraz Super Pig. Nazwy i postacie należą do ich właścicieli. To osobista gra fanowska, bez sugerowania oficjalnej współpracy. Nie dołączono cudzych kadrów, logo ani nagrań.
