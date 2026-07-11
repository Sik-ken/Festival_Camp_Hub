#!/bin/bash
# Health-Check (alle 5 Minuten): prüft ob das Netzwerk-Gateway und die API
# erreichbar sind und ob alle Container laufen, repariert bei Bedarf.
# Hintergrund: in der Nacht vom 10./11.07. blieb der Rock ~13h unerreichbar,
# weil WLAN sich im Sekundentakt neu verbinden musste (wpa_supplicant-Sturm)
# - der App-Check allein (curl auf localhost) hätte das nie bemerkt, da er
# auch ohne funktionierendes Netzwerk-Interface erfolgreich ist.
# Einrichtung als Cronjob siehe network/healthcheck.cron.
set -u

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$REPO_DIR/healthcheck.log"
cd "$REPO_DIR" || exit 1

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }

# --- Netzwerk-Check: Gateway erreichbar? ---
GATEWAY=$(ip route | awk '/^default/ {print $3; exit}')
if [ -n "$GATEWAY" ] && ! ping -c 2 -W 3 "$GATEWAY" > /dev/null 2>&1; then
  echo "$(timestamp) FEHLER: Gateway $GATEWAY nicht erreichbar - setze Netzwerk zurueck" >> "$LOG_FILE"
  sudo -n nmcli networking off >> "$LOG_FILE" 2>&1
  sleep 3
  sudo -n nmcli networking on >> "$LOG_FILE" 2>&1
fi

# --- App-Check: API + Container ---
DOWN=$(docker compose ps --status exited --status dead --format '{{.Name}}' 2>/dev/null)
API_OK=1
curl -fsS -o /dev/null --max-time 10 http://localhost/api/health || API_OK=0

if [ -n "$DOWN" ] || [ "$API_OK" -eq 0 ]; then
  echo "$(timestamp) FEHLER (Container down: ${DOWN:-keine} / API ok: $API_OK) - starte docker compose up -d" >> "$LOG_FILE"
  docker compose up -d >> "$LOG_FILE" 2>&1
else
  echo "$(timestamp) OK" >> "$LOG_FILE"
fi
