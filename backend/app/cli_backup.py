"""Backup ohne HTTP/Auth auslösen, z. B. per Cron:
docker compose exec -T backend python -m app.cli_backup
"""

from app.services.backup import run_backup

if __name__ == "__main__":
    path = run_backup()
    print(f"Backup erstellt: {path}")
