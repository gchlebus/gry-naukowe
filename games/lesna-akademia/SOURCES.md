# Źródła i fotografie

Treść ćwiczeń została napisana od nowa na podstawie listy przekazanej przez rodzica. Materiały edukacyjne niżej służyły do sprawdzenia wiedzy przyrodniczej. Fotografie pobrano osobno z Wikimedia Commons, zgodnie z licencjami wymienionymi w tabeli. Weryfikacja: 15 listopada 2026.

- [Zintegrowana Platforma Edukacyjna — Jakie bogactwa kryją lasy?](https://zpe.gov.pl/a/jakie-bogactwa-kryja-lasy/DOzDRZhuZ): szkolny podział na korony drzew, podszyt, runo oraz ściółkę.
- [Lasy Państwowe — Eryś zaprasza do lasu, klasy 4–6](https://www.lasy.gov.pl/pl/informacje/publikacje/dla-nauczycieli/erys-zaprasza-do-lasu-2/erys-zaprasza-do-lasu-klasy-4-6/erys-zaprasza-do-lasu-uczniow-klas-4-6.pdf): warstwy lasu i przykłady roślin.
- [ZPE — W sadzie i na polu](https://zpe.gov.pl/a/w-sadzie-i-na-polu/D10pKMQe4): rośliny uprawne, zboża i charakterystyczna wiecha owsa.
- [ZPE — Nasza szkoła, klasa 3, część 1a, „Jakie rośliny uprawia się na polu?”](https://zpe.gov.pl/static-data/portal/f/res/RlUJfcZZykLbB/3/1THDfhk7xnn9Yi6Ut80crgsLMihGZb4t/nasza-szkola-kl3-1a.pdf): żółte kwiaty rzepaku oraz położenie bulw ziemniaka pod ziemią.
- [ZPE — Okrytonasienne](https://zpe.gov.pl/a/okrytonasienne/DnM6DLSnt): bulwa ziemniaka jako przekształcony pęd, a nie korzeń.

## Fotografie wykorzystane w grze

Poniższe prawdziwe fotografie zastępują schematy roślin i lasu. Pliki są zapisane lokalnie w `dist/photos/`: gra nie pobiera ich z zewnętrznych serwerów w trakcie zabawy. Nie tworzono ani nie generowano fotografii, nie dorysowywano elementów i nie kadrowano plików. Dla części zdjęć pobrano gotowe pomniejszenia z serwera Wikimedia; pozostałe to oryginalne pliki. Cały kadr jest dopasowywany w CSS.

Tabela podaje autora, stronę źródłową i licencję konkretnej fotografii. Rozwijane atrybucje są też w interfejsie. Linki pobrania, wymiary oraz sumy SHA-256 dokładnych plików zapisano w `dist/js/photos.mjs`. Licencje zdjęć dotyczą tych plików; nie oznaczają objęcia całego kodu gry licencją fotografii.

| Co pokazuje | Plik | Autor | Źródło | Licencja |
| --- | --- | --- | --- | --- |
| Rzepak | `photos/rzepak.jpg` | Michael Brandtner | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Brassica_napus_flower.jpg) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Owies | `photos/owies.jpg` | Andreas Trepte | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Avena_sativa_II.jpg) | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) |
| Ziemniaki | `photos/ziemniaki.jpg` | Philmarin | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:S._tuberosum-5.JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) |
| Pszenica | `photos/pszenica.jpg` | Sten Porse | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Triticum-aestivum-ear.JPG) | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |
| Korony drzew | `photos/korony.jpg` | David Patte / U.S. Fish and Wildlife Service | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Looking_Up_at_an_Old_Growth_Canopy_-_DPLA_-_94d913f7cd4bb2255353e45a1303609a.jpg) | [Domena publiczna](https://commons.wikimedia.org/wiki/Template:PD-USGov-FWS) |
| Podszyt | `photos/podszyt.jpg` | David Pashley | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Woodland_understory_-_geograph.org.uk_-_7457947.jpg) | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) |
| Runo leśne | `photos/runo.jpg` | ForestWander | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Forest-floor-spring-ferns_-_West_Virginia_-_ForestWander.jpg) | [CC BY-SA 3.0 US](https://creativecommons.org/licenses/by-sa/3.0/us/deed.en) |
| Ściółka | `photos/sciolka.jpg` | C. Boothman / U.S. Forest Service | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:20241028-R9HMNF-CB-001_Leafy_ground.jpg) | [Domena publiczna](https://commons.wikimedia.org/wiki/Template:PD-USGov-USDA-FS) |

Fotografia koron drzew: w opisie źródłowym wskazano Davida Patte’a i U.S. Fish and Wildlife Service. Fotografia ściółki: zdjęcie USDA Forest Service, C. Boothman. Oba pliki Wikimedia oznacza jako domenę publiczną — prace federalnych instytucji USA. Runo: wymagane uznanie autorstwa **ForestWander**, źródło [ForestWander](https://www.forestwander.com/2010/03/forest-floor-spring-ferns/). Podszyt: źródło pierwotne [Geograph, David Pashley](https://www.geograph.org.uk/photo/7457947).

Cztery fotografie lasu pochodzą z różnych miejsc. W zadaniu układamy przykłady od najwyższej do najniższej warstwy; nie jest to fotografia jednego lasu podzielona na części. Na zdjęciu ziemniaka widać liście i kwiaty. Bulwy rosną pod ziemią i nie są pokazane.

Dekoracyjne SVG liska i ikony są autorskie. Nie korzystano z ImageGen ani Suno przy tej aktualizacji. Dźwięk sukcesu jest krótko syntezowany przez Web Audio w przeglądarce.

Interpretacja dydaktyczna: cztery warstwy to uproszczony szkolny podział. Nie wszystkie lasy mają identyczną strukturę, a odmiany roślin uprawnych mogą różnić się wyglądem. Sprawdzanie swobodnej odpowiedzi zdaniem jest przybliżone; pełną poprawność językową warto ocenić wspólnie z rodzicem.
