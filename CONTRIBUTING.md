# Dodawanie i rozwijanie gier

## Jeden katalog na grę

- Umieszczaj każdą grę w `games/nazwa-gry/`. Używaj krótkich nazw małymi literami z myślnikami.
- Wybieraj technologię odpowiednią do konkretnej gry. Różne gry mogą korzystać z różnych języków, silników i menedżerów pakietów.
- Przechowuj manifesty, pliki blokujące wersje zależności, zasoby, konfigurację i testy wewnątrz katalogu gry.
- Nie wymagaj instalowania pozostałych gier. Wspólny katalog repozytorium służy do nawigacji i zasad, a nie narzucania jednego środowiska.
- Dodaj grę do tabeli w głównym `README.md`, z nazwą, celem edukacyjnym, technologią i linkiem do instrukcji.

## Każda gra musi mieć instrukcję uruchomienia

README gry powinien opisywać:

1. **Cel gry i odbiorców** — czego uczy, orientacyjny wiek, krótki opis zasad.
2. **Wymagania** — system, konkretne wersje środowiska, potrzebne narzędzia lub sprzęt.
3. **Instalację** — komendy od wejścia do katalogu gry do zainstalowania zależności.
4. **Uruchomienie** — dokładną komendę i adres strony, nazwę pliku lub aplikacji, którą należy otworzyć.
5. **Zatrzymanie** — jak zamknąć aplikację lub serwer.
6. **Testy i budowanie** — dostępne komendy, wymagania testów i sposób uruchomienia zbudowanej wersji, jeśli dotyczy.
7. **Zapisywanie postępów** — gdzie są dane i jak je zachować lub przenieść, jeśli gra zapisuje postępy.
8. **Opcjonalne integracje** — osobno opisz dodatkowy sprzęt, usługi i konfigurację; zaznacz, co działa bez nich i jakie testy faktycznie wykonano.

Nie umieszczaj w repozytorium haseł, tokenów, prywatnych kluczy, danych graczy, lokalnych środowisk ani pobranych zależności. Dodaj odpowiedni `.gitignore`. Zachowuj informacje o licencjach wykorzystywanych bibliotek i zasobów.

## Szablon README nowej gry

````markdown
# Nazwa gry

Krótki opis: dla kogo jest gra i czego uczy.

## Wymagania

- System i wersja środowiska.
- Potrzebne narzędzia.

## Instalacja

```bash
cd games/nazwa-gry
# Komendy instalujące zależności.
```

## Uruchomienie

```bash
# Komenda uruchamiająca grę z jej katalogu.
```

Co otworzyć po uruchomieniu i jak zatrzymać grę.

## Testy i budowanie

Komendy i dodatkowe wymagania, jeśli dotyczy.

## Postępy i dane

Gdzie zapisywane są dane, jeśli dotyczy.
````

## Przed wysłaniem zmian

Sprawdź instalację i uruchomienie zgodnie z README, wykonaj testy właściwe dla danej gry i upewnij się, że wszystkie linki w dokumentacji prowadzą do właściwych miejsc. Nowe pliki nie powinny zawierać ścieżek zależnych od konkretnego komputera.
