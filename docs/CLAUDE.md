# CLAUDE.md
## Arbeitsanweisung für Claude Code

### Projektkontext
Du entwickelst eine lokale, offline-fähige Festival-Webanwendung für das Camp Helmpflicht auf dem Deichbrand Festival.

### Produktname
- Technischer Projektname: Helmpflicht Hub
- Camp-Branding: Camp Helmpflicht

### Ziel
Baue eine moderne, responsive Webanwendung als PWA für Smartphone-Nutzung auf einem lokalen Festivalnetzwerk.

### Harte Anforderungen
- Offline first
- Mobile first
- Lokaler Betrieb ohne Internet als Hauptmodus
- Keine Cloud-Abhängigkeit für Kernfunktionen
- Ein QR-Code führt den Nutzer ins Portal
- Sofort sichtbare Bilder
- Öffentliche Galerie
- Freundebuch immer öffentlich
- Keine privaten Profileinstellungen in Version 1
- Keine Mehrfachbilder pro Challenge
- Eine Challenge pro Benutzer nur einmal abschließbar
- Challenge- und Trichter-Ranglisten getrennt
- Trichter nur durch Trichterwart oder Admin veränderbar
- Nur 0,5L Dosenbier-Trichter zählen
- Bilder niemals in SQLite speichern, nur Metadaten
- Bilder im Dateisystem speichern
- Alle relevanten Aktionen mit Zeitstempel speichern
- Admin darf löschen und korrigieren

### Architekturvorgaben
- Backend: FastAPI
- Frontend: React + TypeScript
- Styling: TailwindCSS + shadcn/ui
- Datenbank: SQLite
- Bildspeicher: Filesystem
- Thumbnails als WebP oder JPEG
- Deployment per Docker Compose
- PWA-fähig
- Responsives Layout für Smartphones

### UI/UX-Vorgaben
- Modern, klar, festival-tauglich
- Keine ERP-/Admin-Optik
- Große Touch-Ziele
- Kaum Textwüsten
- Kachelbasierte Startseite
- Dark Mode als Standard
- Camp-Branding in Farben und Icons berücksichtigen
- Kein horizontaler Scroll

### Farbpalette
- Hintergrund: #0D1419
- Primär: #FBC627
- Sekundär: #92D0F3
- Neutral: #ABB5BB
- Warm: #E6D0A6

### Brand-Kontext
Das Camp heißt Camp Helmpflicht. Es gibt eine Baustellen-/Festival-Ästhetik mit Bauhelmen und Warnwesten.

### Produktumfang Version 1
Implementiere zuerst nur:
1. Startseite
2. Fotobox
3. Registrierung
4. Login
5. Freundebuch
6. Challenges
7. Galerie
8. Trichterliste
9. Ranglisten
10. Wall of Fame
11. Adminbereich
12. Persistenz und Backups

### Verbotene Annahmen
- Keine Cloud-Login-Anbieter
- Keine Social Media Integrationen
- Keine KI-Auswertung von Bildern
- Keine extra Komplexität ohne explizite Anforderung
- Keine Tages- oder Zeit-Challenges
- Keine zusätzlichen Rollen ohne Bedarf

### Arbeitsweise
- Arbeite in kleinen, überprüfbaren Schritten.
- Schreibe zuerst das Datenmodell und die API-Verträge.
- Implementiere dann Backend, dann Frontend.
- Halte Komponenten modular.
- Bevorzuge einfache, stabile Lösungen statt cleverer, fragiler Lösungen.
- Wenn Anforderungen fehlen, frage nicht unnötig nach, sondern arbeite mit den hier definierten Regeln.

### Qualitätsziel
Die Anwendung muss auf modernen Smartphones schnell und intuitiv bedienbar sein und im Festivalalltag zuverlässig laufen.
