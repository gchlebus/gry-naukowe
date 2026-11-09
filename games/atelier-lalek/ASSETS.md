# Grafika i dźwięki Atelier Lalek

## Własna grafika SVG

Lalki i warstwy kosmetyczne narysowano specjalnie do gry jako kod SVG w `components/doll.tsx`. Cztery postacie mają różne odcienie skóry, naturalne włosy i oczy. Każda fryzura jest połączona z niezależnymi pasmami prostymi, kręconymi lub karbowanymi; twarz, kosmetyki, ubrania, buty, dłonie i paznokcie są osobnymi warstwami.

Miniatury ubrań i dodatków są w `components/catalog-art.tsx`, ikony w `components/icon.tsx`, a favicon w `public/favicon.svg`. Tło salonu i efekty są CSS/SVG. Nie pobierano grafik lalek, postaci marek, zdjęć ani kosmetyków z internetu. Nie użyto generowania rastrowego — edytowalne warstwy wektorowe pozwalają pokazywać dokładnie wybrany kolor bezpośrednio na lalce.

PNG tworzy przeglądarka z aktualnej ilustracji SVG przez Canvas. Obraz ma stały wymiar 1040×1520, pełny widok postaci, jednolite tło i podpis z nazwą lalki. Nie dołącza zewnętrznych obrazów ani prywatnych zdjęć.

## Dźwięki

Krótkie własne dźwięki są syntezowane lokalnie przez Web Audio API: delikatne nuty przy wyborach i trzy nuty po zapisaniu pomysłu. Domyślnie są wyłączone. Nie wykorzystano nagrań, piosenek zewnętrznych, Suno ani płatnej integracji muzycznej w tej grze.

## Fonty i zależności

Fraunces oraz DM Sans są ładowane z Google Fonts; zastępstwa systemowe pozwalają grać bez ich pobrania. Pliki fontów nie są przechowywane w repozytorium.

Zależności i wersje są w `package-lock.json`. Elementy startera Sites zachowują dołączone informacje licencyjne w `scripts/vite/` i `vendor/`. Gra nie wymaga żadnego tokenu do grafiki, muzyki ani eksportowania obrazków.
