# Product Requirements Document (PRD)
## Helmpflicht Hub / Camp Helmpflicht

### 1. Produktziel
Helmpflicht Hub ist eine lokale, offline-fähige Festival-Webanwendung für das Camp Helmpflicht auf dem Deichbrand Festival. Die Anwendung soll Besucher auf dem Gelände schnell in ein gemeinsames Camp-Erlebnis bringen: Fotobox, öffentliches Freundebuch, Challenges mit Punkten, Trichterliste, Ranglisten, Galerie und Wall of Fame.

### 2. Produktvision
Die Anwendung ist kein generisches Tool, sondern die digitale Festivalplattform des Camps. Sie soll leicht bedienbar, modern, responsiv und robust sein. Jeder Besucher soll mit einem einzigen QR-Code und dem lokalen WLAN direkt auf die Startseite gelangen. Von dort aus können Gäste ohne Anmeldung Fotos aufnehmen, während registrierte Nutzer ihr Profil, Challenges und Punkte verwalten.

### 3. Zielgruppe
- Festivalgäste des Camps Helmpflicht
- Camp-Mitglieder
- Trichterwarte
- Admin

### 4. Kernprinzipien
- Offline first
- Mobile first
- Einfacher Einstieg
- Keine Cloud-Abhängigkeit für den Betrieb
- Sofort sichtbare Bilder
- Klare Rollen und Rechte
- Responsives, modernes UI
- Keine unnötige Komplexität für Version 1

### 5. Funktionsumfang Version 1

#### 5.1 Öffentlicher Einstieg
- Ein QR-Code führt zum WLAN-Setup und anschließend automatisch ins lokale Portal.
- Die Seite wird über Captive Portal / lokale Domain geöffnet.
- Die Startseite zeigt Navigation, Galerie-Slideshow und Live-Statistiken.

#### 5.2 Fotobox
- Ohne Anmeldung nutzbar.
- Nutzer kann Foto aufnehmen oder hochladen.
- Fester Camp-Rahmen wird automatisch über das Bild gelegt.
- Optionaler Text im vorgesehenen freien Bereich im Rahmen.
- Text hat eine maximale Länge.
- Ergebnis wird sofort gespeichert und ist in der Galerie sichtbar.

#### 5.3 Freundebuch
- Registrierte Benutzer können sich in das Freundebuch eintragen.
- Pflichtfelder:
  - Spitzname
  - Heimatort
- Optionale Felder:
  - Vorname
  - Camp
  - Mein Festival Crush
  - Fav. Act 2025
  - Lieblingsfarbe
- Profilbild ist Pflicht.
- Einträge sind immer öffentlich sichtbar.

#### 5.4 Challenges
- Jeder registrierte Benutzer erhält Zugang zu Challenges.
- 100 feste Challenges sind in Version 1 enthalten.
- 50 Challenges sind offen sichtbar.
- 50 Challenges sind gesperrt und werden erst bei genug Punkten freigeschaltet.
- Jede Challenge kann von jedem Benutzer genau einmal abgeschlossen werden.
- Jede Challenge verlangt genau ein Foto als Nachweis.
- Punkte steigen mit Schwierigkeitsgrad.
- Der Fortschritt wird nach dem Login persönlich angezeigt.

#### 5.5 Galerie
- Alle Fotos erscheinen sofort in der Galerie.
- Fotoquellen:
  - Fotobox
  - Challenge-Bilder
  - Profilbilder nur nach Bedarf, wenn freigegeben
- Die Galerie ist öffentlich sichtbar.
- Nur Admin darf Bilder löschen.
- Auf der Startseite läuft eine Slideshow mit zufälligen Bildern.

#### 5.6 Ranglisten
- Zwei getrennte Ranglisten:
  - Challenge-Punkte
  - Trichter
- Darstellung mit Spitznamen.
- Trichterliste ist unabhängig von Challenge-Punkten.

#### 5.7 Trichterliste
- Nur 0,5L Dosenbier-Trichter werden gezählt.
- Ein Trichter entspricht +1.
- Erfassung nur durch Trichterwarte oder Admin.
- Trichtererfassung ist von den Challenge-Punkten getrennt.

#### 5.8 Wall of Fame
- Automatisch generierte Rekordseite.
- Enthält z. B.:
  - Meiste Punkte
  - Meiste Challenges
  - Meiste Fotos
  - Meiste Trichter
  - Höchstes Level
- Wird serverseitig berechnet.

#### 5.9 Startseite / Dashboard
- Kacheln für:
  - Fotobox
  - Freundebuch
  - Challenges
  - Galerie
  - Trichterliste
  - Ranglisten
  - Wall of Fame
- Live-Statistiken:
  - Teilnehmer
  - Fotos
  - abgeschlossene Challenges
  - Trichter gesamt
- Zufällige Slideshow der Galerie-Bilder alle 1,5 Sekunden.

### 6. Benutzerrollen

#### 6.1 Gast
Darf:
- Fotobox nutzen
- Galerie ansehen
- Freundebuch ansehen
- Ranglisten ansehen
- Wall of Fame ansehen

#### 6.2 Benutzer
Darf zusätzlich:
- Profil erstellen
- Challenges erledigen
- eigenes Profil verwalten
- eigenen Fortschritt sehen

#### 6.3 Trichterwart
Darf zusätzlich:
- Trichter eintragen
- Trichter korrigieren
- Trichtereinträge prüfen

#### 6.4 Admin
Darf alles:
- Nutzer verwalten
- Bilder löschen
- Challenges verwalten
- Rollen verwalten
- Backups erstellen
- Statistiken ansehen
- Trichter korrigieren
- Freigaben und Korrekturen vornehmen

### 7. Nicht-Ziele für Version 1
- Keine Chatfunktion
- Keine Kommentare
- Keine Likes
- Kein Social Graph / Freundesliste
- Keine externe Cloud als Betriebsnotwendigkeit
- Keine KI-Bildanalyse
- Keine Mehrfachbilder pro Challenge
- Keine tägliche Challenge-Logik
- Keine komplexe Kategorienstruktur im UI

### 8. Akzeptanzkriterien
- Ein QR-Code genügt für den Einstieg.
- Die Anwendung funktioniert lokal ohne Internet.
- Die UI ist auf Smartphones nutzbar.
- Bilder erscheinen sofort.
- Nutzer können sich mit Festival-ID und PIN anmelden.
- Challenges sind nachvollziehbar, einmalig pro Benutzer und punktebasiert.
- Trichterliste und Challenge-Punkte sind getrennt.
- Admin kann löschen und korrigieren.
- Die Galerie-Slideshow läuft auf der Startseite.
- Das System ist stabil genug für Festivalbetrieb.

### 9. Priorität
P0:
- Captive Portal / WLAN-Zugang
- Startseite
- Fotobox
- Registrierung
- Login
- Galerie
- Challenges
- Trichterliste
- Admin
- Persistenz

P1:
- Wall of Fame
- Slideshow-Optimierung
- Export / Backup
- hübsche Badges

P2:
- spätere Erweiterungen
