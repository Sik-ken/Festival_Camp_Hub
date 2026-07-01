# UI_UX.md
## Design- und UX-Spezifikation für Helmpflicht Hub

### 1. Ziel der UI
Die UI soll modern, intuitiv, responsiv und festival-tauglich sein. Sie muss auf Smartphones in wenigen Sekunden verständlich sein und darf nicht wie ein klassisches Backend wirken.

### 2. Primäre Designprinzipien
- Mobile first
- Große Touchflächen
- Wenige Schritte pro Aufgabe
- Klare visuelle Hierarchie
- Hoher Kontrast
- Schnelle Orientierung
- Kein unnötiger Text
- Kein horizontaler Scroll
- Moderne Card-UI

### 3. Zielgeräte
- Android Smartphones
- iPhones
- Tablets als Sekundärziel
- Desktop nur als Bonus

### 4. Farbpalette
Verwende die offizielle Camp-Helmpflicht-Palette:

- Background: `#0D1419`
- Primary: `#FBC627`
- Secondary: `#92D0F3`
- Neutral: `#ABB5BB`
- Warm Accent: `#E6D0A6`

Empfehlung:
- Dunkler Hintergrund
- Gelb als Primärakzent
- Blau für sekundäre Infos
- Grau für Flächen und Trennlinien
- Warmton sparsam für Highlights

### 5. Typografie
- Moderne, gut lesbare Sans-Serif
- Große Schrift
- Klare Abstufung zwischen Headline, Untertitel und Fließtext
- Keine kleinteilige Tabellenoptik auf dem Smartphone

### 6. Layoutregeln
- Startseite als Kachel-Dashboard
- Maximal eine Hauptaktion pro Card
- Nach Möglichkeit keine tief verschachtelten Menüs
- Bottom Navigation oder kompakte Kacheln möglich
- Alle Buttons müssen bequem mit dem Daumen erreichbar sein

### 7. Responsiveness
Die App muss für folgende Breiten getestet werden:
- 360px
- 375px
- 390px
- 414px
- 430px
- 768px

Anforderungen:
- Keine abgeschnittenen Elemente
- Keine überlaufenden Textblöcke
- Bilder skalieren sauber
- Galerie-Raster passt sich an
- Cards umbrechen sauber
- Formulare sind auf kleinen Displays komfortabel

### 8. Startseite
Elemente:
- große Helmpflicht-Hub-Branding-Zeile
- kurze Unterzeile mit Camp-Branding
- Galerie-Slideshow
- Kacheln für alle Hauptbereiche
- Statistikbereich
- Wall of Fame Teaser optional

Slideshow:
- automatisch
- zufällige Bilder
- Intervall 1,5 Sekunden
- sanfter Übergang

### 9. Fotobox UI
- Großer Kamera-Button
- Vorschau-Bereich
- Fester Camp-Rahmen
- Textfeld mit Zeichenlimit
- Klarer Speichern-Button
- Sofortige Rückmeldung nach Upload

### 10. Freundebuch UI
- Profilbild oben
- Spitzname prominent
- Heimatort direkt sichtbar
- Optionale Felder als saubere Sektion
- Öffentliches Leselayout, aber trotzdem modern

### 11. Challenges UI
- Karte pro Challenge
- Punktzahl sichtbar
- Lock-Status klar erkennbar
- Fortschritt des Nutzers oben
- Abgeschlossene Challenges separat markiert
- Einfache Upload-Aktion mit einer klaren CTA

### 12. Galerie UI
- Thumbnail-Raster
- Schnelles Laden
- Kein Full-Resolution-Load in der Übersicht
- Klick öffnet Detailansicht
- Bilder können via Lightbox betrachtet werden

### 13. Ranglisten UI
- Zwei getrennte Tabs oder Bereiche:
  - Punkte
  - Trichter
- Spitzname prominent
- Rangnummer groß
- Werte klar und kompakt

### 14. Wall of Fame UI
- Rekordkarten
- wenige, starke Kennzahlen
- klare Icons
- optisch herausgehobener Bereich

### 15. Formulare
- Inputs groß genug
- Labels immer sichtbar oder eindeutig
- Max. 1-2 Fragen pro Screen, wenn möglich
- Fehlermeldungen kurz und direkt
- Erfolgszustände sichtbar

### 16. Icons und Bildsprache
Das Design darf folgende Motive nutzen:
- Bauhelm
- Warnweste
- Baustelle
- Werkzeug
- Festival
- Party
- Becher / Trichter
- Bühne

### 17. Interaktionsdesign
- Buttons mit klarem Hover/Pressed-State
- Deutliche Ladezustände
- Erfolgsmeldungen nach Aktionen
- Kein unnötiges Warten ohne Feedback

### 18. UX-Fehler, die zu vermeiden sind
- Kleine Buttons
- Zu viele Textfelder auf einmal
- Unklare Navigation
- Versteckte Funktionen
- Leere Zustände ohne Erklärung
- Desktop-UI auf dem Smartphone
- Überladene Filter
- Popups ohne Notwendigkeit

### 19. Accessibility-Basics
- Hoher Kontrast
- Klare Focus States
- Lesbare Schriftgrößen
- Buttons mit ausreichender Größe
- Formulare mit verständlichen Labels

### 20. Tonalität der Texte
Die Sprache soll locker, festivaltauglich und direkt sein, aber nicht albern oder unverständlich. Beispiel:
- „Foto aufnehmen“
- „Challenge erledigt“
- „Zur Galerie“
- „Punkte“
- „Trichter eintragen“

### 21. Designreferenz
Die Anwendung soll wirken wie:
- moderne Festival-App
- Social-App mit klaren Cards
- hochwertiges Event-Dashboard

Sie soll nicht wirken wie:
- Verwaltungssoftware
- ERP
- internes Tool
- Formularsammlung

### 22. Umsetzungsvorgaben für Claude
Claude soll vor der Implementierung Wireframes denken und erst dann UI-Komponenten erstellen. Das Design muss konsistent und wiederverwendbar sein. Für Version 1 ist eine ruhige, gut lesbare, robuste Oberfläche wichtiger als visuelle Spielereien.
