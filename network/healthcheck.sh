#!/bin/bash
# Health-Check (alle 5 Minuten): prüft ob die API antwortet und ob alle
# Container laufen, startet den Docker-Compose-Stack bei Bedarf neu.
#
# HINWEIS: Es gab hier den Versuch, zusaetzlich einen Netzwerk-Reset
# (nmcli networking off/on) bei nicht erreichbarem Gateway einzubauen.
# Das wurde am 11./12.07. wieder entfernt: auf diesem Rock laeuft eine
# volle Desktop-Umgebung (KDE Plasma), und der Toggle hat dort nachweislich
# das gesamte System zum Haengen gebracht (Systemd-Journal endete abrupt
# direkt nach dem Toggle, erst ein physischer Neustart half). Ein
# automatischer Reset, der bei einem WLAN-Aussetzer das ganze System
# einfrieren kann, ist schlimmer als das urspruengliche Problem - daher
# bewusst NICHT wieder einbauen, ohne das Haenger-Verhalten erst zu klaeren.
#
# Einrichtung als Cronjob siehe network/healthcheck.cron.
set -u

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$REPO_DIR/healthcheck.log"
cd "$REPO_DIR" || exit 1

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }

DOWN=$(docker compose ps --status exited --status dead --format '{{.Name}}' 2>/dev/null)
API_OK=1
curl -fsS -o /dev/null --max-time 10 http://localhost/api/health || API_OK=0

if [ -n "$DOWN" ] || [ "$API_OK" -eq 0 ]; then
  echo "$(timestamp) FEHLER (Container down: ${DOWN:-keine} / API ok: $API_OK) - starte docker compose up -d" >> "$LOG_FILE"
  docker compose up -d >> "$LOG_FILE" 2>&1
else
  echo "$(timestamp) OK" >> "$LOG_FILE"
fi
