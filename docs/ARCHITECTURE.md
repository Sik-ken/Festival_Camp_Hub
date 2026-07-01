# ARCHITECTURE.md
## Helmpflicht Hub

### 1. Systemübersicht

> **Update (finale Netzwerkarchitektur):** Der ESP32-S3 ist **nur** WLAN Access Point (DHCP, feste IP `192.168.4.1`, externe High-Gain-Antenne, unverändertes `esp32_nat_router`-Projekt). **Kein DNS, kein Captive Portal, kein Webserver, keine App-Logik auf dem ESP32.** Der Rock 4C+ (`192.168.4.2`) übernimmt dnsmasq/DNS-Weiterleitung, Captive Portal, FastAPI, React PWA, SQLite, Galerie, Fotobox, Challenges, Freundebuch, Trichtersystem. Hostnamen `camp.local`, `helmpflicht.local`, `hub.local` zeigen alle auf `192.168.4.2`.

Die Anwendung besteht aus drei Schichten:
- lokales WLAN (ESP32-S3, reiner Access Point)
- Rock 4C+ als Applikationsserver (inkl. DNS + Captive Portal)
- Smartphone als Client im Browser

```text
[Smartphone] <-- WLAN/AP --> [ESP32-S3: nur AP/DHCP, 192.168.4.1] <-- LAN --> [Rock 4C+: 192.168.4.2]
                                                                                    |
                                                                                    +--> dnsmasq / DNS / Captive Portal
                                                                                    +--> FastAPI
                                                                                    +--> SQLite
                                                                                    +--> Filesystem für Bilder
                                                                                    +--> React PWA
```

### 2. Hardware

#### 2.1 Router / Netz
- ESP32-S3 N16R8
- bestehendes Projekt: `esp32_nat_router` (bleibt unverändert)
- Aufgabe: **ausschließlich** WLAN Access Point + DHCP, feste IP `192.168.4.1`, externe High-Gain-Antenne
- Kein DNS, kein Captive Portal, kein Webserver

#### 2.2 Applikationsserver
- Rock 4C+, feste IP `192.168.4.2`
- Betriebssystem: Linux
- Übernimmt zusätzlich: dnsmasq, DNS-Weiterleitung, Captive Portal
- Ausführung: Docker Compose

#### 2.3 Client
- Android Smartphones
- iPhones
- optional Tablets

### 3. Software Stack

#### Backend
- FastAPI
- Uvicorn
- Python 3.11+ oder 3.12

#### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui

#### Persistenz
- SQLite für Metadaten
- Dateisystem für Bilder
- Thumbnails als separate Dateien

#### Medienverarbeitung
- Pillow
- ggf. OpenCV nur wenn wirklich nötig

#### Deployment
- Docker
- Docker Compose

### 4. Laufzeitfluss

#### 4.1 Verbindungsfluss
1. Nutzer scannt QR-Code.
2. Gerät verbindet sich mit dem lokalen WLAN.
3. Captive Portal öffnet die Startseite.
4. PWA lädt lokal vom Rock 4C+.
5. Nutzer wählt Fotobox, Freundebuch, Challenges oder Statistikseite.

#### 4.2 Foto-Workflow
1. Nutzer erstellt oder lädt Foto hoch.
2. Server speichert Originaldatei im Filesystem.
3. Server erzeugt Thumbnail.
4. Server legt Metadaten in SQLite ab.
5. Foto erscheint sofort in Galerie und Slideshow.

#### 4.3 Challenge-Workflow
1. Benutzer meldet sich an.
2. Benutzer sieht offene und gesperrte Challenges.
3. Benutzer öffnet Challenge.
4. Benutzer lädt genau ein Foto hoch.
5. Challenge wird automatisch als erledigt markiert.
6. Punkte werden berechnet.
7. Fortschritt und Ranglisten werden aktualisiert.

#### 4.4 Trichter-Workflow
1. Trichterwart oder Admin öffnet Trichterseite.
2. Person auswählen oder suchen.
3. +1 Trichter eintragen.
4. Zeitstempel speichern.
5. Rangliste aktualisieren.

### 5. Datenhaltung

#### 5.1 In SQLite
- Benutzer
- Rollen
- Challenges
- User-Challenge-Status
- Foto-Metadaten
- Trichtereinträge
- Badge-/Level-Regeln
- Admin-Aktionen
- Audit-Events

#### 5.2 Im Dateisystem
- Originalbilder
- Bearbeitete Bilder
- Thumbnails
- Exportdateien
- Backups

### 6. Verzeichnisstruktur
```text
helmpflicht-hub/
├── backend/
├── frontend/
├── docs/
├── data/
│   ├── db/
│   ├── uploads/
│   ├── thumbnails/
│   └── exports/
├── backups/
└── docker-compose.yml
```

### 7. Seitenstruktur

#### Öffentliche Seiten
- `/`
- `/gallery`
- `/friendbook`
- `/leaderboards`
- `/wall-of-fame`
- `/photo-booth`

#### Benutzerseiten
- `/login`
- `/register`
- `/dashboard`
- `/tasks`
- `/tasks/{id}`
- `/profile`

#### Trichterwart-Seiten
- `/funnels`
- `/funnels/manage`

#### Admin-Seiten
- `/admin`
- `/admin/users`
- `/admin/photos`
- `/admin/tasks`
- `/admin/funnels`
- `/admin/backups`
- `/admin/stats`

### 8. API-Architektur
- REST API unter `/api`
- JSON als Standard
- Multipart Uploads für Bilder
- Authentifizierung über Session oder Token
- lokale Nutzung ohne externen Identity Provider

### 9. Sicherheitsmodell
- Rollenprüfung auf Serverseite
- Admin- und Trichterwart-Routen separat schützen
- Uploads validieren
- Dateinamen normalisieren
- EXIF-Daten optional entfernen
- Nur erlaubte Dateitypen speichern
- Rate-Limit optional für Eingaben und Uploads

### 10. Performance-Anforderungen
- Startseite muss schnell laden
- Galerie darf nur Thumbnails für Übersicht laden
- Slideshow darf nicht das gesamte Bildset gleichzeitig laden
- Bilder nach Upload komprimieren
- API-Antworten klein halten
- UI darf auf Mobilgeräten nicht ruckeln

### 11. Backup-Konzept
- Lokale automatische Backups
- Manuelle Exportfunktion
- Datenbank-Backup getrennt von Bildern
- Wiederherstellung muss dokumentiert sein

### 12. MVP-Entscheidungen
- Ein fester Camp-Rahmen
- Ein Foto pro Challenge
- Alle Einträge öffentlich
- Kein Chat
- Kein Feed mit Kommentaren
- Keine Kalenderlogik
- Keine Cloud-Verpflichtung
- Kein Multitenant-System
