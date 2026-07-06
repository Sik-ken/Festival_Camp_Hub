#!/bin/bash
# Stündlicher Health-Check: prüft ob die API antwortet und ob alle Container
# laufen, startet den Docker-Compose-Stack bei Bedarf neu. Einrichtung als
# Cronjob siehe network/healthcheck.cron.
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
