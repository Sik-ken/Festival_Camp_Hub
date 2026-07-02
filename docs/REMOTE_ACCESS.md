# REMOTE_ACCESS.md
## Zugriff über Cloudflare Tunnel (lokal + weltweit)

Neben dem lokalen Zugriff im Festival-/Heimnetz (siehe [DEPLOYMENT.md](DEPLOYMENT.md)
und [ROCK_SETUP.md](../ROCK_SETUP.md)) ist der Hub zusätzlich über eine feste
Domain aus dem Internet erreichbar — unabhängig davon, an welchem Netzwerk der
Rock 4C+ gerade per LAN/WLAN hängt.

### 1. Funktionsprinzip

Ein dritter Container (`cloudflared`) baut eine **ausgehende** Verbindung zu
Cloudflare auf. Es ist kein Port-Forwarding, keine feste öffentliche IP und
keine Router-Konfiguration nötig.

```
Internet-Client  →  Cloudflare Edge  →  (ausgehender Tunnel)  →  cloudflared-Container  →  web-Container (Port 80)
```

Da der Tunnel ausgehend aufgebaut wird, funktioniert das automatisch an jedem
Standort mit Internetzugang — Rock einstecken, Netzwerkkabel/WLAN verbinden,
fertig. Kein erneutes Einrichten nötig, auch nicht nach einem Standortwechsel
oder Neustart (`restart: unless-stopped` sorgt für Autostart).

### 2. Zugriffs-URLs

| Zugriff | URL | Voraussetzung |
|---|---|---|
| Lokal im WLAN/LAN | `http://<rock-ip>/` (z. B. `http://192.168.0.90/`) | Gerät im selben Netz wie der Rock |
| Von überall (Internet) | `https://helmpflicht.deichdrucker.de/` | Rock hat Internetzugang, Tunnel-Container läuft |

Beide Zugriffswege laufen parallel und unabhängig voneinander — der lokale
Zugriff funktioniert auch dann, wenn der Tunnel-Container aus irgendeinem
Grund nicht erreichbar sein sollte.

### 3. Setup von Grund auf (einmalig)

Falls der Tunnel neu aufgesetzt werden muss (z. B. neue Domain, neues
Cloudflare-Konto):

1. **Domain zu Cloudflare hinzufügen**: Domain kaufen oder bestehende Domain
   auf Cloudflare-Nameserver umstellen (Cloudflare Dashboard → *Add a Site*).
   Genutzt wird aktuell `deichdrucker.de`.
2. **Tunnel anlegen**: [one.dash.cloudflare.com](https://one.dash.cloudflare.com)
   → **Networks → Tunnels** → *Create a tunnel* → Typ **Cloudflared**.
   Name z. B. `helmpflicht-hub`.
3. **Connector-Typ Docker wählen**. Cloudflare zeigt einen Befehl mit einem
   langen Token (`--token eyJ...`). Diesen Token in die `.env`-Datei auf dem
   Rock eintragen (siehe Abschnitt 4).
4. **Public Hostname konfigurieren** (im selben Tunnel-Wizard):
   - Subdomain: `helmpflicht`
   - Domain: `deichdrucker.de`
   - Service Type: `HTTP`
   - URL: **`web:80`** (Docker-Servicename, **nicht** `localhost:80` —
     `localhost` würde im `cloudflared`-Container auf sich selbst zeigen statt
     auf den `web`-Container. Beide Container laufen im selben
     Docker-Compose-Netzwerk und erreichen sich über die Servicenamen.)
5. **Container starten** (siehe Abschnitt 4/5).

### 4. Konfiguration (`.env` und `docker-compose.yml`)

In der `.env`-Datei auf dem Rock (**nicht** in Git, siehe `.gitignore`):

```env
HUB_JWT_SECRET=<zufälliger 64-Zeichen-Hex-String, z. B. via `openssl rand -hex 32`>
HUB_ADMIN_BOOTSTRAP_PIN=<eigener Admin-PIN, nicht changeme123>
CLOUDFLARE_TUNNEL_TOKEN=<Token aus dem Cloudflare Tunnel-Wizard>
```

In `docker-compose.yml` läuft der Tunnel als eigener Service:

```yaml
cloudflared:
  image: cloudflare/cloudflared:latest
  restart: unless-stopped
  command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
  depends_on:
    - web
```

### 5. Starten / Aktualisieren

```bash
cd /home/radxa/Festival_Camp_Hub   # bzw. /opt/helmpflicht-hub, siehe ROCK_SETUP.md
docker compose up -d
```

Startet/aktualisiert alle drei Container (`backend`, `web`, `cloudflared`).
Ändert sich nur der Tunnel-Token oder ein Secret in `.env`, reicht ein
erneutes `docker compose up -d` — Container mit geänderter Konfiguration
werden automatisch neu erstellt, unveränderte laufen weiter.

### 6. Verwaltung des Tunnels

Routing-Regeln, Hostnamen oder Zugriffsbeschränkungen werden im
[Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com) unter
**Networks → Tunnels → helmpflicht-hub** verwaltet. Änderungen dort wirken
sich sofort aus, ohne dass der Container neu gestartet werden muss.

### 7. Troubleshooting

| Problem | Prüfung | Behebung |
|---|---|---|
| `https://helmpflicht.deichdrucker.de` lädt nicht | `docker compose logs cloudflared` | Fehler `connection refused` auf `localhost:80` → Public Hostname im Dashboard zeigt fälschlich auf `localhost` statt `web:80` |
| Tunnel-Container startet nicht | `docker compose ps` | `CLOUDFLARE_TUNNEL_TOKEN` in `.env` fehlt oder ist falsch/abgelaufen — neuen Token im Dashboard generieren |
| Lokaler Zugriff geht, Domain nicht | `docker compose logs cloudflared` auf Verbindungsfehler prüfen | Internetverbindung des Rock prüfen (`ping 1.1.1.1`), danach Container neu starten: `docker compose restart cloudflared` |
| Domain geht, lokaler Zugriff nicht | `docker compose ps` → ist `web` auf Port 80 "Up"? | Unabhängiges Problem vom Tunnel, siehe DEPLOYMENT.md Troubleshooting |
| Vereinzelte `QUIC`/`connection terminated`-Fehler in den Logs | — | Normal, Cloudflare wechselt gelegentlich die Edge-Verbindung; kein Handlungsbedarf, solange der Zugriff funktioniert |

### 8. Sicherheitshinweis

Über die öffentliche Domain ist die App weltweit erreichbar. Der Schutz
besteht aktuell aus PIN-Login + JWT (siehe [ARCHITECTURE.md](ARCHITECTURE.md)).
Vor produktivem Einsatz sicherstellen, dass:
- `HUB_JWT_SECRET` und `HUB_ADMIN_BOOTSTRAP_PIN` in `.env` echte, individuelle
  Werte sind (keine Defaults aus `.env.example`)
- die `.env`-Datei nicht versehentlich ins Git-Repo gelangt (siehe `.gitignore`)
- bei Bedarf zusätzlich **Cloudflare Access** vor den Public Hostname geschaltet
  wird, falls der Zugriff auf bestimmte Personen eingeschränkt werden soll
  (Zero Trust Dashboard → Access → Applications)
