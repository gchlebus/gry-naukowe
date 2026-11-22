# Polish Rush — Four Cities

Ein spielbarer 3D-Arcade-Rennprototyp für die Sammlung „gry naukowe“. Vier fiktive Rundkurse mit Stadtmotiven aus **Kraków, Łódź, Racibórz und Warszawa**. Zeitrennen, vier Checkpoints, Rampen, Boost-Felder, Drift, Medaillen und persönliche Bestzeiten. Trainiert Reaktion, Koordination und Kurvenplanung; ab etwa 7 Jahren mit Unterstützung.

## Grafik und Umfang

Die Spieloberfläche einschließlich Tastaturhilfen, Streckenbeschilderung und Ergebnisanzeige ist auf Polnisch. Vier Fahrzeuge stehen zur Wahl.

- Volvo XC60 T8, Grau Metallic
- Toyota Yaris Selection, Weiß mit schwarzem Dach
- Tesla Model 3 Performance, Perlweiß
- BMW M3 G80 Competition, Isle of Man Green

Jedes Auto hat zwei eigens generierte, freigestellte Fahrzeugbilder. Die Garage zeigt es schräg von vorn. Im Rennen sitzt die Heckansicht als kameraseitig ausgerichtetes Sprite in der 3D-Szene. Abstand, seitliche Bewegung, Neigung und Bodenschatten folgen dem Fahrzustand. Die Stadtansichten sind stilisiert und die Rundkurse fiktiv. Die Fahrwerte sind auf das Arcade-Zeitrennen abgestimmt.

## Direkt öffnen

**`play.html` in Brave öffnen.** Die Datei enthält Spielcode, Three.js, Fahrzeugbilder und Musik. Das Rennen funktioniert ohne Internetverbindung. Für die Darstellung wird WebGL 2 benötigt. Optionale Webfonts werden bei bestehender Verbindung geladen.

## Lokaler Webserver

macOS, Linux oder Windows mit **Node.js ≥ 22.13.0** (geprüfte Version: 22.22.0). Keine npm-Installation notwendig.

```bash
cd games/polish-rush
npm run dev
```

Öffne **http://127.0.0.1:5190**. Beenden: **Ctrl+C**. Alternativer Port auf macOS/Linux: `PORT=5191 npm run dev`.

## Steuerung

| Taste | Aktion |
|---|---|
| W / ↑ | Beschleunigen |
| S / ↓ | Bremsen |
| A, D / ←, → | Lenken |
| Leertaste | Drift |
| Umschalt | Boost; lädt sich automatisch nach |
| Enter | Zum letzten Checkpoint, +3 Sekunden |
| R | Sofortiger Neustart |
| Esc | Pause / fortsetzen |

Auf kleinen Bildschirmen erscheinen vier Touch-Tasten für Gas, Bremse und Lenken. Musik startet nach Klick auf „Włącz muzykę“. Wechsel in einen anderen Tab pausiert das Rennen.

## Tests und Build

```bash
npm test
npm run build
npm run preview
```

`dist/` enthält die statische Website. `npm run preview` liefert sie unter demselben lokalen Port aus. Die eigenständige Datei erneuern:

```bash
node scripts/standalone.mjs
```

Acht automatisierte Tests prüfen alle 16 Stadt-/Auto-Kombinationen, Checkpoints, Zieleinlauf, Sprünge, Boost, Bremsen, Barrieren, Rücksetzstrafen und Kurventrägheit. Die Spielphysik lässt sich mit `npm test` ohne Browser prüfen. Für die Sichtprüfung der 3D-Darstellung wird ein Browser mit WebGL 2 benötigt.

## Bestzeiten und Daten

Bestzeiten liegen ausschließlich in `localStorage`, getrennt je Stadt und Auto unter `polish-rush-v1:*`. Browserdaten löschen entfernt sie. Verschiedene Browser, lokale Dateiadressen und Serveradressen haben getrennte Speicher. Wenn lokaler Speicher gesperrt ist, bleibt das Spiel nutzbar, Bestzeiten werden dann nicht dauerhaft gespeichert. Keine Telemetrie, kein Serverkonto, keine Übertragung von Spielergebnissen.

## Musik und Abhängigkeiten

**Polish Rush — Four Cities**, am 15.11.2026 im Suno-Konto des Nutzers erzeugt und als MP3 heruntergeladen. Instrumentaler Drum and Bass, Prompt mit 174 BPM, rund 1:15 Minuten. Datei: `public/audio/four-cities.mp3`; wird während der Wiedergabe wiederholt.

- Eingebauter Track: https://suno.com/song/d3eee3c3-5688-44bb-808c-ee9fa577c18a
- Zweite erzeugte Variante: https://suno.com/song/2afc3ddc-c498-4c7f-af22-6ea5f45c6c91

Keine Suno-Zugangsdaten oder API-Schlüssel im Projekt. Die Musik wurde tatsächlich in Suno erzeugt; Motorgeräusch separat mit Web Audio synthetisiert. Eine Veröffentlichung oder Weitergabe der Musik richtet sich nach den Rechten des Suno-Kontos; es wird keine eigene Lizenzzusage gemacht.

Three.js **0.180.0** (MIT) liegt unter `src/vendor/three/` einschließlich Lizenz und ist auch in der Einzeldatei eingebettet. Quelle: https://github.com/mrdoob/three.js/tree/r180. Optionale Schriften: Barlow Condensed und DM Sans über Google Fonts. Die acht generierten Fahrzeugansichten liegen unter `src/cars/`.
