import sqlite3
import tarfile
from datetime import datetime

from app.config import settings


def run_backup() -> str:
    """Erstellt ein Zeitstempel-Backup: DB per SQLite-Online-Backup (konsistent
    auch bei laufendem Betrieb) + tar.gz der Uploads. Läuft synchron; für
    Version 1 bewusst einfach gehalten (siehe docs/DEPLOYMENT.md Abschnitt 9)."""
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    backup_dir = settings.backups_dir / timestamp
    backup_dir.mkdir(parents=True, exist_ok=True)

    db_backup_path = backup_dir / "app.db"
    source = sqlite3.connect(settings.db_path)
    dest = sqlite3.connect(db_backup_path)
    with dest:
        source.backup(dest)
    source.close()
    dest.close()

    if settings.uploads_dir.exists():
        with tarfile.open(backup_dir / "uploads.tar.gz", "w:gz") as tar:
            tar.add(settings.uploads_dir, arcname="uploads")

    return str(backup_dir.relative_to(settings.backups_dir.parent))
