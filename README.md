# Gry naukowe

Gry edukacyjne do wspólnego odkrywania, eksperymentowania i nauki z dziećmi.

Każda gra to **osobny projekt** w katalogu `games/`. Może korzystać z dowolnej technologii i ma własne zależności oraz instrukcję uruchomienia. W głównym katalogu nie ma wspólnego środowiska ani obowiązkowego menedżera pakietów.

## Gry

| Gra                           | Czego uczy                                                                               | Technologia                                                       | Uruchomienie                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [Kaczy Kod](games/kaczy-kod/) | Programowanie z klocków: 32 przygody, while, if/else, własne funkcje i zagadki; od 7 lat | React, TypeScript, Vinext/Vite; eksport do Pythona dla Microducka | [Instrukcja](games/kaczy-kod/README.md#uruchomienie-lokalne-macos-i-linux) |
| [Sklepik Kucyków](games/sklepik-kucykow/) | Dodawanie, odejmowanie, mnożenie i dzielenie; 3 poziomy, karty w pary; od 7 lat | React, TypeScript, Vinext/Vite | [Instrukcja](games/sklepik-kucykow/README.md#uruchomienie-lokalne) |

## Pierwsze uruchomienie Kaczego Kodu

Wymagane: Git, Node.js z npm (sprawdzono na **25.9.0**) oraz Python 3 do testów i eksportowanych programów robota. Do samej zabawy w przeglądarce Python i robot nie są potrzebne.

```bash
git clone https://github.com/gchlebus/gry-naukowe.git
cd gry-naukowe/games/kaczy-kod
npm ci
npm run dev
```

Otwórz **http://localhost:5173** lub adres `Local` wypisany w Terminalu. Zatrzymanie serwera: **Ctrl+C**. Gra działa lokalnie bez konta ChatGPT, dostępu do Sites i fizycznego robota.

Szczegóły wymagań, testowania, budowania i pracy z Microduckiem znajdziesz w [README gry](games/kaczy-kod/README.md).

## Struktura repozytorium

```text
gry-naukowe/
├── README.md
├── CONTRIBUTING.md
└── games/
    ├── kaczy-kod/
    │   ├── README.md
    │   ├── package.json
    │   └── ...
    ├── sklepik-kucykow/
    │   ├── README.md
    │   └── ...
    └── kolejna-gra/         # własna technologia i własny README
```

## Dodawanie kolejnej gry

Utwórz `games/nazwa-gry/`, dodaj kompletny kod i README z wymaganiami oraz komendami uruchomienia, a następnie dopisz grę do powyższej tabeli. Każdy projekt powinien dać się uruchomić z własnego katalogu bez instalowania innych gier.

Dokładne zasady i szablon instrukcji: [CONTRIBUTING.md](CONTRIBUTING.md).
