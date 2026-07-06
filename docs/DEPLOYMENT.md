# DEPLOYMENT.md
## Deployment und Betrieb auf Rock 4C+

### 1. Ziel
Die Anwendung läuft lokal auf dem Rock 4C+ und wird über das ESP32-S3-Netzwerk erreichbar gemacht.

> **Update (finale Architektur):** ESP32 = `192.168.4.1`, nur WLAN/DHCP. Rock 4C+ = `192.168.4.2`, stellt zusätzlich DNS und Captive Portal bereit. Speicher: USB-SSD unter `/mnt/festival-data/` mit `uploads/`, `thumbnails/`, `exports/`, `backups/`, `database/`.

> **Zusätzlicher Fernzugriff:** Neben dem lokalen Festival-/WLAN-Zugriff ist der Hub auch über eine feste Domain aus dem Internet erreichbar (Cloudflare Tunnel). Details, Setup und Troubleshooting siehe [REMOTE_ACCESS.md](REMOTE_ACCESS.md).

### 2. Zielumgebung
- Rock 4C+
- Linux
- Docker
- Docker Compose

### 3. Deployment-Architektur
Empfohlen:
- `frontend` Container
- `backend` Container
- ggf. `reverse-proxy` Container
- Datenverzeichnis auf persistenter Partition
- Backups auf separatem Pfad

### 4. Startablauf
1. Rock 4C+ bootet.
2. Docker Compose startet die Dienste.
3. Backend initialisiert Datenbank und Verzeichnisse.
4. Frontend ist lokal erreichbar.
5. ESP32-S3 leitet per Captive Portal auf die lokale Seite.

### 5. Persistente Daten
Müssen außerhalb der Container liegen:
- SQLite DB
- Uploads
- Thumbnails
- Exporte
- Backups

### 6. Dateien und Pfade
Beispiel:
```text
/data/db/app.db
/data/uploads/
/data/thumbnails/
/data/exports/
/backups/
```

### 7. Konfigurationsparameter
- Camp-Name
- QR-Portal-Ziel
- Slideshow-Intervall
- Upload-Kompression
- Max. Textlänge im Rahmen
- Admin-Geheimwerte
- PIN-Länge
- Session-Länge

### 8. Betrieb ohne Internet
Die Anwendung muss auch dann funktionieren, wenn kein Internet verfügbar ist.
- Login lokal
- Galerie lokal
- Challenges lokal
- Fotobox lokal
- Ranglisten lokal
- Admin lokal

### 9. Backups
Empfohlen:
- tägliches manuelles oder automatisiertes DB-Backup
- Bildarchive getrennt sichern
- Exportfunktion für Jahrbuch oder Archiv

### 10. Wartung
- Nur wenige Dienste
- Logdateien regelmäßig prüfen
- Speicherplatz beobachten
- Datenbank-Backup testen
- Neustart-Fähigkeit verifizieren
- Stündlicher Health-Check-Cronjob (`network/healthcheck.sh` +
  `network/healthcheck.cron`): prüft ob die API antwortet und alle
  Container laufen, startet den Stack bei Bedarf automatisch neu
  (`docker compose up -d`). Log unter `healthcheck.log` im Repo-Root.

### 11. Minimaler Produktions-Stack
Für Version 1 genügt:
- Docker Compose
- FastAPI
- SQLite
- React PWA
- statische Bildablage

### 12. Betriebsziel
Das System soll im Festivalmodus ohne Entwickler-Eingriff stabil laufen. Nach dem Start muss es nur noch über WLAN erreichbar sein.
