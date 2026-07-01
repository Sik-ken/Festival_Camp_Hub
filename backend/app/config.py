from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    camp_name: str = "Camp Helmpflicht"

    data_dir: Path = Path("/data")
    db_path: Path = Path("/data/db/app.db")
    uploads_dir: Path = Path("/data/uploads")
    thumbnails_dir: Path = Path("/data/thumbnails")
    exports_dir: Path = Path("/data/exports")
    backups_dir: Path = Path("/backups")

    jwt_secret: str = "change-me-before-festival"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7  # eine Festivalwoche

    pin_min_length: int = 4
    slideshow_interval_ms: int = 1500
    max_photobooth_text_length: int = 80

    max_upload_bytes: int = 15 * 1024 * 1024  # 15 MB
    allowed_image_types: set[str] = {"image/jpeg", "image/png", "image/webp"}
    thumbnail_max_size: int = 480

    admin_bootstrap_festival_id: str = "admin"
    admin_bootstrap_pin: str = "changeme123"

    class Config:
        env_prefix = "HUB_"

    @property
    def database_url(self) -> str:
        return f"sqlite:///{self.db_path}"


settings = Settings()

for path in (
    settings.db_path.parent,
    settings.uploads_dir,
    settings.thumbnails_dir,
    settings.exports_dir,
    settings.backups_dir,
):
    path.mkdir(parents=True, exist_ok=True)
